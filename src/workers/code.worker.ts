import { ExecuteJob } from "../types/executeJob";
import { ExecutionService } from "../services/execution.service";
import { RedisJobStorage } from "../services/storage/redis.storage";

const storage = new RedisJobStorage();

export async function handleJob(job: ExecuteJob) {
  console.log("Processing job:", job.id);

  await storage.setRunning(job.id);

  try {
    const result = await ExecutionService.run(job);

    await storage.setDone(
      job.id,
      result.stdout || "",
      result.stderr || ""
    );

    console.log("Job completed:", job.id);
  } catch (err: any) {
    console.error("Execution error:", job.id, err);

    await storage.setError(job.id, err.message || "Execution failed");
  }
}