import React, { useState } from 'react';
import { ClipboardList, AlertCircle, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';

interface AuditItem {
    id: string;
    item: string;
    location: string;
    expectedQty: number; // Hidden from crew initially
    actualQty: number | null;
    status: 'PENDING' | 'COUNTED' | 'DISCREPANCY';
}

const mockAuditQueue: AuditItem[] = [
    { id: '1', item: 'Aether Crystal Replica', location: 'Shelf G-04', expectedQty: 15, actualQty: null, status: 'PENDING' },
    { id: '2', item: 'Zone 4 T-Shirt (L)', location: 'Rack 2, Top', expectedQty: 45, actualQty: null, status: 'PENDING' },
    { id: '3', item: 'Bioluminescent Lantern', location: 'Display C', expectedQty: 8, actualQty: null, status: 'PENDING' },
];

const RetailAuditTab: React.FC = () => {
    const [queue, setQueue] = useState<AuditItem[]>(mockAuditQueue);
    const [activeAuditIndex, setActiveAuditIndex] = useState<number | null>(null);
    const [inputCount, setInputCount] = useState<string>('');
    const [auditState, setAuditState] = useState<'INPUT' | 'REVIEW'>('INPUT');

    const activeItem = activeAuditIndex !== null ? queue[activeAuditIndex] : null;

    const handleKeypadPress = (num: string) => {
        if (inputCount.length < 4) {
            setInputCount(prev => prev === '0' ? num : prev + num);
        }
    };

    const handleDelete = () => {
        setInputCount(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setInputCount('');
    };

    const handleSubmitCount = () => {
        if (!inputCount || !activeItem) return;

        const count = parseInt(inputCount, 10);

        const updatedQueue = [...queue];
        const itemIndex = queue.findIndex(i => i.id === activeItem.id);

        if (itemIndex !== -1) {
            const hasDiscrepancy = count !== activeItem.expectedQty;
            updatedQueue[itemIndex] = {
                ...activeItem,
                actualQty: count,
                status: hasDiscrepancy ? 'DISCREPANCY' : 'COUNTED'
            };
            setQueue(updatedQueue);
            setAuditState('REVIEW');
        }
    };

    const handleNext = () => {
        setAuditState('INPUT');
        setInputCount('');

        // Find next pending
        const nextPendingIndex = queue.findIndex(item => item.status === 'PENDING');
        if (nextPendingIndex !== -1) {
            setActiveAuditIndex(nextPendingIndex);
        } else {
            setActiveAuditIndex(null); // All done
        }
    };

    const handleRecount = () => {
        setAuditState('INPUT');
        setInputCount('');
    };

    if (activeItem) {
        return (
            <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
                <button
                    onClick={() => setActiveAuditIndex(null)}
                    className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group absolute top-4 md:top-6 left-4 md:left-6 z-10"
                >
                    <div className="w-10 h-10 rounded-full bg-[#2d3142] flex items-center justify-center border border-gray-700 group-hover:bg-gray-800 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><path d="m15 18-6-6 6-6" /></svg>
                    </div>
                </button>

                <div className="flex-1 flex flex-col max-w-md mx-auto w-full mt-12 md:mt-4 h-full relative">

                    {/* Item Info Card */}
                    <div className="bg-[#2d3142] rounded-3xl border border-gray-700 p-6 flex flex-col items-center text-center shadow-xl z-10 mb-6 shrink-0">
                        <div className="w-20 h-20 bg-[#1a1d29] border border-gray-600 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
                            <ClipboardList size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{activeItem.item}</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1d29] rounded-lg border border-gray-600">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Location:</span>
                            <span className="text-sm text-blue-400 font-mono font-bold">{activeItem.location}</span>
                        </div>
                    </div>

                    {auditState === 'INPUT' ? (
                        <>
                            {/* Display */}
                            <div className="bg-[#1a1d29] border-2 border-[#2d3142] rounded-3xl p-6 flex flex-col items-center justify-center mb-6 shrink-0">
                                <span className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Count Input</span>
                                <div className={`text-6xl font-black font-mono tracking-wider h-16 ${inputCount ? 'text-white' : 'text-gray-700'}`}>
                                    {inputCount || '0'}
                                </div>
                            </div>

                            {/* Keypad */}
                            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 flex-1 max-h-[400px]">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleKeypadPress(num.toString())}
                                        className="bg-[#2d3142] hover:bg-gray-700 active:bg-gray-600 rounded-2xl text-2xl font-bold font-mono text-white flex items-center justify-center transition-colors border border-gray-700/50 shadow-lg active:scale-95"
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button
                                    onClick={handleClear}
                                    className="bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center transition-colors border border-red-500/20 active:scale-95"
                                >
                                    Clr
                                </button>
                                <button
                                    onClick={() => handleKeypadPress('0')}
                                    className="bg-[#2d3142] hover:bg-gray-700 active:bg-gray-600 rounded-2xl text-2xl font-bold font-mono text-white flex items-center justify-center transition-colors border border-gray-700/50 shadow-lg active:scale-95"
                                >
                                    0
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-gray-600/20 hover:bg-gray-600/30 active:bg-gray-600/40 text-gray-300 rounded-2xl flex items-center justify-center transition-colors border border-gray-600/30 active:scale-95"
                                >
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" /><line x1="18" y1="9" x2="12" y2="15" /><line x1="12" y1="9" x2="18" y2="15" /></svg>
                                </button>
                            </div>

                            <button
                                onClick={handleSubmitCount}
                                disabled={!inputCount}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shrink-0 mb-6 ${inputCount
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 hover:-translate-y-1 active:scale-95'
                                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                <CheckCircle2 size={24} /> Submit Count
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                            {/* Review Screen */}
                            {activeItem.status === 'DISCREPANCY' ? (
                                <div className="text-center w-full">
                                    <div className="w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500/30 flex items-center justify-center mx-auto mb-6">
                                        <XCircle size={48} className="text-red-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Count Mismatch</h3>
                                    <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                                        Your count does not match the expected system quantity. Please verify the shelf and try again.
                                    </p>

                                    <div className="flex flex-col gap-4 w-full">
                                        <button
                                            onClick={handleRecount}
                                            className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1 active:scale-95"
                                        >
                                            RE-COUNT ITEM
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="w-full py-5 rounded-2xl bg-[#2d3142] hover:bg-gray-700 text-gray-300 font-bold uppercase tracking-wider border border-gray-600 transition-colors"
                                        >
                                            Skip for now
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center w-full">
                                    <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500/30 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={48} className="text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Count Verified</h3>
                                    <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                                        Inventory levels are accurate. Thank you.
                                    </p>

                                    <button
                                        onClick={handleNext}
                                        className="w-full py-5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-[0.1em] shadow-lg shadow-green-900/20 transition-all flex justify-center items-center gap-2 hover:-translate-y-1 active:scale-95"
                                    >
                                        Next Item <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const pendingCount = queue.filter(i => i.status === 'PENDING').length;

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white relative">
            <div className="mb-6 md:mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-2">
                        <ClipboardList className="text-purple-400" size={32} /> Cycle Counts
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">Perform "blind" audits to verify physical inventory levels.</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-white">{pendingCount}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">To Count</div>
                </div>
            </div>

            <div className="flex-1 overflow-auto -mx-4 px-4 custom-scrollbar pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {queue.map((item, idx) => (
                        <div
                            key={item.id}
                            onClick={() => item.status === 'PENDING' ? setActiveAuditIndex(idx) : null}
                            className={`bg-[#2d3142] rounded-2xl p-5 border transition-all relative overflow-hidden group ${item.status === 'PENDING'
                                    ? 'border-gray-600 hover:border-blue-500/50 cursor-pointer shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1'
                                    : 'border-gray-700 opacity-60'
                                }`}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'COUNTED' ? 'bg-green-500' :
                                    item.status === 'DISCREPANCY' ? 'bg-red-500' :
                                        'bg-transparent'
                                }`} />

                            <div className="flex justify-between items-start mb-4">
                                <div className="inline-flex items-center gap-2 px-2 py-1 bg-[#1a1d29] rounded border border-gray-700">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Loc:</span>
                                    <span className="text-xs text-blue-400 font-mono font-bold">{item.location}</span>
                                </div>

                                {item.status !== 'PENDING' && (
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${item.status === 'COUNTED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'
                                        }`}>
                                        {item.status}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">{item.item}</h3>

                            <div className="flex items-center justify-between border-t border-gray-700/50 pt-4 mt-auto">
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    {item.status === 'PENDING' ? 'Action Required' : 'Audit Completed'}
                                </div>
                                {item.status === 'PENDING' ? (
                                    <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm font-bold">
                                        Start Count <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <div className="font-mono font-bold text-gray-400">
                                        Qty: {item.actualQty}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {queue.length === 0 && (
                    <div className="text-center py-12">
                        <ClipboardList className="text-gray-600 w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-bold mb-1">Queue Empty</h3>
                        <p className="text-gray-600 text-sm">No cycle counts scheduled at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RetailAuditTab;
