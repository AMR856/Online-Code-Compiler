import { Request, Response, NextFunction } from "express";
import { CodeService } from "../services/code.service";

export class CodeController {
  static async execute(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CodeService.createJob(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getResult(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CodeService.getJobResult(req.params.jobId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}