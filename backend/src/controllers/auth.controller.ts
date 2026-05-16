import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import mongoose from "mongoose";
import Transaction from "../models/transaction.model";
import Category from "../models/category.model";




// =======================
// SIGNUP
// =======================
export const signup = async (
  req: Request,
  res: Response
) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString(), false);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


// =======================
// LOGIN
// =======================
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: rememberMe ? "30d" : "1d", }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: rememberMe
        ? 30 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000,
      sameSite: "none",
    });
    return res.status(200).json({
      message: "Login successful",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =======================
// LOGOUT
// =======================
export const logout = (
  req: Request,
  res: Response
) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logged out",
  });
};


// =======================
// GET CURRENT USER
// =======================

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // =========================
    // USER
    // =========================
    const user = await User.findById(objectId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =========================
    // TRANSACTION STATS
    // =========================
    const transactionStats =
      await Transaction.aggregate([
        {
          $match: {
            userId: objectId,
          },
        },

        {
          $group: {
            _id: null,

            totalTransactions: {
              $sum: 1,
            },

            months: {
              $addToSet: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$date",
                },
              },
            },
          },
        },

        {
          $project: {
            _id: 0,
            totalTransactions: 1,
            totalMonths: {
              $size: "$months",
            },
          },
        },
      ]);

    // =========================
    // CATEGORY STATS
    // =========================
    const totalCategories =
      await Category.countDocuments({
        userId: objectId,
      });

    // =========================
    // FINAL STATS
    // =========================
    const stats = {
      totalTransactions:
        transactionStats[0]?.totalTransactions || 0,

      totalMonths:
        transactionStats[0]?.totalMonths || 0,

      totalCategories,
    };

    return res.status(200).json({
      user,
      stats,
    });

  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =======================
// FORGET PASSWORD
// =======================

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "If account exists, reset link has been sent",
      });
    }

    // generate random token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // save hashed token
    user.passwordResetToken = hashedToken;

    // expires in 10 mins
    user.passwordResetExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    // frontend reset URL
    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    console.log("RESET URL:", resetUrl);

    // later replace with nodemailer/email

    res.status(200).json({
      message:
        "If account exists, reset link has been sent",
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


// =======================
// RESET PASSWORD
// =======================

export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.params.token;

    if (!token || Array.isArray(token)) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};