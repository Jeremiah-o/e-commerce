import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/users", protect, admin, getAllUsers);
router.put("/users/:id/role", protect, admin, updateUserRole);
router.delete("/users/:id", protect, admin, deleteUser);

export default router;