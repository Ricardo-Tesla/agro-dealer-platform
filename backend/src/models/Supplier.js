import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  location: String,
  productsSupplied: Number,
  totalValue: Number,
  rating: Number,
  lastDelivery: Date
}, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema);
