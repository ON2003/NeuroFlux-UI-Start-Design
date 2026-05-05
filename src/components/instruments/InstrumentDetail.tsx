import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  Send,
  User,
  Bot
} from 'lucide-react';
import { Instrument } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface InstrumentDetailProps {
  instrument: Instrument;
  onUpdate: (instrument: Instrument) => void;
}

export default function InstrumentDetail({ instrument, onUpdate }: InstrumentDetailProps) {
  const [activeTab, setActiveTab] = useState('insights');
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [expandedWorkflowId, setExpandedWorkflowId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I am NeuroFlux Agent assigned to ${instrument.name}. I've been monitoring its telemetry and running continuous probabilistic models. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  // Reset states when instrument changes
  useEffect(() => {
    setEditingWorkflowId(null);
    setExpandedWorkflowId(null);
    // Reset messages for the new instrument
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Hello! I am NeuroFlux Agent assigned to ${instrument.name}. I've been monitoring its telemetry and running continuous probabilistic models. How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [instrument.id]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "I've analyzed the pressure data. It seems the baseline shift is correlated with the ambient temperature increase in Room 4A. I recommend checking the cooling system.",
        "Based on the last 3 duty cycles, the precision has dropped by 0.4%. This usually indicates the beginning of seal wear. Shall I prepare a maintenance ticket?",
        "The current workflow recipe is being followed with 98% compliance. However, step 3 could be shortened by 5 minutes to optimize throughput without compromising stability.",
        "I'm detecting rare micro-fluctuations in the power supply. It hasn't affected results yet, but I'll keep a 'tight-window' monitoring on it."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleSaveWorkflow = () => {
    if (!editingWorkflowId) return;

    let updatedWorkflows = [...instrument.workflows];
    
    if (editingWorkflowId === 'new') {
      updatedWorkflows.push({
        id: `w-${Date.now()}`,
        title: editTitle || 'Untitled Workflow',
        content: editContent
      });
    } else {
      updatedWorkflows = updatedWorkflows.map(w => 
        w.id === editingWorkflowId 
          ? { ...w, title: editTitle, content: editContent } 
          : w
      );
    }

    onUpdate({
      ...instrument,
      workflows: updatedWorkflows
    });
    setEditingWorkflowId(null);
  };

  const startEditing = (workflow?: any) => {
    if (workflow) {
      setEditingWorkflowId(workflow.id);
      setEditTitle(workflow.title);
      setEditContent(workflow.content);
    } else {
      setEditingWorkflowId('new');
      setEditTitle('');
      setEditContent('## 1) Preparation\n- \n\n## 2) Execution\n- ');
    }
  };

  const sortedWorkflows = [...instrument.workflows].sort((a, b) => a.title.localeCompare(b.title));

  const tabs = [
    { id: 'insights', label: 'NeuroFlux Agent', icon: BrainCircuit },
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
      <div className="border border-lab-surface rounded-xl overflow-hidden bg-white shadow-sm flex flex-col h-[700px]">
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

        <div className="flex-1 overflow-hidden p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full flex flex-col"
            >
              {activeTab === 'insights' && (
                <div className="flex-1 flex flex-col h-full bg-lab-bg/10">
                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          msg.role === 'assistant' ? 'bg-slate-dark text-white' : 'bg-white border border-lab-surface text-slate-dark'
                        }`}>
                          {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''} flex flex-col`}>
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'assistant' 
                              ? 'bg-white text-slate-dark rounded-tl-sm border border-lab-surface' 
                              : 'bg-slate-dark text-white rounded-tr-sm'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-[10px] font-bold text-slate-light uppercase mt-1 px-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-lab-surface">
                    <div className="relative group">
                      <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask NeuroFlux Agent anything about this instrument..."
                        className="w-full bg-lab-bg/30 border border-lab-surface rounded-xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-dark/10 transition-all font-body"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                          inputValue.trim() ? 'bg-slate-dark text-white shadow-md' : 'text-slate-light opacity-50'
                        }`}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3 px-2">
                       <span className="text-[9px] font-bold text-slate-light uppercase tracking-widest flex items-center gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                         Agent Online
                       </span>
                       <span className="text-[9px] font-bold text-slate-light uppercase tracking-widest opacity-60">
                         Powered by NeuroFlux Core v8.2
                       </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'workflow' && (
                <div className="flex-1 flex flex-col h-full bg-lab-bg/10">
                  <div className="p-6 border-b border-lab-surface bg-white flex items-center justify-between">
                    <div>
                      <h3 className="font-sans font-bold text-slate-dark">Instrument Workflow Protocols</h3>
                      <p className="text-xs text-slate-light mt-0.5">Standardized operational recipes for this unit.</p>
                    </div>
                    <button 
                      onClick={() => startEditing()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-dark text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-md"
                    >
                      <Plus size={14} />
                      Add Workflow
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {editingWorkflowId ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-lab-surface rounded-xl overflow-hidden shadow-lg"
                      >
                        <div className="px-6 py-4 border-b border-lab-surface flex items-center justify-between bg-slate-50">
                          <input 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Workflow Title (e.g. Daily Startup)"
                            className="bg-transparent font-bold text-slate-dark focus:outline-none placeholder:text-slate-light/50 w-full mr-4"
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => setEditingWorkflowId(null)}
                               className="p-1.5 hover:bg-critical/10 text-critical rounded-lg transition-colors"
                             >
                               <X size={18} />
                             </button>
                             <button 
                               onClick={handleSaveWorkflow}
                               className="p-1.5 hover:bg-success/10 text-success rounded-lg transition-colors"
                             >
                               <Save size={18} />
                             </button>
                          </div>
                        </div>
                        <div className="p-0">
                          <div className="px-6 py-2 bg-lab-bg/30 border-b border-lab-surface flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-light uppercase">Markdown Editor</span>
                            <span className="text-[9px] text-slate-light opacity-50 italic">Use 1) and 2) for steps</span>
                          </div>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="## 1) Preparation&#10;- Step 1...&#10;&#10;## 2) Execution&#10;- Step 2..."
                            className="w-full h-80 p-6 font-mono text-sm resize-none focus:outline-none text-slate-dark leading-relaxed"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        {sortedWorkflows.length > 0 ? (
                          sortedWorkflows.map((workflow) => (
                            <div 
                              key={workflow.id} 
                              className="bg-white border border-lab-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                              <button 
                                onClick={() => setExpandedWorkflowId(expandedWorkflowId === workflow.id ? null : workflow.id)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded-lg ${expandedWorkflowId === workflow.id ? 'bg-slate-dark text-white' : 'bg-lab-bg text-slate-light'}`}>
                                    <Clock size={16} />
                                  </div>
                                  <span className="font-bold text-slate-dark">{workflow.title}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditing(workflow);
                                    }}
                                    className="p-1.5 hover:bg-lab-bg rounded-lg text-slate-light hover:text-slate-dark transition-all"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <ChevronRight 
                                    size={18} 
                                    className={`text-slate-light transition-transform duration-300 ${expandedWorkflowId === workflow.id ? 'rotate-90' : ''}`} 
                                  />
                                </div>
                              </button>
                              
                              <AnimatePresence>
                                {expandedWorkflowId === workflow.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden border-t border-lab-surface"
                                  >
                                    <div className="p-8 prose prose-slate max-w-none prose-sm font-body bg-slate-50/50">
                                      <div className="markdown-body">
                                        <Markdown>{workflow.content}</Markdown>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 bg-white border border-lab-surface border-dashed rounded-2xl">
                            <div className="w-16 h-16 bg-lab-bg rounded-full flex items-center justify-center text-slate-light/40 mb-4">
                              <Plus size={32} />
                            </div>
                            <h4 className="font-bold text-slate-dark">No workflows created</h4>
                            <p className="text-xs text-slate-light mt-1 mb-6">Standardize operations for this instrument unit.</p>
                            <button 
                              onClick={() => startEditing()}
                              className="px-6 py-2.5 bg-slate-dark text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all"
                            >
                              Initialize First Protocol
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* AI Assistance Footer */}
                  <div className="p-4 bg-white border-t border-lab-surface">
                    <div className="p-4 border border-lab-surface rounded-xl bg-slate-dark/5 flex items-start gap-4">
                      <div className="p-2 bg-slate-dark rounded text-white mt-0.5">
                        <BrainCircuit size={14} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-dark mb-1">Workflow Guardian</h5>
                        <p className="text-xs text-slate-dark leading-relaxed opacity-70 italic">
                          "I monitor execution compliance in real-time. If you modify these recipes, I'll update my baseline models to avoid false positive anomaly alerts."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'manual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 overflow-y-auto">
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

