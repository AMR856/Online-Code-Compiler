import { FC } from 'react';

interface HeaderInterface{}

export const Header: FC<HeaderInterface> = () => {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#333] bg-[#252526] px-5 py-3 text-[#d4d4d4] shadow-[0_1px_0_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-md border border-[#3a3a3a] bg-[#1e1e1e] text-sm font-semibold text-[#61dafb]">
          C
        </span>
        <div>
          <div className="text-[15px] font-semibold tracking-wide text-[#61dafb]">Online IDE</div>
          <div className="text-[11px] text-[#9da3ad]">Dark editor, terminal output, and live execution</div>
        </div>
      </div>

      <div className="hidden rounded-full border border-[#3a3a3a] bg-[#1e1e1e] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#9da3ad] md:block">
        Monaco Editor Workspace
      </div>
    </header>
  );
};