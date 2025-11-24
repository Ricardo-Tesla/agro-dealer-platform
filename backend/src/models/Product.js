// models/Product.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    minStock: { type: Number, required: true },
    price: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    supplier: { type: String, required: true },
    status: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock", "expired"],
      default: "in_stock",
    },
    location: { type: String },
    lastRestocked: { type: Date },
  },
  { timestamps: true }
);

// --- AUTO STATUS UPDATE LOGIC ---
function calculateStatus(doc) {
  const now = new Date();

  if (doc.expiryDate && new Date(doc.expiryDate) < now) {
    return "expired";
  }
  if (doc.quantity === 0) {
    return "out_of_stock";
  }
  if (doc.quantity <= doc.minStock) {
    return "low_stock";
  }
  return "in_stock";
}

// Apply on .save()
productSchema.pre("save", function (next) {
  this.status = calculateStatus(this);
  next();
});

// Apply on findOneAndUpdate()
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update) return next();

  const quantity = update.quantity ?? this._update.$set?.quantity;
  const minStock = update.minStock ?? this._update.$set?.minStock;
  const expiry = update.expiryDate ?? this._update.$set?.expiryDate;

  const tempDoc = {
    quantity,
    minStock,
    expiryDate: expiry,
  };

  update.status = calculateStatus(tempDoc);

  this.setUpdate(update);
  next();
});

export default mongoose.model("Product", productSchema);
