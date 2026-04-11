import express from "express";
import { generateContent, getPosts, deletePost } from "../controllers/generateController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All generation and history routes are now protected
router.post("/generate", protect, generateContent);
router.get("/posts", protect, getPosts);
router.delete("/posts/:id", protect, deletePost);

export default router;