import { Request, Response } from "express";
import app from "./app";
import { config } from "./config/env";
import prisma from "@/config/prisma";

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

const start = async () => {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log("✅ Connected to MySQL database via Prisma");

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

// Gracefully disconnect Prisma when process stops
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit(0);
});

start();
