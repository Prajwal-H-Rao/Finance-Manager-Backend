import app from "./app";
import { config } from "./config/env";
import { pool } from "./config/db";

const start = async () => {
  try {
    // Test database connection
    await pool.getConnection();
    console.log("Connected to MySQL database");

    // Start server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
