import CustomError from "../types/customError";
import { ExecuteRequest } from "../types/executeRequest";
import { HttpStatusText } from "../types/HTTPStatusText";
import { Languages } from "../types/languages";
import { runJavaScriptDocker } from "./docker/js.service";
import { runPythonDocker } from "./docker/py.service";

export class CodeService {
  static async execute(request: ExecuteRequest) {
    const { code, input, language } = request;

    switch (language.toLowerCase()) {
      case Languages.PYTHON:
        return runPythonDocker(code, input);
      case Languages.JAVASCRIPT:
        return runJavaScriptDocker(code, input);
      default:
        throw new CustomError(
          `Language ${language} not supported`,
          400,
          HttpStatusText.FAIL,
        );
    }
  }
}
