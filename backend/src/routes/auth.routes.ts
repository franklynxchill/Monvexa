import express from "express";
import { forgotPassword, login, logout, resetPassword, signup } from "../controllers/auth.controller";

const router = express.Router();

// AUTH ROUTES
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// PASSWORD ROUTES
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;