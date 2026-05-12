import { getChannel } from "../../queue/rabbitmq";
import { ExecuteJob } from "../../types/executeJob";
import { handleJob } from "../../workers/code.worker";

const QUEUE = "code_execution";

export async function startConsumer() {
  // The same steps as the producer
  const channel = getChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  console.log("Worker is waiting for jobs...");

  // =====================
  // Now the worker start consuming the jobs in the channel
  channel.consume(
    QUEUE,
    async (msg) => {
      if (!msg) return;

      const job: ExecuteJob = JSON.parse(msg.content.toString());

      console.log("Received job:", job.id);

      try {
        // Handling the job and sending confirmation to RabbitMQ. 
        // The worker processes the job using the handleJob function, 
        // which executes the code and updates the job status in Redis. If the job is processed successfully, we acknowledge the message to remove it from the queue. If there's an error during processing, we nack the message to indicate failure and prevent it from being requeued.
        await handleJob(job);
        channel.ack(msg);
      } catch (err) {
        console.error("Job failed:", job.id, err);

        channel.nack(msg, false, false);
      }
    },
    { noAck: false },
  );
}
