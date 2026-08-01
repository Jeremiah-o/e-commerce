import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/",addToCart);
router.get("/", getCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);

export default router;
