import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import app from "./src/app.js";
import { connect } from "mongoose";

dotenv.config();

connectDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})