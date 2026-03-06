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
                                    <Users size={12} className="text-yellow-400" /> Zone Occupancy
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
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isNotified
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
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#2d3142] rounded-lg border border-gray-700">
                        <Signal size={14} className="text-green-500" />
                        <span className="text-xs text-gray-300 font-mono hidden sm:inline">NET: 1.2 GB/s</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-[500px] lg:min-h-[400px] mb-6 bg-[#000] rounded-xl border border-[#2d3142] shadow-2xl overflow-hidden relative flex flex-col lg:flex-row">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 h-full w-full p-2 overflow-y-auto">
                    {cameras.map((cam) => (
                        <div key={cam.id} className="relative bg-[#111] rounded overflow-hidden group cursor-pointer hover:ring-1 hover:ring-yellow-400 transition-all aspect-video">
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
            </div>


        </div>
    );
};

export default ZoneSurveillance;
