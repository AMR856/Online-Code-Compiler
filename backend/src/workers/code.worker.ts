import { ExecuteJob } from "../types/executeJob";
import { ExecutionService } from "../services/execution.service";
import { RedisJobStorage } from "../services/storage/redis.storage";
import { pubClient } from "../redis/pubsub";

const CHANNEL = "job_updates";

export async function handleJob(job: ExecuteJob) {
  console.log("Processing job:", job.id);

  // Setting the job to running
  await RedisJobStorage.setRunning(job.id);

  // Making the listeners know what's going on
  await pubClient.publish(
    CHANNEL,
    JSON.stringify({
      jobId: job.id,
      status: "running",
    }),
  );

  try {
    // Run the code
    const result = await ExecutionService.run(job);

    // Setting the job as done
    await RedisJobStorage.setDone(
      job.id,
      result.stdout || "",
      result.stderr || "",
    );

    // Letting the listeners know that the job is done and sending the output
    await pubClient.publish(
      CHANNEL,
      JSON.stringify({
        jobId: job.id,
        status: "done",
        stdout: result.stdout,
        stderr: result.stderr,
      }),
    );

    console.log("Job completed:", job.id);

    return result;
  } catch (err: any) {
    const errorMessage = err.message || "Execution failed";

    console.error("Execution error:", job.id, errorMessage);

    // Making the job as error and storing the error message
    await RedisJobStorage.setError(job.id, errorMessage);

    // Letting the listeners know that the job has failed and sending the error message
    await pubClient.publish(
      CHANNEL,
      JSON.stringify({
        jobId: job.id,
        status: "error",
        stderr: errorMessage,
      }),
    );

    throw err;
  }
}
