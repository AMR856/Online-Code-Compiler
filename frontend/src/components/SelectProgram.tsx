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
];

export const SelectProgram: FC<SelectProgramInterface> = ({
  selectedProgram,
  onProgramChange,
}) => {
  return (
    <div className="flex items-center gap-4 p-2">
      <Select value={selectedProgram} onValueChange={onProgramChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
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
