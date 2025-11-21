import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Helper function to format date
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      expiryDate: formatDate(product.expiryDate)
    }));
    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const formattedProduct = {
      ...product.toObject(),
      expiryDate: formatDate(product.expiryDate)
    };
    res.json(formattedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

// Add new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    const formattedProduct = {
      ...product.toObject(),
      expiryDate: formatDate(product.expiryDate)
    };
    res.status(201).json(formattedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error: error.message });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    const formattedProduct = {
      ...updated.toObject(),
      expiryDate: formatDate(updated.expiryDate)
    };
    res.json(formattedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

export default router;