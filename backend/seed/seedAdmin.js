import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.ADMIN_EMAIL.toLowerCase();
    await User.deleteOne({ email });
    await User.create({
      name: "Admin",
      email,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`Admin ready: ${email}`);
  } catch (err) {
    console.error("Admin seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();