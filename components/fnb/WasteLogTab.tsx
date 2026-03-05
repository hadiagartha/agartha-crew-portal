import React, { useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { Trash2, AlertCircle, History } from 'lucide-react';
import { FNBWasteLog } from '../../types';

const WasteLogTab: React.FC = () => {
    const { fnb_waste_logs, addFNBWasteLog } = useGlobalState();

    const [item, setItem] = useState('');
    const [category, setCategory] = useState('PREPARED ITEM');
    const [quantity, setQuantity] = useState('');
    const [reasonCode, setReasonCode] = useState<'Expired / EOD' | 'Dropped / Spilled' | 'Contaminated' | 'Prep Error'>('Expired / EOD');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item && quantity) {
            const newLog: FNBWasteLog = {
                id: `WST-${Date.now()}`,
                item,
                category,
                reasonCode,
                quantity: parseInt(quantity, 10),
                costImpact: Math.floor(Math.random() * 50) + 10, // Simulated backend cost calc
                timestamp: new Date()
            };
            addFNBWasteLog(newLog);
            setItem('');
            setQuantity('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn">
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142]">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <Trash2 className="text-red-400" /> Waste Log (Loss Tracking)
                </h2>
                <p className="text-gray-400 text-sm">Documenting losses for financial auditing.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Log Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#2d3142] rounded-2xl p-6 border border-red-500/20 shadow-xl shadow-red-500/5 sticky top-0">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-3 flex items-center gap-2">
                                <AlertCircle className="text-red-400" size={18} /> Record New Loss
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Item Name</label>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => setItem(e.target.value)}
                                        className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                        required
                                        placeholder="e.g. Croissant..."
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none appearance-none"
                                        >
                                            <option value="PREPARED ITEM">Prepared</option>
                                            <option value="RAW INGREDIENT">Raw</option>
                                            <option value="DRINK">Drink</option>
                                            <option value="RETAIL">Retail</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reason Code</label>
                                    <select
                                        value={reasonCode}
                                        onChange={(e) => setReasonCode(e.target.value as any)}
                                        className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="Expired / EOD">Expired / EOD</option>
                                        <option value="Dropped / Spilled">Dropped / Spilled</option>
                                        <option value="Contaminated">Contaminated</option>
                                        <option value="Prep Error">Prep Error</option>
                                    </select>
                                </div>

                                <div className="pt-4 mt-4 border-t border-gray-700">
                                    <button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-900/50"
                                    >
                                        Submit Waste Log
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#2d3142] rounded-xl border border-gray-700 overflow-hidden flex flex-col h-full">
                            <div className="p-4 border-b border-gray-700 bg-[#1a1d29]/50 flex items-center justify-between">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <History className="text-gray-400" size={18} /> Recent Entries
                                </h3>
                            </div>
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-[#1a1d29] text-xs uppercase tracking-wider text-gray-400 border-b border-gray-700">
                                            <th className="p-4 font-semibold">Date & Time</th>
                                            <th className="p-4 font-semibold">Item & Category</th>
                                            <th className="p-4 font-semibold text-center">Qty</th>
                                            <th className="p-4 font-semibold">Reason Code</th>
                                            {/* Cost column intentionally hidden from F&B Crew - only managers see backend data */}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {fnb_waste_logs.map(log => (
                                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4 text-gray-300 text-sm whitespace-nowrap">
                                                    {new Date(log.timestamp).toLocaleDateString()} <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-white font-bold block">{log.item}</span>
                                                    <span className="text-[10px] text-gray-400 tracking-widest uppercase font-mono">{log.category}</span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="text-lg font-black text-gray-300 bg-[#1a1d29] px-3 py-1 rounded border border-gray-600">
                                                        {log.quantity}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${log.reasonCode.includes('Expired') ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        }`}>
                                                        {log.reasonCode}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {fnb_waste_logs.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                                    No waste logs recorded today.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WasteLogTab;
