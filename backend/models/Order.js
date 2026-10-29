import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      paymentMethod: { type: String, enum: ["cod", "bank"], default: "cod" },
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        category: String,
        price: Number,
        quantity: { type: Number, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);