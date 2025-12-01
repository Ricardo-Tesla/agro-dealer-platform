import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const saleSchema = new mongoose.Schema({
  saleNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [saleItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile_money', 'bank_transfer'],
    default: 'cash'
  },
  customerName: {
    type: String,
    trim: true
  },
  customerContact: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Generate sale number before saving
saleSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Find the last sale of the day
    const lastSale = await this.constructor.findOne({
      saleNumber: new RegExp(`^SALE-${year}${month}${day}`)
    }).sort({ saleNumber: -1 });
    
    let sequence = 1;
    if (lastSale) {
      const lastSequence = parseInt(lastSale.saleNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.saleNumber = `SALE-${year}${month}${day}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;

