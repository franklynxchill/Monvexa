import express from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// 🔥 MUST PROTECT THIS ROUTE
router.get("/", protect, getDashboard);

export default router;