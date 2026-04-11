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
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
        >
          {/* Decorative radial gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === "danger" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-black mb-2 italic">{title}</h3>
          <p className="text-white/50 mb-8 leading-relaxed font-medium">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all text-sm active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 rounded-2xl font-black transition-all text-sm active:scale-95 shadow-lg ${
                type === "danger" 
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-red-500/10" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
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
