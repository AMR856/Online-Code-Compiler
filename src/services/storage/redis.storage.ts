import { redisClient } from "../../redis/client";

export class RedisJobStorage {
  async create(jobId: string) {
    await redisClient.hSet(jobId, {
      status: "queued",
      stdout: "",
      stderr: "",
    });
  }

  async setRunning(jobId: string) {
    await redisClient.hSet(jobId, { status: "running" });
  }

  async setDone(jobId: string, stdout: string, stderr: string) {
    await redisClient.hSet(jobId, {
      status: "done",
      stdout,
      stderr,
    });
  }

  async setError(jobId: string, error: string) {
    await redisClient.hSet(jobId, {
      status: "error",
      stderr: error,
    });
  }

  async get(jobId: string) {
    return redisClient.hGetAll(jobId);
  }
}