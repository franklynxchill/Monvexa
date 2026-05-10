import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      res.status(401).json({
        message: "Unauthorized - No token",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        message: "JWT_SECRET missing",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayload;

    if (!decoded.userId) {
      res.status(401).json({
        message: "Invalid token payload",
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};