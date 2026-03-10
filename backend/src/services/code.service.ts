import { v4 as uuidv4 } from "uuid";
import { ExecuteRequest } from "../types/executeRequest";
import CustomError from "../types/customError";
import { HttpStatusText } from "../types/HTTPStatusText";
import { enqueueJob } from "./queue/producer.service";
import { RedisJobStorage } from "./storage/redis.storage";
import { sanitizeCode, sanitizeInput, validateLanguage } from "../utils/sanitize";

export class CodeService {
  static async createJob(request: ExecuteRequest) {
    const code = sanitizeCode(request.code);
    const language = validateLanguage(request.language);
    const input = sanitizeInput(request.input);

    const jobId = uuidv4();

    RedisJobStorage.create(jobId);

    await enqueueJob({
      id: jobId,
      code,
      language,
      input,
    });

    return { jobId, status: "queued" };
  }

  static async getJobResult(jobId?: string | string[]) {
    if (!jobId) {
      throw new CustomError("Job ID is required", 400, HttpStatusText.FAIL);
    }

    if (Array.isArray(jobId)) {
      jobId = jobId[0];
    }

    if (!jobId || jobId.trim() === "") {
      throw new CustomError("Invalid Job ID", 400, HttpStatusText.FAIL);
    }

    const result = await RedisJobStorage.get(jobId);

    if (!result || Object.keys(result).length === 0) {
      throw new CustomError("Job not found", 404, HttpStatusText.FAIL);
    }

    return {
      jobId,
      status: result.status,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
    };
  }
}
