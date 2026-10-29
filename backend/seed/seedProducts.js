import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const products = [
  { name: "Ryzen 5 5600", category: "cpu", brand: "AMD", price: 25000, spec: "6 cores, 12 threads", specs: { socket: "AM4", ramType: "DDR4", tdp: 65 } },
  { name: "Ryzen 7 5700X", category: "cpu", brand: "AMD", price: 38000, spec: "8 cores, 16 threads", specs: { socket: "AM4", ramType: "DDR4", tdp: 65 } },
  { name: "Ryzen 5 7600", category: "cpu", brand: "AMD", price: 62000, spec: "6 cores, 12 threads", specs: { socket: "AM5", ramType: "DDR5", tdp: 65 } },
  { name: "B550 Motherboard", category: "motherboard", price: 22000, spec: "AM4, ATX, DDR4", specs: { socket: "AM4", ramType: "DDR4" } },
  { name: "B650 Motherboard", category: "motherboard", price: 32000, spec: "AM5, ATX, DDR5", specs: { socket: "AM5", ramType: "DDR5" } },
  { name: "16GB DDR4 RAM", category: "ram", price: 9000, spec: "2 x 8 GB, 3200 MHz", specs: { ramType: "DDR4", sizeGB: 16 } },
  { name: "32GB DDR4 RAM", category: "ram", price: 16000, spec: "2 x 16 GB, 3200 MHz", specs: { ramType: "DDR4", sizeGB: 32 } },
  { name: "16GB DDR5 RAM", category: "ram", price: 18000, spec: "2 x 8 GB, 5600 MHz", specs: { ramType: "DDR5", sizeGB: 16 } },
  { name: "RTX 4060 8GB", category: "gpu", price: 90000, spec: "8 GB GDDR6", specs: { tdp: 115, recommendedPsu: 550 } },
  { name: "RTX 4070 12GB", category: "gpu", price: 185000, spec: "12 GB GDDR6X", specs: { tdp: 200, recommendedPsu: 650 } },
  { name: "1TB NVMe SSD", category: "storage", price: 13000, spec: "PCIe 3.0, fast loading", specs: { type: "NVMe", sizeGB: 1000 } },
  { name: "650W Power Supply", category: "psu", price: 12000, spec: "80+ Bronze", specs: { wattage: 650 } },
  { name: "750W Power Supply", category: "psu", price: 16000, spec: "80+ Gold", specs: { wattage: 750 } },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();