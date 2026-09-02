import { createClient } from "redis";
import { env } from "./env";

export const redisClient = createClient({
  url: env.redisUrl,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
