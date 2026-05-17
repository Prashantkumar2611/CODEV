import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { SunIcon as Sunburst } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      try {
        setError("");
        await login(email, password);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Login failed. Check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4 bg-slate-950">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl border border-zinc-800">
        <div className="w-full h-full z-2 absolute bg-gradient-to-t from-transparent to-black pointer-events-none"></div>
        <div className="flex absolute z-2 overflow-hidden backdrop-blur-2xl pointer-events-none">
          <div className="h-[40rem] z-2 w-[4rem] bg-gradient-to-r from-transparent via-black/40 via-[69%] to-white/10 opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-gradient-to-r from-transparent via-black/40 via-[69%] to-white/10 opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-gradient-to-r from-transparent via-black/40 via-[69%] to-white/10 opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-gradient-to-r from-transparent via-black/40 via-[69%] to-white/10 opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-gradient-to-r from-transparent via-black/40 via-[69%] to-white/10 opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-gradient-to-r from-transparent via-black/40 via-[69%] to-white/10 opacity-30 overflow-hidden"></div>
        </div>
        
        {/* Glow Effects */}
        <div className="w-[15rem] h-[15rem] bg-orange-500/20 filter blur-3xl absolute z-1 rounded-full bottom-0 left-0 pointer-events-none"></div>
        <div className="w-[8rem] h-[5rem] bg-white/10 filter blur-2xl absolute z-1 rounded-full bottom-0 left-10 pointer-events-none"></div>

        {/* Left Side Panel */}
        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-[500px]">
          <div className="z-10 flex items-center gap-2">
            <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">CollabCode</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-medium leading-tight z-10 tracking-tight relative mt-12 md:mt-0">
            Welcome back to the collaborative coding workspace.
          </h1>
          <div className="z-10 text-xs text-zinc-500 mt-8 md:mt-0">
            © {new Date().getFullYear()} CollabCode. All rights reserved.
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-zinc-900 z-10 text-zinc-100 border-l border-zinc-800">
          <div className="flex flex-col items-start mb-8">
            <div className="text-orange-500 mb-4 animate-pulse">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight text-white">
              Login
            </h2>
            <p className="text-left opacity-80 text-zinc-400 text-sm">
              Enter your credentials to continue your coding sessions.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-zinc-300 font-medium">
                Your email
              </label>
              <input
                type="email"
                id="email"
                placeholder="hi@hextastudio.in"
                className={`text-sm w-full py-2.5 px-3.5 border rounded-lg focus:outline-none focus:ring-2 bg-zinc-950 text-white focus:ring-orange-500/50 transition-all ${
                  emailError ? "border-red-500" : "border-zinc-700"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />
              {emailError && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-zinc-300 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className={`text-sm w-full py-2.5 px-3.5 border rounded-lg focus:outline-none focus:ring-2 bg-zinc-950 text-white focus:ring-orange-500/50 transition-all ${
                  passwordError ? "border-red-500" : "border-zinc-700"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
              />
              {passwordError && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] mt-2 cursor-pointer"
            >
              Sign In
            </button>

            <div className="text-center text-zinc-400 text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-medium hover:underline">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
