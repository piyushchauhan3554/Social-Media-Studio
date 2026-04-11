import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LayoutTemplate, History as HistoryIcon, LogOut, Settings } from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Templates", path: "/templates", icon: LayoutTemplate },
    { name: "History", path: "/history", icon: HistoryIcon },
  ];

  return (
    <div className="h-full flex flex-col pt-8 pb-4 px-4 shadow-[5px_0_30px_rgba(0,0,0,0.3)]">
      
      <div className="px-4 mb-10 hidden md:block">
        <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
          Studio.
        </h2>
        <p className="text-xs text-pink-400/80 mt-1 uppercase tracking-widest font-semibold">Creator Workspace</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-r from-pink-500/20 to-violet-500/20 text-pink-300 font-semibold border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)]" 
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={22} className={isActive ? "text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" : ""} />
              <span className="md:inline">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 pt-8 border-t border-white/10">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all hover:bg-white/10 text-white/60 hover:text-white">
          <Settings size={22} />
          <span className="md:inline">Settings</span>
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all hover:bg-red-500/20 text-white/60 hover:text-red-400">
          <LogOut size={22} />
          <span className="md:inline">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;