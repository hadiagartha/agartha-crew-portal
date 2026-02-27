import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, QrCode as QrCodeIcon, AlertTriangle, PackagePlus, Trash2, Droplet, ArrowRightLeft, Clock } from 'lucide-react';
import { StaffMember, Incident, IncidentSeverity } from '../types';
import { useGlobalState } from './GlobalStateContext';

interface CleaningDashboardProps {
    staff: StaffMember;
    onRequestRestock: (item: string, isUrgent: boolean) => void;
    handleAddIncident: (incident: Incident) => void;
}

const CleaningDashboard: React.FC<CleaningDashboardProps> = ({
    staff,
    onRequestRestock,
    handleAddIncident
}) => {
    const currentZone = staff.current_zone_id || 'Z-04';
    const { cleaning_timers, setCleaningTimers } = useGlobalState();

    // Fallback if not initialized in context
    const currentTimer = cleaning_timers[currentZone] || { startTime: null, duration: null, isClean: true };
    const isCleaning = !currentTimer.isClean;

    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [activeScanItem, setActiveScanItem] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const [checklist, setChecklist] = useState([
        { id: 1, category: 'Restrooms', text: 'Sanitize all sinks and surfaces', done: false, requiresScan: false },
        { id: 2, category: 'Restrooms', text: 'Deep Clean Core Restroom Node', done: false, requiresScan: true, scanned: false },
        { id: 3, category: 'High-Touch', text: 'Disinfect interactive rails', done: true, requiresScan: false },
        { id: 4, category: 'High-Touch', text: 'Wipe down dining tables', done: false, requiresScan: false },
        { id: 5, category: 'Waste', text: 'Empty all primary refuse bins', done: true, requiresScan: false },
        { id: 6, category: 'Waste', text: 'Deep Clean Waste Compressor Area', done: false, requiresScan: true, scanned: false },
    ]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCleaning && currentTimer.startTime) {
            setElapsedSeconds(Math.floor((Date.now() - currentTimer.startTime) / 1000));
            interval = setInterval(() => {
                setElapsedSeconds(Math.floor((Date.now() - currentTimer.startTime!) / 1000));
            }, 1000);
        } else if (!isCleaning && currentTimer.duration) {
            setElapsedSeconds(Math.floor(currentTimer.duration / 1000));
        } else {
            setElapsedSeconds(0);
        }
        return () => clearInterval(interval);
    }, [isCleaning, currentTimer.startTime, currentTimer.duration]);

    const handleToggleZoneStatus = () => {
        if (isCleaning) {
            // Clicked 'Zone Ready' (Completion Signal)
            const duration = currentTimer.startTime ? Date.now() - currentTimer.startTime : 0;
            setCleaningTimers(prev => ({
                ...prev,
                [currentZone]: {
                    ...prev[currentZone],
                    isClean: true,
                    duration
                }
            }));
            window.alert(`Zone Ready! Turnaround duration logged.`);
        } else {
            // Clicked 'Start Cleaning'
            setCleaningTimers(prev => ({
                ...prev,
                [currentZone]: {
                    startTime: Date.now(),
                    duration: null,
                    isClean: false
                }
            }));
        }
    };

    const handleToggleCheck = (id: number) => {
        const item = checklist.find(i => i.id === id);
        if (!item) return;

        if (item.requiresScan && !item.scanned && !item.done) {
            // Initiate scan before checking off
            setActiveScanItem(id);
            setIsScanning(true);
            setScanProgress(0);

            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setChecklist(p => p.map(i => i.id === id ? { ...i, done: true, scanned: true } : i));
                            setIsScanning(false);
                            setActiveScanItem(null);
                        }, 1000);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);
        } else {
            // Standard toggle
            setChecklist(p => p.map(i => i.id === id ? { ...i, done: !i.done } : i));
        }
    };

    const handleLogDamage = () => {
        const newIncident: Incident = {
            id: `INC-CLN-${Date.now()}`,
            timestamp: new Date(),
            type: 'Facility Issue',
            severity: IncidentSeverity.MEDIUM,
            description: `Damage/Spill reported by Sanitation in Zone ${currentZone.replace('Z-', '')}. Area requires physical maintenance.`,
            status: 'OPEN',
            reportedBy: staff.staff_id,
            zone_id: currentZone
        };
        handleAddIncident(newIncident);
        window.alert(`Facility Issue reported. Maintenance team notified.`);
    };

    const handleRequestSupplies = (item: string) => {
        onRequestRestock(item, true); // Send urgent request to Runner
        window.alert(`Dispatch Request Sent: Needed ${item} sent to Runner Queue.`);
    };

    // Calculate progress
    const completed = checklist.filter(i => i.done).length;
    const progress = Math.round((completed / checklist.length) * 100);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Sparkles className="text-teal-400" size={28} /> Sanitation Command
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mt-1">Manage zone cleanliness, restock supplies, and report facility wear.</p>
                </div>

                {/* Global Zone Status Toggle */}
                <div className="flex items-center gap-3 bg-[#2d3142] p-2 rounded-xl border border-gray-700 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1d29] rounded-lg">
                        <Clock className={isCleaning ? 'text-yellow-400 animate-pulse' : 'text-gray-500'} size={20} />
                        <span className={`font-mono font-bold text-lg ${isCleaning ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {formatTime(elapsedSeconds)}
                        </span>
                    </div>

                    <button
                        onClick={handleToggleZoneStatus}
                        className={`px-4 py-3 rounded-lg font-bold flex flex-1 items-center justify-center gap-2 transition-all duration-300 ${!isCleaning ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'}`}
                    >
                        <ArrowRightLeft size={16} />
                        {!isCleaning ? 'Start Turnaround' : 'Zone Ready'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">

                {/* Smart Checklist Widget */}
                <div className="lg:col-span-2 bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col h-full">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <CheckCircle2 className="text-teal-400" /> Deep Clean Protocol
                        </h3>
                        <div className="text-right">
                            <span className="text-3xl font-black text-teal-400">{progress}%</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest block">Completion</span>
                        </div>
                    </div>

                    <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
                        <div className="bg-teal-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {/* Categories */}
                        {['Restrooms', 'High-Touch', 'Waste'].map(category => (
                            <div key={category}>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    {category === 'Restrooms' ? <Droplet size={14} /> : category === 'High-Touch' ? <Sparkles size={14} /> : <Trash2 size={14} />}
                                    {category}
                                </h4>
                                <div className="space-y-2">
                                    {checklist.filter(i => i.category === category).map(item => (
                                        <div key={item.id} className={`flex items-center gap-3 bg-[#1a1d29] p-4 rounded-xl border transition-all ${item.done ? 'border-gray-700/30 opacity-60' : item.requiresScan ? 'border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'border-gray-700/50 hover:border-teal-500/30'}`}>

                                            <button
                                                onClick={() => handleToggleCheck(item.id)}
                                                className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors ${item.done ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-[#2d3142] border border-gray-600 hover:border-teal-400'}`}
                                            >
                                                {item.done && <CheckCircle2 size={14} />}
                                            </button>

                                            <div className="flex-1 flex justify-between items-center">
                                                <span className={`text-sm ${item.done ? 'text-gray-500 line-through' : 'text-gray-200'} ${item.requiresScan && !item.done ? 'font-bold text-white' : ''}`}>
                                                    {item.text}
                                                </span>
                                                {item.requiresScan && !item.done && (
                                                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1 uppercase tracking-widest">
                                                        <QrCodeIcon size={10} /> Scan Required
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Runner Request Integration */}
                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <PackagePlus className="text-blue-400" /> Request Supplies
                        </h3>
                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">Dispatch Runner Crew to your location with urgent restock materials.</p>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleRequestSupplies('Sanitizer Refill')} className="bg-[#1a1d29] border border-blue-500/30 hover:bg-blue-500/10 text-white p-3 rounded-xl flex flex-col items-center gap-2 transition-colors">
                                <Droplet size={20} className="text-blue-400" />
                                <span className="text-xs font-bold text-center">Sanitizer Refill</span>
                            </button>
                            <button onClick={() => handleRequestSupplies('Paper Towels')} className="bg-[#1a1d29] border border-blue-500/30 hover:bg-blue-500/10 text-white p-3 rounded-xl flex flex-col items-center gap-2 transition-colors">
                                <PackagePlus size={20} className="text-blue-400" />
                                <span className="text-xs font-bold text-center">Paper Towels</span>
                            </button>
                            <button onClick={() => handleRequestSupplies('Waste Bags')} className="bg-[#1a1d29] border border-blue-500/30 hover:bg-blue-500/10 text-white p-3 rounded-xl flex flex-col items-center gap-2 transition-colors">
                                <Trash2 size={20} className="text-blue-400" />
                                <span className="text-xs font-bold text-center">Waste Bags</span>
                            </button>
                            <button onClick={() => handleRequestSupplies('Spill Kit')} className="bg-[#1a1d29] border border-red-500/30 hover:bg-red-500/10 text-red-100 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                <AlertTriangle size={20} className="text-red-400" />
                                <span className="text-xs font-bold text-center text-red-200">Spill Kit</span>
                            </button>
                        </div>
                    </div>

                    {/* One-Tap Maintenance Logging */}
                    <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl shadow-xl flex flex-col mt-auto relative overflow-hidden group">
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 relative z-10">
                            <AlertTriangle className="text-red-400" /> Physical Damage
                        </h3>
                        <p className="text-xs text-red-200/70 mb-4 leading-relaxed relative z-10">Report broken fixtures, biohazards, or infrastructure damage instantly.</p>

                        <button
                            onClick={handleLogDamage}
                            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative z-10 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                        >
                            Log Facility Issue
                        </button>
                    </div>
                </div>
            </div>

            {/* QR Scanner Overlay for Deep Clean */}
            {isScanning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-xl font-bold text-white mb-4">Verifying Location Authenticity</h2>
                        <div className="w-64 h-64 border-4 border-teal-500 rounded-3xl relative overflow-hidden flex items-center justify-center bg-[#1a1d29]">
                            {scanProgress < 100 ? (
                                <>
                                    <div className="absolute inset-0 bg-teal-500/10" />
                                    <div
                                        className="absolute top-0 left-0 w-full h-1 bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,1)]"
                                        style={{ transform: `translateY(${scanProgress * 2.5}px)` }}
                                    />
                                    <QrCodeIcon size={80} className="text-teal-500/50" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 animate-in zoom-in-95">
                                    <CheckCircle2 size={80} className="text-teal-400 animate-pulse" />
                                </div>
                            )}
                        </div>
                        <p className="text-teal-400 font-mono text-sm">Authenticating Deep Clean Station... {scanProgress}%</p>
                        <button
                            onClick={() => {
                                setIsScanning(false);
                                setActiveScanItem(null);
                            }}
                            className="text-gray-500 hover:text-white transition-colors text-sm underline mt-4"
                        >
                            Abort Verification
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CleaningDashboard;
