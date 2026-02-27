import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Users, AlertCircle, Activity, Signal, Map, LayoutGrid, ChevronLeft, UserCheck, Shield, Radio, Target, Clock, Megaphone, CheckCircle2, X, Lock } from 'lucide-react';

const cameras = Array.from({ length: 16 }, (_, i) => ({
  id: `CAM-${(i + 1).toString().padStart(2, '0')}`,
  zone: `Zone ${(Math.floor(i / 4) + 1).toString().padStart(2, '0')}`,
  occupancy: Math.floor(Math.random() * 50),
  status: Math.random() > 0.95 ? 'ALERT' : 'ACTIVE',
}));

// Initial positions for simulation
const INITIAL_STAFF = [
    { id: '8842-A', name: 'Alex C.', zone: 'Z-04', x: 75, y: 50, status: 'ACTIVE', role: 'Supervisor' },
    { id: '9921-B', name: 'Sarah M.', zone: 'Z-02', x: 25, y: 35, status: 'BUSY', role: 'Maintenance' },
    { id: '7732-C', name: 'David K.', zone: 'Z-01', x: 50, y: 85, status: 'IDLE', role: 'Security' },
    { id: '4451-D', name: 'James W.', zone: 'Z-03', x: 15, y: 15, status: 'ACTIVE', role: 'Tech' },
    { id: 'SEC-01', name: 'Team Alpha', zone: 'Z-02', x: 35, y: 45, status: 'ALERT', role: 'Response Unit' },
    { id: 'SEC-02', name: 'Team Bravo', zone: 'Z-04', x: 80, y: 60, status: 'ACTIVE', role: 'Response Unit' },
];

const ZONE_STATS = [
   { label: 'Zone 01', val: 45, max: 100, dwell: '25m', color: 'green' },
   { label: 'Zone 02', val: 82, max: 100, alert: true, dwell: '1h 10m', color: 'red' },
   { label: 'Zone 03', val: 24, max: 100, dwell: '15m', color: 'yellow' },
   { label: 'Zone 04', val: 56, max: 100, dwell: '45m', color: 'green' },
];

const HEATMAP_DATA = [
    { id: '01', val: 142, level: 'med' },
    { id: '02', val: 384, level: 'high' },
    { id: '03', val: 89, level: 'low' },
    { id: '04', val: 156, level: 'med' }
];

interface ZoneSurveillanceProps {
  hasHealthPulseAlert?: boolean;
}

