import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

function Navbar() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 w-full max-w-[1600px] mx-auto border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl transition-colors duration-500"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles size={15} className="text-white" />
        </div>
        <span className="text-[17px] font-black tracking-tight text-slate-900 dark:text-slate-50">
          AI Studio
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {["Home", "Dashboard", "Templates", "History"].map((item) => {
          const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
          const isActive = location.pathname === path;

          return (
            <Link
              key={item}
              to={path}
              className={`relative px-4 py-2 rounded-xl text-[13.5px] font-semibold transition-all duration-300 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="navbar-indicator"
                  className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400"
                />
              )}
              {item}
            </Link>
          );
        })}
      </div>

      {/* CTA & ThemeToggle */}
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-white px-5 py-2.5 rounded-xl text-[13.5px] font-bold text-white dark:text-slate-900 transition-all hover:-translate-y-px shadow-lg shadow-slate-500/10 active:scale-95"
        >
          <Sparkles size={14} />
          Launch App
        </Link>
      </div>
    </motion.nav>
  );
}

export default Navbar;