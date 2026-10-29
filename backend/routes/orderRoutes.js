import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
const STATUSES = ["Pending", "Assembling", "Testing", "Shipped", "Delivered", "Cancelled"];
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Backend shape -> the shape your frontend already uses
function formatOrder(doc) {
  const o = doc.toObject();
  return {
    id: String(o._id),
    userId: String(o.user),
    createdAt: o.createdAt,
    status: o.status,
    customer: o.customer,
    items: o.items.map((i) => ({
      id: String(i.product),
      name: i.name,
      category: i.category,
      price: i.price,
      quantity: i.quantity,
    })),
    total: o.total,
  };
}

// POST /api/orders  (logged-in customer places an order)
router.post(
  "/",
  protect,
  wrap(async (req, res) => {
    const { customer, items } = req.body || {};

    if (!customer?.fullName || !customer?.phone || !customer?.city || !customer?.address) {
      return res.status(400).json({ message: "Please fill in all delivery details." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }
    if (items.some((i) => !mongoose.isValidObjectId(i.id))) {
      return res.status(400).json({ message: "Your cart has an old item. Please clear it and add parts again." });
    }

    const products = await Product.find({ _id: { $in: items.map((i) => i.id) } });
    const byId = new Map(products.map((p) => [String(p._id), p]));

    let total = 0;
    const lines = [];
    for (const item of items) {
      const product = byId.get(String(item.id));
      const quantity = Number(item.quantity);
      if (!product) {
        return res.status(400).json({ message: "A part in your cart no longer exists." });
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity." });
      }
      total += product.price * quantity; // price comes from the database
      lines.push({
        product: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      customer: {
        fullName: customer.fullName,
        phone: customer.phone,
        city: customer.city,
        address: customer.address,
        paymentMethod: customer.paymentMethod === "bank" ? "bank" : "cod",
      },
      items: lines,
      total,
    });

    res.status(201).json(formatOrder(order));
  })
);

// GET /api/orders/mine  (my own orders)
router.get(
  "/mine",
  protect,
  wrap(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders.map(formatOrder));
  })
);

// GET /api/orders  (admin: all orders)
router.get(
  "/",
  protect,
  adminOnly,
  wrap(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(formatOrder));
  })
);

// GET /api/orders/:id  (owner or admin)
router.get(
  "/:id",
  protect,
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = String(order.user) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "This is not your order." });
    }
    res.json(formatOrder(order));
  })
);

// PATCH /api/orders/:id/status  (admin changes the status)
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  wrap(async (req, res) => {
    const { status } = req.body || {};
    if (!STATUSES.includes(status)) {
  return res.status(400).json({ message: "Invalid status." });
}
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(formatOrder(order));
  })
);

export default router;