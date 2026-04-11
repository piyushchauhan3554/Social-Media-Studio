import express from "express";
import { imageController } from "../controllers/imageController.js";

const router = express.Router();

router.get("/proxy-image", imageController);

export default router;