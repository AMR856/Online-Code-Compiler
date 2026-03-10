import { FC, useState } from "react";

interface InputFieldProps {
    label?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
}

export const InputField: FC<InputFieldProps> = ({
    label = "Label",
    placeholder = "Enter text",
    onChange,
}) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (onChange) onChange(value);
    };

    return (
        <div className="flex flex-col items-start gap-2 p-4">
            <label className="text-sm font-medium text-foreground/80">{label}</label>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="px-4 py-2 w-full border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
        </div>
    );
};
