import { redisClient } from "../../redis/client";

export class RedisJobStorage {
  static async create(jobId: string) {
    await redisClient.hSet(jobId, {
      status: "queued",
      stdout: "",
      stderr: "",
    });
  }

  static  async setRunning(jobId: string) {
    await redisClient.hSet(jobId, { status: "running" });
  }

  static async setDone(jobId: string, stdout: string, stderr: string) {
    await redisClient.hSet(jobId, {
      status: "done",
      stdout,
      stderr,
    });
  }

  static async setError(jobId: string, error: string) {
    await redisClient.hSet(jobId, {
      status: "error",
      stderr: error,
    });
  }

  static async get(jobId: string) {
    return redisClient.hGetAll(jobId);
  }
}