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
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-10">
        {/* <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
            <User size={15} className="text-white" />
          </div>
          <span className="text-[11px] font-bold tracking-[.18em] uppercase text-violet-400">AI Studio</span>
        </div> */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
          Account{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Settings
          </span>
        </h1>
        <p className="text-white/35 text-[15px]">Manage your profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Left: Forms ── */}
        <div className="md:col-span-2 space-y-4">

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/[0.025] border border-white/[0.07] rounded-[24px] p-7 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />

            <h3 className="text-[13px] font-bold tracking-[.12em] uppercase text-white/30 mb-6 flex items-center gap-2">
              <User size={13} className="text-pink-400" />
              Profile Information
            </h3>

            <form onSubmit={handleSave} className="space-y-5">

              {/* Name */}
              <div className="space-y-[.45rem]">
                <label className="block text-[10.5px] font-bold tracking-[.14em] uppercase text-white/25 ml-[2px]">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-white/20 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.045] border border-white/[0.08] rounded-[13px] py-[13px] pl-[45px] pr-[15px] text-white text-[14.5px] font-medium outline-none focus:border-violet-500/55 focus:bg-violet-600/[0.07] transition-all"
                  />
                </div>
              </div>

              {/* Email (disabled) */}
              <div className="space-y-[.45rem]">
                <label className="block text-[10.5px] font-bold tracking-[.14em] uppercase text-white/25 ml-[2px]">
                  Email Address
                </label>
                <div className="relative opacity-50 cursor-not-allowed">
                  <Mail className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-white/20" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-[13px] py-[13px] pl-[45px] pr-[15px] text-white/40 text-[14.5px] font-medium outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-white/20 ml-[2px]">Email cannot be changed yet.</p>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-[14px] transition-all active:scale-95 hover:-translate-y-[1px] ${
                  saved
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white hover:shadow-[0_8px_24px_rgba(124,58,237,0.3)]"
                }`}
              >
                {saved ? (
                  <><CheckCircle size={16} /> Saved!</>
                ) : (
                  <><Save size={16} /> Save Changes</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/[0.025] border border-white/[0.07] rounded-[24px] p-7 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            <h3 className="text-[13px] font-bold tracking-[.12em] uppercase text-white/30 mb-5 flex items-center gap-2">
              <Shield size={13} className="text-violet-400" />
              Security
            </h3>
            <p className="text-white/30 mb-5 text-[14px]">Password management coming soon.</p>
            <button
              disabled
              className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] text-white/20 rounded-xl text-[13px] font-bold cursor-not-allowed"
            >
              Change Password
            </button>
          </motion.div>
        </div>

        {/* ── Right: Profile Card ── */}
        <div className="md:col-span-1">
          <div className="bg-white/[0.025] border border-white/[0.07] rounded-[24px] p-7 text-center sticky top-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl font-black relative">
              <div className="absolute inset-[-3px] rounded-[18px] bg-gradient-to-br from-violet-600/25 to-pink-500/25 blur-[8px] -z-10" />
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h4 className="text-[17px] font-black text-white mb-1 tracking-tight">{user?.name}</h4>
            <p className="text-white/25 text-[12px] mb-6">
              Member since{" "}
              {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>

            <div className="pt-5 border-t border-white/[0.05]">
              <span className="text-[10px] font-bold uppercase tracking-[.18em] text-violet-400 block mb-2">
                Pro Plan
              </span>
              <p className="text-[12px] text-white/25 leading-relaxed">
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