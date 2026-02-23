import { startConsumer } from "./services/queue/consumer.service";

export async function startWorker() {
  try {
    await startConsumer();
    console.log("Worker is running...");
  } catch (err) {
    console.error("Worker failed to start:", err);
    process.exit(1);
  }
}
