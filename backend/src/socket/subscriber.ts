import { subClient } from "../redis/pubsub";
import { getIO } from "./socket";

const CHANNEL = "job_updates";

export async function startSubscriber() {
  await subClient.subscribe(CHANNEL, (message) => {
    const data = JSON.parse(message);

    const { jobId } = data;

    console.log("Update:", data);

    const io = getIO();

    io.to(jobId).emit("jobUpdate", data);
  });

  console.log("Subscribed to job updates");
}