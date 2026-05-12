import { runDocker } from "./docker.runner";

export function runBash(code: string, input?: string) {
  return runDocker({
    image: "ubuntu:22.04",
    fileName: "code.sh",
    code,
    input,
    runCommand: (file) => `bash ${file}`,
  });
}
