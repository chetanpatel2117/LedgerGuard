import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/ledgerguard";
const jwtSecret = process.env.JWT_SECRET ?? "local-dev-secret";

if (!process.env.MONGO_URI) {
  console.warn("MONGO_URI not set; using local default mongodb://127.0.0.1:27017/ledgerguard");
}

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET not set; using local fallback secret");
}

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

const redisLockTtlMs = Number(process.env.REDIS_LOCK_TTL_MS ?? 10000);

if (!Number.isInteger(redisLockTtlMs) || redisLockTtlMs <= 0) {
  throw new Error("REDIS_LOCK_TTL_MS must be a positive integer");
}

export const env = {
  mongoUri,
  jwtSecret,
  redisUrl,
  redisLockTtlMs,
};
