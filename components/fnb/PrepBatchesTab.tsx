import React, { useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { ClipboardCheck, Play, Save, CheckCircle, Clock } from 'lucide-react';
import { FNBPrepBatch } from '../../types';

const PrepBatchesTab: React.FC = () => {
    const { fnb_prep_batches, addFNBPrepBatch, updateFNBPrepBatchStatus } = useGlobalState();

    const [recipeName, setRecipeName] = useState('');
    const [yieldQuantity, setYieldQuantity] = useState('');
    const [unit, setUnit] = useState('Liters');
    const [rawIngId, setRawIngId] = useState('ITM-004'); // Mock ingredient ITM-004
    const [rawIngQty, setRawIngQty] = useState('2');

    const handleStartBatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (recipeName && yieldQuantity) {
            const newBatch: FNBPrepBatch = {
                id: `BAT-${Date.now()}`,
                recipeName,
                status: 'In Progress',
                yieldQuantity: parseInt(yieldQuantity, 10),
                unit,
                rawIngredientsUsed: [{ menuItemId: rawIngId, quantity: parseInt(rawIngQty, 10) }],
                startedAt: new Date(),
            };
            addFNBPrepBatch(newBatch);
            // reset
            setRecipeName('');
            setYieldQuantity('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn">
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142]">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <ClipboardCheck className="text-green-400" /> Prep Batches
                </h2>
                <p className="text-gray-400 text-sm">Track kitchen production and auto-deduct raw ingredients upon completion.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Log Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#2d3142] rounded-2xl p-6 border border-green-500/20 shadow-xl shadow-green-500/5 sticky top-0">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-3 flex items-center gap-2">
                                <Play className="text-green-400" size={18} fill="currentColor" /> Start New Batch
                            </h3>
                            <form onSubmit={handleStartBatch} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Recipe / Prepared Item</label>
                                    <input
                                        type="text"
                                        value={recipeName}
                                        onChange={(e) => setRecipeName(e.target.value)}
                                        className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                                        required
                                        placeholder="e.g. Slushy Mix (Berry)..."
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Yield Qty</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={yieldQuantity}
                                            onChange={(e) => setYieldQuantity(e.target.value)}
                                            className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
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
                                            <option value="Liters">Liters</option>
                                            <option value="kg">kg</option>
                                            <option value="pcs">pcs</option>
                                            <option value="trays">trays</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 bg-[#1a1d29]/50 rounded-lg border border-gray-700">
                                    <p className="text-xs text-green-400 font-mono mb-2 uppercase tracking-widest">Auto-Deduction Queue</p>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={rawIngId}
                                            onChange={(e) => setRawIngId(e.target.value)}
                                            className="w-full bg-[#1a1d29] border border-gray-600 rounded px-2 py-1 text-xs text-white uppercase focus:border-green-500 outline-none"
                                            placeholder="Raw ID"
                                            title="Mock raw ingredient ID mapping"
                                        />
                                        <input
                                            type="number"
                                            value={rawIngQty}
                                            onChange={(e) => setRawIngQty(e.target.value)}
                                            className="w-16 bg-[#1a1d29] border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-green-500 outline-none"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500">Upon completion, the system will backflush {rawIngQty} units of {rawIngId} from warehouse stock.</p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-700">
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-900/50 flex justify-center items-center gap-2"
                                    >
                                        <Play size={18} fill="currentColor" /> Start Production
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Active/History Section */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {fnb_prep_batches.map(batch => (
                                <div key={batch.id} className="bg-[#2d3142] rounded-xl border border-gray-700 overflow-hidden flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-1 text-white">
                                            <span className="font-bold text-lg">{batch.recipeName}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border tracking-wider bg-[#1a1d29] ${batch.status === 'Completed' ? 'text-gray-400 border-gray-600' :
                                                    batch.status === 'Cooling' ? 'text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                                                        'text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)] animate-pulse'
                                                }`}>
                                                {batch.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400 flex items-center gap-x-4 gap-y-1 flex-wrap font-mono">
                                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(batch.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="bg-[#1a1d29] px-2 py-0.5 rounded text-gray-300 border border-gray-700">Target Yield: {batch.yieldQuantity} {batch.unit}</span>
                                            <span>Batch: {batch.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                        {batch.status === 'In Progress' && (
                                            <>
                                                <button onClick={() => updateFNBPrepBatchStatus(batch.id, 'Cooling')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                                                    Start Cooling
                                                </button>
                                                <button onClick={() => updateFNBPrepBatchStatus(batch.id, 'Completed')} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all">
                                                    Finish
                                                </button>
                                            </>
                                        )}
                                        {batch.status === 'Cooling' && (
                                            <button onClick={() => updateFNBPrepBatchStatus(batch.id, 'Completed')} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-green-500/20 flex items-center gap-2">
                                                <CheckCircle size={16} /> Complete & Stock
                                            </button>
                                        )}
                                        {batch.status === 'Completed' && (
                                            <div className="bg-green-500/10 text-green-400 font-bold px-4 py-2 rounded-lg border border-green-500/20 flex items-center gap-2 text-sm">
                                                <Save size={16} /> Yield Logged
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {fnb_prep_batches.length === 0 && (
                                <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl bg-[#2d3142]/30">
                                    No prep batches recorded today.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrepBatchesTab;
