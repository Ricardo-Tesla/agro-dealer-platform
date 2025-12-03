import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },

    quantity: { 
      type: Number, 
      default: 0,
      min: 0
    },

    unit: { 
      type: String, 
      trim: true 
    },

    // REQUIRED: Product must belong to a specific supplier
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    }
  },
  { timestamps: true }
);

// Ensure a supplier cannot have duplicate product names
ProductSchema.index({ name: 1, supplier: 1 }, { unique: true });

export default mongoose.model("Product", ProductSchema);