const ZoneSurveillance: React.FC<ZoneSurveillanceProps> = ({ hasHealthPulseAlert }) => {
  const [viewMode, setViewMode] = useState<'CAMERAS' | 'MAP'>('CAMERAS');
  const [expandedCameraId, setExpandedCameraId] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState(INITIAL_STAFF);
  
  // Ushering Logic
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [notifiedStaffIds, setNotifiedStaffIds] = useState<string[]>([]);

  // Simulate Staff Movement
  useEffect(() => {
    const interval = setInterval(() => {
      setStaffMembers(prev => prev.map(staff => {
        // Small random movement
        const moveX = (Math.random() - 0.5) * 4;
        const moveY = (Math.random() - 0.5) * 4;
        
        // Clamp to 5-95% to stay on map
        const newX = Math.max(5, Math.min(95, staff.x + moveX));
        const newY = Math.max(5, Math.min(95, staff.y + moveY));
        
        return { ...staff, x: newX, y: newY };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const expandedCamera = expandedCameraId ? cameras.find(c => c.id === expandedCameraId) : null;

  // Calculate Live Stats
  const staffCountsByZone = staffMembers.reduce((acc, staff) => {
    // Normalize zone name: 'Z-04' -> 'Zone 04'
    const zoneNum = staff.zone.replace('Z-', '');
    const key = `Zone ${zoneNum}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalActiveStaff = staffMembers.length;
  const activeZonesCount = Object.keys(staffCountsByZone).length;
  const totalZones = 4;

  // Handle Ushering
  const handleUsherStaff = (staffId: string) => {
      setNotifiedStaffIds(prev => [...prev, staffId]);
      // Simulate status update
      setStaffMembers(prev => prev.map(s => s.id === staffId ? { ...s, status: 'USHERING' } : s));
  };

  const selectedZoneStaff = selectedZoneId 
    ? staffMembers.filter(s => s.zone === `Z-${selectedZoneId}`)
    : [];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#1a1d29] p-4 md:p-6 animate-fadeIn relative">
       
       {/* Full Screen Camera Overlay */}
       {expandedCamera && (
         <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-200">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setExpandedCameraId(null)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider font-mono">{expandedCamera.id}</h2>
                            <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
                                {expandedCamera.zone} 
                                <span className="w-1 h-1 rounded-full bg-gray-500"></span> 
                                LIVE FEED
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 pointer-events-auto">
                     <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-500 font-bold text-xs animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]"></div> REC
                     </div>
                     <button 
                        onClick={() => setExpandedCameraId(null)}
                        className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
                     >
                        <Minimize2 size={24} />
                     </button>
                </div>
            </div>

            {/* Main Feed Content */}
            <div className="flex-1 relative overflow-hidden bg-[#050505]">
                {/* Background Visuals for "Feed" */}
                <div className="absolute inset-0">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#1a1d29]/40 to-transparent"></div>
                     
                     {/* Scanning Line Effect */}
                     <div className="absolute inset-x-0 h-[2px] bg-white/10 top-0 animate-[scan_4s_linear_infinite] pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>
                     
                     {/* Tech Grid Overlay */}
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

                     {expandedCamera.status === 'ALERT' && (
                        <div className="absolute inset-0 border-[20px] border-red-500/20 animate-pulse pointer-events-none"></div>
                     )}

                     {/* Center Placeholder Icon */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <Activity size={300} className="text-white" />
                     </div>
                     
                     {/* Timestamp Overlay */}
                     <div className="absolute top-6 right-6 font-mono text-gray-500 text-sm opacity-50 z-10">
                        {new Date().toISOString()}
                     </div>
                </div>

                {/* HUD Elements */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row justify-between items-end bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none gap-4">
                    <div className="bg-black/60 backdrop-blur-md p-5 rounded-xl border border-white/10 text-white shadow-2xl pointer-events-auto w-full md:w-auto">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Users size={12} className="text-yellow-400"/> Zone Occupancy
                        </div>
                        <div className="text-5xl font-mono font-bold flex items-center gap-2 text-white">
                             {expandedCamera.occupancy} <span className="text-lg text-gray-500 font-medium self-end mb-1">Pax</span>
                        </div>
                    </div>
                    
                    {/* Fake PTZ Controls */}
                    <div className="flex gap-2 pointer-events-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        {['ZOOM +', 'ZOOM -', 'PAN', 'TILT'].map(label => (
                            <button key={label} className="px-5 py-2.5 bg-[#1a1d29]/80 backdrop-blur border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-yellow-400 hover:border-yellow-400 transition-all hover:bg-yellow-400/10 shadow-lg whitespace-nowrap">
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
         </div>
       )}

       {/* USHERING MODAL */}
       {selectedZoneId && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
               <div className="bg-[#2d3142] w-full max-w-md rounded-2xl border border-red-500/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                   <div className="p-4 border-b border-red-500/30 bg-red-500/10 flex justify-between items-center">
                       <div>
                           <h3 className="text-lg font-bold text-white flex items-center gap-2">
                               <AlertCircle size={20} className="text-red-500" />
                               High Density Alert: Zone {selectedZoneId}
                           </h3>
                           <p className="text-red-400 text-xs">Immediate Crowd Control Required</p>
                       </div>
                       <button onClick={() => setSelectedZoneId(null)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
                           <X size={20} />
                       </button>
                   </div>
                   
                   <div className="p-6">
                       <p className="text-sm text-gray-300 mb-4">
                           The following staff members are currently located in Zone {selectedZoneId}. Dispatch usher instructions to reduce crowd density.
                       </p>
                       
                       <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                           {selectedZoneStaff.length > 0 ? (
                               selectedZoneStaff.map(staff => {
                                   const isNotified = notifiedStaffIds.includes(staff.id);
                                   return (
                                       <div key={staff.id} className="flex items-center justify-between bg-[#1a1d29] p-3 rounded-xl border border-gray-700">
                                           <div className="flex items-center gap-3">
                                               <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold text-xs">
                                                   {staff.id.split('-')[1] || staff.name.charAt(0)}
                                               </div>
                                               <div>
                                                   <div className="font-bold text-white text-sm">{staff.name}</div>
                                                   <div className="text-xs text-gray-500">{staff.role} • {staff.id}</div>
                                               </div>
                                           </div>
                                           
                                           <button 
                                               onClick={() => handleUsherStaff(staff.id)}
                                               disabled={isNotified}
                                               className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                                   isNotified 
                                                   ? 'bg-green-500/20 text-green-500 cursor-default' 
                                                   : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                                               }`}
                                           >
                                               {isNotified ? (
                                                   <><CheckCircle2 size={12} /> Notified</>
                                               ) : (
                                                   <><Megaphone size={12} /> Usher</>
                                               )}
                                           </button>
                                       </div>
                                   );
                               })
                           ) : (
                               <div className="text-center py-8 text-gray-500 bg-[#1a1d29]/50 rounded-xl border border-dashed border-gray-700">
                                   <Users size={32} className="mx-auto mb-2 opacity-50" />
                                   <p>No active staff detected in this zone.</p>
                                   <button className="mt-2 text-yellow-400 text-xs hover:underline">Request Backup Unit</button>
                               </div>
                           )}
                       </div>
                   </div>
                   
                   <div className="p-4 bg-[#1a1d29] border-t border-gray-700 text-center">
                       <button onClick={() => setSelectedZoneId(null)} className="text-gray-400 text-xs hover:text-white">Close Alert Window</button>
                   </div>
               </div>
           </div>
       )}

       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 shrink-0 gap-4">
         <div>
           <h2 className="text-2xl font-bold text-white">Zone Surveillance</h2>
           <p className="text-gray-400 text-sm">Real-time tracking and occupancy analytics</p>
         </div>
         <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* View Toggle */}
            <div className="bg-[#2d3142] p-1 rounded-lg border border-gray-700 flex">
                <button 
                    onClick={() => setViewMode('CAMERAS')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'CAMERAS' ? 'bg-[#1a1d29] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    <LayoutGrid size={14} /> <span className="hidden sm:inline">Cameras</span>
                </button>
                <button 
                    onClick={() => setViewMode('MAP')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'MAP' ? 'bg-[#1a1d29] text-yellow-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    <Map size={14} /> <span className="hidden sm:inline">Live Map</span>
                </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-[#2d3142] rounded-lg border border-gray-700">
                <Signal size={14} className="text-green-500" />
                <span className="text-xs text-gray-300 font-mono hidden sm:inline">NET: 1.2 GB/s</span>
            </div>
         </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 min-h-[500px] lg:min-h-[400px] mb-6 bg-[#000] rounded-xl border border-[#2d3142] shadow-2xl overflow-hidden relative flex flex-col lg:flex-row">
         
         {viewMode === 'CAMERAS' ? (
             <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-auto md:grid-rows-4 gap-1 h-full w-full p-1 md:overflow-y-auto lg:overflow-visible">
                {cameras.map((cam) => (
                  <div key={cam.id} className="relative bg-[#111] rounded overflow-hidden group cursor-pointer hover:ring-1 hover:ring-yellow-400 transition-all aspect-video lg:aspect-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1d29] to-[#0d0f14] opacity-80"></div>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-transparent to-black"></div>
                    <div className="absolute inset-x-0 h-[2px] bg-white/5 top-0 animate-[scan_3s_linear_infinite] pointer-events-none opacity-50"></div>

                    {cam.status === 'ALERT' && (
                        <div className="absolute inset-0 border-2 border-red-500 animate-pulse bg-red-500/10 z-10"></div>
                    )}

                    <div className="absolute top-2 left-2 flex gap-1 z-20">
                      <span className="px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-gray-300 backdrop-blur-sm font-mono border border-white/10">
                        {cam.zone}
                      </span>
                    </div>
                    
                    <div className="absolute top-2 right-2 z-20">
                       <span className="px-1.5 py-0.5 bg-black/60 rounded text-[9px] text-gray-300 backdrop-blur-sm font-mono flex items-center gap-1 border border-white/10">
                        {cam.status === 'ALERT' ? <AlertCircle size={8} className="text-red-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                        {cam.id}
                       </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-between items-end opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-yellow-400 font-bold">
                          <Users size={10} />
                          {cam.occupancy}
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCameraId(cam.id);
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Maximize2 size={12} />
                        </button>
                    </div>
                  </div>
                ))}
             </div>
         ) : (
             <>
                 {/* Map Area */}
                 <div className="flex-1 bg-[#0f1115] relative overflow-hidden min-h-[300px]">
                    {/* SVG Map Background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg className="w-[90%] h-[90%] drop-shadow-2xl" viewBox="0 0 100 100">
                            {/* Grid Background */}
                            <defs>
                                <pattern id="smallGrid" width="2" height="2" patternUnits="userSpaceOnUse">
                                    <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#2d3142" strokeWidth="0.1" opacity="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#smallGrid)" />

                            {/* Connection Lines */}
                            <path d="M 50 80 L 50 50 L 25 40" stroke="#3e445b" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
                            <path d="M 50 50 L 75 45" stroke="#3e445b" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />

                            {/* Zone 1: Entrance */}
                            <path d="M 40 95 L 60 95 L 60 80 L 40 80 Z" fill="#1a1d29" stroke="#22c55e" strokeWidth="0.5" className="opacity-50" />
                            <rect x="40" y="80" width="20" height="15" fill="url(#smallGrid)" opacity="0.3" />
                            <text x="50" y="90" fontSize="3" fill="#22c55e" textAnchor="middle" fontWeight="bold">ZONE 01</text>
                            <text x="50" y="93" fontSize="2" fill="#4ade80" textAnchor="middle">ENTRANCE</text>

                            {/* Zone 2: Shadow Forest */}
                            <path d="M 5 50 L 45 50 L 40 30 L 10 30 Z" fill="#1a1d29" stroke="#ef4444" strokeWidth="0.5" className="opacity-50" />
                            <text x="25" y="42" fontSize="3" fill="#ef4444" textAnchor="middle" fontWeight="bold">ZONE 02</text>
                            <text x="25" y="45" fontSize="2" fill="#f87171" textAnchor="middle">SHADOW FOREST</text>

                            {/* Zone 3: Service */}
                            <rect x="5" y="5" width="25" height="20" fill="#1a1d29" stroke="#eab308" strokeWidth="0.5" className="opacity-50" />
                            <text x="17.5" y="15" fontSize="3" fill="#eab308" textAnchor="middle" fontWeight="bold">ZONE 03</text>
                            <text x="17.5" y="18" fontSize="2" fill="#facc15" textAnchor="middle">MAINTENANCE</text>

                            {/* Zone 4: Deep Caverns */}
                            <path d="M 55 70 L 95 70 L 90 20 L 60 20 Z" fill="#1a1d29" stroke="#22c55e" strokeWidth="0.5" className="opacity-50" />
                            <text x="75" y="45" fontSize="3" fill="#22c55e" textAnchor="middle" fontWeight="bold">ZONE 04</text>
                            <text x="75" y="48" fontSize="2" fill="#4ade80" textAnchor="middle">DEEP CAVERNS</text>

                        </svg>
                    </div>

                    {/* Live Staff Markers */}
                    {staffMembers.map(staff => (
                        <div 
                            key={staff.id}
                            className="absolute flex flex-col items-center group z-10 cursor-pointer transition-all duration-1000 ease-linear"
                            style={{ left: `${staff.x}%`, top: `${staff.y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#1a1d29] shadow-lg ${
                                staff.status === 'ALERT' ? 'bg-red-500 animate-pulse' :
                                staff.status === 'BUSY' ? 'bg-yellow-400' : 
                                staff.status === 'USHERING' ? 'bg-purple-500' : 'bg-blue-500'
                            }`}>
                                <div className={`absolute w-10 h-10 rounded-full opacity-20 animate-ping ${
                                    staff.status === 'ALERT' ? 'bg-red-500' : 
                                    staff.status === 'BUSY' ? 'bg-yellow-400' : 
                                    staff.status === 'USHERING' ? 'bg-purple-500' : 'bg-blue-500'
                                }`}></div>
                                <span className="text-[8px] font-bold text-[#1a1d29]">
                                    {staff.id.split('-')[1] || 'S'}
                                </span>
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-[#1a1d29]/95 border border-yellow-400/30 rounded-lg text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl backdrop-blur-sm">
                                <div className="font-bold text-xs text-yellow-400">{staff.name}</div>
                                <div className="text-[10px] text-gray-400 font-mono">ID: {staff.id}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{staff.status}</div>
                                {/* Little arrow */}
                                <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-[#1a1d29] border-r border-b border-yellow-400/30 -translate-x-1/2 rotate-45"></div>
                            </div>
                        </div>
                    ))}
                 </div>

                 {/* Side Stats Box */}
                 <div className="w-full lg:w-80 bg-[#1a1d29] border-t lg:border-t-0 lg:border-l border-[#2d3142] flex flex-col h-[250px] lg:h-full">
                    <div className="p-4 md:p-5 border-b border-[#2d3142] bg-[#2d3142]/30">
                        <div className="flex items-center gap-2 mb-1">
                            <Radio size={16} className="text-red-500 animate-pulse"/> 
                            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Live Staff Tracking</h3>
                        </div>
                        <p className="text-[10px] text-gray-500">Real-time GPS positioning • Update: &lt;1s</p>
                    </div>

                    <div className="p-4 md:p-6 border-b border-[#2d3142] hidden lg:block">
                        <div className="flex justify-between items-end mb-2">
                             <div className="text-gray-400 text-xs font-bold uppercase">Total Active</div>
                             <div className="flex items-center gap-1.5 text-[10px] text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full border border-green-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Online
                             </div>
                        </div>
                        <div className="text-5xl font-mono font-bold text-white mb-4">{totalActiveStaff}</div>
                        
                        <div className="space-y-2">
                             <div className="flex justify-between text-xs text-gray-400">
                                <span>Zones Covered</span>
                                <span className="text-white font-bold">{activeZonesCount} / {totalZones}</span>
                             </div>
                             <div className="w-full h-1.5 bg-[#2d3142] rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(activeZonesCount/totalZones)*100}%` }}></div>
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                         <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 px-1">Staff Distribution</div>
                         
                         {['Zone 01', 'Zone 02', 'Zone 03', 'Zone 04'].map((zoneName) => {
                             const count = staffCountsByZone[zoneName] || 0;
                             const hasStaff = count > 0;
                             
                             return (
                                 <div key={zoneName} className={`p-3 rounded-lg border flex justify-between items-center transition-all ${
                                     hasStaff ? 'bg-[#2d3142]/50 border-gray-700' : 'bg-transparent border-gray-800 opacity-50'
                                 }`}>
                                     <div className="flex items-center gap-3">
                                         <div className={`w-2 h-2 rounded-full ${hasStaff ? 'bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'bg-gray-600'}`}></div>
                                         <span className="text-xs font-bold text-gray-300">{zoneName}</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                         <Users size={12} className={hasStaff ? "text-gray-400" : "text-gray-600"}/>
                                         <span className={`font-mono font-bold ${hasStaff ? "text-white" : "text-gray-600"}`}>{count}</span>
                                     </div>
                                 </div>
                             );
                         })}
                    </div>
                 </div>
             </>
         )}
       </div>

       {/* Bottom Widgets */}
       <div className="shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
         
         {/* Guest Density Heatmap */}
         <div className="lg:col-span-8 bg-[#2d3142] rounded-xl border border-white/5 p-4 flex flex-col shadow-lg overflow-hidden h-60">
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                 <Activity size={14} className="text-yellow-400"/> Guest Density Heatmap
               </h3>
               <div className="flex gap-3 text-[10px]">
                 <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-sm bg-yellow-900/50 border border-yellow-700"></div> Low</span>
                 <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-sm bg-yellow-500"></div> Med</span>
                 <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-sm bg-red-500"></div> High</span>
               </div>
            </div>
            
            <div className="flex-1 flex gap-3 min-h-0 overflow-x-auto pb-1">
                {HEATMAP_DATA.map((zone) => {
                    const isHigh = zone.level === 'high';
                    return (
                        <button
                            key={zone.id} 
                            onClick={() => isHigh && setSelectedZoneId(zone.id)}
                            disabled={!isHigh}
                            className={`min-w-[100px] flex-1 rounded-lg border relative group overflow-hidden transition-all duration-300 flex flex-col justify-between p-3 text-left
                                ${isHigh 
                                  ? 'bg-red-900/20 border-red-500/30 hover:bg-red-900/30 cursor-pointer hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-1' 
                                  : zone.level === 'med' 
                                    ? 'bg-yellow-900/20 border-yellow-500/30 opacity-70 cursor-default' 
                                    : 'bg-green-900/20 border-green-500/30 opacity-70 cursor-default'}
                            `}
                        >
                            {/* Background Pulse for High Only */}
                            {isHigh && (
                                <div className="absolute inset-0 bg-red-500 opacity-10 blur-xl animate-pulse pointer-events-none"></div>
                            )}

                            <div className={`relative z-10 text-xs font-bold uppercase tracking-wider mb-2 flex justify-between items-start
                                ${zone.level === 'high' ? 'text-red-400' : 
                                  zone.level === 'med' ? 'text-yellow-400' : 
                                  'text-green-400'}
                            `}>
                                <span>Zone {zone.id}</span>
                                {isHigh ? (
                                    <AlertCircle size={14} className="animate-pulse" />
                                ) : (
                                    <div className="opacity-50">
                                        <Lock size={12} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="relative z-10 text-right mt-auto">
                                <div className="text-3xl font-bold text-white drop-shadow-lg tracking-tight leading-none mb-1">
                                    {zone.val}
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Guests</div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">Tap a <span className="text-red-400 font-bold">HIGH DENSITY</span> zone to dispatch ushering teams. Standard zones are monitored automatically.</p>
         </div>

         {/* Occupancy Stats */}
         <div className="lg:col-span-4 bg-[#2d3142] rounded-xl border border-white/5 p-4 flex flex-col shadow-lg overflow-hidden h-60">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 flex-shrink-0">Zone Operations</h3>
            
            <div className="flex text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-2 px-1 border-b border-gray-700/50 pb-1 flex-shrink-0">
                <span className="flex-1">Zone</span>
                <span className="w-14 text-right">Dwell</span>
                <span className="w-12 text-right">Pax</span>
                <span className="w-12 text-right">Staff</span>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
               {ZONE_STATS.map((item, i) => (
                   <div key={i} className="group hover:bg-white/5 p-1.5 rounded transition-colors">
                       <div className="flex justify-between items-center text-[10px] mb-1.5">
                           <span className="text-gray-300 font-medium">{item.label}</span>
                           <div className="flex items-center gap-2">
                                {/* Dwell Time */}
                                <div className="w-14 text-right">
                                    <span className="text-gray-500 flex items-center justify-end gap-1">
                                        <Clock size={8} /> {item.dwell}
                                    </span>
                                </div>
                                {/* Guest Count */}
                                <div className="w-12 text-right">
                                    <span className={item.alert ? "text-red-400 font-bold" : "text-gray-400"}>{item.val}%</span>
                                </div>
                                {/* Staff Count */}
                                <div className="w-12 text-right">
                                    <span className="text-blue-400 font-mono font-bold">
                                        {staffCountsByZone[item.label] || 0}
                                    </span>
                                </div>
                           </div>
                       </div>
                       <div className="h-1 bg-[#1a1d29] rounded-full overflow-hidden border border-white/5 flex">
                           {/* Guest Bar */}
                           <div 
                              className={`h-full transition-all duration-1000 ease-out ${item.alert ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-yellow-400'}`} 
                              style={{ width: `${item.val}%` }}
                           ></div>
                       </div>
                   </div>
               ))}
            </div>
            
            <div className="pt-2 mt-2 border-t border-gray-700/50 flex flex-col gap-1 shrink-0">
               <div className="flex justify-between items-center">
                   <span className="text-[10px] text-gray-500 uppercase font-bold">Total Guests</span>
                   <span className="text-sm font-mono font-bold text-white">771 / 1500</span>
               </div>
               <div className="flex justify-between items-center">
                   <span className="text-[10px] text-gray-500 uppercase font-bold">Total Active Staff</span>
                   <span className="text-sm font-mono font-bold text-blue-400 flex items-center gap-2">
                       <UserCheck size={12} /> {totalActiveStaff}
                   </span>
               </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default ZoneSurveillance;