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

const allowedOrigins = [
  "http://localhost:5173",
  "https://social-media-studio-rust.vercel.app", // Vercel URL
];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false); // ❗ don't throw error
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", generateRoutes);
app.use("/api", imageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
