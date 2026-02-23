export interface JobStorage {
  create(jobId: string): Promise<void>;
  setRunning(jobId: string): Promise<void>;
  setDone(jobId: string, stdout: string, stderr: string): Promise<void>;
  setError(jobId: string, error: string): Promise<void>;
  get(jobId: string): Promise<any>;
}