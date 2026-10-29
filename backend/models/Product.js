import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case", "cooler"],
    },
    brand: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 }, // in PKR
    spec: {type: String, default: ""},
    image: { type: String, default: "" },
    stock: { type: Number, default: 10, min: 0 },
    // Compatibility info, e.g. { socket: "AM5", ramType: "DDR5", wattage: 650 }
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);