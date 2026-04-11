import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 backdrop-blur-xl bg-slate-950/40 border-b border-white/10 text-white max-w-[1600px] w-full mx-auto"
    >
      <Link to="/" className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        AI Studio
      </Link>

      <div className="space-x-8 hidden md:flex items-center">
        {["Home", "Dashboard", "Templates", "History"].map((item) => {
          const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
          const isActive = location.pathname === path;

          return (
            <Link 
              key={item} 
              to={path}
              className={`relative font-medium transition-colors hover:text-pink-400 ${isActive ? "text-white" : "text-white/70"}`}
            >
              {isActive && (
                <motion.span
                  layoutId="navbar-indicator"
                  className="absolute left-0 bottom-[-6px] w-full h-[2px] bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                />
              )}
              {item}
            </Link>
          );
        })}
      </div>
      
      {/* Mobile CTA or Login placeholder */}
      <div className="hidden md:block">
        <Link to="/dashboard" className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 px-5 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]">
          Launch App
        </Link>
      </div>
    </motion.nav>
  );
}

export default Navbar;