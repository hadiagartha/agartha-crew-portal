import React, { useState } from 'react';
import { AlertTriangle, Camera, ArrowRight, RefreshCw, UploadCloud, CheckCircle2 } from 'lucide-react';

interface DamageLog {
    id: string;
    item: string;
    quantity: number;
    reason: string;
    photoProof: boolean;
    synced: boolean;
    date: Date;
}

const initialLogs: DamageLog[] = [
    { id: 'DL-001', item: 'Zone 4 T-Shirt (M)', quantity: 1, reason: 'Torn seam', photoProof: true, synced: true, date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 'DL-002', item: 'Aether Crystal Replica', quantity: 2, reason: 'Scratched during transit', photoProof: true, synced: false, date: new Date(Date.now() - 1000 * 60 * 30) },
];

const mockCatalog = [
    'Leviathan Plushie',
    'Aether Crystal Replica',
    'Zone 4 T-Shirt (S)', 'Zone 4 T-Shirt (M)', 'Zone 4 T-Shirt (L)',
    'Bioluminescent Lantern',
    'Sector 7 Coffee Mug'
];

type ViewMode = 'LIST' | 'ENTRY';

const DamageReturnTab: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [logs, setLogs] = useState<DamageLog[]>(initialLogs);
    const [isSyncing, setIsSyncing] = useState(false);

    // Form State
    const [itemInput, setItemInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('1');
    const [reasonInput, setReasonInput] = useState('');
    const [hasPhoto, setHasPhoto] = useState(false);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setLogs(prev => prev.map(log => ({ ...log, synced: true })));
            setIsSyncing(false);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemInput || !quantityInput || !reasonInput) return;

        const newLog: DamageLog = {
            id: `DL-${Date.now().toString().slice(-4)}`,
            item: itemInput,
            quantity: parseInt(quantityInput, 10),
            reason: reasonInput,
            photoProof: hasPhoto,
            synced: false,
            date: new Date()
        };

        setLogs(prev => [newLog, ...prev]);

        // Reset form
        setItemInput('');
        setQuantityInput('1');
        setReasonInput('');
        setHasPhoto(false);
        setViewMode('LIST');
    };

    const pendingSyncCount = logs.filter(l => !l.synced).length;

    if (viewMode === 'ENTRY') {
        return (
            <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-y-auto">
                <button
                    onClick={() => setViewMode('LIST')}
                    className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
                >
                    <div className="w-10 h-10 rounded-full bg-[#2d3142] flex items-center justify-center border border-gray-700 group-hover:bg-gray-800 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><path d="m15 18-6-6 6-6" /></svg>
                    </div>
                    <div>
                        <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Cancel Entry</div>
                        <h2 className="text-xl sm:text-3xl font-bold">New Damage/Return Log</h2>
                    </div>
                </button>

                <div className="max-w-2xl mx-auto w-full">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Item Selection */}
                        <div className="bg-[#2d3142] p-5 rounded-2xl border border-gray-700 shadow-xl">
                            <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Item Detail</label>

                            <div className="space-y-4">
                                <div>
                                    <select
                                        value={itemInput}
                                        onChange={(e) => setItemInput(e.target.value)}
                                        className="w-full bg-[#1a1d29] border border-gray-600 rounded-xl px-4 py-3 sm:py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-colors appearance-none"
                                        required
                                    >
                                        <option value="" disabled>Select Item...</option>
                                        {mockCatalog.map(item => <option key={item} value={item}>{item}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <span className="text-gray-400 font-bold whitespace-nowrap">Quantity:</span>
                                    <div className="flex h-12 w-32 border border-gray-600 rounded-xl overflow-hidden">
                                        <button type="button" onClick={() => setQuantityInput(String(Math.max(1, parseInt(quantityInput) - 1)))} className="flex-1 bg-[#1a1d29] hover:bg-white/5 active:bg-white/10 font-bold text-xl border-r border-gray-600 transition-colors">-</button>
                                        <input type="number" min="1" value={quantityInput} onChange={(e) => setQuantityInput(e.target.value)} className="w-12 bg-[#2d3142] text-center font-bold text-lg focus:outline-none hide-arrows" />
                                        <button type="button" onClick={() => setQuantityInput(String(parseInt(quantityInput) + 1))} className="flex-1 bg-[#1a1d29] hover:bg-white/5 active:bg-white/10 font-bold text-xl border-l border-gray-600 transition-colors">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reason Selection */}
                        <div className="bg-[#2d3142] p-5 rounded-2xl border border-gray-700 shadow-xl">
                            <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Reason for write-off</label>
                            <select
                                value={reasonInput}
                                onChange={(e) => setReasonInput(e.target.value)}
                                className="w-full bg-[#1a1d29] border border-gray-600 rounded-xl px-4 py-3 sm:py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-colors appearance-none"
                                required
                            >
                                <option value="" disabled>Select Reason...</option>
                                <option value="Defective / Damaged in Transit">Defective / Damaged in Transit</option>
                                <option value="Customer Return (Resalable)">Customer Return (Resalable)</option>
                                <option value="Customer Return (Damaged)">Customer Return (Damaged)</option>
                                <option value="Display Item Written Off">Display Item Written Off</option>
                            </select>
                        </div>

                        {/* Photo Evidence */}
                        <div className="bg-[#2d3142] p-5 rounded-2xl border border-gray-700 shadow-xl">
                            <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Photo Evidence (Required)</label>

                            <button
                                type="button"
                                onClick={() => setHasPhoto(true)}
                                className={`w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border-2 border-dashed ${hasPhoto
                                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                        : 'bg-[#1a1d29] border-gray-600 hover:border-red-400 text-gray-400 hover:text-red-400'
                                    }`}
                            >
                                {hasPhoto ? (
                                    <>
                                        <CheckCircle2 size={32} />
                                        <span className="font-bold">Photo Captured</span>
                                    </>
                                ) : (
                                    <>
                                        <Camera size={32} className="mb-2" />
                                        <span className="font-bold">Tap to Launch Camera</span>
                                        <span className="text-xs">Physical inspection proof required</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!itemInput || !quantityInput || !reasonInput || !hasPhoto}
                            className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 ${!itemInput || !quantityInput || !reasonInput || !hasPhoto
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:-translate-y-1'
                                }`}
                        >
                            <AlertTriangle size={20} /> SUBMIT LOG ENTRY
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn">
            {/* Header section with mobile considerations */}
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142]">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                            <AlertTriangle className="text-red-400" /> Damage & Returns
                        </h2>
                        <p className="text-gray-400 text-sm">Document defective goods or customer returns.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                        onClick={() => setViewMode('ENTRY')}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                    >
                        <Camera size={20} /> New Log Entry
                    </button>

                    <button
                        onClick={handleSync}
                        disabled={pendingSyncCount === 0 || isSyncing}
                        className={`sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${pendingSyncCount > 0 && !isSyncing
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isSyncing ? (
                            <><RefreshCw size={20} className="animate-spin" /> Syncing...</>
                        ) : (
                            <><UploadCloud size={20} /> Sync ({pendingSyncCount})</>
                        )}
                    </button>
                </div>
            </div>

            {/* List View */}
            <div className="flex-1 overflow-auto p-4 md:p-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {logs.map(log => (
                        <div key={log.id} className="bg-[#2d3142] rounded-2xl border border-gray-700 p-4 md:p-5 flex flex-col sm:flex-row justify-between gap-4 relative overflow-hidden group">
                            {/* Sync Status border indicator */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${log.synced ? 'bg-green-500' : 'bg-yellow-500'}`}></div>

                            <div className="pl-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-mono text-gray-500 bg-black/30 px-2 py-0.5 rounded border border-gray-700">
                                        {log.id}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {log.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &middot; {log.date.toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{log.item}</h3>
                                <p className="text-sm text-gray-400 mb-2">Reason: <span className="text-gray-300">{log.reason}</span></p>

                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${log.synced ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {log.synced ? <CheckCircle2 size={12} /> : <UploadCloud size={12} />}
                                    {log.synced ? 'Synced' : 'Pending Sync'}
                                </span>
                            </div>

                            <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t border-gray-700 sm:border-0 pt-3 sm:pt-0">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1 hidden sm:block">Qty</div>
                                    <div className="text-xl font-black text-white">{log.quantity} <span className="text-sm text-gray-400 font-normal sm:hidden">units</span></div>
                                </div>

                                <div className="flex items-center gap-1 text-gray-500" title="Photo Attached">
                                    <Camera size={16} className={log.photoProof ? 'text-blue-400' : ''} />
                                    <span className="text-xs font-bold">{log.photoProof ? 'Attached' : 'Missing'}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {logs.length === 0 && (
                        <div className="text-center py-12">
                            <AlertTriangle className="text-gray-600 w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-gray-400 font-bold mb-1">No Damage Logs</h3>
                            <p className="text-gray-600 text-sm">Create a new entry when you encounter defective goods.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DamageReturnTab;
