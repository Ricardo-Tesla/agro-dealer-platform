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

// Create new supplier
router.post('/', async (req, res) => {
  try {
    const { name, contact, address, email, phone } = req.body;
    
    // Check if supplier already exists
    const existingSupplier = await Supplier.findOne({ name });
    if (existingSupplier) {
      return res.status(400).json({ message: 'Supplier with this name already exists' });
    }
    
    const supplier = new Supplier({
      name,
      contact,
      address,
      email,
      phone
    });
    
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  try {
    const { name, contact, address, email, phone } = req.body;
    
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    // Check if new name conflicts with existing supplier
    if (name !== supplier.name) {
      const existingSupplier = await Supplier.findOne({ name });
      if (existingSupplier) {
        return res.status(400).json({ message: 'Supplier with this name already exists' });
      }
    }
    
    supplier.name = name || supplier.name;
    supplier.contact = contact || supplier.contact;
    supplier.address = address || supplier.address;
    supplier.email = email || supplier.email;
    supplier.phone = phone || supplier.phone;
    
    const updatedSupplier = await supplier.save();
    
    // Update supplier name in all related products
    if (name !== supplier.name) {
      await Product.updateMany(
        { supplier: supplier._id },
        { supplierName: name }
      );
    }
    
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

