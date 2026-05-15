export default function Output({ output }) {
  return (
    <div className="h-40 bg-gray-950 border-t border-gray-700 p-4 overflow-y-auto">
      <p className="text-gray-400 text-xs uppercase mb-2">Output</p>
      <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
        {output || "// Run your code to see output here"}
      </pre>
    </div>
  );
}
