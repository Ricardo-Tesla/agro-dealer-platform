import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  product: { type: String, required: true },
  customer: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: "Pending" },
  paymentMethod: { type: String, default: "Cash" }
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);
