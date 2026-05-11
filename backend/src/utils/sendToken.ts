import { Response } from "express";

const sendToken = (
  res: Response,
  token: string
) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // IMPORTANT for localhost
    // secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default sendToken;