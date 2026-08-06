import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, upload.array("images", 10), uploadImages);

export default router;