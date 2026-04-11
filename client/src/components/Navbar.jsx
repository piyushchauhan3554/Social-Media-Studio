import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function Navbar() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 w-full max-w-[1600px] mx-auto border-b border-white/[0.06] bg-[#080510]/80 backdrop-blur-xl"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <span className="text-[17px] font-black tracking-tight text-white">
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
              className={`relative px-4 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200 ${
                isActive
                  ? "text-white bg-white/[0.07] border border-white/[0.08]"
                  : "text-white/40 hover:text-white/75 hover:bg-white/[0.04]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="navbar-indicator"
                  className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400"
                />
              )}
              {item}
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="hidden md:block">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 px-5 py-2.5 rounded-xl text-[13.5px] font-bold transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(124,58,237,0.3)] active:scale-95"
        >
          <Sparkles size={14} />
          Launch App
        </Link>
      </div>
    </motion.nav>
  );
}

export default Navbar;