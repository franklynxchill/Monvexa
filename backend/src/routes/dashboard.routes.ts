import express from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// ====================================
// GET DASHBOARD
// ====================================

router.get("/", protect, getDashboard)

export default router;