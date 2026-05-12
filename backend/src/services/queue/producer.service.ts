import { getChannel } from "../../queue/rabbitmq";
import { ExecuteJob } from "../../types/executeJob";

const QUEUE = "code_execution";

export async function enqueueJob(job: ExecuteJob) {
  // Enqueueing a job to RabbitMQ. 
  const channel = getChannel();

  // Ensure the queue exists before sending messages to it. 
  // This is important because RabbitMQ requires that the queue be declared before it can be used. The durable option ensures that the queue will survive a RabbitMQ server restart.
  await channel.assertQueue(QUEUE, { durable: true });

  // Sending to queue
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(job)), {
    persistent: true,
  });

  console.log("Job queued:", job.id);
}
