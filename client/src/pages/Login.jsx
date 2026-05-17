import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { SunIcon as Sunburst } from "lucide-react";
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        if (accessToken) {
          try {
            setError("Logging in with Google...");
            // Clean up address bar
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Get user info from Google
            const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userInfo = await userInfoRes.json();
            
            if (userInfo.email) {
              const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";
              const res = await axios.post(`${API_URL}/api/auth/google-login`, {
                email: userInfo.email,
                name: userInfo.name || userInfo.email.split('@')[0],
                googleId: userInfo.sub
              });
              
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('username', res.data.username);
              // Force reload to dashboard to initialize App with new Auth state
              window.location.href = "/dashboard";
            }
          } catch (err) {
            console.error("Google Auth failed", err);
            setError(err.response?.data?.error || "Google login failed.");
          }
        }
      }
    };
    handleGoogleCallback();
  }, []);

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
            error === "Logging in with Google..." ? (
              <div className="bg-orange-500/5 border border-orange-500/30 text-orange-400 p-4 rounded-xl mb-6 text-sm flex flex-col gap-1.5 relative overflow-hidden backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-semibold tracking-wide">Logging in with Google...</span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Note: The server is waking up from sleep mode (Render Free Tier cold start). This takes 20-30 seconds on the first login of the day, but subsequent requests will be instant!
                </p>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )
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

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase tracking-wider">Or continue with</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                // Trigger Google OAuth flow
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                if (!clientId) {
                  alert("Google Client ID is not configured in environment variables (.env)");
                  return;
                }
                const redirectUri = `${window.location.origin}/login`;
                const scope = "openid email profile";
                const responseType = "token";
                const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
                window.location.href = authUrl;
              }}
              className="w-full flex items-center justify-center gap-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white font-medium py-3 px-4 rounded-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.2662,9.7645 C6.1987,6.9381 8.8523,4.909 12,4.909 C13.6909,4.909 15.2181,5.509 16.4181,6.4909 L19.909,3 C17.7818,1.1454 15.0545,0 12,0 C7.3303,0 3.3218,2.6974 1.3963,6.6268 L5.2662,9.7645 Z"
                />
                <path
                  fill="#34A853"
                  d="M16.0407,18.0133 C14.9503,18.7178 13.5602,19.0909 12,19.0909 C8.8523,19.0909 6.1987,17.0618 5.2662,14.2354 L1.3963,17.3731 C3.3218,21.3026 7.3303,24 12,24 C14.9727,24 17.7272,22.92 19.7727,21.0763 L16.0407,18.0133 Z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49,12.2727 C23.49,11.4545 23.4181,10.7345 23.2909,10.0363 L12,10.0363 L12,14.629 L18.4727,14.629 C18.1909,16.069 17.3272,17.2727 16.0407,18.0133 L19.7727,21.0763 C21.9545,19.069 23.49,16.0254 23.49,12.2727 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.2662,9.7645 C5.0217,10.5049 4.8872,11.2977 4.8872,12.1227 C4.8872,12.9477 5.0217,13.7404 5.2662,14.4809 L1.3963,17.3731 C0.5054,15.5684 0,13.5627 0,11.4372 C0,9.3117 0.5054,7.306 1.3963,5.5013 L5.2662,9.7645 Z"
                />
              </svg>
              Continue with Google
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
