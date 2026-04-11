import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden text-white relative z-10 w-full max-w-[1600px] mx-auto">
      {/* Sidebar */}
      <div className="hidden md:block w-72 shrink-0 border-r border-white/10 bg-slate-950/30 backdrop-blur-xl">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full overflow-y-auto overflow-x-hidden scroll-smooth">
        
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-slate-950/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              AI Studio
            </h1>
        </div>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
