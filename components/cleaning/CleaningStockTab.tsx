import React, { useState } from 'react';
import { ClipboardList, Droplets, Shield, Box, AlertTriangle, CheckCircle2, MinusCircle, PackageOpen } from 'lucide-react';

interface Consumable {
    id: string;
    name: string;
    category: 'CHEMICAL' | 'PPE' | 'HYGIENE';
    currentVolume: number; // Percentage 0-100 or count
    unit: string;
    status: 'READY' | 'LOW' | 'EMPTY';
}

const mockStock: Consumable[] = [
    { id: 'C-01', name: 'Industrial Floor Cleaner', category: 'CHEMICAL', currentVolume: 85, unit: '%', status: 'READY' },
    { id: 'C-02', name: 'Glass & Surface Spray', category: 'CHEMICAL', currentVolume: 15, unit: '%', status: 'LOW' },
    { id: 'P-01', name: 'Nitrile Gloves (L)', category: 'PPE', currentVolume: 2, unit: 'Boxes', status: 'LOW' },
    { id: 'P-02', name: 'Respirator Masks', category: 'PPE', currentVolume: 45, unit: 'Units', status: 'READY' },
    { id: 'H-01', name: 'Restroom Hand Towels', category: 'HYGIENE', currentVolume: 0, unit: 'Rolls', status: 'EMPTY' },
    { id: 'H-02', name: 'Antibacterial Soap', category: 'HYGIENE', currentVolume: 60, unit: '%', status: 'READY' }
];

const CleaningStockTab: React.FC = () => {
    const [stock, setStock] = useState<Consumable[]>(mockStock);
    const [activeInputId, setActiveInputId] = useState<string | null>(null);
    const [usageAmount, setUsageAmount] = useState<string>('');

    const calculateStatus = (vol: number): Consumable['status'] => {
        if (vol <= 0) return 'EMPTY';
        if (vol <= 20) return 'LOW';
        return 'READY';
    };

    const handleLogUsage = (id: string) => {
        const amount = parseFloat(usageAmount);
        if (isNaN(amount) || amount <= 0) return;

        setStock(prev => prev.map(item => {
            if (item.id === id) {
                const newVol = Math.max(0, item.currentVolume - amount);
                return { ...item, currentVolume: newVol, status: calculateStatus(newVol) };
            }
            return item;
        }));

        setActiveInputId(null);
        setUsageAmount('');
    };

    const getStatusColor = (status: Consumable['status']) => {
        switch (status) {
            case 'EMPTY': return 'text-red-500 bg-red-500/10 border-red-500/30';
            case 'LOW': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
            case 'READY': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
        }
    };

    const getCategoryIcon = (category: Consumable['category']) => {
        switch (category) {
            case 'CHEMICAL': return <Droplets size={20} className="text-cyan-400" />;
            case 'PPE': return <Shield size={20} className="text-blue-400" />;
            case 'HYGIENE': return <Box size={20} className="text-purple-400" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
            <div className="mb-6 flex justify-between items-start shrink-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3 mb-1">
                        <ClipboardList className="text-emerald-400" size={32} /> Consumable Stock
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-medium">Monitor chemicals, PPE, and log usage.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stock.map(item => (
                        <div key={item.id} className="bg-[#2d3142] border border-gray-700 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                            {/* Status Indicator Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === 'EMPTY' ? 'bg-red-500' :
                                item.status === 'LOW' ? 'bg-amber-400' : 'bg-emerald-400'
                                }`} />

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-[#1a1d29] rounded-xl border border-gray-700">
                                        {getCategoryIcon(item.category)}
                                    </div>
                                    <div>
                                        <div className="font-mono text-[10px] uppercase font-black tracking-widest text-gray-400">
                                            {item.category}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md border flex items-center gap-1 ${getStatusColor(item.status)}`}>
                                    {item.status === 'EMPTY' && <AlertTriangle size={12} />}
                                    {item.status === 'LOW' && <AlertTriangle size={12} />}
                                    {item.status === 'READY' && <CheckCircle2 size={12} />}
                                    {item.status}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-white mb-4 leading-tight">{item.name}</h3>

                            <div className="flex items-end justify-between mb-4 border-b border-gray-700/50 pb-4">
                                <div>
                                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Current Volume</div>
                                    <div className="text-3xl font-black font-mono tracking-wider flex items-baseline gap-1">
                                        {item.currentVolume} <span className="text-sm text-gray-400">{item.unit}</span>
                                    </div>
                                </div>
                                {item.status !== 'EMPTY' && activeInputId !== item.id && (
                                    <button
                                        onClick={() => setActiveInputId(item.id)}
                                        className="text-emerald-400 hover:text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1 bg-emerald-400/10 px-3 py-2 rounded-lg transition-colors border border-emerald-400/20"
                                    >
                                        <MinusCircle size={14} /> Log Usage
                                    </button>
                                )}
                            </div>

                            {/* Volumetric Progress Bar */}
                            {item.unit === '%' && (
                                <div className="w-full bg-[#1a1d29] rounded-full h-2 mb-4 overflow-hidden border border-gray-700">
                                    <div
                                        className={`h-full transition-all duration-500 ${item.status === 'EMPTY' ? 'bg-red-500 w-0' :
                                            item.status === 'LOW' ? 'bg-amber-400' : 'bg-emerald-400'
                                            }`}
                                        style={{ width: `${Math.max(0, Math.min(100, item.currentVolume))}%` }}
                                    />
                                </div>
                            )}

                            {activeInputId === item.id && (
                                <div className="mt-4 bg-[#1a1d29] p-3 rounded-xl border border-gray-700 animate-slideUp">
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2">
                                        Usage Amount ({item.unit})
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="number"
                                            value={usageAmount}
                                            onChange={(e) => setUsageAmount(e.target.value)}
                                            placeholder="Amt"
                                            className="w-full sm:flex-1 bg-[#2d3142] border border-gray-600 rounded-lg px-3 py-3 sm:py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                        />
                                        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                            <button
                                                onClick={() => handleLogUsage(item.id)}
                                                disabled={!usageAmount}
                                                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-3 sm:py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
                                            >
                                                Submit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setActiveInputId(null);
                                                    setUsageAmount('');
                                                }}
                                                className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-3 sm:py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {item.status === 'LOW' || item.status === 'EMPTY' ? (
                                <div className="mt-2 text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5 bg-amber-400/10 p-2 rounded-lg border border-amber-400/20">
                                    <PackageOpen size={14} /> Auto-Req Sent to Supply Runner
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CleaningStockTab;
