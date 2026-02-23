import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

export async function connectRedis() {
  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  await redisClient.connect();
  console.log("Redis connected");
}


export async function disconnectRedis() {
  try {
    console.log("🔌 Disconnecting Redis...");

    if (redisClient.isOpen) {
      await redisClient.quit();
    }

    console.log("Redis disconnected");
  } catch (err) {
    console.error("Error disconnecting Redis:", err);
  }
}