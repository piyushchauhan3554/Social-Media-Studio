import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LayoutTemplate, History as HistoryIcon, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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

      <div className="mt-auto space-y-2 pt-8 border-t border-white/10 text-white/50">
        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest opacity-30">Account</div>
        
        <Link 
          to="/settings"
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
            location.pathname === "/settings" ? "bg-white/10 text-white font-bold" : "hover:bg-white/10 text-white/60 hover:text-white"
          }`}
        >
          <SettingsIcon size={22} />
          <span className="md:inline">Settings</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all hover:bg-red-500/20 text-white/60 hover:text-red-400"
        >
          <LogOut size={22} />
          <span className="md:inline">Log Out</span>
        </button>

        <div className="mt-4 px-4 py-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-black">{user?.name?.charAt(0)}</div>
           <div className="flex flex-col overflow-hidden">
             <span className="text-xs font-bold truncate text-white/80">{user?.name}</span>
             <span className="text-[10px] opacity-40 truncate">Free Plan</span>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;