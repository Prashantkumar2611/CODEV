import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, Zap, Shield, Users } from "lucide-react";
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
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900 pointer-events-none"></div>
      
      {/* Floating abstract code blocks */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 md:left-32 opacity-20 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-2xl hidden md:block blur-[1px]"
      >
        <pre className="text-blue-400 text-xs font-mono">
          <code>{`function sync() {\n  connectToPeers();\n  shareCode();\n}`}</code>
        </pre>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 right-10 md:right-32 opacity-20 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-2xl hidden md:block blur-[1px]"
      >
        <pre className="text-green-400 text-xs font-mono">
          <code>{`// Real-time Engine\nws.on('code-change',\n  updateUI\n);`}</code>
        </pre>
      </motion.div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="bg-blue-600 p-2 rounded-lg">
            <Code2 size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">CollabCode</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {user ? (
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Go to Dashboard
            </button>
          ) : (
            <button 
              onClick={() => navigate("/login")}
              className="text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </button>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-blue-900/50 text-blue-400 border border-blue-800/50 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide mb-6 inline-block">
            v2.0 is now live
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400 leading-tight"
        >
          Code Together.<br /> Build Faster.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl"
        >
          The ultimate real-time collaborative coding workspace. Write, compile, and execute code simultaneously with your team from anywhere in the world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={handleGetStarted}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 hover:scale-105"
          >
            Get Started Free
            <Zap size={18} className="ml-2 group-hover:text-yellow-400 transition-colors" />
          </button>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Feature 1 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-colors group">
            <div className="bg-blue-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Real-time Collaboration</h3>
            <p className="text-gray-400 leading-relaxed">
              Edit code simultaneously with multiple teammates. See cursors and selections update instantly with zero lag.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-colors group">
            <div className="bg-green-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap size={28} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Instant Compilation</h3>
            <p className="text-gray-400 leading-relaxed">
              Powered by JDoodle API, run your JS, Python, C++, and Java code directly in the browser and see immediate results.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors group">
            <div className="bg-purple-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield size={28} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Secure Workspaces</h3>
            <p className="text-gray-400 leading-relaxed">
              Granular file ownership. Only the creator of a file can edit it, preventing accidental overrides by team members.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-10 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CollabCode. All rights reserved.</p>
      </footer>
    </div>
  );
}
