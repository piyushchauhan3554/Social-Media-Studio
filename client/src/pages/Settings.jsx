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
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black mb-3">
          Account <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Settings</span>
        </h1>
        <p className="text-white/60 text-lg">Manage your profile and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-xl"
          >
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <User className="text-pink-500" />
              Profile Information
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pink-500 transition-colors" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
                <div className="relative group opacity-60 cursor-not-allowed">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 transition-all font-medium"
                  />
                </div>
                <p className="text-[10px] text-white/20 ml-4 italic">Email cannot be changed yet.</p>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 px-8 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-pink-500/20 active:scale-95"
              >
                {saved ? <><CheckCircle size={20} /> Saved!</> : <><Save size={20} /> Save Changes</>}
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-xl"
          >
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Shield className="text-violet-500" />
              Security
            </h3>
            <p className="text-white/40 mb-6 font-medium">Password management coming soon.</p>
            <button disabled className="px-6 py-3 bg-white/5 border border-white/10 text-white/20 rounded-xl text-sm font-bold cursor-not-allowed">
              Change Password
            </button>
          </motion.div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-[32px] p-8 text-center sticky top-8">
             <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-black shadow-2xl">
               {user?.name?.charAt(0) || "U"}
             </div>
             <h4 className="text-xl font-black mb-1">{user?.name}</h4>
             <p className="text-white/30 text-sm font-medium mb-6">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
             <div className="pt-6 border-t border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500/50 block mb-2">Pro Plan</span>
                <p className="text-xs text-white/40 font-bold leading-relaxed">You have full access to all AI Studio features.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
