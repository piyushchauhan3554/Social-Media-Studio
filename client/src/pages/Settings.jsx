import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Save, CheckCircle, Shield } from "lucide-react";

function Settings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 transition-colors duration-300">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-slate-900 dark:text-slate-50">
          Account{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">
            Settings
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[16px] font-medium">Manage your profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Left: Forms ── */}
        <div className="md:col-span-2 space-y-4">

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[28px] p-7 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />

            <h3 className="text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
              <User size={14} className="text-rose-500" />
              Profile Information
            </h3>

            <form onSubmit={handleSave} className="space-y-5">

              {/* Name */}
              <div className="space-y-[.45rem]">
                <label className="block text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500 ml-[2px]">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] py-[13px] pl-[45px] pr-[15px] text-slate-900 dark:text-slate-100 text-[15px] font-medium outline-none focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Email (disabled) */}
              <div className="space-y-[.45rem]">
                <label className="block text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500 ml-[2px]">
                  Email Address
                </label>
                <div className="relative opacity-60 cursor-not-allowed">
                  <Mail className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 dark:text-slate-700" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] py-[13px] pl-[45px] pr-[15px] text-slate-500 dark:text-slate-500 text-[15px] font-medium outline-none cursor-not-allowed shadow-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-600 ml-[2px] font-medium tracking-tight">Email cannot be changed yet.</p>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[14px] transition-all active:scale-95 hover:-translate-y-[1px] ${
                  saved
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20"
                }`}
              >
                {saved ? (
                  <><CheckCircle size={17} /> Saved!</>
                ) : (
                  <><Save size={17} /> Save Changes</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[28px] p-7 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            <h3 className="text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500 mb-5 flex items-center gap-2">
              <Shield size={14} className="text-indigo-500" />
              Security
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-5 text-[15px] font-medium">Password management coming soon.</p>
            <button
              disabled
              className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 rounded-xl text-[13.5px] font-bold cursor-not-allowed opacity-60"
            >
              Change Password
            </button>
          </motion.div>
        </div>

        {/* ── Right: Profile Card ── */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[28px] p-7 text-center sticky top-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl font-black relative text-white shadow-xl shadow-indigo-500/10">
              <div className="absolute inset-[-3px] rounded-[22px] bg-gradient-to-br from-indigo-600/25 to-rose-500/25 blur-[12px] -z-10" />
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h4 className="text-[18px] font-black text-slate-900 dark:text-slate-50 mb-1 tracking-tight">{user?.name}</h4>
            <p className="text-slate-400 dark:text-slate-500 text-[12.5px] mb-6 font-medium">
              Member since{" "}
              {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400 block mb-2">
                Pro Plan
              </span>
              <p className="text-[13px] text-slate-500 dark:text-slate-500 leading-relaxed font-medium">
                You have full access to all AI Studio features.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;