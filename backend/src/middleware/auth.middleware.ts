import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type DecodedToken = {
  userId: string;
};

export const protect = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("TOKEN:", req.cookies.token);
    console.log("ALL COOKIES:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET missing");
    }

    const decoded = jwt.verify(
      token,
      secret
    ) as DecodedToken;

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};