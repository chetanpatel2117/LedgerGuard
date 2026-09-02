import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

const redisLockTtlMs = Number(process.env.REDIS_LOCK_TTL_MS ?? 10000);

if (!Number.isInteger(redisLockTtlMs) || redisLockTtlMs <= 0) {
  throw new Error("REDIS_LOCK_TTL_MS must be a positive integer");
}

export const env = {
  jwtSecret,
  redisUrl,
  redisLockTtlMs,
};
