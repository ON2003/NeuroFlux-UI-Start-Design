import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Zap, 
  BrainCircuit, 
  BookOpen, 
  Activity, 
  AlertTriangle,
  Clock,
  ArrowDownRight,
  ChevronRight,
  Settings2,
  Cpu,
  Edit3,
  Save,
  X,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Instrument } from '../../types';

interface InstrumentDetailProps {
  instrument: Instrument;
  onUpdate: (instrument: Instrument) => void;
}

export default function InstrumentDetail({ instrument, onUpdate }: InstrumentDetailProps) {
  const [activeTab, setActiveTab] = useState('insights');
  const [isEditingWorkflow, setIsEditingWorkflow] = useState(false);
  const [workflowText, setWorkflowText] = useState(instrument.workflow || '');

  // Reset local workflow text when instrument changes
  useEffect(() => {
    setWorkflowText(instrument.workflow || '');
    setIsEditingWorkflow(false);
  }, [instrument.id]);

  const handleSaveWorkflow = () => {
    onUpdate({
      ...instrument,
      workflow: workflowText
    });
    setIsEditingWorkflow(false);
  };

  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: BrainCircuit },
    { id: 'workflow', label: 'User Workflow', icon: Clock },
    { id: 'manual', label: 'Documentation', icon: BookOpen },
  ];

  return (
    <div className="max-w-6xl mx-auto p-10 pb-24 font-body">
      {/* Alarm Section (Level 2 Core - Problem) */}
      {instrument.status !== 'operational' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-10 border-l-4 p-8 rounded-r-xl ${
            instrument.status === 'critical' ? 'bg-critical/5 border-critical' : 'bg-warning/5 border-warning'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${instrument.status === 'critical' ? 'bg-critical text-white' : 'bg-warning text-white'}`}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-sans font-bold mb-2 ${instrument.status === 'critical' ? 'text-critical' : 'text-warning'}`}>
                {instrument.status === 'critical' ? 'Critical Operational Limit Reached' : 'Warning: Performance Deviation Detected'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-light mb-2">What is happening?</h4>
                  <p className="text-slate-dark leading-relaxed font-semibold">
                    {instrument.anomalies[0]?.context || "Baseline shift identified in core operational parameters during the last duty cycle."}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-light mb-2">Why does it matter?</h4>
                  <p className="text-slate-dark leading-relaxed">
                    Unchecked progression will lead to {instrument.predictions[0]?.target || "system calibration loss"} 
                    with a probability of {instrument.predictions[0]?.probability || 45}%.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-6 border-t border-lab-surface pt-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-light">Severity</span>
                  <span className="text-sm font-bold uppercase">{instrument.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-light">Risk Impact</span>
                  <span className="text-sm font-bold uppercase">{instrument.predictions[0]?.impact?.split(' ')[0] || "Medium"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabbed System (Insight -> Context -> Data) */}
      <div className="border border-lab-surface rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex overflow-x-auto border-b border-lab-surface bg-lab-bg/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all min-w-max relative ${
                activeTab === tab.id ? 'text-slate-dark bg-white' : 'text-slate-light hover:text-slate-dark hover:bg-white/50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-dark"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'insights' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-light mb-4 flex items-center gap-2">
                      <Zap size={14} className="text-amber-500" />
                      Strategic Recommendations
                    </h3>
                    <div className="space-y-3">
                      {instrument.recommendations.map(rec => (
                        <div key={rec.id} className="flex items-start gap-4 p-4 border border-lab-surface rounded-lg bg-lab-bg/10 hover:bg-white hover:shadow-subtle transition-all">
                          <div className={`p-1.5 rounded-full mt-0.5 ${rec.priority === 'high' ? 'bg-critical text-white' : 'bg-success text-white'}`}>
                             <ArrowDownRight size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-dark">{rec.action}</p>
                            <p className="text-sm text-slate-light mt-1">{rec.reason}</p>
                          </div>
                        </div>
                      ))}
                      {instrument.recommendations.length === 0 && (
                        <p className="text-sm text-slate-light italic">No immediate actions required for this instrument.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-light mb-4">Core AI Caretaker Analysis</h3>
                    <div className="space-y-4">
                      {instrument.aiInsights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-dark mt-2" />
                          <p className="text-slate-dark leading-relaxed font-body">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'workflow' && (
                <div className="space-y-8">
                  {/* Performance Metrics Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-lab-surface rounded-lg bg-lab-bg/10">
                       <h5 className="text-[10px] uppercase font-bold text-slate-light mb-2">Operator Precision</h5>
                       <div className="flex items-center gap-2 text-success font-bold">
                          <Activity size={14} />
                          <span>94.2%</span>
                       </div>
                    </div>
                    <div className="p-4 border border-lab-surface rounded-lg bg-lab-bg/10">
                       <h5 className="text-[10px] uppercase font-bold text-slate-light mb-2">Recipe Compliance</h5>
                       <div className="flex items-center gap-2 text-slate-dark font-bold">
                          <ShieldCheck size={14} className="text-success" />
                          <span>Strict</span>
                       </div>
                    </div>
                    <div className="p-4 border border-lab-surface rounded-lg bg-lab-bg/10">
                       <h5 className="text-[10px] uppercase font-bold text-slate-light mb-2">Last Modified</h5>
                       <div className="text-sm font-bold text-slate-dark">2 days ago</div>
                    </div>
                  </div>

                  {/* Workflow / Recipe Section */}
                  <div className="border border-lab-surface rounded-xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 bg-lab-bg/30 border-b border-lab-surface">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-light" />
                        <h4 className="font-sans font-bold text-slate-dark">Operational Recipe & Workflow</h4>
                      </div>
                      
                      {!isEditingWorkflow ? (
                        <button 
                          onClick={() => setIsEditingWorkflow(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-lab-surface rounded text-[11px] font-bold text-slate-dark hover:bg-slate-50 transition-colors shadow-sm"
                        >
                          <Edit3 size={14} />
                          {instrument.workflow ? 'Edit Workflow' : 'Create Workflow'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setIsEditingWorkflow(false)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-lab-surface rounded text-[11px] font-bold text-critical hover:bg-critical/5 transition-colors"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                          <button 
                            onClick={handleSaveWorkflow}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-dark text-white rounded text-[11px] font-bold hover:bg-black transition-colors shadow-md"
                          >
                            <Save size={14} />
                            Save Recipe
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-0 min-h-[400px] flex flex-col">
                      {isEditingWorkflow ? (
                        <div className="flex-1 flex flex-col">
                          <div className="px-6 py-3 bg-slate-50 border-b border-lab-surface flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-light uppercase">Markdown Editor</span>
                            <span className="text-[9px] text-slate-light opacity-60">Supports headings, lists, and bold text</span>
                          </div>
                          <textarea
                            value={workflowText}
                            onChange={(e) => setWorkflowText(e.target.value)}
                            placeholder="# Enter instrument workflow recipe here...&#10;&#10;## 1. Preparation&#10;- Step 1...&#10;- Step 2..."
                            className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none bg-white text-slate-dark"
                          />
                        </div>
                      ) : (
                        <div className="p-8 prose prose-slate max-w-none">
                          {instrument.workflow ? (
                            <div className="markdown-body">
                              <Markdown>{instrument.workflow}</Markdown>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                              <div className="w-16 h-16 bg-lab-bg rounded-full flex items-center justify-center text-slate-light/50 mb-4 border-2 border-dashed border-lab-surface">
                                <Plus size={24} />
                              </div>
                              <h5 className="font-bold text-slate-dark mb-1">No workflow defined</h5>
                              <p className="text-sm text-slate-light max-w-xs">
                                Create a standard operating procedure (SOP) or recipe for this instrument to ensure consistent results.
                              </p>
                              <button 
                                onClick={() => setIsEditingWorkflow(true)}
                                className="mt-6 px-4 py-2 bg-slate-dark text-white rounded-md text-xs font-bold hover:shadow-lg transition-all"
                              >
                                Initialize Recipe
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Assistance Footer */}
                  <div className="p-6 border border-lab-surface rounded-xl bg-slate-dark/5 flex items-start gap-4">
                    <div className="p-2 bg-slate-dark rounded text-white mt-1">
                      <BrainCircuit size={16} />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-dark mb-1">AI Caretaker Tip</h5>
                      <p className="text-sm text-slate-dark leading-relaxed opacity-80 italic">
                        "I can help you optimize this recipe based on historical telemetry. If you notice peak drift, consider adding a 'Temperature Equilibration' step of at least 15 minutes."
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'manual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Calibration Schedule v4.2",
                    "Critical Safety Protocols - BIO_B2",
                    "Seal Replacement Procedure Guide",
                    "Daily Maintenance Checklist",
                    "System Architecture Diagram"
                  ].map((doc, idx) => (
                    <div key={idx} className="p-4 border border-lab-surface rounded-lg flex items-center justify-between hover:bg-lab-bg/50 cursor-pointer group transition-all">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-lab-surface/30 rounded text-slate-light group-hover:bg-slate-dark group-hover:text-white transition-colors">
                           <BookOpen size={16} />
                         </div>
                         <span className="font-semibold text-slate-dark">{doc}</span>
                       </div>
                       <ChevronRight size={16} className="text-slate-light" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Supporting View Access - Minimal */}
      <div className="mt-12 flex justify-center">
        <button className="flex items-center gap-2 text-xs font-bold text-slate-light hover:text-slate-dark uppercase tracking-[0.2em] transition-all bg-white px-6 py-3 border border-lab-surface rounded-full">
          <Settings2 size={14} />
          Adjust Monitoring Calibration
        </button>
      </div>
    </div>
  );
}
