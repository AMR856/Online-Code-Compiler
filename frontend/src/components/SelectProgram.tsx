import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SelectProgramInterface {
  selectedProgram: string;
  onProgramChange: (value: string) => void;
}

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "bash", label: "Bash" },
];

export const SelectProgram: FC<SelectProgramInterface> = ({
  selectedProgram,
  onProgramChange,
}) => {
  return (
    <div className="flex items-center gap-4">
      <Select value={selectedProgram} onValueChange={onProgramChange}>
        <SelectTrigger className="h-9 w-[220px] border border-[#555] bg-[#333] text-[#d4d4d4] shadow-none hover:border-[#007acc] focus:ring-0">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="border-[#444] bg-[#252526] text-[#d4d4d4]">
          {LANGUAGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
