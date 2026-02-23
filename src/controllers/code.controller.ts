import { Request, Response } from "express";
import { ExecuteRequest } from "../types/executeRequest";
import { ExecuteResponse } from "../types/executeResponse";
import { CodeService } from "../services/code.service";

export class CodeController {
  static async execute(req: Request<{}, {}, ExecuteRequest>, res: Response) {
    try {
      const result = await CodeService.execute(req.body);
      const response: ExecuteResponse = {
        success: result.success,
        status: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
      };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
