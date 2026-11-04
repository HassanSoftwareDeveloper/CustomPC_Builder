import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const router = express.Router();

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);


router.get(
  "/",
  wrap(async (req, res) => {
    const { category, search, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: escapeRegex(String(search)), $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ price: 1 });
    res.json(products);
  })
);


router.get(
  "/:id",
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  })
);


router.post(
  "/",
  protect,
  adminOnly,
  wrap(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  })
);


router.put(
  "/:id",
  protect,
  adminOnly,
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  })
);


router.delete(
  "/:id",
  protect,
  adminOnly,
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  })
);

export default router;
