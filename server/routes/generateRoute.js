import express from "express";
import { generateContent, getPosts, deletePost, regenerateSlide, generatePostCaption } from "../controllers/generateController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All generation and history routes are now protected
router.post("/generate", protect, generateContent);
router.get("/posts", protect, getPosts);
router.delete("/posts/:id", protect, deletePost);
router.post("/regenerate-slide", protect, regenerateSlide);
router.post("/generate-caption", protect, generatePostCaption);

export default router;