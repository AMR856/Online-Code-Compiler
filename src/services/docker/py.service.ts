import { runDocker } from "./dockerRunner";

export function runPythonDocker(code: string, input?: string) {
  return runDocker({
    image: "python:3.10",
    fileName: "code.py",
    code,
    input,
    runCommand: (file) => `python3 ${file}`,
  });
}