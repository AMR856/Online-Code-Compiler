import { connectRedis } from "./redis/client";
import { connectRabbitMQ } from "./queue/rabbitmq";
import { startConsumer } from "./services/queue/consumer.service";

export async function bootstrap() {
  try {
    console.log("Starting worker...");

    await connectRedis();
    console.log("Redis connected");

    await connectRabbitMQ();
    console.log("RabbitMQ connected");

    await startConsumer();

    console.log("Worker is running...");
  } catch (err) {
    console.error("Worker failed to start:", err);
    process.exit(1);
  }
}
