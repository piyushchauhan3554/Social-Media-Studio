import Sidebar from "./Sidebar";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden text-white relative z-10 w-full max-w-[1600px] mx-auto">

      {/* Sidebar */}
      <div className="hidden md:block w-64 shrink-0 bg-[#080510]/60 backdrop-blur-xl">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative w-full overflow-y-auto overflow-x-hidden scroll-smooth">

        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-[#080510]/80 backdrop-blur-xl border-b border-white/[0.06] px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-[16px] font-black tracking-tight text-white">
              AI Studio
            </span>
          </div>
        </div>

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}