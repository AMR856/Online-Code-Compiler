import { createClient } from "redis";

export const pubClient = createClient();
export const subClient = createClient();

export async function initPubSub() {
  await pubClient.connect();
  await subClient.connect();

  console.log("Redis Pub/Sub ready");
}