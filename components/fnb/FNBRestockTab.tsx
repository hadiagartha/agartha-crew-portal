import React, { useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { Truck, Send, Clock, Package } from 'lucide-react';
import { RestockTask } from '../../types';

const FNBRestockTab: React.FC = () => {
    const { restock_tasks, addRestockTask } = useGlobalState();

    // Form state
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('pcs');
    const [isUrgent, setIsUrgent] = useState(false);

    // F&B specific view of restocks
    const myRestocks = restock_tasks
        .filter(t => t.id.startsWith('FNB-') || t.standLocation.includes('Cafe') || t.standLocation.includes('Snack')) // mock filter for FNB items
        .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item && quantity) {
            const newTask: RestockTask = {
                id: `FNB-RSTK-${Date.now()}`,
                item,
                quantity: parseInt(quantity, 10),
                unit,
                standLocation: 'F&B Main Kiosk', // In a real app, derived from user context
                status: 'PENDING',
                requestedAt: new Date(),
                isUrgent,
                priority: isUrgent ? 'HIGH' : 'NORMAL',
                zoneId: 'Z-01', // mock zone
                destination: 'F&B Kiosk Z-01'
            };
            addRestockTask(newTask);
            // Reset
            setItem('');
            setQuantity('');
            setIsUrgent(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn">
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142]">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <Truck className="text-purple-400" /> Restock Requests
                </h2>
                <p className="text-gray-400 text-sm">Request inbound supplies from the Runner Crew.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#2d3142] rounded-2xl p-6 border border-gray-700 shadow-xl sticky top-0">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-3">New Request</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Item Name / Barcode</label>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => setItem(e.target.value)}
                                        className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        required
                                        placeholder="e.g. Cups, Wrappers..."
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
                                            className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Unit</label>
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="pcs">pcs</option>
                                            <option value="boxes">boxes</option>
                                            <option value="kg">kg</option>
                                            <option value="liters">liters</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isUrgent ? 'bg-red-500 border-red-500' : 'bg-[#1a1d29] border-gray-600 group-hover:border-red-400'}`}>
                                            {isUrgent && <div className="w-3 h-3 bg-white rounded-sm" />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-300">Mark as Critical Priority</span>
                                    </label>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-700">
                                    <button
                                        type="submit"
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-900/50 flex justify-center items-center gap-2"
                                    >
                                        <Send size={18} /> Dispatch Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="text-gray-400" /> Request History
                        </h3>
                        {myRestocks.length === 0 ? (
                            <div className="bg-[#2d3142]/50 rounded-xl p-8 text-center text-gray-500 border border-gray-700/50">
                                <Package size={32} className="mx-auto mb-3 opacity-50" />
                                No recent restock requests found.
                            </div>
                        ) : (
                            myRestocks.map(task => (
                                <div key={task.id} className="bg-[#2d3142] rounded-xl p-4 border border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-white text-lg">{task.item}</span>
                                            {task.isUrgent && <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-red-500/30">Critical</span>}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>Quantity: <strong className="text-gray-200">{task.quantity} {task.unit}</strong></span>
                                            <span className="text-xs">{new Date(task.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-xs font-mono">{task.id}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-right w-full sm:w-auto">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${task.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
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

export default FNBRestockTab;
