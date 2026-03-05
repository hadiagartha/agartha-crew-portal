import React, { useState } from 'react';
import { Package, Plus, Minus, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface ConsumableItem {
    id: string;
    name: string;
    description: string;
    currentQty: number;
    unit: string;
    criticalThreshold: number;
}

const initialConsumables: ConsumableItem[] = [
    { id: 'MED-001', name: 'Gauze Pads 4x4', description: 'Sterile surgical sponges', currentQty: 45, unit: 'pcs', criticalThreshold: 20 },
    { id: 'MED-002', name: 'Cold Packs', description: 'Instant chemical cold packs', currentQty: 12, unit: 'packs', criticalThreshold: 15 },
    { id: 'MED-003', name: 'Saline Solution', description: '0.9% Sodium Chloride 500ml', currentQty: 8, unit: 'bottles', criticalThreshold: 10 },
    { id: 'MED-004', name: 'Adhesive Bandages', description: 'Assorted fabric bandages', currentQty: 120, unit: 'box', criticalThreshold: 50 },
    { id: 'MED-005', name: 'EpiPen Auto-Injector', description: 'Epinephrine Injection, USP', currentQty: 2, unit: 'pcs', criticalThreshold: 3 },
];

const HealthConsumablesTab: React.FC = () => {
    const [inventory, setInventory] = useState<ConsumableItem[]>(initialConsumables);

    const handleUpdateQty = (id: string, delta: number) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.currentQty + delta);
                return { ...item, currentQty: newQty };
            }
            return item;
        }));
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] pb-24 md:pb-0 overflow-y-auto hide-scrollbar p-4 space-y-4">

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Package className="text-yellow-400 w-8 h-8" />
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Medical Consumables</h2>
                        <p className="text-gray-400 text-xs mt-1">Field Kit Inventory Tracking</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-3">
                {inventory.map(item => {
                    const isLowStock = item.currentQty <= item.criticalThreshold;

                    return (
                        <div key={item.id} className={`bg-[#2d3142]/80 border rounded-2xl p-4 shadow-lg transition-colors ${isLowStock ? 'border-red-500/50' : 'border-gray-700/50'}`}>

                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                    <p className="text-gray-400 text-xs">{item.description}</p>
                                </div>
                                {isLowStock ? (
                                    <span className="text-[10px] flex items-center gap-1 font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded-full uppercase tracking-wider">
                                        <AlertOctagon size={12} /> Low Stock Flag
                                    </span>
                                ) : (
                                    <span className="text-[10px] flex items-center gap-1 font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-full uppercase tracking-wider">
                                        <CheckCircle2 size={12} /> Adequate
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between bg-[#1a1d29] rounded-xl border border-gray-700 p-2">
                                <div className="flex items-baseline gap-2 pl-2">
                                    <span className={`text-3xl font-mono font-bold ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                                        {item.currentQty}
                                    </span>
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{item.unit}</span>
                                </div>

                                <div className="flex gap-2 pr-1">
                                    <button
                                        onClick={() => handleUpdateQty(item.id, -1)}
                                        className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors border border-gray-700 hover:border-red-500/50"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateQty(item.id, 1)}
                                        className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-green-500/20 text-gray-400 hover:text-green-400 flex items-center justify-center transition-colors border border-gray-700 hover:border-green-500/50"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {isLowStock && (
                                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider text-center mt-3 animate-pulse">
                                    Restock Request Required (Threshold: {item.criticalThreshold})
                                </p>
                            )}

                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default HealthConsumablesTab;
