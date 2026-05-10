import express from "express";

import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "../controllers/tansaction.controller";

import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(protect);

router.post("/", createTransaction);
router.get("/", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;