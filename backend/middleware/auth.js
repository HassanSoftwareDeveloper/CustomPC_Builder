import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Must be logged in
export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Please log in first." });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "User no longer exists." });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Your session expired. Please log in again." });
  }
}

// Must be an admin (use after protect)
export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only." });
  }
  next();
}


