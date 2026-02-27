import React, { useState } from 'react';
import { ShieldAlert, Crosshair, QrCode as QrCodeIcon, Camera, Siren, CheckCircle2, AlertTriangle, Eye, Image as ImageIcon, Map, Search, Lock, Unlock } from 'lucide-react';
import { Incident } from '../types';

interface SecurityDashboardProps {
    incidents: Incident[];
    onJumpToSurveillance: (zoneId: string) => void;
    onMedicalEscalation: (zoneId: string, description: string) => void;
    onScanArrival: (id: string, timestamp: Date) => void;
    onLogEvidence: (id: string) => void;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
    incidents,
    onJumpToSurveillance,
    onMedicalEscalation,
    onScanArrival,
    onLogEvidence
}) => {
    const [scanningIncidentId, setScanningIncidentId] = useState<string | null>(null);
    const [scanProgress, setScanProgress] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const activeIncidents = incidents.filter(i =>
        i.status !== 'RESOLVED' &&
        (i.id.toLowerCase().includes(searchTerm.toLowerCase()) || i.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleStartScan = (id: string) => {
        setScanningIncidentId(id);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        onScanArrival(id, new Date());
                        setScanningIncidentId(null);
                    }, 1000);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className="text-blue-500 animate-pulse" size={28} /> Security Tactical Command
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mt-1">Unified incident response and compliance audit trail.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search Incidents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#2d3142] border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pb-6">

                {/* Tactical Incident Feed */}
                <div className="bg-[#2d3142]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-2xl flex flex-col h-full min-h-[500px]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Crosshair className="text-red-400" /> Priority Operations Feed
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {activeIncidents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500 italic opacity-50">
                                <ShieldAlert size={48} className="mb-4 text-gray-700" />
                                <span>No active alerts detected in BOH sectors.</span>
                            </div>
                        ) : (
                            activeIncidents.map(inc => (
                                <div key={inc.id} className={`bg-[#1a1d29]/80 border rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${inc.severity === 'High' ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-gray-700/50 hover:border-blue-500/30'}`}>
                                    {inc.severity === 'High' && (
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-red-600 animate-pulse" />
                                    )}

                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`font-bold text-base ${inc.severity === 'High' ? 'text-red-400' : 'text-white'}`}>{inc.type}</h4>
                                                {inc.severity === 'High' && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-mono text-gray-500 uppercase tracking-tighter bg-black/40 px-2 py-0.5 rounded">{inc.id}</span>
                                                <span className="text-[11px] text-gray-400 flex items-center gap-1 font-bold">
                                                    <Map size={10} /> {inc.zone_id || 'Global'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] px-3 py-1 rounded-full border uppercase tracking-widest font-black ${inc.severity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    inc.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-green-500/10 text-green-500 border-green-500/20'
                                                }`}>
                                                {inc.severity} PRIORITY
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-5 leading-relaxed bg-[#2d3142]/30 p-3 rounded-lg border border-white/5">{inc.description}</p>

                                    <div className="space-y-2 mb-5">
                                        {inc.arrivalTimestamp && (
                                            <div className="flex items-center gap-10 justify-between text-[11px] font-bold text-green-400 bg-green-500/5 px-3 py-2 rounded-lg border border-green-500/20 animate-slideIn">
                                                <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Unit Arrived</span>
                                                <span className="font-mono">{inc.arrivalTimestamp.toLocaleTimeString()}</span>
                                            </div>
                                        )}

                                        {inc.evidenceLogged && (
                                            <div className="flex items-center gap-10 justify-between text-[11px] font-bold text-blue-400 bg-blue-500/5 px-3 py-2 rounded-lg border border-blue-500/20 animate-slideIn">
                                                <span className="flex items-center gap-2"><ImageIcon size={14} /> Evidence Logged</span>
                                                <span className="font-mono">Ver-009A</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Responsive Action Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            onClick={() => onJumpToSurveillance(inc.zone_id!)}
                                            disabled={!inc.zone_id}
                                            className="bg-black/40 hover:bg-black/60 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs border border-gray-700 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Eye size={16} className="text-blue-400" /> EYE-LINK FEED
                                        </button>

                                        {!inc.arrivalTimestamp ? (
                                            <button
                                                onClick={() => handleStartScan(inc.id)}
                                                className="bg-purple-600/20 hover:bg-purple-600/30 active:scale-95 text-purple-400 text-xs border border-purple-500/40 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(168,85,247,0.15)]"
                                            >
                                                <QrCodeIcon size={16} /> QR ARRIVAL
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onLogEvidence(inc.id)}
                                                disabled={inc.evidenceLogged}
                                                className="bg-blue-600/20 hover:bg-blue-600/30 active:scale-95 text-blue-400 disabled:opacity-30 disabled:cursor-default text-xs border border-blue-500/40 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(59,130,246,0.15)]"
                                            >
                                                <Camera size={16} /> EVIDENCE LOG
                                            </button>
                                        )}
                                    </div>

                                    {/* Direct Escalation */}
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Broadcast Critical Medical Escalation?")) {
                                                onMedicalEscalation(inc.zone_id || 'Z-01', `Security Escalation at Sector ${inc.id}`);
                                            }
                                        }}
                                        className="w-full mt-3 bg-red-600/10 hover:bg-red-600/20 active:scale-95 text-red-500 text-xs border border-red-500/30 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Siren size={16} className="animate-pulse" /> BROADCAST MEDICAL REQ
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Sector Integrity Overview */}
                    <div className="bg-[#2d3142]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 z-10">
                            <ShieldAlert className="text-gray-400" /> Sector Integrity Matrix
                        </h3>
                        <p className="text-sm text-gray-400 mb-6 z-10 leading-relaxed font-medium">Compliance-ready overview of sector status and physical lock security.</p>

                        <div className="flex-1 min-h-[300px] bg-[#1a1d29]/50 rounded-2xl border border-gray-800 relative flex flex-col p-4 gap-4 overflow-hidden group">
                            {/* Decorative background grid */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />

                            {[
                                { id: 'Z-01', name: 'Alpha Sector', status: 'SECURE', color: 'green' },
                                { id: 'Z-02', name: 'Beta Sector', status: 'ELEVATED', color: 'yellow' },
                                { id: 'Z-03', name: 'Gamma Sector', status: 'SECURE', color: 'green' },
                                { id: 'Z-04', name: 'Delta Sector', status: 'BREACH', color: 'red' }
                            ].map(sector => (
                                <div key={sector.id} className={`group/item relative flex items-center justify-between bg-[#1a1d29] p-4 rounded-xl border transition-all duration-300 hover:translate-x-1 ${sector.color === 'green' ? 'border-green-500/20' :
                                        sector.color === 'yellow' ? 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]' :
                                            'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)] active-sector-danger'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${sector.color === 'green' ? 'bg-green-500/10 text-green-400' :
                                                sector.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-500 animate-pulse'
                                            }`}>
                                            {sector.color === 'red' ? <Lock size={18} /> : <Unlock size={18} />}
                                        </div>
                                        <div>
                                            <span className="text-sm font-black text-white block tracking-tight">{sector.name}</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{sector.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border transition-colors ${sector.color === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                sector.color === 'yellow' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                                                    'bg-red-600 text-white border-red-500 animate-pulse'
                                            }`}>
                                            {sector.status}
                                        </span>
                                        <span className="text-[9px] text-gray-600 mt-1 font-mono uppercase">Last Ping: 0.2ms</span>
                                    </div>
                                </div>
                            ))}

                            {/* Compliance watermark */}
                            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase flex items-center gap-2">
                                    <ShieldAlert size={12} /> Compliance Protocol 10.4
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">02:59 UTC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Overlay */}
            {scanningIncidentId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1d29]/95 backdrop-blur-xl animate-fadeIn">
                    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Rapid Response Verification</h2>
                            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">Sector Handshake Active</p>
                        </div>

                        <div className="w-64 h-64 border-2 border-blue-500/30 rounded-[3rem] relative overflow-hidden flex items-center justify-center bg-black/40 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                            {scanProgress < 100 ? (
                                <>
                                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                                    <div
                                        className="absolute top-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_20px_#3b82f6] transition-transform duration-100 ease-linear"
                                        style={{ transform: `translateY(${scanProgress * 2.56}px)` }}
                                    />
                                    <QrCodeIcon size={80} className="text-blue-500/20" />
                                    <div className="absolute inset-8 border border-blue-500/20 rounded-2xl animate-pulse" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 fill-mode-forwards">
                                    <div className="bg-green-500/20 p-6 rounded-full">
                                        <CheckCircle2 size={60} className="text-green-400" />
                                    </div>
                                    <span className="text-green-400 font-black uppercase tracking-[0.2em] text-sm">Zone Verified</span>
                                </div>
                            )}
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                                <span>Scanning Sector ID...</span>
                                <span>{Math.round(scanProgress)}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                            </div>
                        </div>

                        <button
                            onClick={() => setScanningIncidentId(null)}
                            className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-1"
                        >
                            Abort Operation
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .active-sector-danger {
                    background: linear-gradient(90deg, #1a1d29 0%, rgba(239, 68, 68, 0.05) 100%);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #2d3142;
                    border-radius: 10px;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SecurityDashboard;
