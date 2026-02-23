import { runDocker } from "./docker.runner";

export function runJavaScriptDocker(code: string, input?: string) {
  return runDocker({
    image: "node:18",
    fileName: "code.js",
    code,
    input,
    runCommand: (file) => `node ${file}`,
  });
}