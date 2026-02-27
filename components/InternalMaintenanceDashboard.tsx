import React, { useState, useEffect, useRef } from 'react';
import {
    Save, AlertTriangle, CheckCircle, Activity, Lightbulb,
    Volume2, Move, Search, Cpu, Battery, QrCode, X,
    Terminal, ShieldCheck, Camera, CheckSquare, ClipboardList
} from 'lucide-react';
import { Incident, Alert } from '../types';
import { useGlobalState } from './GlobalStateContext';

interface InternalMaintenanceProps {
    redAlerts: Alert[];
    onResolveIncident: (incidentId: string) => void;
    systemHealthPercentage: number;
}

// Mock Hardware Status
type HardwareState = 'GREEN' | 'YELLOW' | 'RED';
interface HardwareUnit {
    id: string;
    name: string;
    type: 'Lidar' | 'Camera' | 'Projector' | 'Hydraulics' | 'Network Node';
    zone: string;
    state: HardwareState;
    uptime: string;
}

const INITIAL_HARDWARE: HardwareUnit[] = [
    { id: 'HW-CAM-01', name: 'Depth Camera Array Alpha', type: 'Camera', zone: 'Z-04', state: 'GREEN', uptime: '99.9%' },
    { id: 'HW-LID-04', name: 'Lidar Sensor Array C', type: 'Lidar', zone: 'Z-02', state: 'YELLOW', uptime: '94.2%' },
    { id: 'HW-PROJ-09', name: 'Holo-Projector Core', type: 'Projector', zone: 'Z-01', state: 'GREEN', uptime: '99.9%' },
    { id: 'HW-HYD-03', name: 'Leviathan-03 Hydraulics', type: 'Hydraulics', zone: 'Z-04', state: 'RED', uptime: '0.0%' },
    { id: 'HW-NET-01', name: 'Zone 03 Comms Gateway', type: 'Network Node', zone: 'Z-03', state: 'GREEN', uptime: '99.8%' },
];

