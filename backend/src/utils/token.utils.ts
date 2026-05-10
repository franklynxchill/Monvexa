import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (userId: string, version: number) => {
  return jwt.sign(
    { userId, version },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};