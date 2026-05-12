import React from "react";
import Editor, { OnChange } from "@monaco-editor/react";

type Props = {
  language: string;
  value: string;
  onChange: (value: string) => void;
};

export const MonacoEditor: React.FC<Props> = ({ language, value, onChange }) => {
  const handleChange: OnChange = (val) => {
    onChange(val ?? "");
  };

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme("online-ide-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6a9955" },
        { token: "keyword", foreground: "569cd6" },
        { token: "string", foreground: "ce9178" },
        { token: "number", foreground: "b5cea8" },
        { token: "type", foreground: "4ec9b0" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#5a5a5a",
        "editorLineNumber.activeForeground": "#c0c0c0",
        "editorCursor.foreground": "#61dafb",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#3a3d41",
        "editorIndentGuide.background": "#404040",
        "editorIndentGuide.activeBackground": "#707070",
      },
    });
  };

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-md border border-[#333] bg-[#1e1e1e] shadow-[0_0_0_1px_rgba(0,0,0,0.25)]">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleChange}
        beforeMount={beforeMount}
        theme="online-ide-dark"
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', monospace",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
