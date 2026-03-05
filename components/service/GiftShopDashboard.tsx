import React, { useState } from 'react';
import { Package, Camera, AlertTriangle, RefreshCw, Truck, ArrowLeftRight, CheckCircle2, ShieldAlert, ScanLine } from 'lucide-react';

interface GiftShopItem {
    id: string;
    name: string;
    stock: number;
    par: number;
    price: number;
    isHighValue?: boolean;
}

interface Shipment {
    id: string;
    manifest: string;
    expectedItems: number;
    status: 'PENDING' | 'RECEIVED';
}

interface GiftShopDashboardProps {
    onRequestRestock: (item: string, isUrgent: boolean) => void;
}

const INITIAL_INVENTORY: GiftShopItem[] = [
    { id: 'GS-01', name: 'Leviathan Plushie', stock: 12, par: 50, price: 35.00 },
    { id: 'GS-02', name: 'Aether Crystal Replica', stock: 4, par: 20, price: 150.00, isHighValue: true },
    { id: 'GS-03', name: 'Zone 4 T-Shirt (L)', stock: 45, par: 60, price: 25.00 },
    { id: 'GS-04', name: 'Bioluminescent Lantern', stock: 8, par: 15, price: 85.00, isHighValue: true }
];

const INITIAL_SHIPMENTS: Shipment[] = [
    { id: 'SHP-101', manifest: 'Daily Replenishment - AM', expectedItems: 120, status: 'PENDING' },
];

