// routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products with optional search
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { supplier: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    
    if (!['in_stock', 'out_of_stock'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use: in_stock, or out_of_stock' });
    }
    
    const products = await Product.find({ status }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new product (status auto-calculated by model middleware)
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, price, expiryDate, supplier, location } = req.body;

    
    const product = new Product({ 
      name, 
      category, 
      quantity: Number(quantity),  
      price: Number(price), 
      expiryDate, 
      supplier, 
      location 
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(400).json({ message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, category, quantity, minStock, price, expiryDate, supplier, location } = req.body;

    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        category, 
        quantity: Number(quantity), 
        price: Number(price), 
        expiryDate, 
        supplier, 
        location 
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(400).json({ message: err.message });
  }
});


router.patch('/:id/quantity', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Valid quantity is required and cannot be negative' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.quantity = Number(quantity);
    await product.save(); 
    
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', deletedProduct: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;