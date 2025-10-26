import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateTokenPair,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../utils/jwt";
import { User } from "../types/auth.types";
import prisma from "../config/prisma";
import axios from "axios";

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body; // This is actually the access_token

    if (!tokenId) {
      return res.status(400).json({ message: "Access token is required" });
    }

    // Fetch user info using access token
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      }
    );

    const { email, name, email_verified } = response.data;

    // Verify email is confirmed
    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified by Google" });
    }

    if (!email) {
      return res
        .status(400)
        .json({ message: "Unable to get email from Google" });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    // If user doesn't exist, create new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email,
          name: name || email.split("@")[0],
          // password field omitted (will be null by default)
        },
      });
    }

    // Generate tokens
    const tokens = await generateTokenPair({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    res.status(200).json({
      message: "Google authentication successful",
      email: email,
      ...tokens,
    });
  } catch (error: any) {
    console.error("Google auth error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res
        .status(401)
        .json({ message: "Invalid or expired Google token" });
    }

    res.status(500).json({ message: "Error with Google authentication" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = await prisma.user.create({
      data: {
        email: email,
        name: email.split("@")[0], // example placeholder
        password: hashedPassword,
      },
    });

    const tokens = await generateTokenPair({
      id: user.id,
      name: user.name,
      email: user.email,
    });

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
    const { email, password } = req.body;

    const user: User | null = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password || "");
    if (!validPassword) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const tokens = await generateTokenPair({
      id: user.id,
      name: user.name,
      email: user.email,
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

    const existingToken = await prisma.refreshToken.findFirst({
      where: { userId: payload.id },
    });

    if (!existingToken) {
      return res.status(404).json({ message: "Invalid refresh token" });
    }

    // Revoke the old refresh token
    await revokeRefreshToken(refreshToken);

    // Generate new token pair
    const tokens = await generateTokenPair({
      id: payload.id,
      name: payload.name,
      email: payload.email,
    });
    res.json(tokens);
  } catch (error) {
    res.status(404).json({ message: "Invalid refresh token" });
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
