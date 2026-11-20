import Notification from "../models/Notification.js";
import User from "../models/User.js";

let emitter = null;
export function setNotificationEmitter(next) {
  emitter = next;
}

export function toPayload(doc) {
  return {
    id: String(doc._id),
    kind: doc.kind,
    title: doc.title,
    message: doc.message,
    link: doc.link,
    read: Boolean(doc.readAt),
    createdAt: doc.createdAt,
  };
}

// Save one notification for one user, and push it live if the socket layer exists

export async function notifyUser(userId, { kind, title, message, link = "" }) {
  const doc = await Notification.create({
    user: userId,
    kind,
    title,
    message,
    link,
  });
  const payload = toPayload(doc);
  if (emitter) emitter.toUser(String(userId), "notification:new", payload);
  return payload;
}

export async function notifyAdmins(details) {
  const admins = await User.find({ role: "admin" }).select("_id");
  await Promise.all(admins.map((admin) => notifyUser(admin._id, details)));
}

const shortId = (order) => `#${String(order._id).slice(-8)}`;

const STATUS_TEXT = {
  Pending: "it is waiting to be processed.",
  Assembling: "we have started assembling your PC.",
  Testing: "your build is being tested.",
  Shipped: "your order has been shipped.",
  Delivered: "your order has been delivered. Enjoy!",
  Cancelled: "your order was cancelled.",
};

export async function notifyOrderPlaced(order) {
  await Promise.all([
    notifyUser(order.user, {
      kind: "order_placed",
      title: "Order placed",
      message: `Your order ${shortId(order)} was placed. We will keep you updated as it moves forward.`,
      link: `/track-order/${order._id}`,
    }),
    notifyAdmins({
      kind: "new_order",
      title: "New order",
      message: `${order.customer.fullName} placed order ${shortId(order)} (Rs ${order.total.toLocaleString()}).`,
      link: "/admin/orders",
    }),
  ]);
}

export async function notifyOrderStatus(order) {
  await notifyUser(order.user, {
    kind: "order_status",
    title: `Order ${order.status}`,
    message: `Order ${shortId(order)}: ${STATUS_TEXT[order.status] || `status is now ${order.status}.`}`,
    link: `/track-order/${order._id}`,
  });
}
