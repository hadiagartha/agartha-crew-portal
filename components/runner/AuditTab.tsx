import React, { useState } from 'react';
import { ClipboardCheck, EyeOff, CheckCircle2, AlertCircle, RefreshCw, ShieldAlert, Lock, UserCheck, ArrowRight } from 'lucide-react';
import { useGlobalState } from '../GlobalStateContext';

const AuditTab: React.FC = () => {
    const { audit_requests, updateAuditRequest } = useGlobalState();
    const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
    const [count, setCount] = useState('');
    const [showResult, setShowResult] = useState(false);

    const selectedAudit = audit_requests.find(a => a.id === selectedAuditId);

    const handleSubmitCount = () => {
        if (!selectedAudit || !count) return;

        const physical = parseInt(count, 10);
        updateAuditRequest(selectedAudit.id, physical);
        setShowResult(true);
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
                                    <div className="space-y-8">
                                        <div className="bg-green-500/10 p-10 rounded-full w-40 h-40 mx-auto flex items-center justify-center border-2 border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                                            <CheckCircle2 size={80} className="text-green-500 animate-bounce" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Count Logged</h3>
                                            <p className="text-gray-400 font-medium leading-relaxed">The physical count has been submitted to the central ledger.</p>
                                        </div>
                                        <button onClick={() => setSelectedAuditId(null)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
                                            Next Audit Request
                                        </button>
                                    </div>
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
