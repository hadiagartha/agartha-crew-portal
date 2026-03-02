import React, { useState } from 'react';
import { HeartPulse, Activity, Syringe, Bandage, PhoneCall, QrCode as QrCodeIcon, Camera, AlertCircle } from 'lucide-react';
import { Incident } from '../types';
import { useGlobalState } from './GlobalStateContext';

interface HealthDashboardProps {
    incidents: Incident[];
    onScanArrival: (id: string, timestamp: Date) => void;
    onRequestRestock: (item: string, isUrgent: boolean) => void;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({
    incidents,
    onScanArrival,
    onRequestRestock
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
        <div className="flex flex-col h-full bg-[#1a1d29]">
            {/* Header section */}
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142] flex flex-wrap gap-4 md:gap-6 items-center justify-between bg-[#1a1d29]/80 backdrop-blur-md sticky top-0 z-20">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-2 md:gap-3">
                        <HeartPulse className="text-red-500" size={24} /> Medical Triage
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">Active patient monitoring and field operations</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-visible lg:overflow-hidden">
                {/* LEFT COLUMN: TRIAGE FEED */}
                <div className="w-full lg:w-2/3 flex flex-col border-b lg:border-b-0 lg:border-r border-[#2d3142] bg-[#1a1d29]/50 lg:overflow-y-auto hide-scrollbar">
                    <div className="p-4 md:p-6">
                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <Activity size={16} /> Live Health Alerts
                        </h3>

                        <div className="space-y-4">
                            {activeMedicalIncidents.length === 0 ? (
                                <div className="text-center py-12 bg-[#2d3142]/30 rounded-xl border border-dashed border-gray-700">
                                    <Activity size={32} className="mx-auto text-green-500 mb-3 opacity-50" />
                                    <p className="text-gray-400 font-medium">No medical anomalies detected. Vitals normal.</p>
                                </div>
                            ) : (
                                activeMedicalIncidents.map(inc => (
                                    <div key={inc.id} className={`bg-[#2d3142]/90 border rounded-xl p-5 shadow-xl transition-all ${inc.severity === 'High' ? 'border-red-500/50 shadow-red-500/10' : 'border-gray-700/50 hover:border-red-500/30'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2.5 rounded-lg ${inc.severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {inc.severity === 'High' ? <AlertCircle size={20} className="animate-pulse" /> : <Activity size={20} />}
                                            </div>
                                            <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${inc.severity === 'High' ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-blue-500/30 text-blue-400 bg-blue-500/5'}`}>
                                                {inc.id}
                                            </span>
                                        </div>

                                        <h4 className="text-white font-bold text-lg mb-1">{inc.type}</h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 font-mono">
                                            <span>ZONE: {inc.zone_id || 'GLOBAL'}</span>
                                            <span>•</span>
                                            <span className={inc.severity === 'High' ? 'text-red-400' : 'text-blue-400'}>{inc.severity.toUpperCase()} PRIORITY</span>
                                        </div>

                                        {generateMockPulseGraph()}

                                        <p className="text-sm text-gray-300 mb-6 leading-relaxed">{inc.description}</p>

                                        {inc.arrivalTimestamp && (
                                            <div className="mb-6 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                                <HeartPulse size={14} /> Responder Arrived at {inc.arrivalTimestamp.toLocaleTimeString()}
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            {!inc.arrivalTimestamp ? (
                                                <button
                                                    onClick={() => handleStartScan(inc.id)}
                                                    className="flex-1 bg-black/40 hover:bg-black/60 border border-gray-700 hover:border-purple-500/50 text-gray-300 hover:text-purple-400 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <QrCodeIcon size={14} /> Scan Arrival
                                                </button>
                                            ) : (
                                                <div className="flex-1 bg-green-500/5 border border-green-500/20 text-green-500/50 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                                                    Area Secured
                                                </div>
                                            )}

                                            {inc.severity === 'High' && (
                                                <button
                                                    onClick={() => window.alert('911 / External EMS Dispatched')}
                                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                                                >
                                                    <PhoneCall size={14} /> External EMS
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: MEDKIT INVENTORY */}
                <div className="w-full lg:w-1/3 flex flex-col lg:overflow-y-auto hide-scrollbar bg-black/20">
                    <div className="p-4 md:p-6">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <Syringe size={16} /> MedKit Inventory
                        </h3>

                        <div className="space-y-4">
                            {[
                                { name: 'Trauma Kits', icon: HeartPulse, iconColor: 'text-red-400', par: 10, critical: 3 },
                                { name: 'IV Fluids', icon: Syringe, iconColor: 'text-blue-400', par: 20, critical: 5 },
                                { name: 'Bandages', icon: Bandage, iconColor: 'text-green-400', par: 50, critical: 20 }
                            ].map(item => {
                                const count = consumables[item.name as keyof typeof consumables] || 0;
                                const isCritical = count <= item.critical;
                                const isLow = count < item.par;

                                return (
                                    <div key={item.name} className="bg-[#2d3142]/50 p-5 rounded-xl border border-gray-700/50">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-black/20 ${item.iconColor}`}>
                                                    <item.icon size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white font-bold">{item.name}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">PAR LEVEL: {item.par}</p>
                                                </div>
                                            </div>
                                            <div className={`text-xl font-mono font-bold ${isCritical ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                                {count}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {isLow && (
                                                <button
                                                    onClick={() => onRequestRestock(item.name, isCritical)}
                                                    className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/10"
                                                >
                                                    REQUEST RESTOCK
                                                </button>
                                            )}
                                            <button
                                                onClick={() => useConsumable(item.name, 1)}
                                                className="w-10 py-1.5 rounded-lg text-xs font-bold bg-[#1a1d29] text-gray-400 hover:text-white border border-gray-700 transition-colors"
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
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
