import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Layers, ChevronRight, AlertCircle, Trash2, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Custom Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadHistory = async () => {
    try {
      setIsRefreshing(true);
      const res = await axios.get("http://localhost:5000/api/posts");
      setHistory(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Could not load your history from the cloud.");
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/posts/${itemToDelete._id}`);
      setHistory(history.filter(item => item._id !== itemToDelete._id));
      setItemToDelete(null);
    } catch (err) {
      alert("Failed to delete item");
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-pink-500 mb-4" />
        <p className="text-white/40 font-bold tracking-widest uppercase text-xs">Accessing Cloud Storage...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="max-w-6xl mx-auto flex flex-col items-center pt-20 text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sync Error</h2>
          <p className="text-white/50 mb-8">{error}</p>
          <button 
            onClick={loadHistory}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
          >
            Retry Sync
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
          <p className="text-white/60 text-lg">Your AI creations, synced across all your devices.</p>
        </div>
        
        <button 
          onClick={loadHistory}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-sm font-bold active:scale-95 disabled:opacity-50"
        >
          <Clock size={18} className={isRefreshing ? "animate-spin" : ""} />
          Refresh Cloud
        </button>
      </div>

      {history.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[40px] p-20 text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500/10 to-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-white/20">
            <Sparkles size={48} />
          </div>
          <h2 className="text-3xl font-black mb-4 italic">The cloud is empty.</h2>
          <p className="text-white/40 mb-10 text-lg max-w-md mx-auto">Your creative journey starts with a single idea. Go to the studio and build something amazing.</p>
          <Link to="/dashboard" className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-pink-500/20 active:scale-95">
            Open Studio
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                variants={itemVariants}
                key={item._id}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] overflow-hidden hover:border-pink-500/30 transition-all group flex flex-col relative"
              >
                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-2 text-white/40 text-xs font-black uppercase tracking-widest">
                    <Clock size={14} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-pink-500/10 text-pink-400 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-pink-500/20">
                      <Layers size={14} />
                      {item.slides?.length || 0} Slides
                    </div>
                    <button 
                      onClick={() => handleDeleteClick(item)}
                      className="text-white/20 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-6 line-clamp-2 text-white/90 group-hover:text-white transition-colors leading-tight italic">
                  "{item.idea}"
                </h3>

                <div className="bg-white/5 rounded-2xl p-6 flex-1 mb-6 border border-white/5">
                  <p className="text-sm text-white/40 line-clamp-3 leading-relaxed">
                    {item.slides?.[0]?.text || "No preview available."}
                  </p>
                </div>

                <Link to="/dashboard" state={{ idea: item.idea }} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white text-slate-950 hover:bg-pink-100 transition-all text-sm font-black active:scale-95">
                  Remix this Idea <ChevronRight size={18} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Creation?"
        message={`Are you sure you want to permanently delete "${itemToDelete?.idea}"? This action cannot be undone.`}
        confirmText="Delete permanently"
      />
    </div>
  );
}

export default History;