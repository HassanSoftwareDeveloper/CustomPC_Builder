import crypto from "node:crypto";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const REFRESH_DAYS = 7;
const REFRESH_COOKIE = "apna_refresh";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/auth",
};

const makeAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");

async function issueRefreshCookie(user, res) {
  const raw = crypto.randomBytes(40).toString("hex");
  await RefreshToken.create({
    user: user._id,
    tokenHash: hash(raw),
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });
  res.cookie(REFRESH_COOKIE, raw, {
    ...cookieOptions,
    maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
  });
}

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if ([name, email, password].some((v) => typeof v !== "string")) {
      return res
        .status(400)
        .json({ message: "Name, email and password must be text." });
    }
    if (!name.trim() || !email.trim() || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }

    const user = await User.create({ name, email, password });
    await issueRefreshCookie(user, res);
    res
      .status(201)
      .json({ token: makeAccessToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Email and password must be text." });
    }
    const user = await User.findOne({
      email: (email || "").toLowerCase(),
    }).select("+password");

    if (!user || !(await user.matchPassword(password || ""))) {
      return res.status(401).json({ message: "Wrong email or password." });
    }
    await issueRefreshCookie(user, res);
    res.json({ token: makeAccessToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE];
    if (!raw) return res.status(401).json({ message: "Please log in first." });

    const record = await RefreshToken.findOneAndDelete({
      tokenHash: hash(raw),
    });

    if (!record || record.expiresAt < new Date()) {
      res.clearCookie(REFRESH_COOKIE, cookieOptions);
      return res
        .status(401)
        .json({ message: "Your session expired. Please log in again." });
    }

    const user = await User.findById(record.user);
    if (!user) {
      res.clearCookie(REFRESH_COOKIE, cookieOptions);
      return res.status(401).json({ message: "User no longer exists." });
    }

    await issueRefreshCookie(user, res);
    res.json({ token: makeAccessToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE];
    if (raw) await RefreshToken.deleteOne({ tokenHash: hash(raw) });
    res.clearCookie(REFRESH_COOKIE, cookieOptions);
    res.json({ message: "Logged out." });
  } catch (err) {
    next(err);
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
