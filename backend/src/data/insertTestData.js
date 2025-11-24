import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import Supplier from "../models/Supplier.js";

dotenv.config();
connectDB();

const insertTestData = async () => {
  try {
    await Product.deleteMany();
    await Sale.deleteMany();
    await Supplier.deleteMany();

    const products = await Product.insertMany([
      { name: "NPK Fertilizer 50kg", category: "Fertilizers", quantity: 245, minStock: 100, price: 25000, status: "In Stock", location: "Warehouse A" },
      { name: "Maize Seeds (Hybrid)", category: "Seeds", quantity: 320, minStock: 50, price: 25000, status: "In Stock", location: "Warehouse B" }
    ]);

    const sales = await Sale.insertMany([
      { product: "NPK Fertilizer 50kg", customer: "Kirehe Cooperative", location: "Eastern Province", quantity: 50, amount: 1250000, status: "Completed" }
    ]);

    const suppliers = await Supplier.insertMany([
      { name: "Yara Rwanda Ltd", email: "info@yara.rw", phone: "+250788123456", location: "Kigali", productsSupplied: 245, totalValue: 6125000, rating: 4.8 }
    ]);

    console.log("Test data inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

insertTestData();
