import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 bg-white dark:bg-[#080510] transition-colors duration-700 overflow-hidden">

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.08),transparent)] pointer-events-none" />

      {/* Violet Orb */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[40vh] h-[40vh] bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-[110px]"
      />

      {/* Pink Orb */}
      <motion.div
        animate={{
          x: [0, -150, 50, 0],
          y: [0, 100, -100, 0],
          scale: [1, 0.9, 1.3, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[35vh] h-[35vh] bg-pink-600/8 dark:bg-pink-600/18 rounded-full blur-[100px]"
      />

      {/* Cyan Orb */}
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, 80, -80, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[130px]"
      />

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-white/10 dark:bg-[#080510]/20 pointer-events-none select-none" />
    </div>
  );
}