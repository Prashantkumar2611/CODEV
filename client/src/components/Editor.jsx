import MonacoEditor from "@monaco-editor/react";

export default function Editor({ code, language, onChange }) {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      value={code}
      theme="vs-dark"
      onChange={onChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  );
}
