import { FC } from 'react';

interface StatusBarProps {
  status: string;
}

export const StatusBar: FC<StatusBarProps> = ({ status }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full flex items-center gap-4 px-4 py-4 text-sm bg-secondary text-foreground border-t border-border">
      <div>{status}</div>
      <div className="flex-1" />
    </div>
  );
};