const GiftShopDashboard: React.FC<GiftShopDashboardProps> = ({ onRequestRestock }) => {
    const [inventory, setInventory] = useState<GiftShopItem[]>(INITIAL_INVENTORY);
    const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
    const [shrinkageAlerts, setShrinkageAlerts] = useState<string[]>([]);

    // Modals state
    const [activeModal, setActiveModal] = useState<'NONE' | 'SHIPMENT' | 'DAMAGE' | 'RETURN'>('NONE');

    // Return Form State
    const [returnItem, setReturnItem] = useState('');
    const [returnReason, setReturnReason] = useState('');
    const [returnAction, setReturnAction] = useState('BACK_TO_SHELF');

    // Damage Form State
    const [damageItem, setDamageItem] = useState('');

    const handleReceiveShipment = (id: string) => {
        // In a real app, this would open a scanner or detailed checklist
        setShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'RECEIVED' } : s));
        setActiveModal('NONE');
        // Simulate updating inventory
        setInventory(prev => prev.map(item => ({ ...item, stock: item.stock + 20 })));
    };

    const handleReportDamage = () => {
        if (!damageItem) return;
        setInventory(prev => prev.map(item => {
            if (item.name === damageItem && item.stock > 0) {
                return { ...item, stock: item.stock - 1 };
            }
            return item;
        }));
        setActiveModal('NONE');
        setDamageItem('');
    };

    const handleProcessReturn = () => {
        if (!returnItem || !returnReason) return;

        if (returnAction === 'BACK_TO_SHELF') {
            setInventory(prev => prev.map(item => {
                if (item.name === returnItem) {
                    return { ...item, stock: item.stock + 1 };
                }
                return item;
            }));
        }
        setActiveModal('NONE');
        setReturnItem('');
        setReturnReason('');
    };

    const triggerCycleCountSimulation = () => {
        // Simulate a discrepancy finding
        const alert = `Discrepancy found: Aether Crystal Replica. System: ${inventory.find(i => i.id === 'GS-02')?.stock}, Physical: 3`;
        setShrinkageAlerts(prev => [alert, ...prev]);
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29]">
            {/* Header section */}
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142] flex flex-wrap gap-4 md:gap-6 items-center justify-between bg-[#1a1d29]/80 backdrop-blur-md sticky top-0 z-20">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Package className="text-purple-400" size={28} /> Retail Control
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Manage inventory, shipments, and guest returns</p>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {shrinkageAlerts.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-pulse">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="text-red-400 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-red-400 font-bold">Shrinkage Alerts Detected</h4>
                                    <ul className="mt-2 space-y-1">
                                        {shrinkageAlerts.map((alert, idx) => (
                                            <li key={idx} className="text-red-200 text-sm">{alert}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Col: Inventory Health */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#2d3142] rounded-2xl p-6 border border-white/5 shadow-xl">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                        <RefreshCw className="text-blue-400" size={24} /> Live Stock
                                    </h3>
                                    <button
                                        onClick={triggerCycleCountSimulation}
                                        className="text-[10px] md:text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ml-auto"
                                    >
                                        Simulate Cycle Count
                                    </button>
                                </div>

                                <div className="overflow-x-auto custom-scrollbar -mx-2 md:mx-0">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead>
                                            <tr className="border-b border-gray-700 text-[10px] md:text-xs uppercase tracking-widest">
                                                <th className="pb-3 font-semibold text-gray-400 px-2">Item</th>
                                                <th className="pb-3 font-semibold text-gray-400 px-4">Level</th>
                                                <th className="pb-3 font-semibold text-gray-400 px-4">Status</th>
                                                <th className="pb-3 font-semibold text-gray-400 text-right px-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventory.map(item => {
                                                const isLow = item.stock <= item.par * 0.3;
                                                return (
                                                    <tr key={item.id} className="border-b border-gray-700/50 last:border-0 hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-2">
                                                            <div className="flex items-center gap-2 text-white font-medium text-sm">
                                                                {item.name}
                                                                {item.isHighValue && <AlertTriangle size={14} className="text-yellow-400" />}
                                                            </div>
                                                            <div className="text-[10px] text-gray-500 mt-0.5">${item.price.toFixed(2)}</div>
                                                        </td>
                                                        <td className="py-4 px-4 text-white text-sm">
                                                            <div className="flex items-baseline gap-2">
                                                                <span className={`font-bold ${isLow ? 'text-red-400' : 'text-green-400'}`}>
                                                                    {item.stock}
                                                                </span>
                                                                <span className="text-xs text-gray-500">/ {item.par}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            {isLow ? (
                                                                <span className="px-2 py-0.5 md:py-1 bg-red-500/10 text-red-400 rounded-md text-[10px] md:text-xs font-semibold whitespace-nowrap">Below Par</span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 md:py-1 bg-green-500/10 text-green-400 rounded-md text-[10px] md:text-xs font-semibold whitespace-nowrap">Healthy</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 text-right px-2">
                                                            <button
                                                                onClick={() => onRequestRestock(item.name, isLow)}
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-colors whitespace-nowrap ${isLow
                                                                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                                                                    : 'bg-[#1a1d29] hover:bg-gray-700 text-gray-300 border border-gray-600'
                                                                    }`}
                                                            >
                                                                Restock
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-[#2d3142] rounded-2xl p-6 border border-white/5 shadow-xl">
                                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-6">
                                    <Truck className="text-orange-400" size={24} />
                                    Shipment Manager
                                </h3>
                                <div className="space-y-4">
                                    {shipments.map(shipment => (
                                        <div key={shipment.id} className="bg-[#1a1d29] border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div>
                                                <h4 className="text-white font-bold text-sm md:text-base">{shipment.manifest}</h4>
                                                <p className="text-xs text-gray-400 mt-1">Expected: {shipment.expectedItems} items</p>
                                            </div>
                                            {shipment.status === 'PENDING' ? (
                                                <button
                                                    onClick={() => setActiveModal('SHIPMENT')}
                                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all"
                                                >
                                                    Receive Manifest
                                                </button>
                                            ) : (
                                                <span className="flex items-center gap-2 text-green-400 text-xs md:text-sm font-bold bg-green-500/10 px-3 py-1.5 rounded-lg w-full sm:w-auto justify-center">
                                                    <CheckCircle2 size={16} /> Received
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Actions */}
                        <div className="space-y-4 md:space-y-6">
                            <button
                                onClick={() => setActiveModal('DAMAGE')}
                                className="w-full bg-[#2d3142] hover:bg-red-500/10 border border-gray-700 hover:border-red-500/30 rounded-2xl p-6 text-left transition-all duration-300 group"
                            >
                                <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Camera className="text-red-400" size={24} />
                                </div>
                                <h3 className="text-white font-bold text-lg">Flag Damage</h3>
                                <p className="text-gray-400 text-xs md:text-sm mt-2">Log defective or broken items.</p>
                            </button>

                            <button
                                onClick={() => setActiveModal('RETURN')}
                                className="w-full bg-[#2d3142] hover:bg-purple-500/10 border border-gray-700 hover:border-purple-500/30 rounded-2xl p-6 text-left transition-all duration-300 group"
                            >
                                <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <ArrowLeftRight className="text-purple-400" size={24} />
                                </div>
                                <h3 className="text-white font-bold text-lg">Return / Exchange</h3>
                                <p className="text-gray-400 text-xs md:text-sm mt-2">Log guest returns and update status.</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'SHIPMENT' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-[#1a1d29] w-full max-w-md rounded-2xl border border-blue-500/30 shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <ScanLine className="text-blue-400" /> Scan Manifest
                        </h3>
                        <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center mb-6 border border-gray-700">
                            <p className="text-gray-500">[ Camera Scanning Placeholder ]</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleReceiveShipment('SHP-101')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold">Complete Scan</button>
                            <button onClick={() => setActiveModal('NONE')} className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-bold">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'DAMAGE' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-[#1a1d29] w-full max-w-md rounded-2xl border border-red-500/30 shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Camera className="text-red-400" /> Report Damage
                        </h3>
                        <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center mb-6 border border-gray-700">
                            <p className="text-gray-500">[ Take Photo Placeholder ]</p>
                        </div>
                        <select
                            value={damageItem}
                            onChange={e => setDamageItem(e.target.value)}
                            className="w-full bg-[#2d3142] border border-gray-700 text-white rounded-lg px-4 py-3 mb-6 focus:border-red-500/50 outline-none"
                        >
                            <option value="">Select Item...</option>
                            {inventory.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                        </select>
                        <div className="flex gap-3">
                            <button onClick={handleReportDamage} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-bold" disabled={!damageItem}>Confirm Damage</button>
                            <button onClick={() => setActiveModal('NONE')} className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-bold">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'RETURN' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                    <div className="bg-[#1a1d29] w-full max-w-md rounded-2xl border border-purple-500/30 shadow-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <ArrowLeftRight className="text-purple-400" /> Guest Return
                        </h3>
                        <div className="space-y-4 mb-6">
                            <select
                                value={returnItem}
                                onChange={e => setReturnItem(e.target.value)}
                                className="w-full bg-[#2d3142] border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-purple-500/50 outline-none"
                            >
                                <option value="">Select Item...</option>
                                {inventory.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                            </select>

                            <input
                                type="text"
                                placeholder="Reason for return..."
                                value={returnReason}
                                onChange={e => setReturnReason(e.target.value)}
                                className="w-full bg-[#2d3142] border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-purple-500/50 outline-none"
                            />

                            <select
                                value={returnAction}
                                onChange={e => setReturnAction(e.target.value)}
                                className="w-full bg-[#2d3142] border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-purple-500/50 outline-none"
                            >
                                <option value="BACK_TO_SHELF">Return to Sellable Stock</option>
                                <option value="DAMAGED">Mark as Damaged</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleProcessReturn} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold" disabled={!returnItem || !returnReason}>Process Return</button>
                            <button onClick={() => setActiveModal('NONE')} className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-bold">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GiftShopDashboard;
