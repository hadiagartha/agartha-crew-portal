import React, { useState } from 'react';
import { Truck, Navigation, PackageCheck, AlertTriangle, QrCode as QrCodeIcon, Map as MapIcon, Loader2, CheckCircle2, Camera, Download, KeyRound } from 'lucide-react';
import { RestockTask } from '../types';
import { useGlobalState } from './GlobalStateContext';

interface RunnerDashboardProps {
    tasks: RestockTask[];
    onPickupTask: (taskId: string, pickedUpQuantity: number) => void;
    onCompleteTask: (taskId: string) => void;
}

const RunnerDashboard: React.FC<RunnerDashboardProps> = ({ tasks, onPickupTask, onCompleteTask }) => {
    const { active_pos, updatePO, updateCentralStorage } = useGlobalState();
    const [scanningTaskId, setScanningTaskId] = useState<string | null>(null);
    const [scanProgress, setScanProgress] = useState(0);

    // Pickup Verification
    const [pickupTaskId, setPickupTaskId] = useState<string | null>(null);
    const [pickupStep, setPickupStep] = useState<1 | 2 | 3>(1); // 1: Barcode, 2: Quantity, 3: Confirm
    const [pickupQuantity, setPickupQuantity] = useState<string>('');

    // External Intake
    const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
    const [intakeItem, setIntakeItem] = useState('');
    const [intakeQty, setIntakeQty] = useState('');
    const [showSupplyScan, setShowSupplyScan] = useState(false);

    const pendingTasks = tasks.filter(t => t.status === 'PENDING').sort((a, b) => {
        const isA_Urgent = a.isUrgent || (a.statusDetails?.includes('Below Par') && parseInt(a.statusDetails.match(/\d+/)?.[0] || '100') < 10);
        const isB_Urgent = b.isUrgent || (b.statusDetails?.includes('Below Par') && parseInt(b.statusDetails.match(/\d+/)?.[0] || '100') < 10);
        return Number(isB_Urgent) - Number(isA_Urgent);
    });
    const activeTasks = tasks.filter(t => t.status === 'IN_TRANSIT');

    const handleStartScan = (taskId: string) => {
        setScanningTaskId(taskId);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        onCompleteTask(taskId);
                        setScanningTaskId(null);
                    }, 1000);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const handleStartPickup = (taskId: string) => {
        setPickupTaskId(taskId);
        setPickupStep(1);
        setPickupQuantity('');
    };

    const handleBarcodeScanned = () => setPickupStep(2);
    const handleNumpadInput = (num: string) => setPickupQuantity(prev => prev + num);
    const handleDeleteNumpad = () => setPickupQuantity(prev => prev.slice(0, -1));
    const handleSubmitQuantity = () => { if (pickupQuantity) setPickupStep(3); };

    const handleConfirmPickup = () => {
        if (!pickupTaskId || !pickupQuantity) return;
        onPickupTask(pickupTaskId, parseInt(pickupQuantity, 10));
        setPickupTaskId(null);
    };

    const handleIntakeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPoId && intakeItem && intakeQty) {
            const po = active_pos.find(p => p.id === selectedPoId);
            if (po) {
                const qty = parseInt(intakeQty, 10);
                const updatedItems = po.items.map(i => i.item === intakeItem ? { ...i, received: i.received + qty } : i);
                updatePO(selectedPoId, updatedItems);
                updateCentralStorage(intakeItem, qty);

                setIntakeItem('');
                setIntakeQty('');
                window.alert('PO scanned and Central Storage updated!');
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-full">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Truck className="text-purple-400" size={28} /> Runner tactical Dashboard
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mt-1">Manage dispatch tasks and external supply intakes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pb-6">

                {/* Prioritized Task Queue */}
                <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <PackageCheck className="text-yellow-400" /> Dispatch Queue
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {activeTasks.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">In Transit</h4>
                                {activeTasks.map(task => (
                                    <div key={task.id} className="bg-[#1a1d29] border border-purple-500/50 rounded-xl p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)] mb-3 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-white">{task.item}</h4>
                                                <p className="text-xs text-gray-400">Qty: {task.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-purple-400 font-bold text-sm block">Dest: {task.standLocation}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">Status: In Transit</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleStartScan(task.id)}
                                            className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                                        >
                                            <QrCodeIcon size={16} /> Scan Destination QR to Close
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Pending Requests</h4>
                            {pendingTasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 italic">No pending tasks. Stand by.</div>
                            ) : (
                                pendingTasks.map(task => {
                                    const isTaskUrgent = task.isUrgent || (task.statusDetails?.includes('Below Par') && parseInt(task.statusDetails.match(/\d+/)?.[0] || '100') < 10);
                                    return (
                                        <div key={task.id} className={`bg-[#1a1d29] border rounded-xl p-4 mb-3 relative overflow-hidden transition-all duration-300 ${isTaskUrgent ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-gray-700/50 hover:border-blue-500/30'}`}>
                                            {isTaskUrgent && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse"></div>}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className={`font-bold ${isTaskUrgent ? 'text-red-400 flex items-center gap-2' : 'text-white'}`}>
                                                        {task.item} {isTaskUrgent && <AlertTriangle size={14} className="animate-pulse" />}
                                                    </h4>
                                                    <p className="text-xs text-gray-400">Qty: {task.quantity} • {task.standLocation}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1">Dist: {task.distanceEstimate || 'Unknown'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleStartPickup(task.id)}
                                                className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm border ${isTaskUrgent ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30' : 'bg-[#2d3142] hover:bg-[#3e445b] text-white border-gray-600'}`}
                                            >
                                                <Truck size={16} /> {task.action || 'Mark as Picked Up'}
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* External Intake Tracker */}
                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 z-10">
                            <Download className="text-green-400" /> External Intake Tracking
                        </h3>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">Select active PO, scan incoming cargo barcodes, and reconcile quantities into central storage.</p>

                        <div className="mb-4">
                            <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Active Purchase Orders</label>
                            <select
                                value={selectedPoId || ''}
                                onChange={(e) => setSelectedPoId(e.target.value)}
                                className="w-full bg-[#1a1d29] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 mb-4"
                            >
                                <option value="" disabled>Select a PO</option>
                                {active_pos.filter(p => p.status === 'PENDING').map(po => (
                                    <option key={po.id} value={po.id}>{po.id} (Pending)</option>
                                ))}
                            </select>
                        </div>

                        {selectedPoId && (
                            <div className="bg-[#1a1d29] p-4 rounded-xl border border-gray-700">
                                <h4 className="text-sm font-bold text-white mb-3">Reconcile Items</h4>
                                <form onSubmit={handleIntakeSubmit} className="flex flex-col gap-3">
                                    <select
                                        value={intakeItem}
                                        onChange={(e) => setIntakeItem(e.target.value)}
                                        className="bg-[#2d3142] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
                                        required
                                    >
                                        <option value="" disabled>Select Expected Item</option>
                                        {active_pos.find(p => p.id === selectedPoId)?.items.map(i => (
                                            <option key={i.item} value={i.item}>{i.item} (Expected: {i.expected})</option>
                                        ))}
                                    </select>

                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowSupplyScan(true)} className="bg-green-600/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-green-600/30 transition-colors">
                                            <QrCodeIcon size={16} /> Scan
                                        </button>
                                        <input
                                            type="number"
                                            placeholder="Received Qty"
                                            value={intakeQty}
                                            onChange={(e) => setIntakeQty(e.target.value)}
                                            className="flex-1 bg-[#2d3142] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
                                            required
                                        />
                                        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">Log</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Live Heatmap Navigation */}
                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 z-10">
                            <MapIcon className="text-blue-400" /> Live Heatmap Routing
                        </h3>
                        <p className="text-sm text-gray-400 mb-4 z-10 leading-relaxed">Guest density overlay for planning optimal back-of-house traversal routes.</p>

                        <div className="flex-1 min-h-[250px] bg-[#1a1d29] rounded-xl border border-gray-700/50 relative flex items-center justify-center overflow-hidden shadow-inner isolate">
                            {/* Base Grid */}
                            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-red-500/30 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
                            <div className="absolute top-[30%] left-[30%] w-16 h-16 bg-red-600/40 rounded-full blur-2xl animate-[pulse_3s_ease-in-out_infinite]" />
                            <div className="absolute bottom-[30%] right-[20%] w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-[10%] left-[40%] w-24 h-24 bg-green-500/20 rounded-full blur-2xl" />

                            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 400 300">
                                <path d="M 50,250 L 150,100 L 250,50" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="8 4" className="animate-[dash_20s_linear_infinite]" />
                                <path d="M 50,250 L 200,280 L 350,150 L 250,50" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="8 4" className="animate-[dash_20s_linear_infinite]" />
                            </svg>

                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-700/50 flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> High Density (Avoid)</span>
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Optimal Route</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulated Supply Barcode Scan (Intake) */}
            {showSupplyScan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={() => setShowSupplyScan(false)}>
                    <div className="flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-white mb-4">Scanning Cargo Barcode...</h2>
                        <div className="w-64 h-64 border-4 border-green-500 rounded-3xl relative overflow-hidden flex items-center justify-center bg-[#1a1d29] cursor-pointer" onClick={() => {
                            setIntakeQty((Math.floor(Math.random() * 50) * 10).toString());
                            setShowSupplyScan(false);
                        }}>
                            <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
                            <QrCodeIcon size={80} className="text-green-500/50" />
                        </div>
                        <p className="text-green-400 font-mono text-sm mt-4">Tap to capture mock scan.</p>
                    </div>
                </div>
            )}

            {/* Simulated QR Scanner Modal */}
            {scanningTaskId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-xl font-bold text-white mb-4">Delivery Verification</h2>
                        <div className="w-64 h-64 border-4 border-purple-500 rounded-3xl relative overflow-hidden flex items-center justify-center bg-[#1a1d29]">
                            {scanProgress < 100 ? (
                                <>
                                    <div className="absolute inset-0 bg-purple-500/10" />
                                    <div
                                        className="absolute top-0 left-0 w-full h-1 bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,1)]"
                                        style={{ transform: `translateY(${scanProgress * 2.5}px)` }}
                                    />
                                    <QrCodeIcon size={80} className="text-purple-500/50" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 animate-in zoom-in-95">
                                    <CheckCircle2 size={80} className="text-green-400" />
                                    <span className="text-green-400 font-bold uppercase tracking-widest text-sm">Verified</span>
                                </div>
                            )}
                        </div>
                        <p className="text-purple-400 font-mono text-sm">Scanning Destination Node... {scanProgress}%</p>
                        <button
                            onClick={() => setScanningTaskId(null)}
                            className="text-gray-500 hover:text-white transition-colors text-sm underline mt-4"
                        >
                            Cancel Scan
                        </button>
                    </div>
                </div>
            )}

            {pickupTaskId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
                    <div className="bg-[#1a1d29] w-full max-w-sm rounded-[2rem] border-4 border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center p-6 pb-8">
                        {pickupStep === 1 && (
                            <>
                                <h2 className="text-xl font-bold text-white mb-2">Scan Product Barcode</h2>
                                <p className="text-sm text-gray-400 mb-6 text-center">Locate the item in the warehouse and scan its UPC</p>
                                <div
                                    className="w-full aspect-square border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-black mb-6 cursor-pointer hover:border-yellow-400 transition-colors"
                                    onClick={handleBarcodeScanned}
                                >
                                    <Camera size={48} className="text-gray-500 mb-4" />
                                    <span className="text-gray-500">Tap to Scan (Simulate)</span>
                                </div>
                                <button
                                    onClick={() => setPickupTaskId(null)}
                                    className="text-gray-500 hover:text-white transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        {pickupStep === 2 && (
                            <>
                                <h2 className="text-xl font-bold text-white mb-2">Input Quantity File</h2>
                                <p className="text-sm text-gray-400 mb-6 text-center">How many units are you securing for transfer?</p>
                                <div className="text-5xl font-mono text-yellow-400 mb-8 h-12 flex items-center justify-center">
                                    {pickupQuantity || <span className="opacity-20">0</span>}
                                </div>
                                <div className="grid grid-cols-3 gap-3 w-full max-w-[250px] mb-8">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => handleNumpadInput(num.toString())}
                                            className="h-14 bg-[#2d3142] active:bg-gray-600 rounded-xl text-xl font-bold text-white flex items-center justify-center transition-colors shadow-md"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <div />
                                    <button
                                        onClick={() => handleNumpadInput('0')}
                                        className="h-14 bg-[#2d3142] active:bg-gray-600 rounded-xl text-xl font-bold text-white flex items-center justify-center transition-colors shadow-md"
                                    >0</button>
                                    <button
                                        onClick={handleDeleteNumpad}
                                        className="h-14 bg-[#2d3142] active:bg-gray-600 rounded-xl text-xl font-bold text-red-400 flex items-center justify-center transition-colors shadow-md border border-red-500/20"
                                    >DEL</button>
                                </div>

                                <div className="flex w-full gap-3">
                                    <button
                                        onClick={() => setPickupStep(1)}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition-colors"
                                    >Back</button>
                                    <button
                                        onClick={handleSubmitQuantity}
                                        disabled={!pickupQuantity}
                                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-500 text-black py-3 rounded-lg font-bold transition-colors"
                                    >Next</button>
                                </div>
                            </>
                        )}
                        {pickupStep === 3 && (
                            <>
                                <h2 className="text-xl font-bold text-white mb-2">Confirmation Required</h2>
                                <p className="text-sm text-gray-400 mb-8 text-center px-4">
                                    Verify: <strong className="text-white">{pickupQuantity} units</strong> of <strong className="text-white">{pendingTasks.find(t => t.id === pickupTaskId)?.item}</strong>. Proceed to Photo Capture?
                                </p>
                                <div className="w-full flex flex-col gap-3">
                                    <button
                                        onClick={handleConfirmPickup}
                                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                                    ><Camera size={20} /> Capture Proof of Stock</button>
                                    <button
                                        onClick={() => setPickupStep(2)}
                                        className="w-full bg-transparent border border-gray-600 text-gray-400 py-3 rounded-xl font-bold transition-colors hover:text-white hover:border-gray-400"
                                    >Edit Quantity</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RunnerDashboard;
