import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const makeToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    // role is NOT taken from the request, so nobody can sign up as admin
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() }).select("+password");

    if (!user || !(await user.matchPassword(password || ""))) {
      return res.status(401).json({ message: "Wrong email or password." });
    }
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  (who am I?)
router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;