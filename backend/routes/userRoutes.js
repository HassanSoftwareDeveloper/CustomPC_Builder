import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);


router.get(
  "/",
  protect,
  adminOnly,
  wrap(async (req, res) => {
    const customers = await User.find({ role: "customer" }).sort({ createdAt: -1 });

    
    const stats = await Order.aggregate([
      { $group: { _id: "$user", orderCount: { $sum: 1 }, totalSpent: { $sum: "$total" } } },
    ]);
    const byUser = new Map(stats.map((s) => [String(s._id), s]));

    res.json(
      customers.map((c) => {
        const s = byUser.get(String(c._id));
        return {
          id: String(c._id),
          name: c.name,
          email: c.email,
          createdAt: c.createdAt,
          orderCount: s?.orderCount || 0,
          totalSpent: s?.totalSpent || 0,
        };
      })
    );
  })
);

export default router;