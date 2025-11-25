// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Seeds', 'Fertilizer', 'Tools', 'Pesticides', 'Equipment', 'Other']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  expiryDate: {
    type: String,
    default: ''
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['in_stock', 'out_of_stock'],
    default: 'in_stock'
  }
}, {
  timestamps: true
});

// Method to calculate and update status based on quantity
productSchema.methods.updateStatus = function() {
  if (this.quantity === 0) {
    this.status = 'out_of_stock';
  } else {
    this.status = 'in_stock';
  }
  return this.status;
};

// Pre-save middleware to automatically update status before saving
productSchema.pre('save', function(next) {
  this.updateStatus();
  next();
});

// Pre-update middleware to automatically update status on findOneAndUpdate
productSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  // If quantity or minStock is being updated, recalculate status
  if (update.quantity !== undefined || update.minStock !== undefined) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    
    if (docToUpdate) {
      const newQuantity = update.quantity !== undefined ? update.quantity : docToUpdate.quantity;
      
      
      let newStatus;
      if (newQuantity === 0) {
        newStatus = 'out_of_stock';
      
      } else {
        newStatus = 'in_stock';
      }
      
      update.status = newStatus;
    }
  }
  
  next();
});

// Index for search optimization
productSchema.index({ name: 'text', category: 'text', supplier: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;