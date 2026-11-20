import cookieParser from "cookie-parser";
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
import userRoutes from "./routes/userRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import http from "node:http";
import { initSocket } from "./socket/index.js";
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const parsedPort = Number.parseInt(process.env.PORT ?? "", 10);
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4000;

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());
const httpServer = http.createServer(app);
initSocket(httpServer, allowedOrigins);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Apna PC API is running" });
});
app.use("/api/products", productRoutes);
app.use("/api/builds", buildRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use(errorHandler);

async function start() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in the .env file.");
    }
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  }
}

start();
