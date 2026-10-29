import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { checkBuild } from "../utils/compatibility.js";

const router = express.Router();

const PART_TYPES = ["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case"];


router.post("/check", async (req, res, next) => {
  try {
    const parts = {};

    for (const type of PART_TYPES) {
      const id = req.body[type];
      if (!id) continue; 

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: `Invalid id for ${type}` });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: `${type} not found` });
      }
      if (product.category !== type) {
        return res
          .status(400)
          .json({ message: `${product.name} is not a ${type}` });
      }
      parts[type] = product;
    }

    res.json(checkBuild(parts));
  } catch (err) {
    next(err);
  }
});

export default router;