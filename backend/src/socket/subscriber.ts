import { subClient } from "../redis/pubsub";
import { getIO } from "./socket";

const CHANNEL = "job_updates";

export async function startSubscriber() {
  // Subscribe to the Redis channel for job updates. Whenever a message is published to this channel, we parse the message and emit it to the corresponding Socket.IO room based on the jobId. This allows clients that are subscribed to that jobId to receive real-time updates about the job's status and output.
  await subClient.subscribe(CHANNEL, (message) => {
    const data = JSON.parse(message);

    const { jobId } = data;

    console.log("Update:", data);

    const io = getIO();

    io.to(jobId).emit("jobUpdate", data);
  });

  console.log("Subscribed to job updates");
}
