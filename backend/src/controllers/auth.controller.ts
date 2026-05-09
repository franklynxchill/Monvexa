import User from "../models/user.model";
import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// SIGNGUP
export const signup = async (req: Request, res: Response) => {
  try {
    const {fullName, email, password } = req.body;

    if (!fullName || !email  || !password) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const emailLower = email.toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Email check
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Password check
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      });
    }

    const existing = await User.findOne({ email});
    if (existing) {
      return res.status(400).json({message: "User already exists"});
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create( {
      fullName,
      email: emailLower,
      password: hashed,
    });

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",   // 🔥 MUST be lax for localhost
      secure: false,
    });
        

    return res.status(201).json({
      message: "Successful signup",
      data: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email, 
      }
    })
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error"});
  }
}

// lOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid credentials"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",   // 🔥 MUST be lax for localhost
      secure: false,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
      token
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    })
  }
}

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0)
    });

    return res.status(200).json({
      message: "Logout successful",
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    })
  }
}

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({email});

    if (!user) {
      return res.status(200).json({ message: "If email exists, link sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // send email here (nodemailer)
    console.log(`Reset link: /reset-password/${resetToken}`);

    res.status(200).json({
      message: "Reset link sent.."
    })


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    })
  }
}

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  const rawToken = req.params.token;

  if (!rawToken || typeof rawToken !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }
  const token = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  if (!req.body.password) {
  return res.status(400).json({ message: "Password is required" });
}

  user.password = await bcrypt.hash(req.body.password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};