import crypto from "node:crypto";
import { redisClient } from "../config/redis";
import { env } from "../config/env";

const LOCK_PREFIX = "lock:billing:";

const RELEASE_LOCK_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`;

export const acquireLock = async (
  transactionId: string,
  ttlMs: number = env.redisLockTtlMs,
): Promise<string | null> => {
  const lockKey = `${LOCK_PREFIX}${transactionId}`;

  const lockToken = crypto.randomUUID();

  const result = await redisClient.set(lockKey, lockToken, {
    NX: true,
    PX: ttlMs,
  });

  return result === "OK" ? lockToken : null;
};

export const releaseLock = async (
  transactionId: string,
  lockToken: string,
): Promise<boolean> => {
  const lockKey = `${LOCK_PREFIX}${transactionId}`;

  const result = await redisClient.eval(RELEASE_LOCK_SCRIPT, {
    keys: [lockKey],
    arguments: [lockToken],
  });

  return result === 1;
};
