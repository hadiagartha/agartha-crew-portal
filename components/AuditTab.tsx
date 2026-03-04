import React, { useState } from 'react';
import { ClipboardCheck, EyeOff, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useGlobalState } from './GlobalStateContext';

const AuditTab: React.FC = () => {
    const { audit_requests, updateAuditRequest } = useGlobalState();
    const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
    const [count, setCount] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [resultType, setResultType] = useState<'SUCCESS' | 'MISMATCH'>('SUCCESS');

    const selectedAudit = audit_requests.find(a => a.id === selectedAuditId);

    const handleSubmitCount = () => {
        if (!selectedAudit || !count) return;

        const physical = parseInt(count, 10);
        const expected = selectedAudit.expectedQty || 0;

        if (physical === expected) {
            setResultType('SUCCESS');
            updateAuditRequest(selectedAudit.id, physical);
        } else {
            setResultType('MISMATCH');
        }
        setShowResult(true);
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Audit Requests List */}
                <div className="bg-[#2d3142]/50 p-6 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ClipboardCheck className="text-purple-400" size={20} /> Active Audits
                    </h3>
                    <div className="space-y-3">
                        {audit_requests.map(audit => (
                            <button
                                key={audit.id}
                                onClick={() => { setSelectedAuditId(audit.id); setShowResult(false); setCount(''); }}
                                className={`w-full p-4 rounded-xl border text-left transition-all ${selectedAuditId === audit.id
                                        ? 'bg-purple-500/20 border-purple-500'
                                        : 'bg-[#1a1d29] border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="text-white font-bold">{audit.item}</div>
                                <div className="text-xs text-gray-500 mt-1">{audit.section} • {audit.unit}</div>
                                {audit.status === 'COMPLETED' && (
                                    <div className="mt-2 text-[10px] text-green-400 font-bold flex items-center gap-1">
                                        <CheckCircle2 size={10} /> RECONCILED
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blind Count Interface */}
                <div className="lg:col-span-2">
                    {selectedAudit ? (
                        <div className="bg-[#2d3142] p-8 rounded-3xl border border-white/10 shadow-2xl h-full flex flex-col justify-center items-center text-center space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6">
                                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                                    <EyeOff size={14} className="text-purple-400" />
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Protocol: Blind Count Active</span>
                                </div>
                            </div>

                            {!showResult ? (
                                <>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-white">{selectedAudit.item}</h2>
                                        <p className="text-purple-400 font-bold uppercase tracking-widest text-xs">{selectedAudit.section}</p>
                                    </div>

                                    <div className="w-full max-w-xs space-y-4">
                                        <label className="text-xs text-gray-500 font-bold uppercase">Enter Physical Quantity Counted</label>
                                        <input
                                            type="number"
                                            className="w-full bg-[#1a1d29] border-4 border-purple-500/30 rounded-3xl px-6 py-6 text-5xl font-mono text-white text-center focus:border-purple-500 outline-none shadow-[inside_0_0_20px_rgba(168,85,247,0.1)] transition-all"
                                            value={count}
                                            onChange={e => setCount(e.target.value)}
                                            placeholder="00"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmitCount}
                                        disabled={!count}
                                        className="w-full max-w-xs bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all disabled:opacity-50"
                                    >
                                        VERIFY AUDIT DATA
                                    </button>
                                </>
                            ) : (
                                <div className="animate-zoomIn space-y-6">
                                    {resultType === 'SUCCESS' ? (
                                        <>
                                            <div className="bg-green-500/20 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center border-4 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                                <CheckCircle2 size={64} className="text-green-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white">RECONCILIATION MATCH</h3>
                                                <p className="text-gray-400 mt-2">Physical count matches system records. Data logged.</p>
                                            </div>
                                            <button onClick={() => setSelectedAuditId(null)} className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20">Return to Queue</button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-red-500/20 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center border-4 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                                                <AlertCircle size={64} className="text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white">VARIANCE DETECTED</h3>
                                                <p className="text-red-400 font-bold mt-2 uppercase tracking-tight">Recount Protocol Initiated</p>
                                                <p className="text-gray-500 text-sm mt-1 max-w-sm">The count entered does not match system expectations. Please perform a physical recount.</p>
                                            </div>
                                            <div className="flex gap-4 justify-center">
                                                <button onClick={() => setShowResult(false)} className="bg-red-600 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2">
                                                    <RefreshCw size={18} /> CONFIRM & RECOUNT
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full border-4 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-600 space-y-4">
                            <ClipboardCheck size={64} className="opacity-20" />
                            <p className="italic">Select an item from the queue to start blind audit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditTab;
