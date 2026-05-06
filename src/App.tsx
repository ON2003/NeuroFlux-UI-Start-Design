/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  AlertCircle, 
  Activity, 
  Settings, 
  History, 
  LayoutDashboard,
  ChevronRight,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Instrument, Alert as AlertType } from './types';
import { mockInstruments, mockAlerts } from './mockData';
import AlertsPanel from './components/alerts/AlertsPanel';
import InstrumentExplorer from './components/instruments/InstrumentExplorer';
import InstrumentDetail from './components/instruments/InstrumentDetail';

import LoginPage from './components/auth/LoginPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [isInitializing, setIsInitializing] = useState(true);
  const [view, setView] = useState<'dashboard' | 'detail'>('dashboard');
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string | null>(null);
  const [isAlertsCollapsed, setIsAlertsCollapsed] = useState(false);

  const selectedInstrument = useMemo(() => 
    instruments.find(i => i.id === selectedInstrumentId) || null
  , [instruments, selectedInstrumentId]);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectInstrument = (instrument: Instrument) => {
    setSelectedInstrumentId(instrument.id);
    setView('detail');
  };

  const handleUpdateInstrument = (updatedInstrument: Instrument) => {
    setInstruments(prev => prev.map(inst => 
      inst.id === updatedInstrument.id ? updatedInstrument : inst
    ));
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-slate-dark flex flex-col items-center justify-center text-white font-mono uppercase tracking-[0.3em] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <Activity size={48} className="text-white/20 animate-pulse" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs">NeuroFlux Caretaker</span>
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-success"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </div>
            <span className="text-[10px] text-white/40">Synchronizing instrument telemetry...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-lab-bg overflow-hidden text-slate-dark">
      {/* Small Navigation Rail (Level 3) */}
      <nav className="w-16 border-r border-lab-surface bg-white flex flex-col items-center pt-8 pb-0 gap-8 z-20">
        <div className="w-10 h-10 bg-slate-dark rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-dark/20 transition-transform hover:scale-105 cursor-pointer">
          <Activity size={22} />
        </div>
        <div className="mt-auto h-[52px] flex items-center justify-center w-full">
          <button className="p-2 text-slate-light hover:bg-lab-bg rounded-lg transition-colors">
            <Settings size={22} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex h-full w-full"
            >
              {/* Level 1: Split Screen */}
              <AlertsPanel 
                alerts={mockAlerts} 
                isCollapsed={isAlertsCollapsed}
                onToggleCollapse={() => setIsAlertsCollapsed(!isAlertsCollapsed)}
                onSelectAlert={(id) => {
                  const inst = instruments.find(i => i.id === id);
                  if (inst) handleSelectInstrument(inst);
                }}
              />
              <InstrumentExplorer 
                isSidebarCollapsed={isAlertsCollapsed}
                instruments={instruments} 
                onSelectInstrument={handleSelectInstrument}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full flex flex-col bg-lab-bg"
            >
              {/* Level 2: Detail View */}
              <div className="h-20 border-b border-lab-surface flex items-center pt-8 pb-4 px-6 gap-5 bg-lab-bg/80 backdrop-blur-sm sticky top-0 z-10 transition-all">
                <button 
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2 text-sm font-medium text-slate-light hover:text-slate-dark transition-all duration-200"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Command Center</span>
                </button>
                <div className="h-4 w-[1px] bg-lab-surface/60 mx-1" />
                <h2 className="text-xl font-sans font-bold text-slate-dark tracking-tight leading-none">{selectedInstrument?.name}</h2>
                <div className="ml-auto flex items-center gap-3">
                   <div className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 shadow-sm border ${
                     selectedInstrument?.status === 'critical' ? 'bg-critical/5 text-critical border-critical/20' :
                     selectedInstrument?.status === 'warning' ? 'bg-warning/5 text-warning border-warning/20' :
                     'bg-success/5 text-success border-success/20'
                   }`}>
                     <div className={`w-2 h-2 rounded-full animate-pulse transition-colors ${
                        selectedInstrument?.status === 'critical' ? 'bg-critical' :
                        selectedInstrument?.status === 'warning' ? 'bg-warning' :
                        'bg-success'
                     }`} />
                     {selectedInstrument?.status}
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <InstrumentDetail 
                  instrument={selectedInstrument!} 
                  onUpdate={(updated) => handleUpdateInstrument(updated)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
