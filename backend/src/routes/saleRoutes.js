import express from 'express';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single sale
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('items.product', 'name category unit');
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales by date range
router.get('/reports/date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const sales = await Sale.find(query).sort({ createdAt: -1 });
    
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalSales = sales.length;
    
    res.json({
      sales,
      summary: {
        totalSales,
        totalRevenue,
        averageSaleValue: totalSales > 0 ? totalRevenue / totalSales : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new sale (with stock validation and reduction)
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { items, paymentMethod, customerName, customerContact, notes } = req.body;
    
    if (!items || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Sale must have at least one item' });
    }
    
    // Validate stock availability for all items
    const stockErrors = [];
    const processedItems = [];
    let totalAmount = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        stockErrors.push(`Product with ID ${item.productId} not found`);
        continue;
      }
      
      // Check if enough stock is available
      if (!product.hasEnoughStock(item.quantity)) {
        stockErrors.push(
          `Insufficient stock for "${product.name}". Available: ${product.stock} ${product.unit}, Requested: ${item.quantity}`
        );
        continue;
      }
      
      const unitPrice = item.price || product.sellingPrice;
      const subtotal = unitPrice * item.quantity;
      
      processedItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: unitPrice,
        subtotal: subtotal
      });
      
      totalAmount += subtotal;
    }
    
    // If there are any stock errors, abort the transaction
    if (stockErrors.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: 'Cannot complete sale due to stock issues',
        errors: stockErrors 
      });
    }
    
    // Create the sale
    const sale = new Sale({
      items: processedItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      customerName: customerName || '',
      customerContact: customerContact || '',
      notes: notes || '',
      status: 'completed'
    });
    
    await sale.save({ session });
    
    // Reduce stock for each item
    for (const item of processedItems) {
      const product = await Product.findById(item.product).session(session);
      await product.reduceStock(item.quantity);
    }
    
    // Commit the transaction
    await session.commitTransaction();
    
    // Populate and return the sale
    await sale.populate('items.product', 'name category unit');
    
    res.status(201).json({
      message: 'Sale created successfully',
      sale
    });
    
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Cancel sale (restore stock)
router.post('/:id/cancel', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const sale = await Sale.findById(req.params.id).session(session);
    
    if (!sale) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    if (sale.status === 'cancelled') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Sale is already cancelled' });
    }
    
    // Restore stock for each item
    for (const item of sale.items) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        await product.addStock(item.quantity);
      }
    }
    
    sale.status = 'cancelled';
    await sale.save({ session });
    
    await session.commitTransaction();
    
    res.json({
      message: 'Sale cancelled successfully. Stock has been restored.',
      sale
    });
    
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Delete sale (only if cancelled)
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    if (sale.status !== 'cancelled') {
      return res.status(400).json({ 
        message: 'Cannot delete active sale. Please cancel it first to restore stock.' 
      });
    }
    
    await sale.deleteOne();
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

