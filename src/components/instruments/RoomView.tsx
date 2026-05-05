import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Save, 
  Edit3, 
  GripHorizontal, 
  X,
  Map as MapIcon,
  MousePointer2,
  AlertCircle
} from 'lucide-react';
import { Instrument } from '../../types';

interface RoomViewProps {
  instruments: Instrument[];
  allRooms: string[];
  activeRoom: string;
  onSelectRoom: (room: string) => void;
  onSelectInstrument: (instrument: Instrument) => void;
  onUpdateInstrument: (instrument: Instrument) => void;
  onAddInstrument: (name: string, type: string) => void;
}

export default function RoomView({ 
  instruments, 
  allRooms,
  activeRoom,
  onSelectRoom,
  onSelectInstrument, 
  onUpdateInstrument,
  onAddInstrument 
}: RoomViewProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Chromatography');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const GRID_SIZE = 24;

  const snapToGrid = (val: number) => Math.round(val / GRID_SIZE) * GRID_SIZE;

  const handleDrag = (event: any, info: any, instrumentId: string) => {
    if (!isEditMode) return;
    setActiveDragId(instrumentId);
    setDragPos({ x: info.point.x, y: info.point.y });
  };

  const handleDragEnd = (event: any, info: any, instrument: Instrument) => {
    if (!isEditMode) return;
    setActiveDragId(null);
    
    // Calculate new position with snapping
    const newX = snapToGrid((instrument.position?.x || 0) + info.offset.x);
    const newY = snapToGrid((instrument.position?.y || 0) + info.offset.y);
    
    // Boundary checks
    const boundedPos = {
      x: Math.max(0, Math.min(newX, 800)),
      y: Math.max(0, Math.min(newY, 500))
    };

    onUpdateInstrument({
      ...instrument,
      position: boundedPos
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-critical';
      case 'warning': return 'bg-warning';
      case 'operational': return 'bg-success';
      default: return 'bg-slate-light/40';
    }
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddInstrument(newName, newType);
      setNewName('');
      setShowAddModal(false);
    }
  };

  // Find alignment candidates for current drag
  const currentDraggingInst = instruments.find(i => i.id === activeDragId);
  const alignmentGuides = activeDragId ? instruments.filter(i => i.id !== activeDragId).map(i => ({
    x: i.position?.x || 0,
    y: i.position?.y || 0,
  })) : [];

  const isAlignedX = (x: number) => alignmentGuides.some(g => Math.abs(g.x - x) < 5);
  const isAlignedY = (y: number) => alignmentGuides.some(g => Math.abs(g.y - y) < 5);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* View Toolbar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-light uppercase tracking-widest mb-0.5">Active Space</span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-dark">{activeRoom}</h3>
              <div className="relative group">
                <button className="p-1 hover:bg-lab-surface rounded transition-colors text-slate-light">
                  <Edit3 size={12} />
                </button>
                <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white border border-lab-surface shadow-lg rounded-md p-1 z-[60] min-w-[120px]">
                  {allRooms.map(room => (
                    <button
                      key={room}
                      onClick={() => onSelectRoom(room)}
                      className={`w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors ${activeRoom === room ? 'bg-slate-dark text-white' : 'text-slate-dark hover:bg-lab-bg'}`}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-lab-surface mx-2" />

          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-light">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_4px_rgba(34,197,94,0.4)]" /> Healthy
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning shadow-[0_0_4px_rgba(245,158,11,0.4)]" /> Warning
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-critical shadow-[0_0_4px_rgba(239,68,68,0.4)]" /> Critical
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-white border border-lab-surface px-3 py-1.5 rounded text-xs font-bold text-slate-dark hover:bg-slate-50 transition-all"
              >
                <Plus size={14} /> Add Instrument
              </button>
              <button 
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 bg-slate-dark text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-black transition-all shadow-sm"
              >
                <Save size={14} /> Save Layout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 bg-white border border-lab-surface px-4 py-1.5 rounded text-xs font-bold text-slate-dark hover:bg-slate-50 transition-all shadow-sm"
            >
              <Edit3 size={14} /> Edit Room
            </button>
          )}
        </div>
      </div>

      {/* Room Diagram */}
      <div 
        ref={containerRef}
        className={`flex-1 relative bg-[#fcfcfd] border-2 border-lab-surface rounded-xl overflow-hidden shadow-inner ${isEditMode ? 'cursor-crosshair' : 'cursor-default'}`}
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
        }}
      >
        {/* Alignment Guides */}
        {activeDragId && (
          <>
             {isAlignedX(snapToGrid((currentDraggingInst?.position?.x || 0))) && (
               <div className="absolute top-0 bottom-0 w-[1px] bg-slate-light/30 border-l border-dashed pointer-events-none" style={{ left: snapToGrid(currentDraggingInst?.position?.x || 0) + 12 }} />
             )}
             {isAlignedY(snapToGrid((currentDraggingInst?.position?.y || 0))) && (
               <div className="absolute left-0 right-0 h-[1px] bg-slate-light/30 border-t border-dashed pointer-events-none" style={{ top: snapToGrid(currentDraggingInst?.position?.y || 0) + 12 }} />
             )}
          </>
        )}

        {instruments.map((instrument) => (
          <motion.div
            key={instrument.id}
            drag={isEditMode}
            dragMomentum={false}
            onDrag={(e, info) => handleDrag(e, info, instrument.id)}
            onDragEnd={(e, info) => handleDragEnd(e, info, instrument)}
            style={{ 
              x: instrument.position?.x || 0, 
              y: instrument.position?.y || 0,
              position: 'absolute'
            }}
            initial={false}
            whileHover={{ scale: isEditMode ? 1.02 : 1.01 }}
            className={`group p-3 rounded-lg border bg-white shadow-sm flex flex-col gap-2 min-w-[140px] max-w-[180px] select-none transition-shadow ${
              isEditMode 
                ? 'border-dashed border-slate-light/60 cursor-grab active:cursor-grabbing hover:shadow-md ring-2 ring-transparent active:ring-slate-light/20' 
                : 'border-lab-surface cursor-pointer hover:border-slate-light'
            }`}
            onClick={() => !isEditMode && onSelectInstrument(instrument)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(instrument.status)}`} />
                <span className="text-[11px] font-bold text-slate-dark truncate uppercase tracking-tight">
                  {instrument.name}
                </span>
              </div>
              {isEditMode && (
                <div className="text-slate-light/40 group-hover:text-slate-light transition-colors">
                  <GripHorizontal size={14} />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-1">
               <span className="text-[9px] font-mono text-slate-light/60 uppercase">{instrument.id}</span>
               {!isEditMode && (
                 <motion.span 
                   initial={{ opacity: 0 }}
                   whileHover={{ opacity: 1 }}
                   className="text-[9px] font-bold text-slate-dark flex items-center gap-0.5"
                 >
                   View <Plus size={8} />
                 </motion.span>
               )}
            </div>

            {/* Spatial Indicator */}
            {isEditMode && (
              <div className="pt-2 border-t border-lab-surface flex justify-between text-[8px] font-mono text-slate-light">
                 <span>X: {Math.round(instrument.position?.x || 0)}</span>
                 <span>Y: {Math.round(instrument.position?.y || 0)}</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Empty State Instructions */}
        {instruments.length === 0 && (
           <div className="h-full flex items-center justify-center text-slate-light/40 flex-col gap-2">
              <MapIcon size={48} strokeWidth={1} />
              <p className="font-sans text-sm font-medium">No instruments mapped to this space.</p>
           </div>
        )}
      </div>

      {/* Add Instrument Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl border border-lab-surface w-full max-w-md relative z-10 overflow-hidden"
            >
              <form onSubmit={handleSubmitAdd}>
                <div className="p-6 border-b border-lab-surface flex items-center justify-between">
                  <h3 className="font-sans font-bold flex items-center gap-2">
                    <Plus size={18} /> Add New Instrument
                  </h3>
                  <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-light hover:text-slate-dark transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-light uppercase mb-1.5 tracking-widest">Instrument Name</label>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Mass Spectrometer QX-2"
                      required
                      autoFocus
                      className="w-full bg-lab-bg border border-lab-surface rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-dark/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-light uppercase mb-1.5 tracking-widest">Scientific Category</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full bg-lab-bg border border-lab-surface rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-dark/10"
                    >
                      <option>Chromatography</option>
                      <option>Spectrometry</option>
                      <option>Resonance</option>
                      <option>Centrifugation</option>
                      <option>Cell Culture</option>
                    </select>
                  </div>
                </div>
                <div className="p-6 bg-lab-bg/50 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-light hover:text-slate-dark transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-slate-dark text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all"
                  >
                    Deploy to Floor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
