import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, minStock, price, expiryDate, supplier, location } = req.body;

    const qty = Number(quantity);
    const min = Number(minStock);

    let status = 'in_stock';
    if (qty === 0) status = 'out_of_stock';
    else if (qty <= min) status = 'low_stock';

    const product = new Product({ name, category, quantity: qty, minStock: min, price, expiryDate, supplier, location, status });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, category, quantity, minStock, price, expiryDate, supplier, location } = req.body;

    const qty = Number(quantity);
    const min = Number(minStock);

    let status = 'in_stock';
    if (qty === 0) status = 'out_of_stock';
    else if (qty <= min) status = 'low_stock';

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, quantity: qty, minStock: min, price, expiryDate, supplier, location, status },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
