import { ExecuteJob } from "../types/executeJob";
import { ExecutionService } from "../services/execution.service";
import { RedisJobStorage } from "../services/storage/redis.storage";

export async function handleJob(job: ExecuteJob) {
  console.log("Processing job:", job.id);

  await RedisJobStorage.setRunning(job.id);

  try {
    const result = await ExecutionService.run(job);

    await RedisJobStorage.setDone(
      job.id,
      result.stdout || "",
      result.stderr || "",
    );

    console.log("Job completed:", job.id);
  } catch (err: any) {
    console.error("Execution error:", job.id, err);

    await RedisJobStorage.setError(job.id, err.message || "Execution failed");
  }
}
