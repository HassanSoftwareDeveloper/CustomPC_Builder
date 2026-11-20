import express from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { toPayload } from "../services/notificationService.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.use(protect);

// route notification newest first)
router.get(
  "/",
  wrap(async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
    const filter = { user: req.user._id };
    if (req.query.before && mongoose.isValidObjectId(req.query.before)) {
      filter._id = { $lt: req.query.before };
    }

    const [items, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ _id: -1 }).limit(limit),
      Notification.countDocuments({ user: req.user._id, readAt: null }),
    ]);

    res.json({ items: items.map(toPayload), unreadCount });
  }),
);

// PATCH /api/notifications/read-all

router.patch(
  "/read-all",
  wrap(async (req, res) => {
    const result = await Notification.updateMany(
      { user: req.user._id, readAt: null },
      { $set: { readAt: new Date() } },
    );
    res.json({ updated: result.modifiedCount });
  }),
);

// PATCH /api/notifications/:id/read
router.patch(
  "/:id/read",
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }
    // The owner check is inside the query, so nobody can touch another user's notification

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { readAt: new Date() } },
      { new: true },
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(toPayload(notification));
  }),
);

export default router;
