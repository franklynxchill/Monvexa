import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";


// =======================
// SIGNUP
// =======================
export const signup = async (
  req: Request,
  res: Response
) => {
  try {
    const { fullName, email, password } = req.body;

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

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
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
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none", // 🔥 FIX HERE
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logged out",
  });
};


// =======================
// GET CURRENT USER
// =======================
export const getMe = async (
  req: any,
  res: Response
) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
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
      `http://localhost:3000/reset-password/${resetToken}`;

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