import { FC } from 'react';

interface HeaderInterface{}

export const Header: FC<HeaderInterface> = () => {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-secondary border-b border-border">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/80 text-primary-foreground text-lg font-bold">
          C
        </span>
        <div>
          <div className="text-lg font-semibold text-foreground">Online Compiler</div>
          <div className="text-xs text-foreground/70">Run code in Python & JavaScript</div>
        </div>
      </div>
    </header>
  );
};