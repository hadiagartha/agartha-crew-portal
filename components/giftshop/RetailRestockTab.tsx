import React, { useState } from 'react';
import { PackageOpen, Clock, Send, AlertTriangle } from 'lucide-react';

interface RestockRequest {
    id: string;
    item: string;
    quantity: number;
    status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
    requestedAt: Date;
}

const initialHistory: RestockRequest[] = [
    { id: 'R-001', item: 'Aether Crystal Replica', quantity: 10, status: 'DELIVERED', requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: 'R-002', item: 'Zone 4 T-Shirt (L)', quantity: 20, status: 'IN_TRANSIT', requestedAt: new Date(Date.now() - 1000 * 60 * 30) },
];

const mockCatalog = [
    'Leviathan Plushie',
    'Aether Crystal Replica',
    'Zone 4 T-Shirt (S)', 'Zone 4 T-Shirt (M)', 'Zone 4 T-Shirt (L)',
    'Bioluminescent Lantern',
    'Sector 7 Coffee Mug'
];

const RetailRestockTab: React.FC = () => {
    const [history, setHistory] = useState<RestockRequest[]>(initialHistory);
    const [itemInput, setItemInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemInput || !quantityInput) return;

        setIsSubmitting(true);

        const newRequest: RestockRequest = {
            id: `R-${Date.now().toString().slice(-4)}`,
            item: itemInput,
            quantity: parseInt(quantityInput, 10),
            status: 'PENDING',
            requestedAt: new Date(),
        };

        // Simulate network delay
        setTimeout(() => {
            setHistory(prev => [newRequest, ...prev]);
            setItemInput('');
            setQuantityInput('');
            setIsSubmitting(false);
            // In a real app, this would trigger a dispatch to the Runner's 'Dispatch Queue'
        }, 800);
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn">
            {/* Header section */}
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <PackageOpen className="text-orange-400" /> Restock Requests
                    </h2>
                    <p className="text-gray-400 text-sm">Request inventory pulls from central warehouse.</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">

                {/* Request Form */}
                <div className="bg-[#2d3142] rounded-2xl border border-gray-700 p-6 lg:w-1/3 h-fit shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Send size={20} className="text-blue-400" /> New Pull Request
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Item ID or Name</label>
                            <input
                                type="text"
                                list="catalog"
                                placeholder="Scan barcode or type name..."
                                value={itemInput}
                                onChange={(e) => setItemInput(e.target.value)}
                                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                            <datalist id="catalog">
                                {mockCatalog.map(item => <option key={item} value={item} />)}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Quantity Needed</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Enter units (e.g., 20)"
                                value={quantityInput}
                                onChange={(e) => setQuantityInput(e.target.value)}
                                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                            <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                            <p className="text-xs text-yellow-200/70 leading-relaxed text-justify">
                                Submitting this request will dispatch a Runner to fulfill the order from the central warehouse.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !itemInput || !quantityInput}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 ${isSubmitting || !itemInput || !quantityInput
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 hover:-translate-y-1'
                                }`}
                        >
                            {isSubmitting ? (
                                <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> DISPATCHING...</>
                            ) : (
                                <><Send size={20} /> SUBMIT REQUEST</>
                            )}
                        </button>
                    </form>
                </div>

                {/* History Log */}
                <div className="bg-[#2d3142] rounded-2xl border border-gray-700 p-6 lg:w-2/3 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-gray-400" /> Recent Requests
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
                        <div className="space-y-3">
                            {history.map(req => (
                                <div key={req.id} className="bg-[#1a1d29] border border-gray-700/50 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 sm:items-center hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                                                {req.id}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {req.requestedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  &middot; {req.requestedAt.toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-white text-lg">{req.item}</h4>
                                        <div className="text-sm text-gray-400 mt-1">Requested Qty: <strong className="text-white">{req.quantity}</strong></div>
                                    </div>
                                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-700/50">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 hidden sm:block">Status</div>
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${req.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                req.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                            {req.status === 'DELIVERED' ? 'Arrived' : req.status === 'IN_TRANSIT' ? 'En Route' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {history.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No recent restock requests.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RetailRestockTab;
