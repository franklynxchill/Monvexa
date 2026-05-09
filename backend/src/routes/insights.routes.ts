import express from "express";
import { getInsights } from "../controllers/insights.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// ======================================
// GET INSIGHTS / ANALYTICS
// ======================================
router.get("/", protect, getInsights);

export default router;