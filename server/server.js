import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import uploadRoutes from "./routes/uploadRoute.js";

dotenv.config()
const app=express()

const PORT=process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

app.get('/',(req,res)=>{
    res.send("We are live")
})

connectDB()

app.listen(PORT,()=>{
    console.log("server running on port",PORT)
})

