import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CopyPlus, TrendingUp, Sparkles } from "lucide-react";

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
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
  };

  const categoryColors = {
    Education:   "text-violet-400 bg-violet-500/10 border-violet-500/20",
    Health:      "text-green-400 bg-green-500/10 border-green-500/20",
    Parenting:   "text-pink-400 bg-pink-500/10 border-pink-500/20",
    Wellness:    "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    Productivity:"text-amber-400 bg-amber-500/10 border-amber-500/20",
    Growth:      "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col pt-4 px-4">

      {/* Header */}
      <div className="mb-10">
        {/* <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="text-[11px] font-bold tracking-[.18em] uppercase text-violet-400">AI Studio</span>
        </div> */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
          Popular{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Templates
          </span>
        </h1>
        <p className="text-white/35 text-[15px]">
          Click on any template to instantly generate a viral carousel.
        </p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {templates.map((tpl, index) => (
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            key={index}
            onClick={() => handleClick(tpl.title)}
            className="group relative bg-white/[0.025] border border-white/[0.07] hover:border-violet-500/25 p-6 rounded-[22px] cursor-pointer overflow-hidden transition-all duration-300"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/0 group-hover:via-violet-500/50 to-transparent transition-all duration-500" />

            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] to-pink-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[22px]" />

            {/* Category + Icon */}
            <div className="flex justify-between items-start mb-10 relative z-10">
              <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${categoryColors[tpl.category]}`}>
                <TrendingUp size={11} />
                {tpl.category}
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/25 group-hover:text-violet-400 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all">
                <CopyPlus size={14} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-[17px] md:text-[18px] font-black leading-snug tracking-tight text-white/70 group-hover:text-white transition-colors duration-200 relative z-10">
              {tpl.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Templates;