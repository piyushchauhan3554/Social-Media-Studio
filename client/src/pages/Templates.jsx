import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CopyPlus, TrendingUp } from "lucide-react";

function Templates() {
  const navigate = useNavigate();

  const templates = [
    { title: "Why kids forget what they learn", category: "Education" },
    { title: "Healthy breakfast ideas for kids", category: "Health" },
    { title: "How to improve child's focus", category: "Parenting" },
    { title: "Screen time effects on children", category: "Wellness" },
    { title: "Daily routine for students", category: "Productivity" },
    { title: "How to build study habits", category: "Growth" },
  ];

  const handleClick = (idea) => {
    navigate("/dashboard", { state: { idea } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col pt-4">
      
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black mb-3">
          Popular <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Templates</span>
        </h1>
        <p className="text-white/60 text-lg">Click on any template to instantly generate a viral carousel.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {templates.map((tpl, index) => (
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={index}
            onClick={() => handleClick(tpl.title)}
            className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl cursor-pointer overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(236,72,153,0.15)] transition-all duration-300"
          >
            {/* Background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-400/10 px-3 py-1 rounded-full border border-pink-400/20 flex items-center gap-1.5">
                <TrendingUp size={14} />
                {tpl.category}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-pink-400 group-hover:bg-white/10 transition-colors">
                <CopyPlus size={16} />
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
              {tpl.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}

export default Templates;