import { ExecuteRequest } from "../types/executeRequest";
import { runPythonDocker } from "./docker/py.service";

export class CodeService {
  static async execute(request: ExecuteRequest) {
    const { code, input, language } = request;

    switch (language.toLowerCase()) {
      case "python":
        return runPythonDocker(code, input);
      default:
        throw new Error(`Language ${language} not supported`);
    }
  }
}