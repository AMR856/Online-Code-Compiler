export interface ExecutionResult {
  success: boolean;
  status: "success" | "runtime_error" | "timeout" | "system_error";
  stdout: string;
  stderr: string;
}