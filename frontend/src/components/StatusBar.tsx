import { FC } from 'react';

interface StatusBarProps {
  status: string;
}

export const StatusBar: FC<StatusBarProps> = ({ status }) => {
  return (
    <div className="fixed bottom-0 left-0 flex w-full items-center gap-3 border-t border-[#333] bg-[#252526] px-4 py-2 text-[12px] text-[#d4d4d4] shadow-[0_-1px_0_rgba(0,0,0,0.15)]">
      <div className="rounded-full border border-[#3a3a3a] bg-[#1e1e1e] px-2.5 py-1 font-medium text-[#61dafb]">
        {status}
      </div>
      <div className="flex-1" />
      <div className="hidden text-[#9da3ad] md:block">Python, JavaScript, Monaco</div>
    </div>
  );
};
