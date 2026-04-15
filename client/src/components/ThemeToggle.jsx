import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 p-2 transition-all duration-300 rounded-xl bg-slate-50 dark:bg-white/4 border border-black/5 dark:border-white/6 hover:bg-slate-100 dark:hover:bg-white/8 hover:border-black/10 dark:hover:border-white/10 active:scale-95 group shadow-sm dark:shadow-none"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-linear-to-br from-violet-600/5 to-pink-500/5 blur-sm rounded-xl" />
      
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-amber-300"
          >
            <Moon size={18} fill="currentColor" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-violet-600"
          >
            <Sun size={18} fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
