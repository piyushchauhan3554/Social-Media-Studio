import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 bg-slate-50 dark:bg-[#020617] transition-colors duration-700 overflow-hidden">

      {/* Grid - Subtler */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Ambient Radial Blends */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.12),transparent_50%)] pointer-events-none" />

      {/* Floating Ambient Orbs - More professional movement */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 90, -90, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-rose-500/5 dark:bg-pink-500/10 rounded-full blur-[120px]"
      />

      {/* Grain/Texture Overlay for premium feel */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}