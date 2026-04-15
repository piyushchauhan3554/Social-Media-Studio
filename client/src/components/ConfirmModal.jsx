import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", type = "danger" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 min-h-screen">

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-[#020617]/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-7 overflow-hidden shadow-2xl"
        >
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 w-full h-px ${type === "danger" ? "bg-linear-to-r from-transparent via-rose-500/50 to-transparent" : "bg-linear-to-r from-transparent via-indigo-500/50 to-transparent"}`} />

          {/* Glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] pointer-events-none ${type === "danger" ? "bg-red-500/5 dark:bg-red-500/10" : "bg-violet-500/5 dark:bg-violet-500/10"}`} />

          {/* Header */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${
              type === "danger"
                ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
            }`}>
              <AlertTriangle size={24} />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold"
            >
              <X size={18} />
            </button>
          </div>

          {/* Text */}
          <div className="relative z-10 mb-7">
            <h3 className="text-[20px] font-black tracking-tight text-slate-900 dark:text-slate-50 mb-2">{title}</h3>
            <p className="text-[14px] text-slate-500 dark:text-slate-500 leading-relaxed font-medium">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 relative z-10">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[14px] transition-all active:scale-95 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 py-3.5 rounded-xl font-bold text-[14px] transition-all active:scale-95 hover:-translate-y-px shadow-lg ${
                type === "danger"
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/10"
                  : "bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 shadow-slate-900/10"
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