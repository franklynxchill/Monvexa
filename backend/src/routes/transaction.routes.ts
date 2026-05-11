import express from "express";

import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "../controllers/transaction.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// ✅ MUST be a function
router.use(protect);

router.post("/", createTransaction);
router.get("/", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;