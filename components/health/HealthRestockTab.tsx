import React, { useState } from 'react';
import { Truck, Search, Plus, Minus, Send, CheckCircle2, PackageOpen } from 'lucide-react';
import { useGlobalState } from '../GlobalStateContext';

interface RestockRequest {
    id: string;
    items: { filterId: string; quantity: number }[];
    status: 'PENDING' | 'DISPATCHED' | 'FULFILLED';
    timestamp: Date;
    urgency: 'STANDARD' | 'URGENT';
}

const medicalInventoryList = [
    { id: 'MED-001', name: 'Gauze Pads 4x4', category: 'Bandages' },
    { id: 'MED-002', name: 'Cold Packs', category: 'Therapy' },
    { id: 'MED-003', name: 'Saline Solution', category: 'Liquids' },
    { id: 'MED-004', name: 'Adhesive Bandages', category: 'Bandages' },
    { id: 'MED-005', name: 'EpiPen Auto-Injector', category: 'Emergency' },
    { id: 'MED-006', name: 'Splint (Sam)', category: 'Support' },
    { id: 'MED-007', name: 'Medical Tape', category: 'Supplies' }
];

const HealthRestockTab: React.FC = () => {
    const { restock_tasks, setRestockTasks } = useGlobalState();

    // Local state for the current request being built
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<{ id: string, name: string } | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [urgency, setUrgency] = useState<'STANDARD' | 'URGENT'>('STANDARD');

    // Local history of requests submitted by this terminal
    const [requestHistory, setRequestHistory] = useState<RestockRequest[]>([]);

    const filteredItems = medicalInventoryList.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || quantity < 1) return;

        const newRequest: RestockRequest = {
            id: `MED-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
            items: [{ filterId: selectedItem.id, quantity }],
            status: 'PENDING',
            timestamp: new Date(),
            urgency
        };

        // Add to local history
        setRequestHistory(prev => [newRequest, ...prev]);

        // Push task to Runner Crew's Dispatch Queue globally
        setRestockTasks(prev => [...prev, {
            id: newRequest.id,
            location: 'Medical Triage Zone',
            status: 'PENDING',
            assignedTo: null,
            items: [{ id: selectedItem.id, name: selectedItem.name, quantity, status: 'PENDING' }],
            urgency: urgency === 'URGENT' ? 'HIGH' : 'NORMAL'
        }]);

        // Reset Form
        setSelectedItem(null);
        setSearchQuery('');
        setQuantity(1);
        setUrgency('STANDARD');
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] pb-24 md:pb-0 overflow-y-auto hide-scrollbar space-y-4">

            <div className="bg-[#2d3142]/90 backdrop-blur-md p-5 border-b border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Truck className="text-purple-400 w-8 h-8" />
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Restock Requests</h2>
                        <p className="text-gray-400 text-xs mt-1">Medical Supply Pull</p>
                    </div>
                </div>

                <form onSubmit={handleSubmitRequest} className="space-y-4">

                    {/* Item Selection */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Item</label>
                        {!selectedItem ? (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#1a1d29] border border-gray-700 text-white text-sm rounded-xl pl-9 pr-3 py-3 outline-none focus:border-purple-500 transition-colors"
                                />
                                {searchQuery && (
                                    <div className="absolute z-10 w-full mt-1 bg-[#2d3142] border border-gray-700 rounded-xl shadow-2xl max-h-40 overflow-y-auto">
                                        {filteredItems.map(item => (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedItem(item)}
                                                className="p-3 hover:bg-gray-800 cursor-pointer flex justify-between items-center transition-colors border-b border-gray-700/50 last:border-0"
                                            >
                                                <span className="text-white text-sm font-bold">{item.name}</span>
                                                <span className="text-xs font-mono text-gray-400">{item.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-purple-500/20 border border-purple-500/50 p-3 rounded-xl gap-2 sm:gap-0">
                                <div className="pr-2">
                                    <span className="block text-white font-bold text-sm leading-tight">{selectedItem.name}</span>
                                    <span className="text-xs font-mono text-gray-400">{selectedItem.id}</span>
                                </div>
                                <button type="button" onClick={() => setSelectedItem(null)} className="text-xs text-purple-400 font-bold uppercase hover:underline self-start sm:self-auto">Change</button>
                            </div>
                        )}
                    </div>

                    {/* Quantity & Urgency */}
                    {selectedItem && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quantity</label>
                                <div className="flex items-center justify-between bg-[#1a1d29] border border-gray-700 rounded-xl p-1">
                                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center transition-colors">
                                        <Minus size={20} />
                                    </button>
                                    <span className="text-xl font-mono font-bold text-white px-2">{quantity}</span>
                                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center transition-colors">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Urgency</label>
                                <div className="flex bg-[#1a1d29] border border-gray-700 rounded-xl overflow-hidden h-12 sm:h-full">
                                    <button type="button" onClick={() => setUrgency('STANDARD')} className={`flex-1 text-xs font-bold transition-colors ${urgency === 'STANDARD' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>STD</button>
                                    <button type="button" onClick={() => setUrgency('URGENT')} className={`flex-1 text-xs font-bold transition-colors ${urgency === 'URGENT' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>URGENT</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!selectedItem || quantity < 1}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] disabled:shadow-none mt-2"
                    >
                        <Send size={18} /> Send to Runner Queue
                    </button>

                </form>
            </div>

            {/* Request History */}
            <div className="p-4">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 pl-2 flex items-center gap-2">
                    <PackageOpen size={14} /> Request Status History
                </h3>

                <div className="space-y-3">
                    {requestHistory.map(req => (
                        <div key={req.id} className="bg-[#2d3142]/60 border border-gray-700/50 p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden">
                            {req.urgency === 'URGENT' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}

                            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2 sm:gap-0">
                                <div>
                                    <span className="font-mono text-xs font-bold text-gray-400 block mb-1">{req.id}</span>
                                    <span className="text-[10px] text-gray-500">{req.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border self-start sm:self-auto ${req.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                                    req.status === 'DISPATCHED' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                                        'bg-green-500/20 text-green-400 border-green-500/50'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 bg-[#1a1d29] p-2 rounded-lg border border-gray-700">
                                {req.items.map((item, idx) => {
                                    const match = medicalInventoryList.find(m => m.id === item.filterId);
                                    return (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-white">{match?.name || item.filterId}</span>
                                            <span className="text-xs font-mono font-bold text-purple-400">x{item.quantity}</span>
                                        </div>
                                    )
                                })}
                            </div>

                            {req.status === 'FULFILLED' && (
                                <p className="text-[10px] text-green-500 font-bold uppercase flex items-center justify-center gap-1 mt-1 border border-green-500/30 bg-green-500/10 py-1 rounded">
                                    <CheckCircle2 size={12} /> Handover Confirmed
                                </p>
                            )}
                        </div>
                    ))}
                    {requestHistory.length === 0 && (
                        <div className="text-center p-6 border border-dashed border-gray-700 rounded-xl text-gray-500 text-sm">
                            No restock requests sent this shift.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default HealthRestockTab;
