import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Fertilizers, Seeds, etc
  quantity: { type: Number, required: true },
  minStock: { type: Number, required: true },
  price: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  supplier: { type: String, required: true },
  status: { type: String, default: "In Stock" },
  location: { type: String },
  lastRestocked: { type: Date },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
