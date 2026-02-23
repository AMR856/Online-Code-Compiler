import { ExecuteJob } from "../types/executeJob";
import { ExecutionService } from "../services/execution.service";
import { RedisJobStorage } from "../services/storage/redis.storage";
import { pubClient } from "../redis/pubsub";

const CHANNEL = "job_updates";

export async function handleJob(job: ExecuteJob) {
  console.log("Processing job:", job.id);

  await RedisJobStorage.setRunning(job.id);

  await pubClient.publish(
    CHANNEL,
    JSON.stringify({
      jobId: job.id,
      status: "running",
    })
  );

  try {
    const result = await ExecutionService.run(job);

    await RedisJobStorage.setDone(
      job.id,
      result.stdout || "",
      result.stderr || ""
    );

    await pubClient.publish(
      CHANNEL,
      JSON.stringify({
        jobId: job.id,
        status: "done",
        stdout: result.stdout,
        stderr: result.stderr,
      })
    );

    console.log("Job completed:", job.id);

    return result;
  } catch (err: any) {
    const errorMessage = err.message || "Execution failed";

    console.error("Execution error:", job.id, errorMessage);

    await RedisJobStorage.setError(job.id, errorMessage);

    await pubClient.publish(
      CHANNEL,
      JSON.stringify({
        jobId: job.id,
        status: "error",
        stderr: errorMessage,
      })
    );

    throw err;
  }
}