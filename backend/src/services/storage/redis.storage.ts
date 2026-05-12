import { redisClient } from "../../redis/client";

export class RedisJobStorage {
  // Creating the job entry in Redis with an initial status of "queued" and empty stdout/stderr fields. This method is called when a new job is created and added to the queue.
  static async create(jobId: string) {
    await redisClient.hSet(jobId, {
      status: "queued",
      stdout: "",
      stderr: "",
    });
  }

  // Making the job status runnig
  static  async setRunning(jobId: string) {
    await redisClient.hSet(jobId, { status: "running" });
  }

  // Set the job status to done and store the stdout and stderr output from the execution. This method is called when a job finishes successfully, allowing us to retrieve the output later when the client requests it.
  static async setDone(jobId: string, stdout: string, stderr: string) {
    await redisClient.hSet(jobId, {
      status: "done",
      stdout,
      stderr,
    });
  }

  // Set the status to error and store the error message. This method is called when a job encounters an error during execution, allowing us to provide feedback to the client about what went wrong.
  static async setError(jobId: string, error: string) {
    await redisClient.hSet(jobId, {
      status: "error",
      stderr: error,
    });
  }

  // Getting the job information from Redis. This method is called when the client requests the status or output of a job, allowing us to return the current state and any available output or error messages.
  static async get(jobId: string) {
    return redisClient.hGetAll(jobId);
  }
}