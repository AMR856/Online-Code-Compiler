import CustomError from "../types/customError";
import { ExecuteJob } from "../types/executeJob";
import { runners } from "./docker";
import { HttpStatusText } from "../types/HTTPStatusText";

export class ExecutionService {
  static async run(job: ExecuteJob) {
    const runner = runners[job.language];

    if (!runner) {
      throw new CustomError("Unsupported language", 400, HttpStatusText.FAIL);
    }

    return runner(job.code, job.input);
  }
}
