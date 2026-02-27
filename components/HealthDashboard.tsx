import React, { useState } from 'react';
import { HeartPulse, Activity, Syringe, Bandage, PhoneCall, QrCode as QrCodeIcon, Camera, AlertCircle } from 'lucide-react';
import { Incident } from '../types';
import { useGlobalState } from './GlobalStateContext';

interface HealthDashboardProps {
    incidents: Incident[];
    onScanArrival: (id: string, timestamp: Date) => void;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({
    incidents,
    onScanArrival
}) => {
    const { consumables, useConsumable } = useGlobalState();
    const [scanningIncidentId, setScanningIncidentId] = useState<string | null>(null);
    const [scanProgress, setScanProgress] = useState(0);

    const activeMedicalIncidents = incidents.filter(i =>
        i.status !== 'RESOLVED' &&
        (i.type.includes('Health') || i.type.includes('Medical') || i.type.includes('Anomaly'))
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

    const generateMockPulseGraph = () => {
        // Generates a random SVGs sparkline mimicking a heartbeat
        const points = Array.from({ length: 20 }, (_, i) => `${i * 5},${Math.random() * 20 + 10}`).join(' ');
        return (
            <div className="h-10 w-full mb-3 mt-2 opacity-70">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <polyline fill="none" stroke="#f87171" strokeWidth="1.5" points={points} className="animate-pulse" />
                </svg>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-full">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <HeartPulse className="text-red-500" size={28} /> Medical Triage
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mt-1">Active patient monitoring and emergency field operations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">

                {/* Triage Feed */}
                <div className="lg:col-span-2 bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col h-full min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="text-red-400" /> Live Health Alerts
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {activeMedicalIncidents.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 italic">No medical anomalies detected. Vitals normal.</div>
                        ) : (
                            activeMedicalIncidents.map(inc => (
                                <div key={inc.id} className={`bg-[#1a1d29] border rounded-xl p-4 relative overflow-hidden transition-all duration-300 ${inc.severity === 'High' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-gray-700/50 hover:border-red-500/30'}`}>
                                    {inc.severity === 'High' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 text-red-500"></div>}

                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className={`font-bold ${inc.severity === 'High' ? 'text-red-400 flex items-center gap-2' : 'text-white'}`}>
                                                {inc.type} {inc.severity === 'High' && <AlertCircle size={14} className="animate-pulse" />}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{inc.id} • {inc.zone_id || 'Global Sector'}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-widest font-bold ${inc.severity === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : inc.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                                                {inc.severity} Priority
                                            </span>
                                        </div>
                                    </div>

                                    {/* Patient Pulse History Graph */}
                                    {generateMockPulseGraph()}

                                    <p className="text-sm text-gray-300 mb-4">{inc.description}</p>

                                    {inc.arrivalTimestamp && (
                                        <div className="mb-4 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20">
                                            <HeartPulse size={14} /> Responder Arrived at {inc.arrivalTimestamp.toLocaleTimeString()}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 mt-2">

                                        {!inc.arrivalTimestamp ? (
                                            <button
                                                onClick={() => handleStartScan(inc.id)}
                                                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs border border-purple-500/30 py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <QrCodeIcon size={14} /> Scan Arrival
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="bg-green-500/5 text-green-500/50 disabled:cursor-default text-xs border border-green-500/20 py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                                            >
                                                Area Secured
                                            </button>
                                        )}
                                    </div>

                                    {/* Direct EMS Escalation */}
                                    {inc.severity === 'High' && (
                                        <button
                                            onClick={() => window.alert('911 / External EMS Dispatched with coordinates.')}
                                            className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] text-xs border border-red-500 py-2 rounded font-bold flex items-center justify-center gap-2 transition-all duration-300"
                                        >
                                            <PhoneCall size={14} /> DISPATCH EXTERNAL EMS
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Consumables Tracker */}
                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 z-10">
                            <Syringe className="text-blue-400" /> MedKit Inventory
                        </h3>
                        <p className="text-sm text-gray-400 mb-6 z-10 leading-relaxed">Log supplies used in the field to trigger automatic restock orders.</p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between bg-[#1a1d29] p-3 rounded-lg border border-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-500/20 p-2 rounded-lg text-red-400">
                                        <HeartPulse size={18} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white block">Trauma Kits</span>
                                        <span className="text-xs text-gray-500">Par: 10</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold ${(consumables['Trauma Kits'] || 0) < 3 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{consumables['Trauma Kits'] || 0}</span>
                                    <button onClick={() => useConsumable('Trauma Kits', 1)} className="w-8 h-8 rounded bg-[#2d3142] hover:bg-gray-600 text-white font-bold">-</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[#1a1d29] p-3 rounded-lg border border-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                                        <Syringe size={18} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white block">IV Fluids (L)</span>
                                        <span className="text-xs text-gray-500">Par: 20</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold ${(consumables['IV Fluids'] || 0) < 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{consumables['IV Fluids'] || 0}</span>
                                    <button onClick={() => useConsumable('IV Fluids', 1)} className="w-8 h-8 rounded bg-[#2d3142] hover:bg-gray-600 text-white font-bold">-</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[#1a1d29] p-3 rounded-lg border border-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                                        <Bandage size={18} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white block">Bandages</span>
                                        <span className="text-xs text-gray-500">Par: 50</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold ${(consumables['Bandages'] || 0) <= 20 ? 'text-yellow-400' : 'text-white'}`}>{consumables['Bandages'] || 0}</span>
                                    <button onClick={() => useConsumable('Bandages', 1)} className="w-8 h-8 rounded bg-[#2d3142] hover:bg-gray-600 text-white font-bold">-</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulated QR Scanner Modal */}
            {scanningIncidentId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-xl font-bold text-white mb-4">Establishing Medical Perimeter</h2>
                        <div className="w-64 h-64 border-4 border-red-500 rounded-3xl relative overflow-hidden flex items-center justify-center bg-[#1a1d29]">
                            {scanProgress < 100 ? (
                                <>
                                    <div className="absolute inset-0 bg-red-500/10" />
                                    <div
                                        className="absolute top-0 left-0 w-full h-1 bg-red-400 shadow-[0_0_15px_rgba(248,113,113,1)]"
                                        style={{ transform: `translateY(${scanProgress * 2.5}px)` }}
                                    />
                                    <Camera size={80} className="text-red-500/50" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 animate-in zoom-in-95">
                                    <HeartPulse size={80} className="text-green-400 animate-pulse" />
                                    <span className="text-green-400 font-bold uppercase tracking-widest text-sm">Zone Secured</span>
                                </div>
                            )}
                        </div>
                        <p className="text-red-400 font-mono text-sm">Scanning Environment... {scanProgress}%</p>
                        <button
                            onClick={() => setScanningIncidentId(null)}
                            className="text-gray-500 hover:text-white transition-colors text-sm underline mt-4"
                        >
                            Abort Scan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthDashboard;
