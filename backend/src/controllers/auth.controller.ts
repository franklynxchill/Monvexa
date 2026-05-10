import User from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils";

import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../utils/cookie.config";

/* =========================
   SIGNUP
========================= */
export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const emailLower = email.toLowerCase();

    const exists = await User.findOne({ email: emailLower });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: emailLower,
      password: hashed,
    });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.refreshTokenVersion
    );

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.refreshTokenVersion
    );

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REFRESH TOKEN
========================= */
export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    const user = await User.findById(decoded.userId);

    if (!user || decoded.version !== user.refreshTokenVersion) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(
      user._id.toString(),
      user.refreshTokenVersion
    );

    res.cookie("accessToken", newAccessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.json({ message: "Token refreshed" });
  } catch (err) {
    return res.status(401).json({ message: "Refresh failed" });
  }
};

/* =========================
   LOGOUT
========================= */
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", accessCookieOptions);
  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.json({ message: "Logged out" });
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(200).json({ message: "If email exists, link sent" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.passwordResetToken = hashed;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  console.log(`Reset link: /reset-password/${resetToken}`);

  return res.json({ message: "Reset link sent" });
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req: Request, res: Response) => {
  const rawToken = req.params.token;

  if (!rawToken || typeof rawToken !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  if (!req.body.password || req.body.password.length < 6) {
  return res.status(400).json({ message: "Invalid password" });
}

  const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return res.json({ message: "Password reset successful" });
};