import React, { useState } from 'react';
import { Truck, MapPin, Package, Camera, QrCode, CheckCircle2, QrCode as QrCodeIcon } from 'lucide-react';
import { useGlobalState } from './GlobalStateContext';
import { RestockTask } from '../types';

const RestockTab: React.FC = () => {
    const { restock_tasks, updateRestockTask, updateCentralStorage } = useGlobalState();
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Acceptance, 2: Item Data, 3: Verification
    const [itemName, setItemName] = useState('');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('pcs');
    const [showCamera, setShowCamera] = useState(false);
    const [showQrScan, setShowQrScan] = useState(false);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [isScanningBarcode, setIsScanningBarcode] = useState(false);

    const activeTask = restock_tasks.find(t => t.id === activeTaskId);

    const handleAcceptTask = (taskId: string) => {
        setActiveTaskId(taskId);
        updateRestockTask(taskId, { status: 'IN_PROGRESS' });
        setStep(2);
    };

    const handleBarcodeScan = () => {
        setIsScanningBarcode(true);
        setTimeout(() => {
            setItemName(activeTask?.item || 'Unknown Item');
            setAmount(activeTask?.quantity.toString() || '');
            setIsScanningBarcode(false);
        }, 1500);
    };

    const handleCompleteTask = () => {
        if (!activeTaskId) return;
        updateRestockTask(activeTaskId, { status: 'COMPLETED', photoProof: 'verified_destination_photo' });

        // Update Inventory (Deduction from warehouse)
        updateCentralStorage(activeTask?.item || '', -(parseInt(amount, 10) || 0));

        window.alert('Task Completed Successfully!');
        setActiveTaskId(null);
        setStep(1);
        setHasPhoto(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dispatch Queue */}
                <div className="bg-[#2d3142]/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Truck className="text-yellow-400" size={20} /> Dispatch Queue
                    </h3>
                    <div className="space-y-3">
                        {restock_tasks.filter(t => t.status === 'PENDING').map(task => (
                            <div key={task.id} className="bg-[#1a1d29] p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-yellow-500/30 transition-all">
                                <div>
                                    <div className="text-white font-bold">{task.item}</div>
                                    <div className="text-xs text-gray-500">{task.standLocation}</div>
                                </div>
                                <button
                                    onClick={() => handleAcceptTask(task.id)}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-xs hover:bg-yellow-400 transition-all"
                                >
                                    Claim Task
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Task Workflow */}
                {activeTask && (
                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-yellow-500/20 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Active: {activeTask.item}</h3>
                            <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                                Phase: {step === 2 ? 'Data Input' : 'Destination Verification'}
                            </span>
                        </div>

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Item Identifier</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Name/Barcode"
                                                    className="w-full bg-[#1a1d29] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                                                    value={itemName}
                                                    onChange={(e) => setItemName(e.target.value)}
                                                />
                                                {isScanningBarcode && (
                                                    <div className="absolute inset-0 bg-yellow-500/20 rounded-xl animate-pulse flex items-center justify-center">
                                                        <span className="text-[10px] font-black text-yellow-500">SCANNING...</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleBarcodeScan}
                                                className="p-2 bg-[#1a1d29] border border-white/10 rounded-xl text-yellow-400 hover:border-yellow-500"
                                                title="Scan Barcode"
                                            >
                                                <QrCode size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Quantity</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                className="flex-1 bg-[#1a1d29] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                            <select
                                                className="bg-[#1a1d29] border border-white/10 rounded-xl px-2 py-2 text-white text-xs"
                                                value={unit}
                                                onChange={(e) => setUnit(e.target.value)}
                                            >
                                                <option>pcs</option>
                                                <option>kgs</option>
                                                <option>liters</option>
                                                <option>boxes</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Dispatch Destination</label>
                                    <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-center gap-3">
                                        <MapPin className="text-yellow-500" size={18} />
                                        <span className="text-white font-medium">{activeTask.standLocation}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setShowCamera(true)}
                                        className={`w-full border font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${hasPhoto ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-[#1a1d29] border-white/10 text-white hover:border-yellow-500/50'}`}
                                    >
                                        <Camera size={20} className={hasPhoto ? 'text-green-500' : 'text-yellow-400'} />
                                        {hasPhoto ? 'Photo Captured' : 'Photo Proof (Destination)'}
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!itemName || !amount || !hasPhoto}
                                        className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl disabled:opacity-50 disabled:grayscale transition-all"
                                    >
                                        Continue to Final Verification
                                        {!hasPhoto && <span className="block text-[10px] font-black uppercase opacity-60 mt-1">(Photo Proof Required)</span>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 text-center">
                                <div className="bg-[#1a1d29] p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center border-4 border-yellow-500/20">
                                    <QrCodeIcon size={48} className="text-yellow-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Zone QR Verification</h4>
                                    <p className="text-gray-400 text-sm mt-1">Scan the physical QR code located at {activeTask.standLocation} to unlock completion.</p>
                                </div>

                                <button
                                    onClick={() => setShowQrScan(true)}
                                    className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all animate-pulse"
                                >
                                    <QrCode size={20} /> Scan Zone QR Code
                                </button>

                                <button onClick={() => setStep(2)} className="text-gray-500 text-xs underline">Back to Item Data</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals for Camera and QR */}
            {showCamera && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setShowCamera(false)}>
                    <div className="bg-[#1a1d29] p-8 rounded-3xl border border-white/10 text-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <Camera size={64} className="mx-auto text-yellow-500 mb-4" />
                        <h2 className="text-xl font-bold text-white">Capture Delivery Proof</h2>
                        <button onClick={() => { setShowCamera(false); setHasPhoto(true); }} className="mt-6 w-full bg-yellow-500 text-black py-3 rounded-xl font-bold">Capture Photo</button>
                    </div>
                </div>
            )}

            {showQrScan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setShowQrScan(false)}>
                    <div className="bg-[#1a1d29] p-8 rounded-3xl border border-white/10 text-center max-w-sm w-full space-y-6" onClick={e => e.stopPropagation()}>
                        <div className="relative w-48 h-48 mx-auto border-2 border-yellow-500 rounded-3xl overflow-hidden flex items-center justify-center bg-black/50">
                            <QrCodeIcon size={80} className="text-yellow-500/50" />
                            <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Verifying Zone...</h2>
                        <button onClick={handleCompleteTask} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} /> Mock Successful Scan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestockTab;
