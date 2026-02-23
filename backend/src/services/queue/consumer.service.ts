import { getChannel } from "../../queue/rabbitmq";
import { ExecuteJob } from "../../types/executeJob";
import { handleJob } from "../../workers/code.worker";

const QUEUE = "code_execution";

export async function startConsumer() {
  const channel = getChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  console.log("Worker is waiting for jobs...");

  channel.consume(
    QUEUE,
    async (msg) => {
      if (!msg) return;

      const job: ExecuteJob = JSON.parse(msg.content.toString());

      console.log("Received job:", job.id);

      try {
        await handleJob(job);
        channel.ack(msg);
      } catch (err) {
        console.error("Job failed:", job.id, err);

        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}