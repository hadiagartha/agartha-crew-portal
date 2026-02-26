import React, { useState, useEffect, useRef } from 'react';
import {
    FileText, Timer, ShieldAlert, PenTool, Lock, Unlock,
    MapPin, Camera, CheckSquare, Settings2, Download, QrCode, X
} from 'lucide-react';
import { StaffMember } from '../types';

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
    timeLimitMinutes: 15 // Short limit for demo
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
            // Dispatch forced logout via callback
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
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} `;
    };

    const attemptZoneUnlock = () => {
        setValidationStep(1);
        setScanProgress(0);

        // Simulate scan
        const simulateProgress = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(simulateProgress);

                    // FOR DEMO: 80% chance to scan the correct zone, 20% chance to fail
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
                return prev + 15;
            });
        }, 100);
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

    // 1. Initial State (Expired)
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
        <div className="flex flex-col h-full bg-[#1a1d29] max-w-4xl mx-auto w-full">
            {/* Top Warning Banner & Timer */}
            <div className="bg-yellow-400/10 border-b border-yellow-400/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-yellow-400" size={24} />
                    <div>
                        <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest">Restricted Vendor Access</h2>
                        <p className="text-xs text-yellow-500/70">Session logged. Actions monitored.</p>
                    </div>
                </div>
                <div className="bg-black/40 border border-yellow-400/30 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                    <Timer className={timeLeft < 300 ? "text-red-500 animate-pulse" : "text-yellow-400"} size={18} />
                    <span className={`text - xl font - mono font - bold ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white"} `}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">

                {/* Work Order Focus */}
                <div className="bg-[#2d3142] border border-gray-700 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
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
                                className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold shadow-lg shadow-yellow-400/20 hover:-translate-y-0.5 transition-transform"
                            >
                                Unlock Location
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fadeIn space-y-8">
                            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 w-fit px-4 py-2 rounded-lg border border-green-500/20">
                                <Unlock size={18} /> Zone Access Verified
                            </div>

                            {/* Restricted Tooling */}
                            <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute right-[-40px] top-[-40px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                    <Settings2 size={200} />
                                </div>
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    {CONST_WORK_ORDER.toolType === 'CALIBRATION' ? <Settings2 size={18} className="text-blue-400" /> : <Download size={18} className="text-blue-400" />}
                                    {CONST_WORK_ORDER.toolType === 'CALIBRATION' ? 'Calibration Interface' : 'Firmware Updater'}
                                </h3>

                                {/* Fake Tool UI */}
                                <div className="bg-black/40 rounded border border-gray-800 p-6 mb-6">
                                    {CONST_WORK_ORDER.toolType === 'CALIBRATION' ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-xs text-gray-500 font-mono">
                                                <span>LENS FOCUS Z-INDEX</span>
                                                <span className="text-blue-400">{activeToolProgress > 0 ? 'SYNCING...' : 'IDLE'}</span>
                                            </div>
                                            <input
                                                type="range"
                                                disabled={isToolComplete}
                                                onChange={(e) => {
                                                    if (parseInt(e.target.value) > 80 && !isToolComplete) simulateToolAction();
                                                }}
                                                className="w-full accent-blue-500"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-blue-400 font-mono">
                                                <span>v4.12.8 Upload</span>
                                                <span>{activeToolProgress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 transition-all duration-100 ease-linear" style={{ width: `${activeToolProgress}% ` }} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {!isToolComplete ? (
                                    <button
                                        onClick={simulateToolAction}
                                        className="w-full bg-[#2d3142] hover:bg-[#343a4f] text-white py-3 rounded-lg font-bold border border-gray-700 transition-colors"
                                    >
                                        {CONST_WORK_ORDER.toolType === 'CALIBRATION' ? 'Run Auto-Calibration Sequence' : 'Start Push'}
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-green-400 font-bold py-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <CheckSquare size={18} /> Operation Successful
                                    </div>
                                )}
                            </div>

                            {/* Proof & Resolution */}
                            {isToolComplete && (
                                <div className="animate-fadeIn pt-4 border-t border-gray-700 space-y-6">
                                    <h3 className="text-white font-bold">Sign-off & Resolution</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setValidationStep(2)}
                                            className={`flex items - center justify - center gap - 3 p - 4 rounded - xl border ${validationStep > 2 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-black/20 border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400'} transition - colors`}
                                        >
                                            {validationStep > 2 ? <CheckSquare size={20} /> : <Camera size={20} />}
                                            1. Attach Visual Proof
                                        </button>

                                        <button
                                            disabled={validationStep < 2}
                                            onClick={() => setValidationStep(3)}
                                            className={`flex items - center justify - center gap - 3 p - 4 rounded - xl border ${isSigned ? 'bg-green-500/10 border-green-500/30 text-green-400' : validationStep >= 2 ? 'bg-black/20 border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400 opacity-100' : 'bg-black/20 border-gray-800 text-gray-600 opacity-50 cursor-not-allowed'} transition - colors`}
                                        >
                                            {isSigned ? <CheckSquare size={20} /> : <PenTool size={20} />}
                                            2. Digital Signature
                                        </button>
                                    </div>

                                    {/* Complete Task */}
                                    <button
                                        disabled={!isSigned}
                                        onClick={() => onLogout()} // Completing it ends the session for vendors
                                        className={`w - full py - 4 rounded - lg font - bold text - lg shadow - lg transition - all ${isSigned ? 'bg-green-500 text-black hover:-translate-y-0.5 shadow-green-500/20' : 'bg-[#2d3142] text-gray-500 cursor-not-allowed border border-gray-700'} `}
                                    >
                                        Complete Work Order & Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* OVERLAYS (Scan / Photo / Sign) */}
            {validationStep > 0 && (
                <div className="fixed inset-0 z-[110] bg-[#1a1d29]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fadeIn">
                    <button
                        onClick={() => setValidationStep(0)}
                        className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors"
                        title="Cancel Validation"
                    >
                        <X size={32} />
                    </button>
                    <div className="max-w-md w-full flex flex-col items-center text-center animate-fadeIn">

                        {validationStep === 1 && (
                            <>
                                <div className="w-16 h-16 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mb-4">
                                    <Lock size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Zone Enforcement</h2>
                                <p className="text-gray-400 mb-8 text-sm">Please scan the physical Zone Marker for {CONST_WORK_ORDER.targetZone}. Scanning unauthorized zones will trigger a security event.</p>

                                <div className="relative w-full aspect-square bg-black rounded-3xl border border-[#2d3142] overflow-hidden shadow-2xl mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50" />
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(250,204,21,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(250,204,21,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                    <div className="absolute inset-8 border-2 border-yellow-400/30 rounded-xl flex items-center justify-center animate-pulse">
                                        <QrCode size={64} className="text-yellow-400/50" />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between text-xs text-yellow-400 font-mono mb-2">
                                        <span>VALIDATING LOCATION...</span>
                                        <span>{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className="h-1 bg-[#2d3142] rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 transition-all duration-100 ease-linear" style={{ width: `${scanProgress}% ` }} />
                                    </div>
                                </div>
                            </>
                        )}

                        {validationStep === 2 && (
                            <>
                                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <Camera size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Attach Visual Proof</h2>
                                <p className="text-gray-400 mb-8 text-sm">Upload a photo of the completed work reflecting the Scope of Work.</p>

                                <div className="relative w-full aspect-[4/3] bg-[#2d3142] rounded-2xl border-2 border-dashed border-gray-600 flex justify-center items-center hover:border-yellow-400 cursor-pointer overflow-hidden transition-colors">
                                    <span className="text-gray-400 font-bold">Tap to emulate capture</span>
                                    <button
                                        onClick={() => setValidationStep(3)} // Move straight to signature
                                        className="absolute inset-0 w-full h-full z-10 opacity-0"
                                        aria-label="Simulate taking photo"
                                    />
                                </div>
                            </>
                        )}

                        {validationStep === 3 && (
                            <>
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                                    <PenTool size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Digital Signature</h2>
                                <p className="text-gray-400 mb-8 text-sm">Acknowledge completion of {CONST_WORK_ORDER.id}.</p>

                                <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 relative hover:cursor-crosshair flex items-center justify-center">
                                    <span className="text-gray-300 font-italic text-2xl rotate-[-10deg] opacity-50 user-select-none">Sign Here</span>
                                    {/* Simulating signing area */}
                                    <button
                                        onClick={() => {
                                            setIsSigned(true);
                                            setValidationStep(0);
                                        }}
                                        className="absolute inset-0 w-full h-full z-10 opacity-0"
                                        title="Simulate Signature"
                                        aria-label="Click to sign"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExternalMaintenanceDashboard;
