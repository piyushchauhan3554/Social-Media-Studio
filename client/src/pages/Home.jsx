import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-white px-4">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl text-center flex flex-col items-center"
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 text-sm font-medium text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
        >
          <Sparkles size={16} />
          <span>The #1 AI Tool for Creators</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
          Create Viral Content <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]">
            with AI
          </span>
        </h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 text-xl md:text-2xl text-white/70 max-w-2xl font-light"
        >
          Turn your raw ideas into fully-designed, viral Instagram carousels in seconds. Stop stressing over design, start creating.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
        >
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-pink-500/90 border border-transparent rounded-full shadow-[0_0_40px_rgba(236,72,153,0.6)] hover:bg-pink-400 hover:shadow-[0_0_60px_rgba(236,72,153,0.8)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 overflow-hidden"
          >
            <span className="relative flex items-center gap-2 z-10">
              Start Creating Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </motion.div>
      </motion.div>

    </div>
  );
}

export default Home;