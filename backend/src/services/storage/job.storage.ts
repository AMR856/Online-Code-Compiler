// This interface defines the contract for a job storage system. It includes methods for creating a job, updating its status to running, marking it as done with output and error information, marking it as errored with an error message, and retrieving the job information. This abstraction allows us to implement different storage backends (e.g., in-memory, database) without changing the rest of the application logic that interacts with job storage.
export interface JobStorage {
  create(jobId: string): Promise<void>;
  setRunning(jobId: string): Promise<void>;
  setDone(jobId: string, stdout: string, stderr: string): Promise<void>;
  setError(jobId: string, error: string): Promise<void>;
  get(jobId: string): Promise<any>;
}
