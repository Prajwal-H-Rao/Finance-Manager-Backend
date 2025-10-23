import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  dbHost: process.env.DB_HOST || "localhost",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "yourpassword",
  dbName: process.env.DB_NAME || "myapp",
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || "refresh-supersecretkey",
};
