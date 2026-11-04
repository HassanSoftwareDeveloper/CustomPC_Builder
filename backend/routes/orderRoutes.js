import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
const STATUSES = ["Pending", "Assembling", "Testing", "Shipped", "Delivered", "Cancelled"];
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);


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

async function giveBackStock(lines) {
  for (const line of lines) {
    await Product.updateOne({ _id: line.product }, { $inc: { stock: line.quantity } });
  }
}


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
    if (items.some((i) => !mongoose.isValidObjectId(i?.id))) {
      return res.status(400).json({ message: "Your cart has an old item. Please clear it and add parts again." });
    }

    
    const wanted = new Map();
    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity." });
      }
      const key = String(item.id);
      wanted.set(key, (wanted.get(key) || 0) + quantity);
    }

    const products = await Product.find({ _id: { $in: [...wanted.keys()] } });
    const byId = new Map(products.map((p) => [String(p._id), p]));

    let total = 0;
    const lines = [];
    for (const [id, quantity] of wanted) {
      const product = byId.get(id);
      if (!product) {
        return res.status(400).json({ message: "A part in your cart no longer exists." });
      }
      total += product.price * quantity; 
      lines.push({
        product: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity,
      });
    }

  
    const reduced = [];
    for (const line of lines) {
      const updated = await Product.findOneAndUpdate(
        { _id: line.product, stock: { $gte: line.quantity } },
        { $inc: { stock: -line.quantity } }
      );

      if (!updated) {
        await giveBackStock(reduced); 
        return res.status(400).json({
          message: `Sorry, "${line.name}" does not have enough stock.`,
        });
      }
      reduced.push(line);
    }

    let order;
    try {
      order = await Order.create({
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
    } catch (err) {
      await giveBackStock(reduced); 
      throw err;
    }

    res.status(201).json(formatOrder(order));
  })
);


router.get(
  "/mine",
  protect,
  wrap(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders.map(formatOrder));
  })
);


router.get(
  "/",
  protect,
  adminOnly,
  wrap(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(formatOrder));
  })
);


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

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const wasCancelled = order.status === "Cancelled";
    const nowCancelled = status === "Cancelled";

    
    if (!wasCancelled && nowCancelled) {
      await giveBackStock(order.items);
    }

    
    if (wasCancelled && !nowCancelled) {
      const taken = [];
      for (const line of order.items) {
        const ok = await Product.findOneAndUpdate(
          { _id: line.product, stock: { $gte: line.quantity } },
          { $inc: { stock: -line.quantity } }
        );
        if (!ok) {
          await giveBackStock(taken);
          return res.status(400).json({
            message: `Not enough stock of "${line.name}" to reopen this order.`,
          });
        }
        taken.push(line);
      }
    }

    order.status = status;
    await order.save();
    res.json(formatOrder(order));
  })
);

export default router;