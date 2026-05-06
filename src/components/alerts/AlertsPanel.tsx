import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, ChevronRight, Zap, PanelLeftClose, PanelLeftOpen, Activity } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsPanelProps {
  alerts: Alert[];
  onSelectAlert: (instrumentId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AlertsPanel({ alerts, onSelectAlert, isCollapsed, onToggleCollapse }: AlertsPanelProps) {
  return (
    <motion.section 
      animate={{ width: isCollapsed ? '64px' : '38%' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-full bg-lab-bg border-r border-lab-surface flex flex-col overflow-hidden relative"
    >
      {/* Header - Stays partially visible */}
      <div className={`px-6 pt-8 pb-4 flex items-center justify-between transition-colors ${isCollapsed ? 'bg-lab-bg flex-col gap-5 pt-8' : 'bg-white/40'}`}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div 
              key="expanded-header"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <h2 className="text-xl font-sans font-bold flex items-center gap-2 whitespace-nowrap text-slate-dark uppercase tracking-tight">
                Notification
                <span className="flex h-2 w-2 rounded-full bg-critical animate-pulse" />
              </h2>
            </motion.div>
          ) : (
            <motion.div 
              key="collapsed-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center w-full"
            >
              <div className="relative group/badge">
                <AlertCircle size={22} className="text-critical" />
                <span className="absolute -top-1 -right-1 bg-critical text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-lab-bg">
                  {alerts.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button - Modern Floating Position */}
        <button 
          onClick={onToggleCollapse}
          className={`z-30 p-1.5 rounded-md backdrop-blur-md transition-all group flex items-center justify-center
            ${!isCollapsed 
              ? 'bg-lab-bg border border-lab-surface text-slate-light hover:bg-slate-dark hover:text-white' 
              : 'bg-white border border-lab-surface shadow-sm hover:bg-slate-dark hover:text-white'}`}
          title={isCollapsed ? "Expand Feed" : "Collapse Feed"}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={16} className="animate-pulse" />
          ) : (
            <PanelLeftClose size={18} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto flex flex-col"
          >
            <div className="px-6 py-1.5 bg-white/30 flex items-center justify-between">
               <span className="text-[10px] font-bold text-slate-light tracking-widest uppercase">{alerts.length} Active Risks</span>
            </div>

            <div className="divide-y divide-lab-surface">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.4)' }}
                  onClick={() => onSelectAlert(alert.instrumentId)}
                  className="px-6 py-2 cursor-pointer transition-all group relative border-l-2 border-transparent hover:border-l-critical/50"
                >
                  <div className="flex items-start justify-between gap-4 mb-0.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-0.5 rounded-md ${alert.severity === 'critical' ? 'bg-critical/10 text-critical' : 'bg-warning/10 text-warning'}`}>
                        <AlertCircle size={12} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-light">{alert.instrumentName}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-light/60">{alert.timestamp}</span>
                  </div>

                  <h3 className="text-[13px] font-semibold text-slate-dark mb-0.5 group-hover:text-black transition-colors leading-tight">
                    {alert.summary}
                  </h3>
                  
                  <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-bold text-slate-light flex items-center gap-1 uppercase tracking-tighter">
                      Investigate <ChevronRight size={10} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {alerts.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
                <ShieldCheck size={32} className="text-success mb-3" />
                <h3 className="font-sans font-semibold text-sm">Systems Nominal</h3>
                <p className="text-xs mt-1">AI caretakers report no risks.</p>
              </div>
            )}

            {/* Footer Insight */}
            <div className="mt-auto px-6 py-4 bg-slate-dark text-white/90 text-xs font-mono">
              <div className="flex items-center gap-2 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span>VIGILANCE AGENT: ACTIVE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Indicator - Vertical Label */}
      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center pointer-events-none">
           <span className="rotate-180 [writing-mode:vertical-lr] text-[10px] font-bold text-slate-light uppercase tracking-[0.3em] opacity-30">
             Priority Feed
           </span>
        </div>
      )}
    </motion.section>
  );
}

import { ShieldCheck } from 'lucide-react';
