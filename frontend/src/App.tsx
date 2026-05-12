import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { StatusBar } from "./components/StatusBar";
import { CenteredButton } from "./components/CenteredButton";
import { SelectProgram } from "./components/SelectProgram";
import { MonacoEditor } from "./components/MonacoEditor";
import { Terminal } from "./components/Terminal";
import axios from "axios";

const DEFAULT_CODE: Record<string, string> = {
  javascript: "console.log(\"Hello from JavaScript\");",
  python: "print(\"Hello from Python\")",
  c: "#include <stdio.h>\n\nint main(void) {\n    printf(\"Hello from C\\n\");\n    return 0;\n}",
  bash: "#!/usr/bin/env bash\necho \"Hello from Bash\"",
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,122,204,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(97,218,251,0.08),transparent_28%)]" />
      <Header />
      <main className="relative z-10 grid flex-1 gap-4 overflow-hidden px-4 py-4 pb-16 md:grid-cols-[1.25fr_0.95fr] md:px-6">
        <section className="flex min-h-0 flex-col gap-4 overflow-hidden rounded-md border border-[#333] bg-[#1e1e1e]/95 p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.24)] backdrop-blur-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9da3ad]">Editor</span>
              <h2 className="text-lg font-semibold text-[#d4d4d4]">Write, run, and inspect code</h2>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-[#9da3ad]">Language</span>
              <SelectProgram
                selectedProgram={language}
                onProgramChange={handleLanguageChange}
              />
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <MonacoEditor language={language} value={code} onChange={handleCodeChange} />
          </div>

          <div className="flex items-center justify-between gap-4 rounded border border-[#333] bg-[#252526] px-3 py-3">
            <div className="text-xs text-[#9da3ad]">
              <span className="font-semibold text-[#d4d4d4]">Status:</span> {status}
            </div>
            <CenteredButton
              onProgram={handleRun}
              disabled={status === "Submitting..." || status === "Queued"}
            />
          </div>
        </section>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-md border border-[#333] bg-[#1e1e1e]/95 shadow-[0_0_0_1px_rgba(0,0,0,0.24)] backdrop-blur-sm">
          <div className="flex min-h-0 flex-1 flex-col">
            <Terminal
              stdout={stdout}
              stderr={stderr}
              stdin={stdin}
              onStdinChange={handleStdinChange}
              onClear={() => {
                setStdout("");
                setStderr("");
              }}
            />
          </div>

          {jobId && (
            <div className="border-t border-[#333] bg-[#252526] p-4 text-sm text-[#d4d4d4]">
              <div className="font-medium text-[#61dafb]">Job</div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="text-[#9da3ad]">ID:</span>
                <span className="max-w-full truncate font-mono text-xs text-[#d4d4d4]">{jobId}</span>
              </div>
            </div>
          )}
        </section>
      </main>

      <StatusBar status={status} />
    </div>
  );
}

export default App;
