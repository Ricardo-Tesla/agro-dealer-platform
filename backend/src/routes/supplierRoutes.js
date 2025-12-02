import express from 'express';
import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get supplier with products
router.get('/:id/products', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    const products = await Product.find({ supplier: req.params.id });
    res.json({
      supplier,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new supplier with product
router.post('/', async (req, res) => {
  try {
    const { name, contact, address, email, phone, product, quantity, category } = req.body;
    
    // Validate required fields
    if (!name || !contact || !address || !phone || !product || !quantity || !category) {
      return res.status(400).json({ 
        message: 'All fields are required: name, contact, address, phone, product, quantity, and category' 
      });
    }

    // Validate quantity is a positive number
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ 
        message: 'Quantity must be a positive number' 
      });
    }
    
    // Check if supplier already exists
    const existingSupplier = await Supplier.findOne({ name });
    if (existingSupplier) {
      return res.status(400).json({ 
        message: 'Supplier with this name already exists' 
      });
    }
    
    const supplier = new Supplier({
      name,
      contact,
      address,
      email,
      phone,
      product,
      quantity: parseInt(quantity),
      category
    });
    
    const newSupplier = await supplier.save();
    res.status(201).json({
      message: 'Supplier created successfully',
      supplier: newSupplier
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: messages 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  try {
    const { name, contact, address, email, phone, product, quantity, category } = req.body;
    
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    // Check if new name conflicts with existing supplier
    if (name && name !== supplier.name) {
      const existingSupplier = await Supplier.findOne({ name });
      if (existingSupplier) {
        return res.status(400).json({ message: 'Supplier with this name already exists' });
      }
    }

    // Validate quantity if provided
    if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
      return res.status(400).json({ 
        message: 'Quantity must be a positive number' 
      });
    }
    
    // Update fields
    supplier.name = name || supplier.name;
    supplier.contact = contact || supplier.contact;
    supplier.address = address || supplier.address;
    supplier.email = email || supplier.email;
    supplier.phone = phone || supplier.phone;
    supplier.product = product || supplier.product;
    supplier.quantity = quantity !== undefined ? parseInt(quantity) : supplier.quantity;
    supplier.category = category || supplier.category;
    
    const updatedSupplier = await supplier.save();
    
    // Update supplier name in all related products if name changed
    if (name && name !== supplier.name) {
      await Product.updateMany(
        { supplier: supplier._id },
        { supplierName: name }
      );
    }
    
    res.json({
      message: 'Supplier updated successfully',
      supplier: updatedSupplier
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: messages 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    // Check if supplier has products
    const productCount = await Product.countDocuments({ supplier: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete supplier. There are ${productCount} product(s) associated with this supplier. Please delete the products first.` 
      });
    }
    
    await supplier.deleteOne();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;