import React, { useState, useEffect, useRef } from 'react';
import {
    FileText, Timer, ShieldAlert, PenTool, Lock, Unlock,
    MapPin, Camera, CheckSquare, Settings2, Download, QrCode, X,
    Wrench
} from 'lucide-react';
import { StaffMember } from '../../types';

interface ExternalMaintenanceProps {
    staff: StaffMember;
    onLogout: () => void;
    onSecurityAlert: (description: string) => void;
}

// Mock Work Order linked to the specific EXT-01 vendor
interface VendorWorkOrder {
    id: string;
    vendorId: string;
    title: string;
    scopeOfWork: string;
    targetZone: string;
    toolType: 'FIRMWARE' | 'CALIBRATION';
    timeLimitMinutes: number;
}

const CONST_WORK_ORDER: VendorWorkOrder = {
    id: 'WO-9942-EXT',
    vendorId: 'EXT-01',
    title: 'Holo-Projector Array Alignment',
    scopeOfWork: 'Vendor is authorized to recalibrate the primary lens focusing and update firmware for the Holo-Projector Array located in Zone 01. Must verify sharp edge projection.',
    targetZone: 'Z-01',
    toolType: 'CALIBRATION',
    timeLimitMinutes: 15
};

const ExternalMaintenanceDashboard: React.FC<ExternalMaintenanceProps> = ({
    staff,
    onLogout,
    onSecurityAlert
}) => {
    // Timer State
    const [timeLeft, setTimeLeft] = useState(CONST_WORK_ORDER.timeLimitMinutes * 60);
    const [isExpired, setIsExpired] = useState(false);

    // Workflow State
    const [isZoneUnlocked, setIsZoneUnlocked] = useState(false);
    const [isToolComplete, setIsToolComplete] = useState(false);
    const [activeToolProgress, setActiveToolProgress] = useState(0);

    // Validation State (Step 0: Not started, 1: Scanning, 2: Photo, 3: Sign)
    const [validationStep, setValidationStep] = useState<0 | 1 | 2 | 3>(0);
    const [scanProgress, setScanProgress] = useState(0);
    const [isSigned, setIsSigned] = useState(false);

    const tempIntervalRef = useRef<number | null>(null);

    // Countdown Logic
    useEffect(() => {
        if (timeLeft <= 0 && !isExpired) {
            setIsExpired(true);
            setTimeout(() => onLogout(), 3000);
        }

        if (timeLeft > 0) {
            const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft, isExpired, onLogout]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const attemptZoneUnlock = () => {
        setValidationStep(1);
        setScanProgress(0);

        const simulateProgress = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(simulateProgress);
                    const isCorrectZone = Math.random() > 0.2;
                    if (isCorrectZone) {
                        setIsZoneUnlocked(true);
                        setValidationStep(0);
                    } else {
                        setValidationStep(0);
                        onSecurityAlert(`Unauthorized access attempt by Vendor(${staff.staff_id}) outside assigned ${CONST_WORK_ORDER.targetZone}.`);
                    }
                    return 100;
                }
                return prev + 25;
            });
        }, 80);
    };

    const simulateToolAction = () => {
        setActiveToolProgress(0);
        if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);

        tempIntervalRef.current = window.setInterval(() => {
            setActiveToolProgress(prev => {
                if (prev >= 100) {
                    clearInterval(tempIntervalRef.current!);
                    setIsToolComplete(true);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    if (isExpired) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-[#2d3142] border border-red-500/30 rounded-2xl shadow-2xl h-full animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 animate-pulse">
                    <Lock className="text-red-400 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 text-center">Access Window Expired</h2>
                <p className="text-gray-400 text-center max-w-md mb-8">
                    Your authorized time limit for this vendor session has elapsed. The connection is being automatically terminated.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] w-full max-w-6xl mx-auto">
            {/* Top Header Stats */}
            <div className="flex-none p-4 md:p-6 border-b border-yellow-400/20 flex flex-wrap gap-4 md:gap-6 justify-between items-center bg-[#1a1d29]/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                        <Wrench size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">External Maintenance</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest">{staff.staff_id}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Active Vendor Session</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-black/40 border border-yellow-400/30 px-4 md:px-6 py-1.5 md:py-2 rounded-full flex items-center gap-2 md:gap-3 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                        <Timer className={timeLeft < 300 ? "text-red-500 animate-pulse" : "text-yellow-400"} size={18} />
                        <span className={`text-lg md:text-xl font-mono font-bold ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white"}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 lg:overflow-y-auto p-4 md:p-6 lg:p-10 hide-scrollbar scroll-smooth">
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                        {/* Work Order Focus */}
                        <div className="bg-[#2d3142] border border-gray-700 rounded-2xl p-6 lg:p-8 relative overflow-hidden h-fit">
                            <div className="absolute top-0 right-0 p-4 border-l border-b border-gray-700 rounded-bl-xl bg-black/20 text-xs font-mono text-gray-400">
                                {CONST_WORK_ORDER.id}
                            </div>

                            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 pr-24">{CONST_WORK_ORDER.title}</h1>
                            <div className="flex items-center gap-2 mb-6 text-sm text-yellow-400 font-bold bg-yellow-400/10 w-fit px-3 py-1 rounded">
                                <MapPin size={16} /> TARGET ZONE: {CONST_WORK_ORDER.targetZone}
                            </div>

                            <div className="bg-black/20 border border-white/5 rounded-xl p-5 mb-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <FileText size={14} /> Scope of Work
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                    {CONST_WORK_ORDER.scopeOfWork}
                                </p>
                            </div>

                            {/* Zone Lock Area */}
                            {!isZoneUnlocked ? (
                                <div className="border border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center text-center bg-black/10">
                                    <Lock size={32} className="text-gray-500 mb-4" />
                                    <h3 className="text-white font-bold mb-2">Zone Authorization Required</h3>
                                    <p className="text-gray-400 text-sm max-w-sm mb-6">
                                        You must physically scan into {CONST_WORK_ORDER.targetZone} before accessing the authorized toolset. Scanning the wrong zone will flag Security.
                                    </p>
                                    <button
                                        onClick={attemptZoneUnlock}
                                        className="w-full sm:w-auto bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold shadow-lg shadow-yellow-400/20 hover:-translate-y-0.5 transition-transform"
                                    >
                                        Unlock Location
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-fadeIn space-y-6">
                                    <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 w-fit px-4 py-2 rounded-lg border border-green-500/20">
                                        <Unlock size={18} /> Zone Access Verified
                                    </div>

                                    {/* Tooling UI Placeholder */}
                                    <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-6 relative overflow-hidden group">
                                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                            <Settings2 size={18} className="text-blue-400" /> Authorized Toolset
                                        </h3>
                                        <div className="bg-black/40 rounded border border-gray-800 p-4 mb-4">
                                            <div className="flex justify-between text-xs text-blue-400 font-mono mb-2">
                                                <span>{CONST_WORK_ORDER.toolType} PROGRESS</span>
                                                <span>{activeToolProgress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 transition-all duration-100 ease-linear" style={{ width: `${activeToolProgress}%` }} />
                                            </div>
                                        </div>
                                        {!isToolComplete ? (
                                            <button
                                                onClick={simulateToolAction}
                                                className="w-full bg-[#3e445b] hover:bg-[#4a516d] text-white py-3 rounded-lg font-bold transition-colors"
                                            >
                                                Execute Operation
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-green-400 font-bold py-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                                <CheckSquare size={18} /> Operation Successful
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sign-off & Resolution */}
                        <div className={`space-y-6 ${!isToolComplete ? 'opacity-50 pointer-events-none' : 'animate-fadeIn'}`}>
                            <div className="bg-[#2d3142] border border-gray-700 rounded-2xl p-6 lg:p-8">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <ShieldAlert size={20} className="text-yellow-400" /> Sign-off & Resolution
                                </h3>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setValidationStep(2)}
                                        className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border ${validationStep > 2 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-black/20 border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400'} transition-colors`}
                                    >
                                        {validationStep > 2 ? <CheckSquare size={20} /> : <Camera size={20} />}
                                        1. Attach Visual Proof
                                    </button>

                                    <button
                                        disabled={validationStep < 2}
                                        onClick={() => setValidationStep(3)}
                                        className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border ${isSigned ? 'bg-green-500/10 border-green-500/30 text-green-400' : validationStep >= 2 ? 'bg-black/20 border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400' : 'opacity-30 cursor-not-allowed border-gray-800 text-gray-600'} transition-colors`}
                                    >
                                        {isSigned ? <CheckSquare size={20} /> : <PenTool size={20} />}
                                        2. Digital Signature
                                    </button>
                                </div>

                                <button
                                    disabled={!isSigned}
                                    onClick={() => onLogout()}
                                    className={`w-full mt-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${isSigned ? 'bg-green-500 text-black hover:-translate-y-0.5 shadow-green-500/20' : 'bg-[#1a1d29] text-gray-600 cursor-not-allowed border border-gray-800'}`}
                                >
                                    Complete Work Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OVERLAYS (Scan / Photo / Sign) */}
            {validationStep > 0 && (
                <div className="fixed inset-0 z-[110] bg-[#1a1d29]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fadeIn">
                    <button onClick={() => setValidationStep(0)} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors">
                        <X size={32} />
                    </button>
                    <div className="max-w-md w-full flex flex-col items-center text-center">
                        {validationStep === 1 && (
                            <>
                                <div className="w-16 h-16 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mb-4">
                                    <QrCode size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Zone Enforcement</h2>
                                <p className="text-gray-400 mb-8 text-sm">Scan the physical Zone Marker for {CONST_WORK_ORDER.targetZone}.</p>
                                <div className="relative w-full aspect-square bg-black rounded-3xl border border-[#2d3142] overflow-hidden shadow-2xl mb-8">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 shadow-[0_0_20px_#facc15] animate-scan" style={{ animation: 'scan 2s ease-in-out infinite' }} />
                                    <div className="absolute inset-8 border-2 border-yellow-400/30 rounded-xl flex items-center justify-center">
                                        <QrCode size={64} className="text-yellow-400/50 animate-pulse" />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between text-xs text-yellow-400 font-mono mb-2">
                                        <span>VALIDATING...</span>
                                        <span>{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-[#2d3142] rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 transition-all duration-100 ease-linear" style={{ width: `${scanProgress}%` }} />
                                    </div>
                                </div>
                            </>
                        )}
                        {validationStep === 2 && (
                            <div className="w-full flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <Camera size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Attach Visual Proof</h2>
                                <p className="text-gray-400 mb-8 text-sm">Simulate capturing a photo of the completed work.</p>
                                <div
                                    onClick={() => setValidationStep(3)}
                                    className="w-full aspect-[4/3] bg-black rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors group"
                                >
                                    <Camera size={48} className="text-gray-600 mb-4 group-hover:text-yellow-400 transition-colors" />
                                    <span className="text-gray-500 font-bold group-hover:text-white">Tap to Capture</span>
                                </div>
                            </div>
                        )}
                        {validationStep === 3 && (
                            <div className="w-full flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                                    <PenTool size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Digital Signature</h2>
                                <p className="text-gray-400 mb-8 text-sm">Acknowledge completion of {CONST_WORK_ORDER.id}.</p>
                                <div
                                    onClick={() => { setIsSigned(true); setValidationStep(0); }}
                                    className="w-full h-48 bg-white/5 border border-gray-700 rounded-2xl flex items-center justify-center cursor-crosshair relative group overflow-hidden"
                                >
                                    <span className="text-gray-600 italic select-none">Sign Here</span>
                                    <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExternalMaintenanceDashboard;
