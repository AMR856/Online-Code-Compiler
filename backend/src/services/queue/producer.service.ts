import { getChannel } from "../../queue/rabbitmq";
import { ExecuteJob } from "../../types/executeJob";

const QUEUE = "code_execution";

export async function enqueueJob(job: ExecuteJob) {
  const channel = getChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  channel.sendToQueue(
    QUEUE,
    Buffer.from(JSON.stringify(job)),
    { persistent: true }
  );

  console.log("Job queued:", job.id);
}