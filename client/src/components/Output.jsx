export default function Output({ output }) {
  return (
    <div className="h-40 bg-zinc-950 border-t border-zinc-800/80 p-4 overflow-y-auto">
      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">Output</p>
      <pre className="text-orange-400 text-xs font-mono whitespace-pre-wrap">
        {output || "// Run code to compile output..."}
      </pre>
    </div>
  );
}
