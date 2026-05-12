import { createClient } from "redis";

// We use separate clients for publishing and subscribing to avoid interference between the two operations.
export const pubClient = createClient();
export const subClient = createClient();

export async function initPubSub() {
  // Connect both clients before using them
  await pubClient.connect();
  await subClient.connect();

  console.log("Redis Pub/Sub ready");
}
