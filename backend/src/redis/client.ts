import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

// Connecting to Redis is handled in the main server file (e.g., src/index.ts) to ensure it's established before the application starts handling requests.
export async function connectRedis() {
  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  // Connect
  await redisClient.connect();
  console.log("Redis connected");
}


export async function disconnectRedis() {
  try {
    console.log("Disconnecting Redis...");
  
    // If it connected, quit the client to close the connection gracefully
    if (redisClient.isOpen) {
      await redisClient.quit();
    }

    console.log("Redis disconnected");
  } catch (err) {
    console.error("Error disconnecting Redis:", err);
  }
}