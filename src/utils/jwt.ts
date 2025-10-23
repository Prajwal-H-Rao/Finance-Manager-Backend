import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { TokenPair, UserPayload } from "../types/auth.types";
import { pool } from "../config/db";
import crypto from "crypto";

export const generateAccessToken = (payload: UserPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: UserPayload): string => {
  return jwt.sign(payload, config.refreshTokenSecret, { expiresIn: "7d" });
};

export const generateTokenPair = async (
  payload: UserPayload
): Promise<TokenPair> => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token in database
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await pool.execute(
    "INSERT INTO refresh_tokens (userId, token, expiresAt) VALUES (?, ?, ?)",
    [payload.id, hashedToken, expiresAt]
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyAccessToken = (token: string): UserPayload => {
  return jwt.verify(token, config.jwtSecret) as UserPayload;
};

export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, config.refreshTokenSecret) as UserPayload;
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  await pool.execute("DELETE FROM refresh_tokens WHERE token = ?", [
    hashedToken,
  ]);
};
