import express from "express";
import { createProduct,getProducts, getProductById, updateProduct , deleteProduct, getProductReviews, createProductReview } from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, createProductReview);
router.get("/:id/reviews", getProductReviews);

export default router;