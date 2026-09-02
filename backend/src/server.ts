import "dotenv/config";

import app from "./app";
import { connectRedis } from "./config/redis";

const PORT = 3000;

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`LedgerGuard API Gateway running on port ${PORT}`);
      console.log("Redis connected successfully");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
