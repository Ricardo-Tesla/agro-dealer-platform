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
    sellingPrice: {
      type: Number,
      default: 0,
      min: 0
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

// Method to check if enough stock is available
ProductSchema.methods.hasEnoughStock = function(requestedQuantity) {
  return this.quantity >= requestedQuantity;
};

// Method to reduce stock
ProductSchema.methods.reduceStock = async function(quantityToReduce) {
  if (!this.hasEnoughStock(quantityToReduce)) {
    throw new Error(`Insufficient stock for ${this.name}. Available: ${this.quantity}, Requested: ${quantityToReduce}`);
  }
  this.quantity -= quantityToReduce;
  await this.save();
  return this;
};

// Method to add stock (for cancelled sales or new deliveries)
ProductSchema.methods.addStock = async function(quantityToAdd) {
  this.quantity += quantityToAdd;
  await this.save();
  return this;
};

// Virtual property for stock alias (for compatibility)
ProductSchema.virtual('stock').get(function() {
  return this.quantity;
});

export default mongoose.model("Product", ProductSchema);