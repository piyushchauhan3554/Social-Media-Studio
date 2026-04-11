import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Loader2, Sparkles } from "lucide-react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-violet-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/20">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2 italic">Join Studio.</h1>
          <p className="text-white/40 font-medium">Create your account to start generating.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Full Name</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-500 transition-colors" size={20} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-medium"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-500 transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-medium"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-500 transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-medium"
                placeholder="min. 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 py-5 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-violet-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Get Started</>}
          </button>
        </form>

        <p className="text-center mt-10 text-white/40 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-500 hover:text-violet-400 underline decoration-violet-500/30 transition-colors">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
