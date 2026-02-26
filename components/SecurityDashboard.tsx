import React, { useState } from 'react';
import { ShieldAlert, Crosshair, QrCode as QrCodeIcon, Camera, Siren, CheckCircle2, AlertTriangle, Eye, Image as ImageIcon } from 'lucide-react';
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

    const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

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
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className="text-blue-500" size={28} /> Security Tactical Feed
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mt-1">Live incident monitoring and rapid-response escalation tools.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pb-6">

                {/* Tactical Incident Feed */}
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col h-full min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Crosshair className="text-red-400" /> Active Operations
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {activeIncidents.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 italic">No active incidents. Sectors secure.</div>
                        ) : (
                            activeIncidents.map(inc => (
                                <div key={inc.id} className={`bg-[#1a1d29] border rounded-xl p-4 relative overflow-hidden transition-all duration-300 ${inc.severity === 'High' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-gray-700/50'}`}>
                                    {inc.severity === 'High' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 text-red-500"></div>}

                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className={`font-bold ${inc.severity === 'High' ? 'text-red-400' : 'text-white'}`}>{inc.type}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{inc.id} • {inc.zone_id || 'Global'}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-widest font-bold ${inc.severity === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : inc.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                                                {inc.severity}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-4">{inc.description}</p>

                                    {inc.arrivalTimestamp && (
                                        <div className="mb-4 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20">
                                            <CheckCircle2 size={14} /> Unit Arrived on Scene at {inc.arrivalTimestamp.toLocaleTimeString()}
                                        </div>
                                    )}

                                    {inc.evidenceLogged && (
                                        <div className="mb-4 flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                                            <ImageIcon size={14} /> Photo Evidence Logged to Case File
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button
                                            onClick={() => onJumpToSurveillance(inc.zone_id!)}
                                            disabled={!inc.zone_id}
                                            className="bg-[#2d3142] hover:bg-[#3e445b] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs border border-gray-600 py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Eye size={14} /> Visual Confirmation
                                        </button>

                                        {!inc.arrivalTimestamp ? (
                                            <button
                                                onClick={() => handleStartScan(inc.id)}
                                                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs border border-purple-500/30 py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <QrCodeIcon size={14} /> Scan Arrival
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onLogEvidence(inc.id)}
                                                disabled={inc.evidenceLogged}
                                                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 disabled:opacity-50 disabled:cursor-default text-xs border border-blue-500/30 py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Camera size={14} /> Log Evidence
                                            </button>
                                        )}
                                    </div>

                                    {/* Medical Escalation (Always available, high visibility) */}
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Trigger Medical Escalation for this zone?")) {
                                                onMedicalEscalation(inc.zone_id || 'Z-01', `Escalation from: ${inc.id}`);
                                            }
                                        }}
                                        className="w-full mt-2 bg-red-600/20 hover:bg-red-600/40 text-red-500 text-xs border border-red-500/50 py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Siren size={14} /> REQUEST MEDICAL
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Placeholder for Quick Actions or Map */}
                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 z-10">
                            <ShieldAlert className="text-gray-400" /> Sector Status Overview
                        </h3>
                        <p className="text-sm text-gray-400 mb-4 z-10 leading-relaxed">Centralized view of zone locks and sector safety integrity.</p>

                        <div className="flex-1 min-h-[250px] bg-[#1a1d29] rounded-xl border border-gray-700/50 relative flex items-center justify-center overflow-hidden shadow-inner flex-col gap-3">
                            <div className="flex items-center justify-between w-full max-w-[80%] bg-[#2d3142] p-3 rounded-lg border border-gray-600">
                                <span className="text-sm font-bold text-white">Zone 01 Security</span>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">NOMINAL</span>
                            </div>
                            <div className="flex items-center justify-between w-full max-w-[80%] bg-[#2d3142] p-3 rounded-lg border border-gray-600">
                                <span className="text-sm font-bold text-white">Zone 02 Security</span>
                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">ELEVATED</span>
                            </div>
                            <div className="flex items-center justify-between w-full max-w-[80%] bg-[#2d3142] p-3 rounded-lg border border-gray-600">
                                <span className="text-sm font-bold text-white">Zone 03 Security</span>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">NOMINAL</span>
                            </div>
                            <div className="flex items-center justify-between w-full max-w-[80%] bg-[#2d3142] p-3 rounded-lg border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                <span className="text-sm font-bold text-red-400">Zone 04 Security</span>
                                <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded border border-red-500/50 animate-pulse">ATTENTION</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulated QR Scanner Modal */}
            {scanningIncidentId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-xl font-bold text-white mb-4">Arrival Verification</h2>
                        <div className="w-64 h-64 border-4 border-purple-500 rounded-3xl relative overflow-hidden flex items-center justify-center bg-[#1a1d29]">
                            {scanProgress < 100 ? (
                                <>
                                    <div className="absolute inset-0 bg-purple-500/10" />
                                    <div
                                        className="absolute top-0 left-0 w-full h-1 bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,1)]"
                                        style={{ transform: `translateY(${scanProgress * 2.5}px)` }}
                                    />
                                    <QrCodeIcon size={80} className="text-purple-500/50" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 animate-in zoom-in-95">
                                    <CheckCircle2 size={80} className="text-green-400" />
                                    <span className="text-green-400 font-bold uppercase tracking-widest text-sm">Verified</span>
                                </div>
                            )}
                        </div>
                        <p className="text-purple-400 font-mono text-sm">Scanning Location Node... {scanProgress}%</p>
                        <button
                            onClick={() => setScanningIncidentId(null)}
                            className="text-gray-500 hover:text-white transition-colors text-sm underline mt-4"
                        >
                            Cancel Scan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecurityDashboard;
