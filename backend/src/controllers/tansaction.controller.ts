import { Request, Response } from "express";
import Transaction from "../models/transaction.model";
import Category from "../models/category.model";

// CREATE TRANSACTION
export const createTransaction = async (req: Request, res: Response) => {
  const { amount, type, category, date, note} = req.body;
  try {
    // ✅ DEBUG LOGS (ADD HERE)
    // console.log("COOKIE USER:", req.user);
    // console.log("USER ID:", req.user?.userId);
    // console.log("CATEGORY:", category);
    if (!amount || !type || !category || !date) {
      return res.status(400).json({message: "Enter required fields"});
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // 🔒 Validate category belongs to user or is default
    const categoryExists = await Category.findOne({
      _id: category,
      $or: [
        { isDefault: true },
        { userId: userId },
        { userId: null } // 👈 system fallback (VERY IMPORTANT)
      ]
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

    res.status(201).json({
      newTransaction: {
        id: newTransaction._id,
        amount: newTransaction.amount,
        type: newTransaction.type,
        category: newTransaction.category,
        date: newTransaction.date,
        note: newTransaction.note,
      },
      message: "Transaction successful added"
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
}

// VIEW TRANSACTION
export const getTransaction = async (req: Request, res: Response) => {
  try {
     const userId = req.user?.userId;

    const transactions = await Transaction.find({ userId })
    .populate("category")
    .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Transaction fetched is successful",
      data: transactions,
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
}

// UPDATE TRANSACTION
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        userId, // 🔒 ensures user owns transaction
      },
      {
        $set: req.body, // safer than raw req.body overwrite
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE TRANSACTION
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    

    const transactions = await Transaction.findOneAndDelete({
      _id: id,
      userId
    })

    if (!transactions) {
      return res.status(400).json({message: "Transaction not found"})
    }

    res.status(200).json({
      message: "Transaction deleted is successful",
      data: transactions,
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
}