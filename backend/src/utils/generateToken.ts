import jwt from "jsonwebtoken";

export const generateToken = (
  userId: string,
  rememberMe: boolean
) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET missing");
  }

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: rememberMe ? "30d" : "1d", }
  );
};