
import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import productRoutes from "./routes/productRoutes.js";
import buildRoutes from "./routes/buildRoutes.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Apna PC API is running" });
});
app.use("/api/products", productRoutes);
app.use("/api/builds", buildRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  }
}

start();