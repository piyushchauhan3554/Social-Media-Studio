import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-900 dark:text-white px-4 relative overflow-hidden min-h-screen bg-white dark:bg-[#080510] transition-colors duration-300">

      {/* Orbs */}
      <div className="absolute top-[-120px] left-[-100px] w-[500px] h-[500px] bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-[110px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-[110px] animate-pulse delay-700 pointer-events-none" />
      <div className="absolute top-[40%] left-[55%] w-[250px] h-[250px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[80px] animate-pulse delay-1000 pointer-events-none" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl text-center flex flex-col items-center relative z-10"
      >

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-7 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-white/[0.06] border border-violet-100 dark:border-white/[0.1] flex items-center gap-2 text-[13px] font-bold text-violet-600 dark:text-violet-300 tracking-wide"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse" />
          <Sparkles size={13} />
          <span>The #1 AI Tool for Creators</span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-6xl md:text-[88px] font-black mb-7 leading-[1.05] tracking-[-2px] text-slate-900 dark:text-white">
          Create Viral Content
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500">
            with AI
          </span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-11 text-[18px] md:text-xl text-slate-500 dark:text-white/40 max-w-xl font-normal leading-relaxed"
        >
          Turn your raw ideas into fully-designed, viral Instagram carousels
          in seconds. Stop stressing over design, start creating.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[15px] font-bold text-white rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 transition-all hover:-translate-y-[2px] hover:shadow-[0_12px_36px_rgba(124,58,237,0.4)] active:scale-[.98] overflow-hidden"
          >
            Start Creating Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default Home;