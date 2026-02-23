import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

export interface DockerRunOptions {
  image: string;
  fileName: string;
  code: string;
  runCommand: (filePath: string) => string;
  input?: string;
  timeout?: number;
}

export async function runDocker(options: DockerRunOptions): Promise<{
  success: boolean;
  status: string;
  stdout: string;
  stderr: string;
}> {
  return new Promise((resolve) => {
    const {
      image,
      fileName,
      code,
      runCommand,
      input,
      timeout = 20000,
    } = options;

    const jobId = uuidv4();
    const tempDir = path.join(__dirname, "../../../temp_jobs", jobId);

    fs.mkdirSync(tempDir, { recursive: true });

    const codeFilePath = path.join(tempDir, fileName);
    fs.writeFileSync(codeFilePath, code);

    const containerFilePath = `/app/${fileName}`;

    const dockerCmd = `
      docker run --rm \
      -i \
      --network none \
      --memory 100m \
      --cpus 0.5 \
      -v ${tempDir}:/app \
      ${image} \
      sh -c "${runCommand(containerFilePath)}"
    `;

    const child = exec(dockerCmd, { timeout }, (err, stdout, stderr) => {
      fs.rmSync(tempDir, { recursive: true, force: true });

      let status: string = "success";
      let success = true;
      let cleanError = stderr;

      if (err) {
        success = false;
        if ((err as any).killed) {
          status = "timeout";
          cleanError = "Execution timed out";
        } else if (stderr) {
          status = "runtime_error";

          const lines = stderr.split("\n");
          cleanError = lines.slice(-2).join("\n");
        } else {
          status = "system_error";
          cleanError = err.message;
        }
      }

      resolve({
        success,
        status,
        stdout,
        stderr: cleanError,
      });
    });

    if (input) child.stdin?.write(input);
    child.stdin?.end();
  });
}
