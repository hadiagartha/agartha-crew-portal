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
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-full">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Coffee className="text-yellow-400" size={28} /> F&B Operations Dashboard
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mt-1">Manage EHS, Inventory, and Runner dispatch.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pb-6">

                {/* EHS Fridge Checklist */}
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Thermometer className="text-blue-400" /> Compliance Log (Temperature)
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-[#1a1d29] p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                            <div>
                                <p className="text-white font-bold mb-1">Fridge 01 (Beverages)</p>
                                <p className="text-xs text-gray-400 font-mono">Target: 1.0 - 4.0 °C</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`text-2xl font-mono font-bold ${fridgeTemps.fridge1 > 4 || fridgeTemps.fridge1 < 1 ? 'text-red-400' : 'text-green-400'}`}>
                                    {fridgeTemps.fridge1.toFixed(1)} °C
                                </div>
                                <button onClick={() => handleLogFridge(1, fridgeTemps.fridge1)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 text-xs rounded-lg">Log</button>
                            </div>
                        </div>
                        <div className="bg-[#1a1d29] p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                            <div>
                                <p className="text-white font-bold mb-1">Fridge 02 (Perishables)</p>
                                <p className="text-xs text-gray-400 font-mono">Target: 1.0 - 4.0 °C</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`text-2xl font-mono font-bold ${fridgeTemps.fridge2 > 4 || fridgeTemps.fridge2 < 1 ? 'text-red-400' : 'text-green-400'}`}>
                                    {fridgeTemps.fridge2.toFixed(1)} °C
                                </div>
                                <button onClick={() => handleLogFridge(2, fridgeTemps.fridge2)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 text-xs rounded-lg">Log</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Prep and Waste Management */}
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <ClipboardCheck className="text-green-400" /> Prep Batch Logger
                        </h3>
                        <form onSubmit={handleLogPrep} className="flex gap-2">
                            <input type="text" placeholder="Item (e.g., Slush Mix)" value={prepItem} onChange={(e) => setPrepItem(e.target.value)} className="flex-1 bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white" required />
                            <input type="number" placeholder="Qty" value={prepQty} onChange={(e) => setPrepQty(e.target.value)} className="w-20 bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white" required min="1" />
                            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Log Batch</button>
                        </form>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Trash2 className="text-red-400" /> Waste/Spoilage Tracker
                        </h3>
                        <form onSubmit={handleLogWaste} className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input type="text" placeholder="Item (e.g., Croissant)" value={wasteItem} onChange={(e) => setWasteItem(e.target.value)} className="flex-1 bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white" required />
                                <input type="number" placeholder="Qty" value={wasteQty} onChange={(e) => setWasteQty(e.target.value)} className="w-20 bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white" required min="1" />
                            </div>
                            <div className="flex gap-2 items-center">
                                <select value={wasteReason} onChange={(e) => setWasteReason(e.target.value)} className="flex-1 bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                                    <option value="Expired">Expired</option>
                                    <option value="Damaged">Damaged</option>
                                    <option value="Contaminated">Contaminated</option>
                                    <option value="Prep Error">Prep Error</option>
                                </select>
                                <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Log Waste</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Checkout & Promo Code Flow */}
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <QrCodeIcon className="text-yellow-400" /> POS Checkout Flow
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">Enter marketing promo code and generate secure receipt for guest F&B redemption.</p>

                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-600/50 hover:border-yellow-500/30 transition-colors rounded-xl p-6 bg-[#1a1d29]/50 relative overflow-hidden group">
                        {qrGenerated ? (
                            <div className="flex flex-col items-center gap-5 relative z-10 animate-fadeIn">
                                <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                                    <QrCodeIcon size={100} className="text-[#1a1d29]" />
                                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-2xl animate-pulse opacity-50"></div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-green-400 text-sm font-bold flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                                        <CheckCircle size={16} /> Receipt Active
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono">Expires in 04:59</span>
                                </div>
                                <button
                                    onClick={() => setQrGenerated(false)}
                                    className="mt-2 text-xs text-gray-400 hover:text-white transition-colors underline decoration-gray-600 hover:decoration-white underline-offset-4"
                                >
                                    New Transaction
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCheckout} className="w-full max-w-sm flex flex-col gap-4 relative z-10">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Ticket className="text-gray-400 w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Promo Code (Optional)"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        className="w-full bg-[#1a1d29] border border-gray-600 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 uppercase transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-[#1a1d29] hover:brightness-110 font-bold px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 w-full"
                                >
                                    <QrCodeIcon size={20} /> Checkout & Print Code
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Real-time Inventory snippet (condensed to fit) */}
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Package className="text-purple-400" /> Live Inventory (Par Levels)
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center text-sm mb-2 font-bold">
                                <span className="text-gray-300">Bottled Water</span>
                                <div className="flex items-center gap-3">
                                    <span className={waterStock < 20 ? "text-red-400" : "text-green-400"}>{waterStock} / 100</span>
                                    <button onClick={() => handleSale('water')} className="bg-[#1a1d29] hover:bg-[#3e445b] text-xs px-2 py-1 rounded border border-gray-600">Sell 1</button>
                                </div>
                            </div>
                            <div className="w-full bg-[#1a1d29] rounded-full h-3 border border-gray-700 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-300 ${waterStock < 20 ? 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse' : 'bg-gradient-to-r from-green-500 to-green-400'}`} style={{ width: `${waterStock}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-sm mb-2 font-bold">
                                <span className="text-gray-300">Pre-packaged Meals</span>
                                <div className="flex items-center gap-3">
                                    <span className={mealStock < 20 ? "text-red-400" : "text-yellow-400"}>{mealStock} / 100</span>
                                    <button onClick={() => handleSale('meal')} className="bg-[#1a1d29] hover:bg-[#3e445b] text-xs px-2 py-1 rounded border border-gray-600">Sell 1</button>
                                </div>
                            </div>
                            <div className="w-full bg-[#1a1d29] rounded-full h-3 border border-gray-700 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-300 ${mealStock < 20 ? 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'}`} style={{ width: `${mealStock}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FNBDashboard;
