import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Activity, ShieldCheck, X, LayoutList, Map as MapIcon } from 'lucide-react';
import { Instrument } from '../../types';
import RoomView from './RoomView';

interface InstrumentExplorerProps {
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
}

export default function InstrumentExplorer({ instruments: initialInstruments, onSelectInstrument }: InstrumentExplorerProps) {
  const [viewMode, setViewMode] = useState<'list' | 'room'>('list');
  const [fleetInstruments, setFleetInstruments] = useState<Instrument[]>(initialInstruments);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Sync with props if they change
  useEffect(() => {
    setFleetInstruments(initialInstruments);
  }, [initialInstruments]);

  const { floors, rooms } = useMemo(() => {
    const f = new Set<string>();
    const r = new Set<string>();
    fleetInstruments.forEach(inst => {
      f.add(inst.floor);
      r.add(inst.room);
    });
    return { floors: Array.from(f).sort(), rooms: Array.from(r).sort() };
  }, [fleetInstruments]);

  const filteredInstruments = fleetInstruments.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase()) || 
                         inst.id.toLowerCase().includes(search.toLowerCase());
    const matchesFloor = selectedFloor ? inst.floor === selectedFloor : true;
    const matchesRoom = viewMode === 'room' && selectedRoom 
      ? inst.room === selectedRoom 
      : (selectedRoom ? inst.room === selectedRoom : true);
    return matchesSearch && matchesFloor && matchesRoom;
  });

  // For Room View, if no room is selected, default to the first available room
  useEffect(() => {
    if (viewMode === 'room' && !selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0]);
    }
  }, [viewMode, rooms, selectedRoom]);

  const { priorityInstruments, instrumentsByRoom, sortedRooms } = useMemo(() => {
    const priority = filteredInstruments.filter(i => i.status === 'critical' || i.status === 'warning');
    
    const groups: Record<string, Instrument[]> = {};
    filteredInstruments.forEach(inst => {
      const r = inst.room;
      if (!groups[r]) groups[r] = [];
      groups[r].push(inst);
    });
    
    return { 
      priorityInstruments: priority, 
      instrumentsByRoom: groups,
      sortedRooms: Object.keys(groups).sort()
    };
  }, [filteredInstruments]);

  const InstrumentCard = ({ instrument }: { instrument: Instrument }) => (
    <motion.div
      key={instrument.id}
      whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.01)' }}
      onClick={() => onSelectInstrument(instrument)}
      className="bg-white border border-lab-surface p-3 rounded-lg flex items-center gap-4 cursor-pointer group transition-all"
    >
      <div className={`w-1 h-8 rounded-full ${
        instrument.status === 'critical' ? 'bg-critical shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
        instrument.status === 'warning' ? 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 
        instrument.status === 'operational' ? 'bg-success' : 'bg-slate-light/20'
      }`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-bold text-[13px] text-slate-dark group-hover:text-black transition-colors truncate">{instrument.name}</h3>
          <span className="text-[8px] font-mono text-slate-light font-bold px-1 py-0.5 bg-lab-bg rounded border border-lab-surface uppercase shrink-0">
            {instrument.id}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-slate-light font-semibold uppercase tracking-wider truncate">
          <span className="flex items-center gap-1">
            {instrument.type}
          </span>
          <span className="opacity-30">•</span>
          <span className="truncate">{instrument.location}</span>
        </div>
      </div>

      <div className="bg-lab-bg p-2 rounded group-hover:bg-slate-dark group-hover:text-white transition-colors duration-200 shrink-0">
        <Activity size={12} />
      </div>
    </motion.div>
  );

  const handleUpdateInstrument = (updated: Instrument) => {
    setFleetInstruments(prev => prev.map(inst => inst.id === updated.id ? updated : inst));
  };

  const handleAddInstrument = (name: string, type: string) => {
    const newInstrument: Instrument = {
      id: `NEW-${Math.floor(Math.random() * 1000)}`,
      name,
      type,
      status: 'idle',
      healthScore: 100,
      lastCalibrated: new Date().toISOString().split('T')[0],
      location: 'Unassigned',
      floor: selectedFloor || floors[0] || '1',
      room: selectedRoom || rooms[0] || '1',
      position: { x: 50, y: 50 },
      aiInsights: ['AI Agent standby: Baseline monitoring initiated.'],
      predictions: [],
      anomalies: [],
      recommendations: [],
      logs: [{ id: Date.now().toString(), timestamp: new Date().toISOString(), level: 'SYSTEM', message: 'Instrument provisioned and added to digital twin.' }]
    };
    setFleetInstruments(prev => [...prev, newInstrument]);
  };

  const resetFilters = () => {
    setSelectedFloor(null);
    setSelectedRoom(null);
  };

  return (
    <section className="flex-1 h-full bg-lab-bg flex flex-col p-8 overflow-hidden relative">
      <div className="mb-6">
        <h2 className="text-2xl font-sans font-bold text-slate-dark uppercase tracking-tight mb-4">Fleet Status & Control</h2>
        
        <div className="flex items-center justify-between">
          {/* Left Part: Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
            <input 
              type="text" 
              placeholder="Search ID / Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-lab-surface rounded pl-9 pr-4 h-9 text-[11px] font-bold w-80 focus:outline-none focus:ring-1 focus:ring-slate-dark/10 transition-all font-mono shadow-sm"
            />
          </div>

          {/* Right Part: Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 h-9 rounded text-[11px] font-bold transition-colors border shadow-sm ${
                  showFilters || selectedFloor || selectedRoom 
                    ? 'bg-slate-dark text-white border-slate-dark' 
                    : 'bg-white border-lab-surface text-slate-dark hover:bg-slate-50'
                }`}
              >
                <Filter size={14} />
                Filters
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-lab-surface shadow-xl rounded z-50 p-3"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-light">Active Filters</span>
                      <button onClick={resetFilters} className="text-[9px] uppercase font-bold text-critical hover:underline">Clear</button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-light uppercase mb-1.5">Floor</label>
                        <div className="flex flex-wrap gap-1.5">
                          {floors.map(floor => (
                            <button
                              key={floor}
                              onClick={() => setSelectedFloor(selectedFloor === floor ? null : floor)}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                                selectedFloor === floor 
                                  ? 'bg-slate-dark text-white border-slate-dark' 
                                  : 'bg-lab-bg text-slate-dark border-lab-surface hover:bg-lab-surface'
                              }`}
                            >
                              {floor}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-light uppercase mb-1.5">Room Space</label>
                        <div className="flex flex-wrap gap-1.5">
                          {rooms.map(room => (
                            <button
                              key={room}
                              onClick={() => setSelectedRoom(selectedRoom === room ? null : room)}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                                selectedRoom === room 
                                  ? 'bg-slate-dark text-white border-slate-dark' 
                                  : 'bg-lab-bg text-slate-dark border-lab-surface hover:bg-lab-surface'
                              }`}
                            >
                              {room}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-[1px] bg-lab-surface mx-1" />

            <div className="flex items-center bg-white border border-lab-surface p-0.5 rounded shadow-sm h-9">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 h-full rounded transition-all flex items-center gap-1.5 text-[11px] font-bold ${viewMode === 'list' ? 'bg-slate-dark text-white shadow-sm' : 'text-slate-light hover:text-slate-dark'}`}
              >
                <LayoutList size={12} /> List
              </button>
              <button 
                onClick={() => setViewMode('room')}
                className={`px-3 h-full rounded transition-all flex items-center gap-1.5 text-[11px] font-bold ${viewMode === 'room' ? 'bg-slate-dark text-white shadow-sm' : 'text-slate-light hover:text-slate-dark'}`}
              >
                <MapIcon size={12} /> Room
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-hidden flex flex-col">
        {viewMode === 'list' && (
          <div className="mb-4 flex items-center gap-2 px-2">
            {selectedFloor && (
              <span className="bg-slate-dark text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                Floor: {selectedFloor}
                <X size={10} className="cursor-pointer" onClick={() => setSelectedFloor(null)} />
              </span>
            )}
            {selectedRoom && (
              <span className="bg-slate-dark text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                Room: {selectedRoom}
                <X size={10} className="cursor-pointer" onClick={() => setSelectedRoom(null)} />
              </span>
            )}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div 
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Priority Section */}
                {priorityInstruments.length > 0 && !search && (
                  <div>
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <div className="w-2 h-2 rounded-full bg-critical animate-pulse" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-critical">Priority Action Required</h4>
                      <div className="flex-1 h-[1px] bg-critical/10" />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {priorityInstruments.map(inst => (
                        <InstrumentCard key={inst.id} instrument={inst} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Grouped by Room */}
                {sortedRooms.map(room => (
                  <div key={room}>
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-light">Room: {room}</h4>
                      <div className="flex-1 h-[1px] bg-lab-surface" />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {instrumentsByRoom[room].map(inst => (
                        <InstrumentCard key={inst.id} instrument={inst} />
                      ))}
                    </div>
                  </div>
                ))}

                {filteredInstruments.length === 0 && (
                  <div className="text-center py-20 bg-white border border-lab-surface rounded-xl border-dashed">
                    <p className="text-sm text-slate-light">No instruments match current filter criteria.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="room-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <RoomView 
                  instruments={filteredInstruments} 
                  allRooms={rooms}
                  activeRoom={selectedRoom || rooms[0] || 'Unassigned'}
                  onSelectRoom={setSelectedRoom}
                  onSelectInstrument={onSelectInstrument}
                  onUpdateInstrument={handleUpdateInstrument}
                  onAddInstrument={handleAddInstrument}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
