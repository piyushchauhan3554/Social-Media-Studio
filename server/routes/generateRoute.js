import express from "express";
import { generateContent } from "../controllers/generateController.js";

const router = express.Router();

router.post("/generate", generateContent);

export default router;