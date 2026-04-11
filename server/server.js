import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import generateRoutes from "./routes/generateRoute.js";
import authRoutes from "./routes/authRoute.js";
import imageRoutes from "./routes/imageRoute.js"; 
// Connect to Database
connectDB();


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", generateRoutes);
app.use("/api", imageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
