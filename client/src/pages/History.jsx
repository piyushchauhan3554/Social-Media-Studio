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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadHistory = async () => {
    try {
      setIsRefreshing(true);
      const res = await axios.get("http://localhost:5000/api/posts");
      setHistory(res.data);
      setError(null);
    } catch (err) {
      setError("Could not load your history from the cloud.");
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const handleDeleteClick = (item) => { setItemToDelete(item); setIsModalOpen(true); };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${itemToDelete._id}`);
      setHistory(history.filter((item) => item._id !== itemToDelete._id));
      setItemToDelete(null);
    } catch {
      alert("Failed to delete item");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
        <p className="text-[11px] font-bold tracking-[.18em] uppercase text-white/25">
          Accessing Cloud Storage...
        </p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center pt-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">Sync Error</h2>
        <p className="text-white/35 mb-8 text-[15px]">{error}</p>
        <button
          onClick={loadHistory}
          className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-8 py-3 rounded-xl text-[13px] font-bold transition-all hover:-translate-y-[1px] active:scale-95"
        >
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col pt-4 px-4">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-[11px] font-bold tracking-[.18em] uppercase text-violet-400">AI Studio</span>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              History
            </span>
          </h1>
          <p className="text-white/35 text-[15px]">Your AI creations, synced across all your devices.</p>
        </div>

        <button
          onClick={loadHistory}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] rounded-xl transition-all text-[13px] font-bold text-white/50 hover:text-white/80 active:scale-95 disabled:opacity-40 self-start md:self-auto"
        >
          <Clock size={15} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-[28px] p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="text-white/20" />
          </div>
          <h2 className="text-2xl font-black mb-3 tracking-tight text-white/70">The cloud is empty.</h2>
          <p className="text-white/30 mb-9 text-[15px] max-w-sm mx-auto leading-relaxed">
            Your creative journey starts with a single idea. Go to the studio and build something amazing.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(124,58,237,0.3)] active:scale-95 text-[14px]"
          >
            <Sparkles size={16} />
            Open Studio
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                variants={itemVariants}
                key={item._id}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/[0.025] border border-white/[0.07] hover:border-violet-500/25 rounded-[24px] p-6 flex flex-col relative overflow-hidden group transition-all"
              >
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/0 group-hover:via-violet-500/40 to-transparent transition-all duration-500" />

                {/* Card Header */}
                <div className="flex justify-between items-center mb-5 pb-5 border-b border-white/[0.05]">
                  <div className="flex items-center gap-1.5 text-white/25 text-[11px] font-bold uppercase tracking-widest">
                    <Clock size={12} />
                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-pink-500/10 text-pink-400 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-pink-500/15">
                      <Layers size={11} />
                      {item.slides?.length || 0} Slides
                    </div>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Idea Title */}
                <h3 className="text-[17px] font-black mb-4 line-clamp-2 text-white/80 group-hover:text-white transition-colors leading-snug tracking-tight">
                  "{item.idea}"
                </h3>

                {/* Preview Text */}
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 flex-1 mb-5">
                  <p className="text-[13px] text-white/30 line-clamp-3 leading-relaxed">
                    {item.slides?.[0]?.text || "No preview available."}
                  </p>
                </div>

                {/* Remix Button */}
                <Link
                  to="/dashboard"
                  state={{ idea: item.idea }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600/80 to-pink-600/80 hover:from-violet-600 hover:to-pink-600 text-white transition-all text-[13px] font-bold hover:-translate-y-[1px] active:scale-[.98]"
                >
                  Remix this Idea <ChevronRight size={15} />
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