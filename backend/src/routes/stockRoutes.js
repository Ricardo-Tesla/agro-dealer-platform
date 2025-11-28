import express from "express";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import Sale from "../models/Sale.js";

const router = express.Router();

/* ===========================================================
   1. HANDLE SUPPLY DELIVERY (Increase product or create new)
   =========================================================== */
router.post("/supply", async (req, res) => {
  try {
    const { supplierName, productName, category, quantity, price, expiryDate, location } = req.body;

    if (!supplierName || !productName || !quantity) {
      return res.status(400).json({ message: "Missing required supply fields." });
    }

    // Find supplier
    let supplier = await Supplier.findOne({ name: supplierName });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    // Check if product already exists
    let product = await Product.findOne({ name: productName });

    if (product) {
      // Product exists → increase quantity
      product.quantity += Number(quantity);
      product.price = Number(price); // optional: update latest price
      await product.save();
    } else {
      // Create new product
      product = new Product({
        name: productName,
        category,
        quantity,
        price,
        expiryDate,
        supplier: supplierName,
        location
      });
      await product.save();
    }

    // Update supplier stats
    supplier.productsSupplied = (supplier.productsSupplied || 0) + Number(quantity);
    supplier.totalValue = (supplier.totalValue || 0) + Number(quantity) * Number(price);
    supplier.lastDelivery = new Date();
    await supplier.save();

    res.json({ message: "Supply processed successfully", product, supplier });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================================================
   2. HANDLE SALES (Reduce product stock)
   =========================================================== */
router.post("/sale", async (req, res) => {
  try {
    const { product, customer, quantity, unitPrice, paymentStatus, paymentMethod } = req.body;

    if (!product || !customer || !quantity || !unitPrice) {
      return res.status(400).json({ message: "Missing required sale fields." });
    }

    // Find product
    const productDoc = await Product.findOne({ name: product });
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check stock availability
    if (productDoc.quantity < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${productDoc.quantity}`
      });
    }

    // Deduct quantity
    productDoc.quantity -= Number(quantity);
    await productDoc.save();

    // Create sale record
    const sale = new Sale({
      date: new Date(),
      product,
      customer,
      quantity,
      unitPrice,
      totalAmount: Number(quantity) * Number(unitPrice),
      paymentStatus,
      paymentMethod
    });

    await sale.save();

    res.json({
      message: "Sale recorded successfully",
      sale,
      product: productDoc
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
