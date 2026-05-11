import { Response, Request } from "express";

import Transaction from "../models/transaction.model";
import Category from "../models/category.model";

import { AuthRequest } from "../middleware/auth.middleware";

// CREATE TRANSACTION
export const createTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { amount, type, category, date, note } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({
        message: "Enter required fields",
      });
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Validate category
    const categoryExists = await Category.findOne({
      _id: category,
      $or: [
        { isDefault: true },
        { userId },
        { userId: null },
      ],
    });

    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    const newTransaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      note,
      userId,
    });

    return res.status(201).json({
      message: "Transaction added successfully",
      data: newTransaction,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// GET TRANSACTIONS
export const getTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const transactions = await Transaction.find({
      userId,
    })
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Transactions fetched successfully",
      data: transactions || [],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE TRANSACTION
export const updateTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category");

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction updated successfully",
      data: transaction,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE TRANSACTION
export const deleteTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
      data: transaction,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};