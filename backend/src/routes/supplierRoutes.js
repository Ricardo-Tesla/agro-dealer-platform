import express from 'express';
import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single supplier
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET supplier with products
router.get('/:id/products', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const products = await Product.find({ supplier: supplier._id });
    res.json({ supplier, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE supplier + product
router.post('/', async (req, res) => {
  try {
    const { name, contact, address, email, phone, product, quantity, category, unit } = req.body;

    if (!name || !contact || !address || !phone || !product || quantity === undefined || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const existingSupplier = await Supplier.findOne({ name });
    if (existingSupplier) return res.status(400).json({ message: 'Supplier already exists' });

    const supplier = new Supplier({ name, contact, address, email, phone, product, quantity, category });
    const newSupplier = await supplier.save();

    // --- PRODUCT LOGIC ---
    let prod = await Product.findOne({
      name: { $regex: new RegExp(`^${product}$`, 'i') },
      supplier: newSupplier._id
    });

    if (prod) {
      prod.quantity += Number(quantity);
      await prod.save();
    } else {
      await Product.create({
        name: product,
        quantity,
        supplier: newSupplier._id,
        unit: unit || null
      });
    }

    res.status(201).json({ message: 'Supplier created and product updated', supplier: newSupplier });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE supplier + product quantity
router.put('/:id', async (req, res) => {
  try {
    const { name, contact, address, email, phone, product, quantity, category, unit } = req.body;

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    if (name && name !== supplier.name) {
      const existingSupplier = await Supplier.findOne({ name });
      if (existingSupplier) return res.status(400).json({ message: 'Supplier with this name already exists' });
    }

    if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    supplier.name = name || supplier.name;
    supplier.contact = contact || supplier.contact;
    supplier.address = address || supplier.address;
    supplier.email = email || supplier.email;
    supplier.phone = phone || supplier.phone;
    supplier.product = product || supplier.product;
    supplier.quantity = quantity !== undefined ? Number(quantity) : supplier.quantity;
    supplier.category = category || supplier.category;

    const updatedSupplier = await supplier.save();

    // --- PRODUCT LOGIC ---
    if (product && quantity !== undefined) {
      let prod = await Product.findOne({
        name: { $regex: new RegExp(`^${product}$`, 'i') },
        supplier: supplier._id
      });

      if (prod) {
        prod.quantity += Number(quantity);
        await prod.save();
      } else {
        await Product.create({
          name: product,
          quantity,
          supplier: supplier._id,
          unit: unit || null
        });
      }
    }

    res.json({ message: 'Supplier updated and product updated', supplier: updatedSupplier });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE supplier (block if products exist)
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const productCount = await Product.countDocuments({ supplier: supplier._id });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete supplier. There are ${productCount} product(s) associated. Delete products first.`
      });
    }

    await supplier.deleteOne();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
