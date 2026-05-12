import React, { useEffect, useRef } from "react";

type Props = {
  stdout: string;
  stderr: string;
  stdin: string;
  onStdinChange?: (val: string) => void;
  onClear?: () => void;
};

export const Terminal: React.FC<Props> = ({ stdout, stderr, stdin, onStdinChange, onClear }) => {
  const outRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (outRef.current) {
      outRef.current.scrollTop = outRef.current.scrollHeight;
    }
  }, [stdout, stderr]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-[#333] bg-[#1e1e1e] shadow-[0_0_0_1px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between border-b border-[#333] bg-[#252526] px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-[#d4d4d4]">Terminal</h2>
          <p className="text-[11px] text-[#9da3ad]">stdout, stderr, and stdin</p>
        </div>
        <button
          className="rounded border border-[#555] bg-[#333] px-3 py-1 text-xs text-[#d4d4d4] transition-colors hover:border-[#007acc] hover:bg-[#007acc]"
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <div className="mb-3 flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9da3ad]">stdin</label>
          <input
            value={stdin}
            onChange={(e) => onStdinChange && onStdinChange(e.target.value)}
            placeholder="Input to pass to your program"
            className="rounded border border-[#555] bg-[#252526] px-3 py-2 font-mono text-sm text-[#d4d4d4] outline-none placeholder:text-[#707070] focus:border-[#007acc]"
          />
        </div>

        <div className="grid h-[calc(100%-4.5rem)] gap-3 lg:grid-rows-[1fr_auto]">
          <div ref={outRef} className="min-h-0 overflow-auto rounded border border-[#333] bg-[#111111] p-3 font-mono text-sm leading-6 text-[#b7ffb7]">
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#9da3ad]">stdout</div>
            {stdout ? (
              <div className="whitespace-pre-wrap">{stdout}</div>
            ) : (
              <div className="text-[#6f6f6f]">No output yet</div>
            )}
          </div>

          <div className="rounded border border-[#333] bg-[#111111] p-3 font-mono text-sm leading-6 text-[#f14c4c]">
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#9da3ad]">stderr</div>
            {stderr ? (
              <div className="whitespace-pre-wrap">{stderr}</div>
            ) : (
              <div className="text-[#6f6f6f]">No errors</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
