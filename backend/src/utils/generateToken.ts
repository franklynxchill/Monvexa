// utils/generateToken.ts
import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign(
    { userId }, // MUST be userId (not id)
    process.env.JWT_SECRET as string,
    { expiresIn: "2d" }
  );
};