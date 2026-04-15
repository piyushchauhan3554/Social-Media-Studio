import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LayoutTemplate, History as HistoryIcon, LogOut, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Templates", path: "/templates", icon: LayoutTemplate },
    { name: "History", path: "/history", icon: HistoryIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col pt-7 pb-5 px-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] transition-colors duration-500">

      {/* Logo */}
      <div className="px-3 mb-9 hidden md:block">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600 to-pink-500 flex items-center justify-center shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          <h2 className="text-[18px] font-black tracking-tight text-slate-900 dark:text-white">
            AI Studio
          </h2>
        </div>
        <p className="text-[10px] text-violet-600 dark:text-violet-400/70 uppercase tracking-[.18em] font-bold ml-[42px]">
          Creator Workspace
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50"
              }`}
            >
              {/* Active left bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-linear-to-b from-violet-500 to-pink-500" />
              )}
              <Icon
                size={18}
                className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"}
              />
              <span className={`md:inline text-[13.5px] font-${isActive ? "bold" : "medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 pt-5 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400 dark:text-slate-500 px-3 mb-2">
          Account
        </p>

        <Link
          to="/settings"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
            location.pathname === "/settings"
              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50"
          }`}
        >
          <SettingsIcon
            size={18}
            className={
              location.pathname === "/settings"
                ? "text-violet-600 dark:text-violet-400"
                : "text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors"
            }
          />
          <span className="md:inline text-[13.5px] font-medium">Settings</span>
        </Link>

        {/* Theme Toggle in Sidebar */}
        <div className="px-3 py-2 flex items-center justify-between">
          <span className="text-[13px] text-slate-500 dark:text-white/40 font-medium">Appearance</span>
          <ThemeToggle />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-slate-500 dark:text-white/40 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 group"
        >
          <LogOut size={18} className="text-slate-400 dark:text-white/30 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
          <span className="md:inline text-[13.5px] font-medium">Log Out</span>
        </button>

        {/* User Card */}
        <div className="mt-3 px-3 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3 transition-colors duration-500">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600 to-pink-500 flex items-center justify-center text-[12px] font-black text-white shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className="text-[13px] font-bold truncate text-slate-700 dark:text-slate-200">{user?.name}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Free Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;