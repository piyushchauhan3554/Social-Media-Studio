import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader2, Sparkles } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-500">

      {/* Orbs - Refined */}
      <div className="absolute top-[-100px] left-[-120px] w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/15 rounded-full blur-[110px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-100px] w-[450px] h-[450px] bg-rose-500/5 dark:bg-rose-500/15 rounded-full blur-[110px] animate-pulse delay-700 pointer-events-none" />

      {/* Grid - Subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10 rounded-[32px] p-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl"
      >
        {/* Shimmer */}
        <div className="absolute top-[-60%] left-[-80%] w-[60%] h-[220%] bg-gradient-to-r from-transparent via-black/[0.02] dark:via-white/[0.04] to-transparent -skew-x-12 animate-[shimmer_5s_ease-in-out_1s_infinite] pointer-events-none" />

        {/* Top */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-rose-500 flex items-center justify-center mb-5 text-white shadow-lg shadow-indigo-500/20">
            <Sparkles size={24} />
          </div>
          <h1 className="text-[28px] font-black text-slate-900 dark:text-slate-50 tracking-tight">Welcome back</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Create viral content with AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[1.1rem]">
          {/* Email */}
          <div className="space-y-[.45rem]">
            <label className="block text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500 ml-[2px]">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] py-[13.5px] pl-[45px] pr-[15px] text-slate-900 dark:text-slate-100 text-[15px] font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-[.45rem]">
            <label className="block text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500 ml-[2px]">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] py-[13.5px] pl-[45px] pr-[15px] text-slate-900 dark:text-slate-100 text-[15px] font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 rounded-2xl bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 text-[16px] font-bold flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] shadow-xl shadow-slate-900/10 active:scale-[.99] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-[14px] text-slate-400 dark:text-slate-500 font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-500 transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;