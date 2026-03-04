import React, { useState } from 'react';
import { ClipboardCheck, EyeOff, CheckCircle2, AlertCircle, RefreshCw, ShieldAlert, Lock, UserCheck, ArrowRight } from 'lucide-react';
import { useGlobalState } from './GlobalStateContext';

const AuditTab: React.FC = () => {
    const { audit_requests, updateAuditRequest } = useGlobalState();
    const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
    const [count, setCount] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [resultType, setResultType] = useState<'SUCCESS' | 'MISMATCH' | 'CRITICAL_VARIANCE'>('SUCCESS');
    const [recountAttempt, setRecountAttempt] = useState(0);
    const [managerCode, setManagerCode] = useState('');

    const selectedAudit = audit_requests.find(a => a.id === selectedAuditId);

    const handleSubmitCount = () => {
        if (!selectedAudit || !count) return;

        const physical = parseInt(count, 10);
        const expected = selectedAudit.expectedQty || 0;
        const variance = Math.abs(physical - expected);
        const variancePercentage = (variance / expected) * 100;

        if (physical === expected) {
            setResultType('SUCCESS');
            updateAuditRequest(selectedAudit.id, physical);
        } else if (variancePercentage > 20 && recountAttempt === 0) {
            // First time major variance > 20% triggers mandatory recount
            setResultType('MISMATCH');
            setRecountAttempt(1);
        } else if (variancePercentage > 20 && recountAttempt >= 1) {
            // Persistent major variance requires manager sign-off
            setResultType('CRITICAL_VARIANCE');
        } else {
            // Minor variance logged but accepted
            setResultType('SUCCESS');
            updateAuditRequest(selectedAudit.id, physical);
        }
        setShowResult(true);
    };

    const handleManagerOverride = () => {
        if (managerCode === '1234') { // Mock manager code
            if (selectedAudit && count) {
                updateAuditRequest(selectedAudit.id, parseInt(count, 10));
                window.alert('Manager Override Accepted: Variance Logged with Signature.');
                setSelectedAuditId(null);
                setShowResult(false);
                setRecountAttempt(0);
                setManagerCode('');
            }
        } else {
            window.alert('Invalid Manager Authorization Code.');
        }
    };

    const resetAudit = () => {
        setShowResult(false);
        setCount('');
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn pb-20 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Audit Queue */}
                <div className="space-y-6">
                    <div className="bg-[#2d3142]/50 p-6 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <ClipboardCheck className="text-purple-400" size={18} />
                            Audit Schedule
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {audit_requests.map(audit => (
                            <button
                                key={audit.id}
                                onClick={() => {
                                    setSelectedAuditId(audit.id);
                                    resetAudit();
                                    setRecountAttempt(0);
                                }}
                                className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${selectedAuditId === audit.id
                                    ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                                    : 'bg-black/20 border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="text-lg font-black tracking-tight">{audit.item}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <ShieldAlert size={10} className="text-purple-400" /> {audit.section}
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black uppercase text-gray-600 group-hover:text-white transition-colors">
                                        {audit.unit}
                                    </div>
                                </div>
                                {audit.status === 'COMPLETED' && (
                                    <div className="absolute top-0 right-0 p-2">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blind Count Engine */}
                <div className="lg:col-span-2">
                    {selectedAudit ? (
                        <div className="bg-[#1a1d31]/80 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl h-full flex flex-col justify-center items-center text-center space-y-10 relative overflow-hidden">
                            {/* Decorative Background Element */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

                            <div className="absolute top-8 left-8 flex items-center gap-2 bg-black/40 px-5 py-2.5 rounded-full border border-white/10">
                                <EyeOff size={16} className="text-purple-400" />
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Security: Blind Protocol Active</span>
                            </div>

                            {!showResult ? (
                                <>
                                    <div className="space-y-3">
                                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase">{selectedAudit.item}</h2>
                                        <p className="text-purple-400 font-black uppercase tracking-[0.3em] text-xs">Awaiting Physical Verification</p>
                                    </div>

                                    <div className="w-full max-w-sm space-y-6">
                                        <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6 block">Physical Count at Location</label>
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-none text-7xl font-mono text-white text-center focus:outline-none transition-all"
                                                value={count}
                                                onChange={e => setCount(e.target.value)}
                                                placeholder="000"
                                                autoFocus
                                            />
                                            <div className="text-[10px] text-purple-500/50 font-black uppercase mt-4 tracking-widest">Units: {selectedAudit.unit}</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmitCount}
                                        disabled={!count}
                                        className="w-full max-w-sm bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[2rem] shadow-2xl shadow-purple-900/30 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-20 disabled:grayscale"
                                    >
                                        VERIFY AUDIT BALANCE
                                    </button>
                                </>
                            ) : (
                                <div className="animate-zoomIn space-y-8 w-full max-w-md">
                                    {resultType === 'SUCCESS' && (
                                        <div className="space-y-8">
                                            <div className="bg-green-500/10 p-10 rounded-full w-40 h-40 mx-auto flex items-center justify-center border-2 border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                                                <CheckCircle2 size={80} className="text-green-500 animate-bounce" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Audit Synchronized</h3>
                                                <p className="text-gray-400 font-medium leading-relaxed">The physical count has been recorded in the central ledger.</p>
                                            </div>
                                            <button onClick={() => setSelectedAuditId(null)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
                                                Next Audit Request
                                            </button>
                                        </div>
                                    )}

                                    {resultType === 'MISMATCH' && (
                                        <div className="space-y-8">
                                            <div className="bg-orange-500/10 p-10 rounded-full w-40 h-40 mx-auto flex items-center justify-center border-2 border-orange-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
                                                <RefreshCw size={80} className="text-orange-500 animate-spin-slow" />
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Recount Triggered</h3>
                                                <p className="text-orange-400 font-black uppercase tracking-widest text-[10px]">Variance Threshold Exceeded</p>
                                                <p className="text-gray-500 text-sm max-w-xs mx-auto">The count deviates significantly from system records. Protocol requires a 2nd physical count.</p>
                                            </div>
                                            <button onClick={resetAudit} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                                <RefreshCw size={20} /> Restart Physical Count
                                            </button>
                                        </div>
                                    )}

                                    {resultType === 'CRITICAL_VARIANCE' && (
                                        <div className="space-y-8 bg-red-500/5 p-10 rounded-[3rem] border border-red-500/20">
                                            <div className="bg-red-500/10 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center border-2 border-red-500/30">
                                                <Lock size={60} className="text-red-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Critical Variance</h3>
                                                <p className="text-red-500 font-black uppercase tracking-widest text-[10px]">Manager Override Required</p>
                                                <p className="text-gray-500 text-sm">A persistent discrepancy was found after multiple physical recounts. Audit locked.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                                                    <input
                                                        type="password"
                                                        placeholder="Manager PIN"
                                                        className="w-full bg-black/40 border border-red-500/30 rounded-2xl pl-12 pr-4 py-4 text-white text-center tracking-[0.5em] focus:outline-none focus:border-red-500"
                                                        value={managerCode}
                                                        onChange={e => setManagerCode(e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleManagerOverride}
                                                    className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                                >
                                                    <UserCheck size={20} /> Authorize Variance
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full border-4 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-gray-700 space-y-6">
                            <div className="p-10 bg-white/2 rounded-full border border-white/5">
                                <EyeOff size={80} className="opacity-20" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="font-black uppercase tracking-[0.3em] text-[10px]">System Standby</p>
                                <p className="text-sm font-medium italic opacity-40">Select an item to begin physical audit reconciliation.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditTab;
