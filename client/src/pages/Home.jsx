import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">

      {/* Orbs - Refined */}
      <div className="absolute top-[-120px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/15 rounded-full blur-[110px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-rose-500/5 dark:bg-rose-500/15 rounded-full blur-[110px] animate-pulse delay-700 pointer-events-none" />

      {/* Grid - Subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl text-center flex flex-col items-center relative z-10"
      >

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 px-5 py-2 rounded-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5 text-[14px] font-bold text-slate-800 dark:text-slate-200 shadow-sm"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
          <Sparkles size={14} className="text-rose-500" />
          <span className="tracking-tight">Personalized Content for Every Platform</span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-6xl md:text-[92px] font-black mb-7 leading-[1.0] tracking-[-3px] text-slate-900 dark:text-slate-50">
          Create Viral Content
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-indigo-600 to-indigo-700">
            at the speed of thought
          </span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 text-[19px] md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed"
        >
          Turn your raw ideas into fully-designed, viral carousel content
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
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-[16px] font-bold text-white rounded-2xl bg-slate-900 dark:bg-slate-50 dark:text-slate-950 transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[.98] overflow-hidden"
          >
            Launch Creator Studio
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default Home;