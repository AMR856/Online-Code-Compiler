require("dotenv").config();
import app from "./app";
import { connectRedis, disconnectRedis } from "./redis/client";
import { connectRabbitMQ, closeRabbitMQ } from "./queue/rabbitmq";
import { startWorker } from "./worker";
import { initSocket } from "./socket/socket";
import http from "http";
import { initPubSub } from "./redis/pubsub";
import { startSubscriber } from "./socket/subscriber";

const PORT = process.env.PORT || 3000;
const RUN_WORKER = process.env.RUN_WORKER === "false";

let isShuttingDown = false;

async function startServer() {
  try {
    console.log("Connecting to Redis...");
    await connectRedis();

    console.log("Connecting to RabbitMQ...");
    await connectRabbitMQ();

    if (RUN_WORKER) {
      console.log("Starting worker...");
      await startWorker();
    }

    const server = http.createServer(app);

    initSocket(server);
    await initPubSub();
    await startSubscriber();

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    const shutdown = async (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      console.log(`\nReceived ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        try {
          console.log("Cleaning up resources...");

          await disconnectRedis();
          await closeRabbitMQ();

          console.log("Shutdown complete");
          process.exit(0);
        } catch (err) {
          console.error("Error during shutdown:", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("uncaughtException", async (err) => {
      console.error("Uncaught Exception:", err);
      await shutdown("uncaughtException");
    });

    process.on("unhandledRejection", async (reason) => {
      console.error("Unhandled Rejection:", reason);
      await shutdown("unhandledRejection");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
