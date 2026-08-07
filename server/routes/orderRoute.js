import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderAsPaid,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);//customer
router.get("/myorders", protect, getMyOrders);//customer
router.get("/", protect, admin, getAllOrders);//admin
router.get("/:id", protect, getOrderById);//customer
router.put("/:id/pay", protect, markOrderAsPaid);//customer
router.put("/:id/status", protect, admin, updateOrderStatus);//admin
// router.put("/:id/deliver", protect, admin, markOrderAsDelivered);admin

export default router;