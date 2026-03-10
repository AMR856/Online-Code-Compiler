import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { StatusBar } from "./components/StatusBar";
import { CenteredButton } from "./components/CenteredButton";
import { SelectProgram } from "./components/SelectProgram";
import { InputField } from "./components/InputField";
import axios from "axios";

const DEFAULT_CODE: Record<string, string> = {
  javascript: "console.log(\"Hello from JavaScript\");",
  python: "print(\"Hello from Python\")",
};

function App() {
  const [status, setStatus] = useState("Ready");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE[language]);
  const [stdin, setStdin] = useState("");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    setCode(DEFAULT_CODE[language]);
  }, [language]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleStdinChange = (value: string) => {
    setStdin(value);
  };

  const fetchResult = async (id: string) => {
    try {
      const resp = await axios.get(`/code/${id}`);
      const { status: jobStatus, stdout: out, stderr: err } = resp.data;

      setStatus(jobStatus);
      setStdout(out ?? "");
      setStderr(err ?? "");

      if (jobStatus !== "queued") {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    } catch (error) {
      console.error(error);
      setStatus("Error fetching result");
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  };

  const handleRun = async () => {
    setStatus("Submitting...");
    setStdout("");
    setStderr("");
    setJobId(null);

    try {
      const response = await axios.post("/code/execute", {
        code,
        language,
        input: stdin,
      });

      const { jobId: id } = response.data;
      setJobId(id);
      setStatus("Queued");

      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      pollingRef.current = window.setInterval(() => {
        fetchResult(id);
      }, 1200);
    } catch (error) {
      console.error(error);
      setStatus("Execution request failed");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-col gap-4 px-6 py-4 md:flex-row">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground/80">Language</span>
            <SelectProgram
              selectedProgram={language}
              onProgramChange={handleLanguageChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground/80">Code</span>
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="h-60 w-full resize-none rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <InputField
            label="Stdin (optional)"
            placeholder="Input to pass to your program"
            onChange={handleStdinChange}
          />

          <CenteredButton
            onProgram={handleRun}
            disabled={status === "Submitting..." || status === "Queued"}
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="rounded-md border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Output</h2>
            <div className="mt-2 space-y-2">
              <div>
                <div className="text-xs font-medium text-foreground/70">Stdout</div>
                <pre className="max-h-48 overflow-auto rounded-md bg-background/60 p-2 text-sm text-foreground">
                  {stdout || (
                    <span className="text-foreground/60">No output yet</span>
                  )}
                </pre>
              </div>
              <div>
                <div className="text-xs font-medium text-foreground/70">Stderr</div>
                <pre className="max-h-48 overflow-auto rounded-md bg-background/60 p-2 text-sm text-foreground">
                  {stderr || (
                    <span className="text-foreground/60">No errors</span>
                  )}
                </pre>
              </div>
            </div>
          </div>

          {jobId && (
            <div className="rounded-md border border-border bg-card p-4 text-sm text-foreground">
              <div className="font-medium">Job</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-foreground/80">ID:</span>
                <span className="font-mono text-xs text-foreground/70">{jobId}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <StatusBar status={status} />
    </div>
  );
}

export default App;
