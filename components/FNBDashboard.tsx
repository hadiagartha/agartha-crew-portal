import React, { useState, useEffect } from 'react';
import { Thermometer, Package, Map, QrCode as QrCodeIcon, AlertTriangle, CheckCircle, Coffee, Navigation } from 'lucide-react';
import { RestockTask } from '../types';

interface FNBDashboardProps {
    onRequestRestock: (item: string, isUrgent: boolean) => void;
    restockTasks: RestockTask[];
}

const FNBDashboard: React.FC<FNBDashboardProps> = ({ onRequestRestock, restockTasks }) => {
    const [fridgeTemps, setFridgeTemps] = useState({ fridge1: 2.5, fridge2: 3.1 });
    const [qrGenerated, setQrGenerated] = useState(false);

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
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Thermometer className="text-blue-400" /> EHS Equipment Monitoring
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-[#1a1d29] p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                            <div>
                                <p className="text-white font-bold mb-1">Fridge 01 (Beverages)</p>
                                <p className="text-xs text-gray-400 font-mono">Target: 2.0 - 4.0 °C</p>
                            </div>
                            <div className={`text-2xl font-mono font-bold ${fridgeTemps.fridge1 > 4 ? 'text-red-400' : 'text-green-400'}`}>
                                {fridgeTemps.fridge1.toFixed(1)} °C
                            </div>
                        </div>
                        <div className="bg-[#1a1d29] p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                            <div>
                                <p className="text-white font-bold mb-1">Fridge 02 (Perishables)</p>
                                <p className="text-xs text-gray-400 font-mono">Target: 1.0 - 3.0 °C</p>
                            </div>
                            <div className={`text-2xl font-mono font-bold ${fridgeTemps.fridge2 > 3 ? 'text-red-400' : 'text-green-400'}`}>
                                {fridgeTemps.fridge2.toFixed(1)} °C
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Inventory */}
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
                                <div className={`h-full rounded-full transition-all duration-300 ${waterStock < 20 ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-gradient-to-r from-green-500 to-green-400'}`} style={{ width: `${waterStock}%` }}></div>
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
                                <div className={`h-full rounded-full transition-all duration-300 ${mealStock < 20 ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'}`} style={{ width: `${mealStock}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-sm mb-2 font-bold">
                                <span className="text-gray-300 flex items-center gap-2">Energy Snacks {snackStock < 20 && <AlertTriangle size={14} className="text-red-500 shrink-0 animate-pulse" />}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-red-400 flex items-center gap-2">{snackStock} / 100 {snackStock < 20 && <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30 uppercase tracking-widest">Below Par</span>}</span>
                                    <button onClick={() => handleSale('snack')} className="bg-[#1a1d29] hover:bg-[#3e445b] text-xs px-2 py-1 rounded border border-gray-600">Sell 1</button>
                                </div>
                            </div>
                            <div className="w-full bg-[#1a1d29] rounded-full h-3 border border-gray-700 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-300 ${snackStock < 20 ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-gradient-to-r from-green-500 to-green-400'}`} style={{ width: `${snackStock}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Map Runner Tracking */}
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 z-10">
                        <Map className="text-green-400" /> Runner Tracking Map
                    </h3>
                    <div className="flex-1 min-h-[250px] bg-[#1a1d29] rounded-xl border border-gray-700/50 relative flex items-center justify-center overflow-hidden shadow-inner">
                        {/* Map Grid Background */}
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                        {/* Base Station marker */}
                        <div className="absolute top-1/2 left-1/2 -ml-4 -mt-4 text-blue-500 bg-blue-500/10 p-2 rounded-full border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10">
                            <Coffee size={20} />
                        </div>

                        {/* Runner 1 (Active) */}
                        <div className="absolute top-[25%] left-[30%] text-yellow-500 flex flex-col items-center animate-bounce z-20">
                            <div className="bg-black/90 px-3 py-1 rounded-md text-[10px] font-bold mb-2 border border-yellow-500/50 shadow-lg backdrop-blur-sm truncate">Runner A (Zone 2)</div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400 blur-md opacity-40 rounded-full"></div>
                                <Navigation size={20} className="rotate-45 relative z-10 fill-current text-yellow-400" />
                            </div>
                        </div>

                        {/* Runner 2 (Returning) */}
                        <div className="absolute bottom-[20%] right-[25%] text-purple-500 flex flex-col items-center z-20">
                            <div className="bg-black/90 px-3 py-1 rounded-md text-[10px] font-bold mb-2 border border-purple-500/50 shadow-lg backdrop-blur-sm truncate">Runner B (Return)</div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-400 blur-md opacity-40 rounded-full"></div>
                                <Navigation size={20} className="-rotate-[135deg] relative z-10 fill-current text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Code Receipt Generator */}
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <QrCodeIcon className="text-yellow-400" /> Digital Receipt Generator
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">Generate a secure one-time QR code for guest food and beverage redemptions at designated pickup areas.</p>

                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-600/50 hover:border-yellow-500/30 transition-colors rounded-xl p-6 bg-[#1a1d29]/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
                        {qrGenerated ? (
                            <div className="flex flex-col items-center gap-5 relative z-10 animate-fadeIn">
                                <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.4)] transform hover:scale-105 transition-transform duration-300">
                                    <QrCodeIcon size={100} className="text-[#1a1d29]" />
                                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-2xl animate-pulse opacity-50"></div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-green-400 text-sm font-bold flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                                        <CheckCircle size={16} /> Receipt #8892 Active
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono">Expires in 04:59</span>
                                </div>
                                <button
                                    onClick={() => setQrGenerated(false)}
                                    className="mt-2 text-xs text-gray-400 hover:text-white transition-colors underline decoration-gray-600 hover:decoration-white underline-offset-4"
                                >
                                    Reset Generator
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setQrGenerated(true)}
                                className="relative z-10 bg-gradient-to-r from-yellow-500 to-yellow-600 text-[#1a1d29] hover:brightness-110 font-bold px-8 py-4 rounded-xl border border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all flex items-center justify-center gap-3 w-full max-w-sm group-hover:scale-[1.02]"
                            >
                                <QrCodeIcon size={24} className="group-hover:rotate-12 transition-transform duration-300" /> Generate One-Time Code
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FNBDashboard;
