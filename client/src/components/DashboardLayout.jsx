import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AnimatedBackground from "./AnimatedBackground";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      {/* Sidebar - Fix position and surface */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] z-40 relative">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Navbar on top of dashboard */}
        <Navbar />
        
        <div className="flex-1 overflow-y-auto scrollbar-hide relative">
          <AnimatedBackground />
          <div className="relative z-10 p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}