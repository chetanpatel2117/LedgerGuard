import "dotenv/config";

import app from "./app";
import { connectRedis } from "./config/redis";

const PORT = 3000;

const startServer = async () => {
  try {
    try {
      await connectRedis();
    } catch (error) {
      console.warn("Redis unavailable; starting without Redis-backed locks.", error);
    }

    app.listen(PORT, () => {
      console.log(`LedgerGuard API Gateway running on port ${PORT}`);
      console.log("Redis connection attempted");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
