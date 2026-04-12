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
    Education:   "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    Health:      "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Parenting:   "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    Wellness:    "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    Productivity:"text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    Growth:      "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col pt-4 px-4 transition-colors duration-300">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-slate-900 dark:text-slate-50">
          Popular{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">
            Templates
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[16px] font-medium">
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
            className="group relative bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 p-6 rounded-[28px] cursor-pointer overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/0 group-hover:via-indigo-500/40 to-transparent transition-all duration-500" />

            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] to-pink-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[22px]" />

            {/* Category + Icon */}
            <div className="flex justify-between items-start mb-10 relative z-10">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 ${categoryColors[tpl.category]}`}>
                <TrendingUp size={11} />
                {tpl.category}
              </span>
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all shadow-sm">
                <CopyPlus size={14} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-[17px] md:text-[19px] font-black leading-snug tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-200 relative z-10">
              {tpl.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Templates;