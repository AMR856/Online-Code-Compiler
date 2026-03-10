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
    <div className="flex items-center justify-center max-h-screen white">
      <Button
        onClick={onProgram}
        variant="default"
        className="px-4 py-2 text-sm"
        disabled={disabled}
      >
        Run
      </Button>
    </div>
  );
};
