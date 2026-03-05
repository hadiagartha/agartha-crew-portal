import React, { useState } from 'react';
import { Search, Package, Check, AlertTriangle, Camera, ArrowRight, Truck } from 'lucide-react';
import { useGlobalState } from '../GlobalStateContext';

interface POTabProps {
    onTriggerIncident: (data: any) => void;
}

const POTab: React.FC<POTabProps> = ({ onTriggerIncident }) => {
    const { active_pos, updatePO, updateCentralStorage } = useGlobalState();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
    const [receivedQtys, setReceivedQtys] = useState<Record<string, string>>({});
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [mismatchData, setMismatchData] = useState<any[] | null>(null);

    const selectedPO = active_pos.find(po => po.id === selectedPoId);

    const handleQtyChange = (item: string, val: string) => {
        setReceivedQtys(prev => ({ ...prev, [item]: val }));
    };

    const handleReconcile = () => {
        if (!selectedPO) return;
        if (!hasPhoto) {
            window.alert('Mandatory: Please capture a photo of the signed DO receipt first.');
            return;
        }

        const currentMismatches: any[] = [];
        const updatedItems = selectedPO.items.map(i => {
            const received = parseInt(receivedQtys[i.item] || '0', 10);
            if (received !== i.expected) {
                currentMismatches.push({
                    id: `INC-PO-${selectedPO.id}-${Date.now()}`,
                    timestamp: new Date(),
                    type: 'Quantity Mismatch',
                    severity: 'Medium',
                    item_id: i.item,
                    expected_qty: i.expected,
                    actual_qty: received,
                    description: `Mismatch detected for ${i.item} during PO ${selectedPO.id} reconciliation. Expected ${i.expected}, received ${received}.`,
                    status: 'OPEN',
                    reportedBy: 'System'
                });
            }
            return { ...i, received: i.received + received };
        });

        if (currentMismatches.length > 0) {
            setMismatchData(currentMismatches);
        } else {
            // Perfect match - update inventory and PO
            updatedItems.forEach(item => {
                updateCentralStorage(item.item, item.received);
            });
            updatePO(selectedPO.id, updatedItems);
            window.alert('PO Reconciled Successfully. Inventory Updated.');
            resetSelection();
        }
    };

    const confirmLogWithVariances = () => {
        if (!selectedPO || !mismatchData) return;
        const updatedItems = selectedPO.items.map(i => {
            const received = parseInt(receivedQtys[i.item] || '0', 10);
            updateCentralStorage(i.item, received);
            return { ...i, received: i.received + received };
        });
        updatePO(selectedPO.id, updatedItems);
        window.alert('Inventory Updated with variances.');
        resetSelection();
    };

    const resetSelection = () => {
        setSelectedPoId(null);
        setMismatchData(null);
        setHasPhoto(false);
        setReceivedQtys({});
    };

    const filteredPos = active_pos.filter(po =>
        po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // End Category Styles hook

    return (
        <div className="flex flex-col gap-6 animate-fadeIn pb-20 text-white">
            {/* SEARCH & FILTERS SECTION */}
            {!selectedPoId && (
                <div className="space-y-6">
                    <div className="bg-[#2d3142]/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                <Package className="text-blue-400" size={24} />
                                Active Purchase Orders
                            </h3>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search PO # or Supplier Name..."
                                className="w-full bg-black/20 border border-white/10 rounded-2xl px-12 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* PO TABLE VIEW */}
                    <div className="bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">PO Number & Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Supplier Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Total Items</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPos.map(po => (
                                    <tr key={po.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{po.id}</div>
                                            <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${po.status === 'PENDING' ? 'text-yellow-400' : 'text-green-400'}`}>
                                                {po.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-sm font-medium text-gray-300">{po.supplier}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 rounded-md text-[10px] font-black border bg-blue-500/10 text-blue-400 border-blue-500/20">
                                                    {po.items.length} {po.items.length === 1 ? 'Item' : 'Items'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedPoId(po.id)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2 rounded-lg transition-all flex items-center gap-2 ml-auto"
                                            >
                                                SELECT <ArrowRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SELECTED PO RECONCILIATION VIEW */}
            {selectedPO && (
                <div className="space-y-6">
                    <button onClick={resetSelection} className="text-gray-500 hover:text-white text-xs font-bold flex items-center gap-2 mb-2 transition-colors">
                        <ArrowRight className="rotate-180" size={14} /> BACK TO LIST
                    </button>

                    <div className="bg-[#1a1d31]/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tight uppercase">PO Reconciliation</h3>
                                <p className="text-blue-400/60 font-medium flex items-center gap-2">
                                    <Truck size={16} /> {selectedPO.supplier} — {selectedPO.id}
                                </p>
                            </div>
                            <div className="bg-yellow-400/10 px-4 py-2 rounded-xl border border-yellow-400/20">
                                <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Awaiting Verification</span>
                            </div>
                        </div>

                        {/* RECONCILIATION TABLE */}
                        <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Item Name & Barcode</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Expected Qty</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Unit</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actual Received</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPO.items.map(item => (
                                        <tr key={item.item} className="border-b border-white/5">
                                            <td className="px-6 py-6">
                                                <div className="font-bold text-white">{item.item}</div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.barcode || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-6 text-center text-blue-400 font-black">{item.expected}</td>
                                            <td className="px-6 py-6 text-center text-gray-400 font-bold text-xs uppercase">{item.unit || 'pcs'}</td>
                                            <td className="px-6 py-6 text-right">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-center font-bold focus:outline-none focus:border-blue-500 transition-all"
                                                    value={receivedQtys[item.item] || ''}
                                                    onChange={(e) => handleQtyChange(item.item, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* FINALIZATION ACTIONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => setShowPhotoModal(true)}
                                className={`group flex items-center justify-center gap-4 py-5 rounded-2xl font-black uppercase tracking-widest transition-all border-2 ${hasPhoto
                                    ? 'bg-green-500/10 border-green-500 text-green-500'
                                    : 'bg-white/5 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500'}`}
                            >
                                <Camera className={hasPhoto ? 'animate-none' : 'group-hover:scale-110 transition-transform'} size={24} />
                                {hasPhoto ? 'DO Receipt Recorded' : 'Capture DO Proof'}
                            </button>
                            <button
                                onClick={handleReconcile}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
                            >
                                <Check size={24} /> Verify & Push to Stock
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CAMERA MODAL MOCK */}
            {showPhotoModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowPhotoModal(false)}>
                    <div className="bg-[#1a1d31] p-10 rounded-[3rem] border border-white/10 text-center space-y-6 max-w-sm w-full animate-zoomIn" onClick={e => e.stopPropagation()}>
                        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera size={48} className="text-blue-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">DO Proof Required</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">Align the signed Delivery Order receipt within the frame to verify shipment contents.</p>
                        <button
                            onClick={() => { setShowPhotoModal(false); setHasPhoto(true); }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Log Photo Proof
                        </button>
                        <button onClick={() => setShowPhotoModal(false)} className="text-gray-600 text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">Cancel</button>
                    </div>
                </div>
            )}

            {/* MISMATCH TRIGGER MODAL */}
            {mismatchData && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                    <div className="bg-[#2d3142] p-10 rounded-[3rem] border border-red-500/50 shadow-[0_0_80px_rgba(239,68,68,0.3)] max-w-md w-full space-y-8 animate-zoomIn">
                        <div className="flex items-center gap-6 text-red-500">
                            <div className="p-4 bg-red-500/10 rounded-2xl">
                                <AlertTriangle size={40} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Variances Detected</h2>
                                <p className="text-red-400/60 text-xs font-bold uppercase tracking-widest">Protocol Deviation Alert</p>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-[2rem] p-6 space-y-4 border border-white/5">
                            {mismatchData.map((m, idx) => (
                                <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                    <span className="text-white font-black text-sm uppercase">{m.item_id}</span>
                                    <div className="flex justify-between items-center bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10">
                                        <span className="text-[10px] text-gray-500 font-black uppercase">Expected: {m.expected_qty}</span>
                                        <span className="text-[10px] text-red-400 font-black uppercase">Received: {m.actual_qty}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    onTriggerIncident(mismatchData[0]); // Trigger first as context
                                    setMismatchData(null);
                                }}
                                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02]"
                            >
                                <AlertTriangle size={20} /> OPEN INCIDENT REPORT
                            </button>
                            <button
                                onClick={confirmLogWithVariances}
                                className="w-full bg-white/5 border border-white/10 text-gray-400 py-4 rounded-xl hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs"
                            >
                                Accept Variances & Force Sync
                            </button>
                            <button onClick={() => setMismatchData(null)} className="text-gray-600 text-[10px] font-black uppercase tracking-widest underline hover:text-gray-400 transition-colors mx-auto">Correction Needed</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POTab;
