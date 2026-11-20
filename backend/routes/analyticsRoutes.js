import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// sirf admin

router.use(protect, adminOnly);

// allowed 1 t0 365 and by defualt days 30
function getSince(req) {
  const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
  const since = new Date();
  since.setDate(since.getDate() - days);
  return { days, since };
}

// Shared Filter for order counted as sales bro

const soldOrders = (since) => ({
  createdAt: { $gte: since },
  status: { $ne: "Cancelled" },
});

router.get(
  "/summary",
  wrap(async (req, res) => {
    const { days, since } = getSince(req);
    const [totals] = await Order.aggregate([
      { $match: soldOrders(since) },
      { $group: { _id: null, orders: { $sum: 1 }, sales: { $sum: "$total" } } },
    ]);

    const pendingOrders = await Order.countDocuments({
      createdAt: { $gte: since },
      status: "Pending",
    });
    const cancelledOrders = await Order.countDocuments({
      createdAt: { $gte: since },
      status: "Cancelled",
    });
    res.json({
      days,
      orders: totals?.orders || 0,
      sales: totals?.sales || 0,
      pendingOrders,
      cancelledOrders,
    });
  }),
);

router.get(
  "/orders-over-time",
  wrap(async (req, res) => {
    const { since } = getSince(req);
    const rows = await Order.aggregate([
      { $match: soldOrders(since) },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Karachi",
            },
          },

          orders: { $sum: 1 },
          sales: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", orders: 1, sales: 1 } },
    ]);
    res.json(rows);
  }),
);

//  top 5 product

router.get(
  "/top-products",
  wrap(async (req, res) => {
    const { since } = getSince(req);
    const rows = await Order.aggregate([
      { $match: soldOrders(since) },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          unitsSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"],
            },
          },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: 1,
          unitsSold: 1,
          revenue: 1,
        },
      },
    ]);
    res.json(rows);
  }),
);

// sales by category

router.get(
  "/sales-by-category",
  wrap(async (req, res) => {
    const { since } = getSince(req);
    const rows = await Order.aggregate([
      { $match: soldOrders(since) },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.category",
          unitsSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $project: { _id: 0, category: "$_id", unitsSold: 1, revenue: 1 } },
    ]);
    res.json(rows);
  }),
);

// threshold=5

router.get(
  "/low-stock",
  wrap(async (req, res) => {
    const rawThreshold = Number(req.query.threshold);

    const threshold = Number.isFinite(rawThreshold)
      ? Math.max(Math.floor(rawThreshold), 0)
      : 5;
    const products = await Product.find({ stock: { $lte: threshold } })
      .sort({ stock: 1 })
      .limit(10);
    res.json(
      products.map((p) => ({
        id: String(p._id),
        name: p.name,
        category: p.category,
        stock: p.stock,
      })),
    );
  }),
);

export default router;
