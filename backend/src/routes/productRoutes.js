import express from 'express';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('supplier', 'name contact')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by supplier ID
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.params.supplierId })
      .populate('supplier', 'name contact');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplier', 'name contact address');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock products
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('supplier', 'name');
    
    const lowStockProducts = products.filter(product =>
      product.stock <= product.minStockLevel
    );
    
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const { 
      name, 
      description, 
      supplier, 
      category, 
      purchasePrice, 
      sellingPrice,
      minStockLevel,
      unit,
      sku
    } = req.body;
    
    // If supplier is being changed, verify new supplier exists
    if (supplier && supplier !== product.supplier.toString()) {
      const supplierDoc = await Supplier.findById(supplier);
      if (!supplierDoc) {
        return res.status(400).json({ message: 'Invalid supplier. Supplier does not exist.' });
      }
      product.supplier = supplier;
      product.supplierName = supplierDoc.name;
    }
    
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (category) product.category = category;
    if (purchasePrice !== undefined) product.purchasePrice = purchasePrice;
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
    if (minStockLevel !== undefined) product.minStockLevel = minStockLevel;
    if (unit) product.unit = unit;
    if (sku) product.sku = sku;
    
    const updatedProduct = await product.save();
    await updatedProduct.populate('supplier', 'name contact');
    
    res.json(updatedProduct);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Add stock (purchase from supplier)
router.post('/:id/add-stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.addStock(quantity);
    await product.populate('supplier', 'name contact');
    
    res.json({
      message: 'Stock added successfully',
      product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
