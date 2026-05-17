import { useState } from "react";

export default function Output({ output }) {
  const [activeConsoleTab, setActiveConsoleTab] = useState("Output");

  return (
    <div className="h-44 bg-zinc-950 border-t border-zinc-800/80 flex flex-col font-sans">
      {/* Console Header */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-900 border-b border-zinc-800/80">
        <div className="flex items-center gap-6">
          {[
            { name: "Output", count: 0 },
            { name: "Errors", count: 1 },
            { name: "Terminal", count: 0 }
          ].map(tab => (
            <button 
              key={tab.name}
              onClick={() => setActiveConsoleTab(tab.name)}
              className={`flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${activeConsoleTab === tab.name ? "text-orange-400" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="text-zinc-550 hover:text-zinc-300 transition-colors cursor-pointer"
            onClick={() => alert("Console cleared successfully!")}
            title="Clear Console"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
          <button className="text-zinc-550 hover:text-zinc-300 transition-colors cursor-pointer" title="Collapse Console">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] custom-scrollbar">
        {activeConsoleTab === "Output" && (
          <pre className="text-orange-400 whitespace-pre-wrap leading-relaxed">
            {output ? (
              output
            ) : (
              <>
                <span className="text-blue-500">[System]</span> Watching for file changes...{"\n"}
                <span className="text-emerald-500">[CODEV]</span> Ready to run and compile workspace.{"\n"}
                {"// Run any file using the top '▶ Run' button or pane selectors..."}
              </>
            )}
          </pre>
        )}

        {activeConsoleTab === "Errors" && (
          <pre className="text-red-400 whitespace-pre-wrap leading-relaxed">
            <span className="text-red-500 font-bold">[Sarah]</span> Error: Unexpected token at line 42 in utils.ts{"\n"}
            <span className="text-zinc-500 font-bold">[Advice]</span> Please verify that type annotations match your schema declarations.
          </pre>
        )}

        {activeConsoleTab === "Terminal" && (
          <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
            <span className="text-zinc-550">codev-terminal-agent@ubuntu:~$</span> node --version{"\n"}
            v20.11.0{"\n"}
            <span className="text-zinc-550">codev-terminal-agent@ubuntu:~$</span> npm run dev{"\n"}
            VITE v8.0.13  ready in 479ms{"\n"}
            <span className="text-zinc-550">codev-terminal-agent@ubuntu:~$</span> <span className="animate-pulse">_</span>
          </pre>
        )}
      </div>
    </div>
  );
}
