import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("supplier");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("supplier");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE product name/unit only
router.put("/:id", async (req, res) => {
  try {
    const { name, unit, quantity } = req.body;

    if (quantity !== undefined) {
      return res.status(403).json({ message: "Quantity cannot be updated directly. Use supplier delivery logic." });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, { name, unit }, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted", product: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
