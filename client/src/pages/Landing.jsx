import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-white overflow-hidden relative font-sans">
      {/* Aurora Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* 4K AI 3D Glassmorphic Assets */}
      <motion.img 
        src="/assets/hero-3d.png" 
        alt="3D Floating Orbs"
        animate={{ y: [-30, 30, -30], rotate: [0, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-[-10%] w-[800px] h-auto opacity-40 mix-blend-screen pointer-events-none blur-[2px]"
      />
      <motion.img 
        src="/assets/hero-3d.png" 
        alt="3D Floating Orbs"
        animate={{ y: [30, -30, 30], rotate: [0, -15, 0], scale: [0.8, 0.9, 0.8] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-15%] w-[1000px] h-auto opacity-30 mix-blend-screen pointer-events-none blur-[4px]"
      />

      {/* Subtle Dotted Grid Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6 lg:px-12 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img src="/favicon.svg" alt="CollabCode Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold tracking-tight">CollabCode</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-6"
        >
          {user ? (
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate("/register")}
                className="text-sm font-medium bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Sign up
              </button>
            </>
          )}
        </motion.div>
      </nav>

      {/* Main Hero Content */}
      <main className="relative z-10 flex flex-col items-center pt-24 pb-32 px-6 text-center max-w-[1400px] mx-auto">
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-[5rem] lg:text-[6.5rem] font-bold tracking-tighter leading-[1.05] mb-6 relative z-10"
        >
          Code with your team,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">live.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl font-light relative z-10"
        >
          The most immersive collaborative coding environment. Jump into a project and build together in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button 
            onClick={handleGetStarted}
            className="bg-white text-black font-semibold text-lg px-8 py-4 rounded-lg hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            Start coding
          </button>
        </motion.div>

        {/* The Giant Mock IDE */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 40 }}
          className="mt-20 w-full max-w-5xl perspective-1000 relative z-10"
        >
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-xl overflow-hidden border border-white/10 bg-[#0E131F]/60 backdrop-blur-3xl shadow-[0_30px_100px_-15px_rgba(0,0,0,1),0_0_80px_rgba(59,130,246,0.2)] flex flex-col relative"
          >
            {/* Glowing borders */}
            <div className="absolute inset-0 border border-blue-500/10 rounded-xl pointer-events-none"></div>
            
            {/* Window Header */}
            <div className="flex items-center px-4 py-3 border-b border-white/5 bg-[#1C2333]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="mx-auto flex gap-2">
                <div className="bg-white/5 px-3 py-1 rounded text-xs text-gray-400 border border-white/5 font-mono">
                  index.js
                </div>
              </div>
            </div>

            {/* IDE Body */}
            <div className="flex h-[400px] md:h-[500px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-white/5 bg-[#161B28] hidden md:flex flex-col py-4 px-3">
                <div className="text-xs font-semibold tracking-wider text-gray-500 mb-4 px-2 uppercase">Files</div>
                <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-500/10 text-blue-400 rounded cursor-pointer text-sm font-mono">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  index.js
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-gray-400 hover:text-white cursor-pointer text-sm font-mono transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  styles.css
                </div>
                <div className="mt-auto px-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#161B28]">P</div>
                    <span className="text-xs text-gray-400">prasantkumar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#161B28]">A</div>
                    <span className="text-xs text-gray-400">alex_dev</span>
                  </div>
                </div>
              </div>

              {/* Code Area */}
              <div className="flex-1 p-6 overflow-hidden font-mono text-sm leading-relaxed text-gray-300 relative">
                {/* Line Numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1C2333]/50 border-r border-white/5 flex flex-col items-end pt-6 pr-3 text-gray-600 select-none">
                  {Array.from({length: 15}).map((_, i) => (
                    <div key={i} className="mb-[2px]">{i + 1}</div>
                  ))}
                </div>
                
                <div className="pl-10">
                  <div className="mb-[2px]"><span className="text-pink-400">import</span> {`{ Server }`} <span className="text-pink-400">from</span> <span className="text-green-300">'socket.io'</span>;</div>
                  <div className="mb-[2px]"><span className="text-pink-400">import</span> {`express`} <span className="text-pink-400">from</span> <span className="text-green-300">'express'</span>;</div>
                  <br/>
                  <div className="mb-[2px]"><span className="text-blue-400">const</span> app = <span className="text-yellow-200">express</span>();</div>
                  <div className="mb-[2px]"><span className="text-blue-400">const</span> io = <span className="text-blue-400">new</span> <span className="text-yellow-200">Server</span>(app);</div>
                  <br/>
                  <div className="mb-[2px]"><span className="text-gray-500 italic">// Real-time collaboration engine</span></div>
                  <div className="mb-[2px]">io.<span className="text-yellow-200">on</span>(<span className="text-green-300">'connection'</span>, (socket) <span className="text-blue-400">=&gt;</span> {"{"}</div>
                  <div className="mb-[2px] ml-4 text-gray-500 italic">// Alex is typing...</div>
                  <div className="mb-[2px] ml-4 relative">
                    socket.<span className="text-yellow-200">join</span>(<span className="text-green-300">'workspace-1'</span>);
                    {/* Simulated Cursor */}
                    <span className="absolute -top-3 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded rounded-bl-none z-10 animate-pulse">Alex</span>
                    <span className="absolute top-0 -right-[2px] w-[2px] h-4 bg-green-500 animate-pulse"></span>
                  </div>
                  <div className="mb-[2px] ml-4">console.<span className="text-yellow-200">log</span>(<span className="text-green-300">{"`User connected: ${socket.id}`"}</span>);</div>
                  <div className="mb-[2px]">{"});"}</div>
                  <br/>
                  <div className="mb-[2px]">app.<span className="text-yellow-200">listen</span>(<span className="text-orange-300">3000</span>, () <span className="text-blue-400">=&gt;</span> {"{"}</div>
                  <div className="mb-[2px] ml-4">console.<span className="text-yellow-200">log</span>(<span className="text-green-300">'Workspace live on port 3000'</span>);</div>
                  <div className="mb-[2px]">{"});"}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Ideas from Replit implemented in 4K Dark Mode */}
      
      {/* Testimonials */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 py-10 mt-10">
        <h3 className="text-center text-3xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Loved by teams worldwide</h3>
        <div className="grid md:grid-cols-3 gap-8 text-white">
          <div className="bg-[#0E131F]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ismail" className="w-10 h-10 rounded-full bg-blue-500/20" alt="Avatar"/>
              <div>
                <h4 className="font-semibold text-[15px] text-gray-200">Ismail Pelaseyet</h4>
                <p className="text-gray-500 text-xs tracking-wider uppercase font-semibold">CO-FOUNDER, SUPERAGENT.SH</p>
              </div>
            </div>
            <p className="text-gray-400 text-[14px] leading-relaxed italic">
              "We use CollabCode internally to prototype new types of Assistants before pushing them to production. It allows us to rapidly deploy."
            </p>
          </div>
          <div className="bg-[#0E131F]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=morgan" className="w-10 h-10 rounded-full bg-purple-500/20" alt="Avatar"/>
              <div>
                <h4 className="font-semibold text-[15px] text-gray-200">Morgan McGuire</h4>
                <p className="text-gray-500 text-xs tracking-wider uppercase font-semibold">LEAD GROWTH ML</p>
              </div>
            </div>
            <p className="text-gray-400 text-[14px] leading-relaxed italic">
              "We needed to be able to collaborate on the codebase, which CollabCode allowed us to do instantly without setup."
            </p>
          </div>
          <div className="bg-[#0E131F]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=pietro" className="w-10 h-10 rounded-full bg-indigo-500/20" alt="Avatar"/>
              <div>
                <h4 className="font-semibold text-[15px] text-gray-200">Pietro Schirano</h4>
                <p className="text-gray-500 text-xs tracking-wider uppercase font-semibold">CO-FOUNDER, EVERART</p>
              </div>
            </div>
            <p className="text-gray-400 text-[14px] leading-relaxed italic">
              "CollabCode extrapolates complex problems and takes care of all the mundane parts of coding. It's magic."
            </p>
          </div>
        </div>
      </section>

      {/* Idea to software, fast */}
      <section className="relative z-10 py-24 text-center px-6">
        <h2 className="text-[4rem] md:text-[6rem] font-bold tracking-tighter leading-none mb-10 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          Idea to software, <br className="hidden md:block" />fast
        </h2>
        <button 
          onClick={handleGetStarted}
          className="bg-white text-black font-semibold text-lg px-10 py-4 rounded-lg hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Start building
        </button>
      </section>

      {/* Features Text Strip */}
      <section className="relative z-10 border-t border-white/5 bg-[#0E1525]/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Zero configuration</h3>
            <p className="text-gray-500 text-sm">Start coding immediately. No setup required.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Multiplayer ready</h3>
            <p className="text-gray-500 text-sm">Real-time sync. Code together like Google Docs.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Built-in Compiler</h3>
            <p className="text-gray-500 text-sm">Run JS, Python, C++, and Java in the browser.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Secure Workspaces</h3>
            <p className="text-gray-500 text-sm">Granular file permissions and ownership.</p>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-xs">
        <p>CollabCode &copy; {new Date().getFullYear()}. Crafted for developers.</p>
      </footer>
    </div>
  );
}
