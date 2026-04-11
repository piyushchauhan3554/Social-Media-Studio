import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 bg-slate-950 overflow-hidden">
      {/* Dark background base with gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
      
      {/* Purple Orb */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-[40vh] h-[40vh] bg-purple-600/30 rounded-full blur-[100px]"
      />

      {/* Pink Orb */}
      <motion.div
        animate={{
          x: [0, -150, 50, 0],
          y: [0, 100, -100, 0],
          scale: [1, 0.9, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-[35vh] h-[35vh] bg-pink-600/30 rounded-full blur-[100px]"
      />

      {/* Blue/Cyan Orb */}
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, 80, -80, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] bg-indigo-500/20 rounded-full blur-[120px]"
      />
      
      {/* Subtle overlay to soften everything */}
      <div className="absolute inset-0 bg-black/10 select-none pointer-events-none"></div>
    </div>
  );
}
