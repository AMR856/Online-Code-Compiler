import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

export async function runPythonDocker(code: string, input?: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const jobId = uuidv4();
    const tempDir = path.join(__dirname, "../../../temp_jobs", jobId);
    fs.mkdirSync(tempDir, { recursive: true });

    const codeFilePath = path.join(tempDir, "code.py");
    fs.writeFileSync(codeFilePath, code);

    const dockerCmd = `
      docker run --rm \
      -i \
      --network none \
      --memory 100m \
      --cpus 0.5 \
      -v ${tempDir}:/app \
      python:3.10 \
      python /app/code.py
    `;

    const child = exec(dockerCmd, { timeout: 5000 }, (err, stdout, stderr) => {
      fs.rmSync(tempDir, { recursive: true, force: true });
      resolve({
        stdout,
        stderr: err ? err.message : stderr,
      });
    });

    if (input) child.stdin?.write(input);
    child.stdin?.end();
  });
}