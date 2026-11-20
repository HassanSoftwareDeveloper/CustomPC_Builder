import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kind: {
      type: String,
      required: true,
      enum: ["order_placed", "order_status", "new_order", "chat_message"],
    },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    link: { type: String, default: "" },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, _id: -1 });
notificationSchema.index({ user: 1, readAt: 1 });

notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

export default mongoose.model("Notification", notificationSchema);
