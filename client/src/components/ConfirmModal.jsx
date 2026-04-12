import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", type = "danger" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen">

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#080510]/60 dark:bg-[#080510]/75 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm bg-white dark:bg-[#0e0b1a] border border-black/[0.05] dark:border-white/[0.08] rounded-[24px] p-7 overflow-hidden"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.04)" }}
        >
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 w-full h-[1px] ${type === "danger" ? "bg-gradient-to-r from-transparent via-red-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"}`} />

          {/* Glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] pointer-events-none ${type === "danger" ? "bg-red-500/5 dark:bg-red-500/10" : "bg-violet-500/5 dark:bg-violet-500/10"}`} />

          {/* Header */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              type === "danger"
                ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                : "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400"
            }`}>
              <AlertTriangle size={20} />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-white/25 hover:text-slate-900 dark:hover:text-white/60 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Text */}
          <div className="relative z-10 mb-7">
            <h3 className="text-[19px] font-black tracking-tight text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-[13.5px] text-slate-500 dark:text-white/35 leading-relaxed">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 relative z-10">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.07] border border-black/[0.05] dark:border-white/[0.07] text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white font-bold text-[13.5px] transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 py-3 rounded-xl font-bold text-[13.5px] transition-all active:scale-95 hover:-translate-y-[1px] ${
                type === "danger"
                  ? "bg-red-600 hover:bg-red-500 text-white hover:shadow-[0_6px_20px_rgba(239,68,68,0.3)]"
                  : "bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white hover:shadow-[0_6px_20px_rgba(124,58,237,0.3)]"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}