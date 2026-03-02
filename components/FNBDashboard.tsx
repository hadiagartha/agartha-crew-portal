import React, { useState, useEffect } from 'react';
import { Thermometer, Package, Map, QrCode as QrCodeIcon, AlertTriangle, CheckCircle, Coffee, Navigation, ClipboardCheck, Trash2, Ticket } from 'lucide-react';
import { RestockTask } from '../types';
import { useGlobalState } from './GlobalStateContext';

interface FNBDashboardProps {
    onRequestRestock: (item: string, isUrgent: boolean) => void;
    restockTasks: RestockTask[];
}

const FNBDashboard: React.FC<FNBDashboardProps> = ({ onRequestRestock, restockTasks }) => {
    const { addFridgeTemp, addPrepBatch, addWasteLog, addPromoCode } = useGlobalState();

    const [fridgeTemps, setFridgeTemps] = useState({ fridge1: 2.5, fridge2: 3.1 });
    const [qrGenerated, setQrGenerated] = useState(false);

    // Forms state
    const [prepItem, setPrepItem] = useState('');
    const [prepQty, setPrepQty] = useState('');
    const [wasteItem, setWasteItem] = useState('');
    const [wasteQty, setWasteQty] = useState('');
    const [wasteReason, setWasteReason] = useState('Expired');
    const [promoCode, setPromoCode] = useState('');

    // Inventory states
    const [waterStock, setWaterStock] = useState(100);
    const [mealStock, setMealStock] = useState(45);
    const [snackStock, setSnackStock] = useState(15);

    const handleSale = (item: 'water' | 'meal' | 'snack') => {
        if (item === 'water') {
            setWaterStock(prev => {
                const requestedAlready = restockTasks.some(t => t.item === 'Bottled Water' && t.status !== 'COMPLETED');
                if (prev - 1 < 20 && !requestedAlready) onRequestRestock('Bottled Water', true);
                return Math.max(0, prev - 1);
            });
        }
        if (item === 'meal') {
            setMealStock(prev => {
                const requestedAlready = restockTasks.some(t => t.item === 'Pre-packaged Meals' && t.status !== 'COMPLETED');
                if (prev - 1 < 20 && !requestedAlready) onRequestRestock('Pre-packaged Meals', true);
                return Math.max(0, prev - 1);
            });
        }
        if (item === 'snack') {
            setSnackStock(prev => {
                const requestedAlready = restockTasks.some(t => t.item === 'Energy Snacks' && t.status !== 'COMPLETED');
                if (prev - 1 < 20 && !requestedAlready) onRequestRestock('Energy Snacks', true);
                return Math.max(0, prev - 1);
            });
        }
    };

    const handleLogFridge = (fridgeNum: number, temp: number) => {
        addFridgeTemp(temp, `FNB-Staff-01 (Fridge ${fridgeNum})`);
        window.alert(`Compliance Log saved for Fridge ${fridgeNum}: ${temp.toFixed(1)}°C`);
    };

    const handleLogPrep = (e: React.FormEvent) => {
        e.preventDefault();
        if (prepItem && prepQty) {
            addPrepBatch(prepItem, parseInt(prepQty, 10));
            setPrepItem('');
            setPrepQty('');
            window.alert('Prep batch logged to inventory.');
        }
    };

    const handleLogWaste = (e: React.FormEvent) => {
        e.preventDefault();
        if (wasteItem && wasteQty) {
            addWasteLog(wasteItem, parseInt(wasteQty, 10), wasteReason);
            setWasteItem('');
            setWasteQty('');
            window.alert('Waste logged successfully.');
        }
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        if (promoCode) {
            addPromoCode(promoCode, 'FNB-Checkout');
            setPromoCode('');
        }
        setQrGenerated(true);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setFridgeTemps(prev => ({
                fridge1: prev.fridge1 + (Math.random() * 0.4 - 0.2),
                fridge2: prev.fridge2 + (Math.random() * 0.4 - 0.2)
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#1a1d29]">
            {/* Header section */}
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142] flex flex-wrap gap-4 md:gap-6 items-center justify-between bg-[#1a1d29]/80 backdrop-blur-md sticky top-0 z-20">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-2 md:gap-3">
                        <Coffee className="text-yellow-400" size={24} /> F&B Operations
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">EHS Compliance, Prep Logger, and Inventory Management</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
                <div className="p-4 md:p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* EHS Fridge Checklist */}
                        <div className="bg-[#2d3142]/80 p-6 rounded-2xl border border-gray-700/50 shadow-xl flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Thermometer size={20} />
                                </div>
                                Compliance Log (EHS)
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-[#1a1d29] p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-blue-500/30 transition-all group">
                                    <div>
                                        <p className="text-white font-bold mb-1">Fridge 01 (Beverages)</p>
                                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Target: 1.0 - 4.0 °C</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-xl font-mono font-bold ${fridgeTemps.fridge1 > 4 || fridgeTemps.fridge1 < 1 ? 'text-red-400' : 'text-green-400'}`}>
                                            {fridgeTemps.fridge1.toFixed(1)}°
                                        </div>
                                        <button onClick={() => handleLogFridge(1, fridgeTemps.fridge1)} className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30 font-bold px-4 py-2 text-xs rounded-lg transition-all">LOG</button>
                                    </div>
                                </div>
                                <div className="bg-[#1a1d29] p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-blue-500/30 transition-all group">
                                    <div>
                                        <p className="text-white font-bold mb-1">Fridge 02 (Perishables)</p>
                                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Target: 1.0 - 4.0 °C</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-xl font-mono font-bold ${fridgeTemps.fridge2 > 4 || fridgeTemps.fridge2 < 1 ? 'text-red-400' : 'text-green-400'}`}>
                                            {fridgeTemps.fridge2.toFixed(1)}°
                                        </div>
                                        <button onClick={() => handleLogFridge(2, fridgeTemps.fridge2)} className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30 font-bold px-4 py-2 text-xs rounded-lg transition-all">LOG</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Prep and Waste Management */}
                        <div className="bg-[#2d3142]/80 p-6 rounded-2xl border border-gray-700/50 shadow-xl flex flex-col gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                        <ClipboardCheck size={20} />
                                    </div>
                                    Prep Batch Logger
                                </h3>
                                <form onSubmit={handleLogPrep} className="flex flex-col sm:flex-row gap-2">
                                    <input type="text" placeholder="Item (e.g., Slush Mix)" value={prepItem} onChange={(e) => setPrepItem(e.target.value)} className="flex-1 bg-[#1a1d29] border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500/50" required />
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Qty" value={prepQty} onChange={(e) => setPrepQty(e.target.value)} className="w-24 bg-[#1a1d29] border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500/50" required min="1" />
                                        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-green-600/10 whitespace-nowrap">Log</button>
                                    </div>
                                </form>
                            </div>

                            <div className="pt-2 border-t border-gray-700/30">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                        <Trash2 size={20} />
                                    </div>
                                    Waste Tracker
                                </h3>
                                <form onSubmit={handleLogWaste} className="space-y-3">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" placeholder="Item (e.g., Croissant)" value={wasteItem} onChange={(e) => setWasteItem(e.target.value)} className="flex-1 bg-[#1a1d29] border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50" required />
                                        <input type="number" placeholder="Qty" value={wasteQty} onChange={(e) => setWasteQty(e.target.value)} className="w-full sm:w-24 bg-[#1a1d29] border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50" required min="1" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <select value={wasteReason} onChange={(e) => setWasteReason(e.target.value)} className="flex-1 bg-[#1a1d29] border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none">
                                            <option value="Expired">Reason: Expired</option>
                                            <option value="Damaged">Reason: Damaged</option>
                                            <option value="Contaminated">Reason: Contaminated</option>
                                            <option value="Prep Error">Reason: Prep Error</option>
                                        </select>
                                        <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-red-600/10">Log Waste</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Checkout & POS Flow */}
                        <div className="bg-[#2d3142]/80 p-6 rounded-2xl border border-gray-700/50 shadow-xl flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                                    <QrCodeIcon size={20} />
                                </div>
                                POS Checkout
                            </h3>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed uppercase tracking-wider font-semibold">Generate Digital Guest Receipt</p>

                            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-600/50 rounded-2xl p-6 bg-[#1a1d29]/50 relative overflow-hidden group min-h-[250px]">
                                {qrGenerated ? (
                                    <div className="flex flex-col items-center gap-6 relative z-10 animate-in zoom-in-95 duration-300">
                                        <div className="bg-white p-5 rounded-3xl shadow-[0_0_50px_rgba(250,204,21,0.25)] relative group">
                                            <QrCodeIcon size={120} className="text-[#1a1d29]" />
                                            <div className="absolute -inset-2 border-2 border-yellow-400/30 rounded-[2rem] animate-pulse"></div>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-green-400 text-xs font-bold flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                                                <CheckCircle size={14} /> TRANSACTION SECURE
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Expires in 04:59</span>
                                        </div>
                                        <button
                                            onClick={() => setQrGenerated(false)}
                                            className="text-[10px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest border-b border-gray-600 hover:border-white pb-0.5"
                                        >
                                            New Transaction
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleCheckout} className="w-full max-w-sm flex flex-col gap-4 relative z-10">
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Ticket className="text-gray-500" size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="MARKETING PROMO CODE"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                    className="w-full bg-[#1a1d29] border border-gray-600 text-white rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 uppercase font-mono tracking-widest transition-all"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-yellow-500 hover:bg-yellow-400 text-[#1a1d29] font-black px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(234,179,8,0.2)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.35)] transition-all flex items-center justify-center gap-3 w-full uppercase tracking-tighter text-lg"
                                            >
                                                Generate Receipt
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Real-time Inventory */}
                        <div className="bg-[#2d3142]/80 p-6 rounded-2xl border border-gray-700/50 shadow-xl flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                    <Package size={20} />
                                </div>
                                Live Inventory (EOD Par)
                            </h3>
                            <div className="space-y-8">
                                <div className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="text-gray-300 font-bold block">Bottled Water</span>
                                            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Target Par: 100u</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-mono font-bold ${waterStock < 20 ? "text-red-400" : "text-green-400"}`}>{waterStock}%</span>
                                            <button onClick={() => handleSale('water')} className="bg-[#1a1d29] hover:bg-gray-700 text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-600 transition-all uppercase tracking-widest">Sell 1</button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#1a1d29] rounded-full h-2 border border-black/50 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ease-out ${waterStock < 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500'}`} style={{ width: `${waterStock}%` }}></div>
                                    </div>
                                </div>

                                <div className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="text-gray-300 font-bold block">Pre-packaged Meals</span>
                                            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Target Par: 100u</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-mono font-bold ${mealStock < 20 ? "text-red-400" : "text-yellow-400"}`}>{mealStock}%</span>
                                            <button onClick={() => handleSale('meal')} className="bg-[#1a1d29] hover:bg-gray-700 text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-600 transition-all uppercase tracking-widest">Sell 1</button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#1a1d29] rounded-full h-2 border border-black/50 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ease-out ${mealStock < 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-yellow-500'}`} style={{ width: `${mealStock}%` }}></div>
                                    </div>
                                </div>

                                <div className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="text-gray-300 font-bold block">Energy Snacks</span>
                                            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Target Par: 100u</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-mono font-bold ${snackStock < 20 ? "text-red-400" : "text-blue-400"}`}>{snackStock}%</span>
                                            <button onClick={() => handleSale('snack')} className="bg-[#1a1d29] hover:bg-gray-700 text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-600 transition-all uppercase tracking-widest">Sell 1</button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#1a1d29] rounded-full h-2 border border-black/50 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ease-out ${snackStock < 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`} style={{ width: `${snackStock}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FNBDashboard;
