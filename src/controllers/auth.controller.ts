import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/db";
import {
  generateTokenPair,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../utils/jwt";
import { User, UserPayload } from "../types/auth.types";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await pool.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    const user: UserPayload = {
      id: result.insertId,
      username,
    };

    const tokens = await generateTokenPair(user);
    res.status(201).json({
      message: "User registered successfully",
      ...tokens,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user: User = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokens = await generateTokenPair({
      id: user.id,
      username: user.username,
    });
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify the refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if the refresh token exists in the database
    const [rows]: any = await pool.execute(
      "SELECT * FROM refresh_tokens WHERE userId = ?",
      [payload.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Revoke the old refresh token
    await revokeRefreshToken(refreshToken);

    // Generate new token pair
    const tokens = await generateTokenPair({
      id: payload.id,
      username: payload.username,
    });
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    await revokeRefreshToken(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};
