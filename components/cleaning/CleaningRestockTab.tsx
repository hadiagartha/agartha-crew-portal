import React, { useState } from 'react';
import { PackageOpen, QrCode, Send, History, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';

interface RestockRequest {
    id: string;
    item: string;
    quantity: number;
    unit: string;
    urgency: 'NORMAL' | 'URGENT';
    status: 'PENDING' | 'DISPATCHED' | 'FULFILLED';
    timestamp: Date;
}

const mockRequests: RestockRequest[] = [
    {
        id: 'REQ-191',
        item: 'Mop Heads (Industrial)',
        quantity: 5,
        unit: 'Units',
        urgency: 'NORMAL',
        status: 'FULFILLED',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
        id: 'REQ-203',
        item: 'Restroom Hand Towels',
        quantity: 2,
        unit: 'Boxes',
        urgency: 'URGENT',
        status: 'DISPATCHED',
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
    }
];

const CleaningRestockTab: React.FC = () => {
    const [requests, setRequests] = useState<RestockRequest[]>(mockRequests);
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('Units');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !quantity) return;

        const numQty = parseFloat(quantity);
        if (isNaN(numQty) || numQty <= 0) return;

        const newReq: RestockRequest = {
            id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
            item,
            quantity: numQty,
            unit,
            urgency: 'NORMAL',
            status: 'PENDING',
            timestamp: new Date()
        };

        setRequests(prev => [newReq, ...prev]);
        setItem('');
        setQuantity('');
        setUnit('Units');
    };

    const getStatusIcon = (status: RestockRequest['status']) => {
        switch (status) {
            case 'PENDING': return <Clock size={16} className="text-amber-400" />;
            case 'DISPATCHED': return <Truck size={16} className="text-blue-400 animate-pulse" />;
            case 'FULFILLED': return <CheckCircle2 size={16} className="text-emerald-400" />;
        }
    };

    const getStatusColor = (status: RestockRequest['status']) => {
        switch (status) {
            case 'PENDING': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
            case 'DISPATCHED': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
            case 'FULFILLED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
            <div className="mb-6 shrink-0">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3 mb-1">
                    <PackageOpen className="text-blue-400" size={32} /> Supply Restock
                </h1>
                <p className="text-gray-400 text-sm md:text-base font-medium">Request heavy-duty supplies from Runner Crew.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 space-y-6">
                {/* Request Form */}
                <form onSubmit={handleSubmit} className="bg-[#2d3142] border border-gray-700 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Send className="text-blue-400" size={20} />
                        </div>
                        <h2 className="text-lg font-black text-white uppercase tracking-widest">New Request</h2>
                    </div>

                    <div className="space-y-5">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Item Name / ID</label>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => setItem(e.target.value)}
                                    placeholder="e.g. Biohazard Bags"
                                    className="w-full bg-[#1a1d29] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <button
                                type="button"
                                className="self-end bg-[#1a1d29] border border-gray-700 hover:border-blue-500 text-blue-400 p-3 rounded-xl transition-colors h-[50px] aspect-square flex items-center justify-center"
                                title="Scan Barcode"
                                onClick={() => {
                                    // Mock barcode scan
                                    setItem("Industrial Bleach (5L)");
                                    setUnit("Gallons");
                                }}
                            >
                                <QrCode size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 w-full sm:w-auto">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="0"
                                    min="1"
                                    className="w-full bg-[#1a1d29] border border-gray-700 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="flex-1 w-full sm:w-auto">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Unit</label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full bg-[#1a1d29] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                >
                                    <option value="Units">Units</option>
                                    <option value="Boxes">Boxes</option>
                                    <option value="Gallons">Gallons</option>
                                    <option value="Rolls">Rolls</option>
                                </select>
                            </div>
                        </div>

                        {/* Urgency selection removed */}

                        <button
                            type="submit"
                            disabled={!item || !quantity}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all mt-4 flex justify-center items-center gap-2 ${item && quantity
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 hover:-translate-y-1 active:scale-95'
                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            <Send size={18} /> Dispatch Request
                        </button>
                    </div>
                </form>

                {/* History List */}
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                        <History size={16} /> Request History
                    </h3>

                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <div className="text-center py-8 bg-[#2d3142]/50 rounded-2xl border border-dashed border-gray-700 text-gray-500 text-sm">
                                No past requests.
                            </div>
                        ) : (
                            requests.map(req => (
                                <div key={req.id} className="bg-[#2d3142] border border-gray-700 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-4 sm:items-center">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="font-mono text-xs font-black tracking-widest bg-[#1a1d29] px-2 py-1 rounded text-white border border-gray-700">
                                                {req.id}
                                            </span>
                                            {req.urgency === 'URGENT' && (
                                                <span className="text-[10px] bg-red-500/20 text-red-500 font-black uppercase tracking-widest px-2 py-1 rounded border border-red-500/30">
                                                    URGENT
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-lg text-white mb-1 truncate">{req.item}</h4>
                                        <div className="text-sm text-gray-400 font-mono font-bold bg-[#1a1d29] px-2 py-1 rounded inline-block">
                                            Qty: {req.quantity} {req.unit}
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-gray-700/50 pt-3 sm:pt-0 sm:pl-4 mt-1 sm:mt-0 w-full sm:w-auto">
                                        <span className={`text-[10px] sm:text-xs uppercase tracking-widest font-black px-3 py-1.5 rounded-lg border flex items-center gap-1.5 mb-0 sm:mb-1 ${getStatusColor(req.status)}`}>
                                            {getStatusIcon(req.status)}
                                            {req.status}
                                        </span>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                            {req.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CleaningRestockTab;
