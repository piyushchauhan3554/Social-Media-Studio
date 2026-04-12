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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white dark:bg-[#080510] transition-colors duration-300">

      {/* Orbs */}
      <div className="absolute top-[-100px] left-[-120px] w-[420px] h-[420px] bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-[90px] animate-pulse" />
      <div className="absolute bottom-[-80px] right-[-100px] w-[350px] h-[350px] bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-[90px] animate-pulse delay-700" />
      <div className="absolute top-1/2 left-[65%] w-[180px] h-[180px] bg-cyan-500/5 dark:bg-cyan-500/15 rounded-full blur-[70px] animate-pulse delay-1000" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[430px] relative z-10 rounded-[28px] p-[2.8rem_2.4rem] bg-white dark:bg-white/[0.035] border border-black/[0.05] dark:border-white/[0.08] overflow-hidden shadow-xl dark:shadow-none"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(124,58,237,0.15)",
        }}
      >
        {/* Shimmer */}
        <div className="absolute top-[-60%] left-[-80%] w-[60%] h-[220%] bg-gradient-to-r from-transparent via-black/[0.02] dark:via-white/[0.04] to-transparent -skew-x-12 animate-[shimmer_5s_ease-in-out_1s_infinite] pointer-events-none" />

        {/* Top */}
        <div className="flex flex-col items-center mb-9">
          <h1 className="text-[25px] font-black text-slate-900 dark:text-white tracking-[-0.4px]">Welcome back</h1>
          <p className="text-[13.5px] text-slate-500 dark:text-white/35 mt-1">Log in to continue creating viral content.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[1.1rem]">
          {/* Email */}
          <div className="space-y-[.45rem]">
            <label className="block text-[10.5px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-white/30 ml-[2px]">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-300 dark:text-white/22 group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 dark:bg-white/[0.045] border border-black/[0.05] dark:border-white/[0.08] rounded-[13px] py-[13px] pl-[45px] pr-[15px] text-slate-900 dark:text-white text-[14.5px] font-medium placeholder:text-slate-300 dark:placeholder:text-white/18 outline-none focus:border-violet-500/55 focus:bg-violet-600/[0.02] dark:focus:bg-violet-600/7 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-[.45rem]">
            <label className="block text-[10.5px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-white/30 ml-[2px]">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-300 dark:text-white/22 group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-slate-50 dark:bg-white/[0.045] border border-black/[0.05] dark:border-white/[0.08] rounded-[13px] py-[13px] pl-[45px] pr-[15px] text-slate-900 dark:text-white text-[14.5px] font-medium placeholder:text-slate-300 dark:placeholder:text-white/18 outline-none focus:border-violet-500/55 focus:bg-violet-600/[0.02] dark:focus:bg-violet-600/7 transition-all"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-[1.6rem] py-[14px] rounded-[13px] bg-gradient-to-br from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white text-[15px] font-bold flex items-center justify-center gap-[9px] transition-all hover:-translate-y-[1px] hover:shadow-[0_10px_30px_rgba(124,58,237,0.3)] active:scale-[.99] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <>
                <LogIn size={17} />
                Login Now
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-[1.8rem] text-[13px] text-slate-400 dark:text-white/28">
          Don't have an account?{" "}
          <Link to="/signup" className="text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-500 dark:hover:text-violet-300 transition-colors">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;