const InternalMaintenanceDashboard: React.FC<InternalMaintenanceProps> = ({
    redAlerts,
    onResolveIncident,
    systemHealthPercentage
}) => {
    const { addHardwareChecklist } = useGlobalState();
    const [hardware, setHardware] = useState<HardwareUnit[]>(INITIAL_HARDWARE);
    const [selectedAsset, setSelectedAsset] = useState<HardwareUnit | null>(null);

    // Terminal State
    const [showTerminal, setShowTerminal] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

    // Resolution State
    const [scanStep, setScanStep] = useState<0 | 1 | 2>(0); // 0: None, 1: QR Scanning, 2: Photo Capture
    const [scanProgress, setScanProgress] = useState(0);
    const tempIntervalRef = useRef<number | null>(null);

    // Upkeep Checklist State
    const [checklist, setChecklist] = useState([
        { id: 'check-1', item: 'Hydraulic Piston Leak Test', status: 'Pending' },
        { id: 'check-2', item: 'Lidar Lens Calibration', status: 'Pending' },
        { id: 'check-3', item: 'Network Patch Panel Integrity', status: 'Pending' },
        { id: 'check-4', item: 'Projector Cooling Fan Verification', status: 'Pending' }
    ]);

    const handleCheckItem = (id: string, result: 'Pass' | 'Fail') => {
        setChecklist(prev => prev.map(c => c.id === id ? { ...c, status: result } : c));
        const item = checklist.find(c => c.id === id);
        if (item) {
            addHardwareChecklist({
                id: `HC-${Date.now()}`,
                item: item.item,
                zone: 'Central Warehouse',
                status: result,
                timestamp: new Date(),
                checkedBy: 'Maint-01'
            });
        }
    };

    // Sync Hardware state with redAlerts roughly
    useEffect(() => {
        const hasZ04Alert = redAlerts.some(a => a.zone_id === 'Z-04');
        setHardware(prev => prev.map(h => {
            if (h.id === 'HW-HYD-03') return { ...h, state: hasZ04Alert ? 'RED' : 'GREEN' };
            return h;
        }));
    }, [redAlerts]);

    const handleOpenTerminal = (asset: HardwareUnit) => {
        setSelectedAsset(asset);
        setShowTerminal(true);
        setTerminalLogs([
            `Initiating secure connection to ${asset.id}...`,
            `Establishing handshake with node ${asset.zone}...`,
        ]);

        let step = 0;
        const sequences = [
            `[OK] Connection established. Encryption verified.`,
            `[INFO] Querying device diagnostics...`,
            asset.state === 'RED'
                ? `[ERROR] Device unresponsive. Heartbeat timed out.`
                : `[OK] Telemetry stream active. Sensors nominal.`,
            asset.state === 'RED'
                ? `[WARN] Sending PWR_CYCLE_HARD command...`
                : `[INFO] Fetching latest firmware version...`,
            asset.state === 'RED'
                ? `[ERROR] Kernel panic detected. Physical repair required.`
                : `[OK] Version 4.12.8 running smoothly.`,
            `[END] Session terminated.`
        ];

        const runSim = () => {
            if (step < sequences.length) {
                setTerminalLogs(prev => [...prev, sequences[step]]);
                step++;
                tempIntervalRef.current = window.setTimeout(runSim, 800 + Math.random() * 800);
            }
        };

        tempIntervalRef.current = window.setTimeout(runSim, 1000);
    };

    const closeTerminal = () => {
        setShowTerminal(false);
        if (tempIntervalRef.current) clearTimeout(tempIntervalRef.current);
    };

    const startResolutionFlow = (asset: HardwareUnit) => {
        setSelectedAsset(asset);
        setScanStep(1);
        setScanProgress(0);

        const simulateProgress = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(simulateProgress);
                    setTimeout(() => setScanStep(2), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
    };

    const completePhotoCapture = () => {
        setScanStep(0);
        if (selectedAsset) {
            setHardware(prev => prev.map(h =>
                h.id === selectedAsset.id ? { ...h, state: 'GREEN' } : h
            ));

            if (selectedAsset.zone === 'Z-04') {
                const linkedAlert = redAlerts.find(a => a.zone_id === 'Z-04');
                if (linkedAlert) {
                    onResolveIncident(linkedAlert.id);
                }
            }
        }
    };


    return (
        <div className="flex flex-col h-full bg-[#1a1d29]">
            {/* Top Header Stats */}
            <div className="flex-none p-6 border-b border-[#2d3142] flex flex-wrap gap-6 items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-3">
                        <ShieldCheck className="text-blue-500" /> Maintenance Command
                    </h2>
                    <p className="text-gray-400 text-sm">System Topologies & Hardware Triage</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#2d3142] border border-gray-700 rounded-xl p-4 flex flex-col items-center min-w-[120px]">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Global Health</span>
                        <div className="flex items-center gap-2">
                            <Activity size={20} className={systemHealthPercentage > 90 ? 'text-green-400' : 'text-yellow-400'} />
                            <span className={`text-2xl font-mono font-bold ${systemHealthPercentage > 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {systemHealthPercentage}%
                            </span>
                        </div>
                    </div>
                    <div className="bg-[#2d3142] border border-red-500/30 rounded-xl p-4 flex flex-col items-center min-w-[120px] shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <span className="text-xs font-bold text-red-500/80 uppercase tracking-widest mb-1">Active Faults</span>
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={20} className="text-red-500" />
                            <span className="text-2xl font-mono font-bold text-red-500">
                                {hardware.filter(h => h.state === 'RED').length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                {/* LEFT COLUMN: CHECKLIST & FEED */}
                <div className="w-full lg:w-1/3 min-w-[320px] flex flex-col border-r border-[#2d3142] bg-[#1a1d29]/50 overflow-y-auto">

                    {/* Mandatory Upkeep Section */}
                    <div className="p-6 border-b border-[#2d3142]">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <ClipboardList size={16} /> Daily Hardware Upkeep
                        </h3>
                        <div className="space-y-4">
                            {checklist.map(item => (
                                <div key={item.id} className="bg-[#2d3142]/50 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-sm text-white font-bold mb-3">{item.item}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCheckItem(item.id, 'Pass')}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${item.status === 'Pass' ? 'bg-green-600 text-white' : 'bg-[#1a1d29] text-gray-500 hover:text-green-400'}`}
                                        >
                                            PASS
                                        </button>
                                        <button
                                            onClick={() => handleCheckItem(item.id, 'Fail')}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${item.status === 'Fail' ? 'bg-red-600 text-white' : 'bg-[#1a1d29] text-gray-500 hover:text-red-400'}`}
                                        >
                                            FAIL
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-b border-[#2d3142]">
                        <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Active System Operations
                        </h3>
                    </div>
                    <div className="flex-1 p-4 space-y-3">
                        {redAlerts.length === 0 ? (
                            <div className="text-center p-8 bg-[#2d3142]/30 rounded-xl border border-dashed border-gray-700">
                                <CheckCircle size={32} className="mx-auto text-green-500 mb-3 opacity-50" />
                                <p className="text-gray-400 font-medium">No critical incidents active.</p>
                            </div>
                        ) : (
                            redAlerts.map(alert => (
                                <div key={alert.id} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono font-bold text-red-400">{alert.id}</span>
                                        <span className="text-[10px] text-red-400/60 font-mono">
                                            {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-red-300 transition-colors">{alert.description}</h4>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                                        <Cpu size={12} /> {alert.zone_name || alert.zone_id}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: HARDWARE TOPOLOGY */}
                <div className="flex-1 flex flex-col overflow-hidden bg-black/40">
                    <div className="p-4 bg-[#1a1d29]/90 backdrop-blur-sm border-b border-[#2d3142] flex justify-between items-center z-10">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Hardware Topology Grid
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {hardware.map(item => (
                                <div
                                    key={item.id}
                                    className={`bg-[#2d3142]/90 backdrop-blur-md border rounded-xl p-5 shadow-xl transition-all ${item.state === 'GREEN' ? 'border-green-500/20 shadow-green-500/5' :
                                        item.state === 'YELLOW' ? 'border-yellow-500/30' :
                                            'border-red-500/40 shadow-red-500/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2.5 rounded-lg ${item.state === 'GREEN' ? 'bg-green-500/10 text-green-500' :
                                            item.state === 'YELLOW' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500 animate-pulse'
                                            }`}>
                                            {item.type === 'Camera' && <Camera size={20} />}
                                            {item.type === 'Hydraulics' && <Activity size={20} />}
                                            {item.type === 'Projector' && <Lightbulb size={20} />}
                                            {item.type === 'Lidar' && <Search size={20} />}
                                            {item.type === 'Network Node' && <Cpu size={20} />}
                                        </div>
                                        <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${item.state === 'GREEN' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                            item.state === 'YELLOW' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' :
                                                'border-red-500/30 text-red-500 bg-red-500/5'
                                            }`}>
                                            {item.id}
                                        </span>
                                    </div>

                                    <h4 className="text-white font-bold text-lg mb-1">{item.name}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-6 font-mono">
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {item.zone}</span>
                                        <span>•</span>
                                        <span>UPTIME: {item.uptime}</span>
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        <button
                                            onClick={() => handleOpenTerminal(item)}
                                            className="flex-1 bg-black/40 hover:bg-black/60 border border-gray-700 hover:border-blue-500/50 text-gray-300 hover:text-blue-400 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Terminal size={14} /> Console
                                        </button>
                                        {item.state !== 'GREEN' && (
                                            <button
                                                onClick={() => startResolutionFlow(item)}
                                                className="flex-1 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/50 text-yellow-400 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ShieldCheck size={14} /> Resolve
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* REMOTE TERMINAL MODAL */}
            {showTerminal && selectedAsset && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-3xl bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
                        <div className="bg-[#1a1d29] border-b border-gray-800 px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-3 text-sm">
                                <Terminal size={16} className="text-gray-400" />
                                <span className="font-mono text-gray-300">Terminal — root@{selectedAsset.id}</span>
                            </div>
                            <button onClick={closeTerminal} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm bg-black">
                            {terminalLogs.map((log, i) => {
                                let color = "text-gray-300";
                                if (log.includes("[ERROR]")) color = "text-red-500 font-bold";
                                if (log.includes("[WARN]")) color = "text-yellow-400";
                                if (log.includes("[OK]")) color = "text-green-400";
                                if (log.includes("[INFO]")) color = "text-blue-400";
                                return (
                                    <div key={i} className={`mb-2 animate-fadeIn ${color}`}>
                                        <span className="text-gray-600 mr-3 opacity-50">{String(i).padStart(3, '0')}</span>
                                        {log}
                                    </div>
                                );
                            })}
                            <div className="mt-4 flex items-center">
                                <span className="text-green-500 mr-2">root@{selectedAsset.id}:~#</span>
                                <span className="w-2.5 h-4 bg-gray-400 animate-pulse inline-block" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VALIDATION/RESOLUTION FLOW */}
            {scanStep > 0 && selectedAsset && (
                <div className="fixed inset-0 z-[110] bg-[#1a1d29]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fadeIn">
                    <button onClick={() => setScanStep(0)} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors">
                        <X size={32} />
                    </button>
                    <div className="max-w-md w-full flex flex-col items-center text-center">
                        {scanStep === 1 && (
                            <>
                                <div className="w-16 h-16 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mb-4">
                                    <QrCode size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Device Validation</h2>
                                <p className="text-gray-400 mb-8 text-sm">Scan the QR code physically affixed to the {selectedAsset.name} rack to verify physical presence.</p>
                                <div className="relative w-full aspect-square bg-black rounded-3xl border border-[#2d3142] overflow-hidden shadow-2xl mb-8">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 shadow-[0_0_20px_#facc15] animate-[scan_2s_ease-in-out_infinite] z-10" />
                                    <div className="absolute inset-8 border-2 border-yellow-400/30 rounded-xl flex items-center justify-center">
                                        <QrCode size={64} className="text-yellow-400/50 animate-pulse" />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between text-xs text-yellow-400 font-mono mb-2">
                                        <span>VERIFYING ASSET ID...</span>
                                        <span>{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className="h-1 bg-[#2d3142] rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 transition-all duration-100 ease-linear" style={{ width: `${scanProgress}%` }} />
                                    </div>
                                </div>
                            </>
                        )}
                        {scanStep === 2 && (
                            <div className="animate-fadeIn w-full flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                                    <CheckSquare size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Presence Verified</h2>
                                <p className="text-gray-400 mb-8 text-sm">Upload visual proof of the clean installation/repair to close out the {selectedAsset.id} incident log.</p>
                                <div className="relative w-full aspect-[4/3] bg-[#2d3142] rounded-2xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center group hover:border-yellow-400 transition-colors cursor-pointer mb-8 overflow-hidden">
                                    <Camera size={48} className="text-gray-500 mb-4 group-hover:text-yellow-400 transition-colors" />
                                    <span className="text-gray-400 font-bold group-hover:text-white transition-colors">Tap to Open Camera</span>
                                    <button onClick={completePhotoCapture} className="absolute inset-0 w-full h-full opacity-0 z-10" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

function MapPin(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
}

export default InternalMaintenanceDashboard;
