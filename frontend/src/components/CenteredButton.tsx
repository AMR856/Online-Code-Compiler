import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface CenteredButtonInterface {
  onProgram: () => void;
  disabled?: boolean;
}

export const CenteredButton: FC<CenteredButtonInterface> = ({
  onProgram,
  disabled,
}) => {
  return (
    <div className="flex items-center justify-start">
      <Button
        onClick={onProgram}
        variant="default"
        className="border border-[#555] bg-[#333] px-5 py-2 text-sm text-[#d4d4d4] shadow-none transition-colors hover:border-[#007acc] hover:bg-[#007acc]"
        disabled={disabled}
      >
        Run ▶
      </Button>
    </div>
  );
};
