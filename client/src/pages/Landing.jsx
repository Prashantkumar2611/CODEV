import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden relative font-sans">
      {/* Aurora Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-zinc-800/30 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Subtle Dotted Grid Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDEwNywwLDAuMDQpIi8+PC9zdmc+')] opacity-60 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6 lg:px-12 max-w-[1400px] mx-auto border-b border-zinc-900/50 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/favicon.svg" alt="CollabCode Logo" className="w-10 h-10 object-contain" />
          <span className="brand-logo-text text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">CODEV</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
            title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            )}
          </button>

          {user ? (
            <div className="relative group z-50">
              <button className="flex items-center gap-2 focus:outline-none cursor-pointer">
                <div className="relative rounded-full ring-2 ring-zinc-800 group-hover:ring-orange-500 transition-all shadow-lg">
                  <img 
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`} 
                    alt={user?.username}
                    className="w-10 h-10 rounded-full bg-[#1c1c1e] object-cover border border-zinc-850"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 bg-zinc-950 rounded-full flex items-center justify-center p-[1px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="0">
                      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="3" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-zinc-900 border border-zinc-800 p-2.5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-2 py-1.5 border-b border-zinc-850 mb-2">
                  <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-xs font-bold text-white truncate mt-0.5">{user?.username}</p>
                </div>
                
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>
                  Dashboard
                </button>
                
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to logout?")) {
                      logout();
                      navigate("/");
                    }
                  }}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors mt-1 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate("/login")}
                className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors hidden sm:block"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate("/register")}
                className="text-sm font-semibold bg-white text-zinc-950 px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-amber-200 drop-shadow-[0_0_35px_rgba(249,115,22,0.2)]">live.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl font-light relative z-10"
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
            className="bg-orange-500 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-orange-600 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_35px_rgba(249,115,22,0.25)] cursor-pointer"
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
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 backdrop-blur-3xl shadow-[0_30px_100px_-15px_rgba(0,0,0,0.8),0_0_80px_rgba(249,115,22,0.1)] flex flex-col relative"
          >
            {/* Glowing borders */}
            <div className="absolute inset-0 border border-orange-500/10 rounded-2xl pointer-events-none"></div>
            
            {/* Window Header */}
            <div className="flex items-center px-4 py-3 border-b border-zinc-800/80 bg-zinc-900">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="mx-auto flex gap-2">
                <div className="bg-zinc-950 px-3 py-1 rounded-lg text-xs text-zinc-400 border border-zinc-800 font-mono">
                  index.js
                </div>
              </div>
            </div>

            {/* IDE Body */}
            <div className="flex h-[400px] md:h-[500px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-zinc-800/80 bg-zinc-950 flex flex-col py-4 px-3">
                <div className="text-[10px] font-bold tracking-wider text-zinc-500 mb-4 px-2 uppercase">Files</div>
                <div className="flex items-center gap-2 px-2 py-1.5 bg-orange-500/10 text-orange-400 rounded-lg cursor-pointer text-sm font-mono border border-orange-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  index.js
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 hover:text-white cursor-pointer text-sm font-mono transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  styles.css
                </div>
                <div className="mt-auto px-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-zinc-950">P</div>
                    <span className="text-xs text-zinc-400 truncate">prasant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white border-2 border-zinc-950">A</div>
                    <span className="text-xs text-zinc-400 truncate">alex_dev</span>
                  </div>
                </div>
              </div>

              {/* Code Area */}
              <div className="flex-1 p-6 overflow-hidden font-mono text-sm leading-relaxed text-zinc-300 relative bg-[#0d0d0f]">
                {/* Line Numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-zinc-950/40 border-r border-zinc-900 flex flex-col items-end pt-6 pr-3 text-zinc-700 select-none">
                  {Array.from({length: 15}).map((_, i) => (
                    <div key={i} className="mb-[2px]">{i + 1}</div>
                  ))}
                </div>
                
                <div className="pl-10">
                  <div className="mb-[2px]"><span className="text-orange-400">import</span> {`{ Server }`} <span className="text-orange-400">from</span> <span className="text-zinc-400">'socket.io'</span>;</div>
                  <div className="mb-[2px]"><span className="text-orange-400">import</span> {`express`} <span className="text-orange-400">from</span> <span className="text-zinc-400">'express'</span>;</div>
                  <br/>
                  <div className="mb-[2px]"><span className="text-zinc-500">const</span> app = <span className="text-white">express</span>();</div>
                  <div className="mb-[2px]"><span className="text-zinc-500">const</span> io = <span className="text-orange-400">new</span> <span className="text-white">Server</span>(app);</div>
                  <br/>
                  <div className="mb-[2px]"><span className="text-zinc-600 italic">// Real-time collaboration engine</span></div>
                  <div className="mb-[2px]">io.<span className="text-orange-300">on</span>(<span className="text-zinc-400">'connection'</span>, (socket) <span className="text-orange-400">=&gt;</span> {"{"}</div>
                  <div className="mb-[2px] ml-4 text-zinc-650 italic">// Alex is typing...</div>
                  <div className="mb-[2px] ml-4 relative">
                    socket.<span className="text-orange-300">join</span>(<span className="text-zinc-400">'workspace-1'</span>);
                    {/* Simulated Cursor */}
                    <span className="absolute -top-3 -right-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded rounded-bl-none z-10 animate-pulse">Alex</span>
                    <span className="absolute top-0 -right-[2px] w-[2px] h-4 bg-orange-500 animate-pulse"></span>
                  </div>
                  <div className="mb-[2px] ml-4">console.<span className="text-orange-300">log</span>(<span className="text-zinc-400">{"`User connected: ${socket.id}`"}</span>);</div>
                  <div className="mb-[2px]">{"});"}</div>
                  <br/>
                  <div className="mb-[2px]">app.<span className="text-orange-300">listen</span>(<span className="text-orange-400">3000</span>, () <span className="text-orange-400">=&gt;</span> {"{"}</div>
                  <div className="mb-[2px] ml-4">console.<span className="text-orange-300">log</span>(<span className="text-zinc-400">'Workspace live on port 3000'</span>);</div>
                  <div className="mb-[2px]">{"});"}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Testimonials */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 py-10 mt-10">
        <h3 className="text-center text-3xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Loved by teams worldwide</h3>
        <div className="grid md:grid-cols-3 gap-8 text-white">
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ismail" className="w-10 h-10 rounded-full bg-orange-500/10" alt="Avatar"/>
              <div>
                <h4 className="font-semibold text-[15px] text-zinc-200">Ismail Pelaseyet</h4>
                <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">CO-FOUNDER, SUPERAGENT.SH</p>
              </div>
            </div>
            <p className="text-zinc-400 text-[14px] leading-relaxed italic">
              "We use CODEV internally to prototype new types of Assistants before pushing them to production. It allows us to rapidly deploy."
            </p>
          </div>
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=morgan" className="w-10 h-10 rounded-full bg-zinc-700/20" alt="Avatar"/>
              <div>
                <h4 className="font-semibold text-[15px] text-zinc-200">Morgan McGuire</h4>
                <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">LEAD GROWTH ML</p>
              </div>
            </div>
            <p className="text-zinc-400 text-[14px] leading-relaxed italic">
              "We needed to be able to collaborate on the codebase, which CODEV allowed us to do instantly without setup."
            </p>
          </div>
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=pietro" className="w-10 h-10 rounded-full bg-orange-500/10" alt="Avatar"/>
              <div>
                <h4 className="font-semibold text-[15px] text-zinc-200">Pietro Schirano</h4>
                <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">CO-FOUNDER, EVERART</p>
              </div>
            </div>
            <p className="text-zinc-400 text-[14px] leading-relaxed italic">
              "CODEV extrapolates complex problems and takes care of all the mundane parts of coding. It's magic."
            </p>
          </div>
        </div>
      </section>

      {/* Idea to software, fast */}
      <section className="relative z-10 py-24 text-center px-6">
        <h2 className="text-[4rem] md:text-[6rem] font-bold tracking-tighter leading-none mb-10 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          Idea to software, <br className="hidden md:block" />fast
        </h2>
        <button 
          onClick={handleGetStarted}
          className="bg-orange-500 text-white font-semibold text-lg px-10 py-4 rounded-xl hover:bg-orange-600 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_40px_rgba(249,115,22,0.2)] cursor-pointer"
        >
          Start building
        </button>
      </section>

      {/* Features Text Strip */}
      <section className="relative z-10 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Zero configuration</h3>
            <p className="text-zinc-550 text-sm">Start coding immediately. No setup required.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Multiplayer ready</h3>
            <p className="text-zinc-550 text-sm">Real-time sync. Code together like Google Docs.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Built-in Compiler</h3>
            <p className="text-zinc-550 text-sm">Run JS, Python, C++, and Java in the browser.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Secure Workspaces</h3>
            <p className="text-zinc-550 text-sm">Granular file permissions and ownership.</p>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-zinc-900 py-8 text-center text-zinc-600 text-xs bg-zinc-950">
        <p>CODEV &copy; {new Date().getFullYear()}. Crafted for developers.</p>
      </footer>
    </div>
  );
}
