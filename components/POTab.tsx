import React, { useState } from 'react';
import { Search, Package, Check, AlertTriangle, Camera } from 'lucide-react';
import { useGlobalState } from './GlobalStateContext';

interface POTabProps {
    onTriggerIncident: (data: any) => void;
}

const POTab: React.FC<POTabProps> = ({ onTriggerIncident }) => {
    const { active_pos, updatePO, updateCentralStorage } = useGlobalState();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
    const [receivedQtys, setReceivedQtys] = useState<Record<string, string>>({});
    const [showPhotoModal, setShowPhotoModal] = useState(false);

    const selectedPO = active_pos.find(po => po.id === selectedPoId);

    const handleQtyChange = (item: string, val: string) => {
        setReceivedQtys(prev => ({ ...prev, [item]: val }));
    };

    const handleReconcile = () => {
        if (!selectedPO) return;

        const updatedItems = selectedPO.items.map(i => {
            const received = parseInt(receivedQtys[i.item] || '0', 10);
            return { ...i, received: i.received + received };
        });

        updatePO(selectedPO.id, updatedItems);

        // Check for mismatch
        updatedItems.forEach(i => {
            if (i.received !== i.expected) {
                onTriggerIncident({
                    type: 'Quantity Mismatch',
                    item_id: i.item,
                    expected_qty: i.expected,
                    actual_qty: i.received,
                    description: `Mismatch detected for ${i.item} in PO ${selectedPO.id}`
                });
            }
        });

        window.alert('PO Reconciled Successfully');
        setSelectedPoId(null);
    };

    const filteredPos = active_pos.filter(po =>
        po.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="bg-[#2d3142]/50 p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Search className="text-blue-400" size={20} /> Locate Purchase Order
                </h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search PO Number..."
                        className="w-full bg-[#1a1d29] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPos.map(po => (
                        <button
                            key={po.id}
                            onClick={() => setSelectedPoId(po.id)}
                            className={`p-4 rounded-xl border transition-all text-left ${selectedPoId === po.id
                                    ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'bg-[#1a1d29] border-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className="font-bold text-white">{po.id}</div>
                            <div className="text-xs text-gray-500 mt-1">{po.status} • {po.items.length} Items</div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedPO && (
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Reconcile: {selectedPO.id}</h3>
                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Supplier Delivery Verification
                        </span>
                    </div>

                    <div className="space-y-4">
                        {selectedPO.items.map(item => (
                            <div key={item.item} className="bg-[#1a1d29] p-4 rounded-xl flex items-center justify-between border border-white/5">
                                <div>
                                    <div className="text-white font-bold">{item.item}</div>
                                    <div className="text-sm text-gray-500">Expected: {item.expected}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <label className="text-[10px] text-gray-500 uppercase block mb-1">Physical Qty</label>
                                        <input
                                            type="number"
                                            className="w-24 bg-[#2d3142] border border-white/10 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:border-blue-400"
                                            value={receivedQtys[item.item] || ''}
                                            onChange={(e) => handleQtyChange(item.item, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                        <button
                            onClick={() => setShowPhotoModal(true)}
                            className="flex-1 bg-[#1a1d29] border border-white/10 hover:border-blue-500/50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
                        >
                            <Camera size={20} className="text-blue-400" /> Capture DO Receipt
                        </button>
                        <button
                            onClick={handleReconcile}
                            className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2"
                        >
                            <Check size={20} /> Verify & Update Inventory
                        </button>
                    </div>
                </div>
            )}

            {showPhotoModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowPhotoModal(false)}>
                    <div className="bg-[#1a1d29] p-8 rounded-3xl border border-white/10 text-center space-y-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <Camera size={64} className="mx-auto text-blue-400 animate-pulse" />
                        <h2 className="text-xl font-bold text-white">Camera Interface</h2>
                        <p className="text-gray-400 text-sm">Align the signed Delivery Order receipt within the frame.</p>
                        <button onClick={() => setShowPhotoModal(false)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Capture & Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POTab;
