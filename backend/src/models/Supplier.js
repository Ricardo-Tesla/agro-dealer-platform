import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true,
    unique: true
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  product: {
    type: String,
    required: [true, 'product is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'quantity is required']
  },
  category: {
    type: String,
    required: [true, 'category is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Prevent deletion if supplier has products
supplierSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const Product = mongoose.model('Product');
  const productCount = await Product.countDocuments({ supplier: this._id });
  
  if (productCount > 0) {
    throw new Error('Cannot delete supplier with existing products. Please delete products first.');
  }
  next();
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;

