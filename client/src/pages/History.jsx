import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Layers, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadHistory = () => {
    try {
      setIsRefreshing(true);
      const rawData = localStorage.getItem("history");
      console.log("Raw History from LocalStorage:", rawData);
      
      const data = JSON.parse(rawData) || [];
      console.log("Parsed History Data:", data);

      // Additional safety: filter out any corrupted entries
      const validData = Array.isArray(data) ? data.filter(item => {
        const isValid = item && typeof item === 'object' && (item.idea || item.slides);
        if (!isValid) console.warn("Filtering out invalid history item:", item);
        return isValid;
      }) : [];
      
      console.log("Final Valid History to Display:", validData);
      setHistory(validData);
      setError(null);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Could not load your history. Local storage might be corrupted.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (error) {
     return (
        <div className="max-w-6xl mx-auto flex flex-col items-center pt-20 text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-white/50 mb-8">{error}</p>
          <button 
            onClick={() => { localStorage.removeItem("history"); setHistory([]); setError(null); }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold"
          >
            Clear History
          </button>
        </div>
     );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col pt-4">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">History</span>
          </h1>
          <p className="text-white/60 text-lg">Past generations saved locally on your device.</p>
        </div>
        
        <button 
          onClick={loadHistory}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-sm font-bold active:scale-95 disabled:opacity-50"
        >
          <Clock size={18} className={isRefreshing ? "animate-spin" : ""} />
          Refresh List
        </button>
      </div>

      {history.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/30">
            <Clock size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">No history yet</h2>
          <p className="text-white/50 mb-8">Go generate your first viral carousel!</p>
          <Link to="/dashboard" className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-pink-500/20">
            Generate Now
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {history.map((item, index) => (
            <motion.div
              variants={itemVariants}
              key={index}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-colors group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
                  <Clock size={16} />
                  {item.date || "Unknown Date"}
                </div>
                <div className="flex items-center gap-1.5 bg-pink-500/10 text-pink-400 px-3 py-1 rounded-full text-xs font-bold border border-pink-500/20">
                  <Layers size={14} />
                  {item.slides?.length || 0} Slides
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4 line-clamp-2 text-white/90 group-hover:text-white transition-colors">
                "{item.idea || "Untitled Project"}"
              </h3>

              <div className="bg-white/5 rounded-2xl p-4 flex-1 mb-4">
                <p className="text-sm text-white/60 line-clamp-3 italic">
                  {item.slides?.[0] ? `${item.slides[0].substring(0, 100)}...` : "No slide content preview available."}
                </p>
              </div>

              <Link to="/dashboard" state={{ idea: item.idea }} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold mt-auto">
                Reuse this Idea <ChevronRight size={16} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

    </div>
  );
}

export default History;