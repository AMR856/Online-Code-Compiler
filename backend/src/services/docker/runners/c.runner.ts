import { runDocker } from "./docker.runner";

export function runC(code: string, input?: string) {
  return runDocker({
    image: "gcc:latest",
    fileName: "code.c",
    code,
    input,
    runCommand: (file) => `gcc ${file} -o /app/code.out && /app/code.out`,
  });
}
