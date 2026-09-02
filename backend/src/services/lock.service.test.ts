import assert from "node:assert/strict";
import { connectRedis, redisClient } from "../config/redis";
import { acquireLock, releaseLock } from "./lock.service";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runTests = async () => {
  await connectRedis();

  const transactionId = `test-${Date.now()}`;

  console.log("Test 1: First lock acquisition");

  const firstToken = await acquireLock(transactionId);

  assert.ok(firstToken);
  console.log("✅ First lock acquired");

  console.log("Test 2: Duplicate lock acquisition");

  const secondToken = await acquireLock(transactionId);

  assert.equal(secondToken, null);
  console.log("✅ Duplicate lock rejected");

  console.log("Test 3: Different transaction");

  const otherToken = await acquireLock(`${transactionId}-other`);

  assert.ok(otherToken);
  console.log("✅ Different transaction acquired");

  console.log("Test 4: Wrong token cannot release lock");

  const wrongRelease = await releaseLock(transactionId, "wrong-token");

  assert.equal(wrongRelease, false);
  console.log("✅ Wrong token rejected");

  console.log("Test 5: Correct token releases lock");

  const correctRelease = await releaseLock(transactionId, firstToken!);

  assert.equal(correctRelease, true);
  console.log("✅ Correct token released lock");

  console.log("Test 6: Lock can be acquired again");

  const thirdToken = await acquireLock(transactionId);

  assert.ok(thirdToken);
  console.log("✅ Lock acquired again");

  console.log("Test 7: Lock expires automatically");

  await releaseLock(transactionId, thirdToken!);

  const shortLivedTransaction = `${transactionId}-expiry`;

  const expiryToken = await acquireLock(shortLivedTransaction, 100);

  assert.ok(expiryToken);

  await sleep(150);

  const afterExpiryToken = await acquireLock(shortLivedTransaction, 100);

  assert.ok(afterExpiryToken);
  console.log("✅ Expired lock can be acquired again");

  await releaseLock(`${transactionId}-other`, otherToken!);

  await releaseLock(shortLivedTransaction, afterExpiryToken!);

  await redisClient.quit();

  console.log("");
  console.log("🎉 ALL REDIS LOCK TESTS PASSED");
};

runTests().catch(async (error) => {
  console.error("❌ Redis lock test failed:", error);

  if (redisClient.isOpen) {
    await redisClient.quit();
  }

  process.exit(1);
});
