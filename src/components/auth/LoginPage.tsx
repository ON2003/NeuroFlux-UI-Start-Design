import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ChevronRight, Activity, ShieldCheck, Cpu } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-dark rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-dark rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-dark rounded-2xl shadow-xl mb-6 text-white">
            <Cpu size={32} />
          </div>
          <h1 className="text-3xl font-sans font-bold text-slate-dark tracking-tight uppercase">NeuroFlux</h1>
          <p className="text-slate-light font-medium tracking-wide text-xs uppercase mt-2">Laboratory Command & Intelligence</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-lab-surface rounded-2xl shadow-2xl p-8 backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-light uppercase tracking-widest ml-1">Access ID (Email)</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light transition-colors group-focus-within:text-slate-dark" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@neuroflux.lab"
                  className="w-full bg-lab-bg border border-lab-surface rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-dark/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-light uppercase tracking-widest">Security Protocol (Password)</label>
                <a href="#" className="text-[10px] font-bold text-slate-dark/60 hover:text-slate-dark transition-colors">Recover</a>
              </div>
              <div className="relative group">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light transition-colors group-focus-within:text-slate-dark" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-lab-bg border border-lab-surface rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-dark/10 transition-all font-mono"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-dark text-white rounded-xl py-3.5 font-bold text-sm tracking-wide shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Initiate Secure Login
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-lab-surface flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                <ShieldCheck size={14} className="text-slate-dark" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">AES-256</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                <Activity size={14} className="text-slate-dark" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">Live Monitor</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-light/40">v8.2.RC4</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-[10px] font-medium text-slate-light uppercase tracking-widest px-4"
        >
          Institutional Access Only. All operations are logged and monitored by the 
          <span className="text-slate-dark font-bold"> NeuroFlux Core Agent</span>.
        </motion.div>
      </div>
    </div>
  );
}
