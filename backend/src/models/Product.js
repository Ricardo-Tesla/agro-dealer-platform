import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Product must have a supplier']
  },
  supplierName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    trim: true
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price cannot be negative']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative']
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  minStockLevel: {
    type: Number,
    default: 10,
    min: [0, 'Minimum stock level cannot be negative']
  },
  unit: {
    type: String,
    default: 'pcs',
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create index for faster queries
productSchema.index({ supplier: 1, name: 1 });
productSchema.index({ stock: 1 });

// Virtual field to check if stock is low
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.minStockLevel;
});

// Method to check if sufficient stock is available
productSchema.methods.hasEnoughStock = function(quantity) {
  return this.stock >= quantity;
};

// Method to add stock (when purchasing from supplier)
productSchema.methods.addStock = async function(quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be positive');
  }
  this.stock += quantity;
  return await this.save();
};

// Method to reduce stock (when making a sale)
productSchema.methods.reduceStock = async function(quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be positive');
  }
  if (!this.hasEnoughStock(quantity)) {
    throw new Error(`Insufficient stock. Available: ${this.stock}, Requested: ${quantity}`);
  }
  this.stock -= quantity;
  return await this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;

