import React, { useState } from 'react';
import { Truck, MapPin, Package, Camera, QrCode, CheckCircle2, QrCode as QrCodeIcon, AlertCircle, ArrowRight, Play } from 'lucide-react';
import { useGlobalState } from '../GlobalStateContext';
import { RestockTask } from '../../types';

const RestockTab: React.FC = () => {
    const { restock_tasks, updateRestockTask, updateCentralStorage } = useGlobalState();
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [showQrScan, setShowQrScan] = useState(false);

    const activeTask = restock_tasks.find(t => t.id === activeTaskId);

    const handleAcceptTask = (taskId: string) => {
        setActiveTaskId(taskId);
        updateRestockTask(taskId, { status: 'IN_PROGRESS' });
    };

    const handleCompleteTask = () => {
        if (!activeTaskId || !activeTask) return;
        updateRestockTask(activeTaskId, { status: 'COMPLETED', photoProof: 'verified_destination_photo' });

        // Deduction from warehouse happened at dispatch or happens now depending on business logic
        // For this flow, let's assume it's logged upon arrival at destination
        updateCentralStorage(activeTask.item, -(activeTask.quantity));

        window.alert('Task Finalized: Item delivered and zone verified.');
        setActiveTaskId(null);
        setHasPhoto(false);
        setShowQrScan(false);
    };

    // Priority styles removed

    return (
        <div className="flex flex-col gap-6 animate-fadeIn pb-20 text-white">
            {/* DISPATCH QUEUE TABLE */}
            {!activeTaskId && (
                <div className="space-y-6">
                    <div className="bg-[#2d3142]/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Truck className="text-yellow-400" size={24} />
                            Dispatch Queue (Restocks)
                        </h3>
                    </div>

                    <div className="bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Task ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Item Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Route (From &rarr; To)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restock_tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').map(task => (
                                    <tr key={task.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-6 font-bold">
                                            <div className="text-white group-hover:text-yellow-400 transition-colors">{task.id}</div>
                                            <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${task.status === 'IN_PROGRESS' ? 'text-blue-400' : 'text-yellow-500'}`}>
                                                {task.status === 'IN_PROGRESS' ? 'ACCEPTED - PENDING' : 'PENDING'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-sm font-bold text-gray-200">{task.item}</div>
                                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">{task.barcode} • {task.quantity} {task.unit}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                <MapPin size={14} className="text-red-400" />
                                                <span className="text-gray-500">{task.origin || 'Warehouse'}</span>
                                                <ArrowRight size={12} className="mx-1 text-gray-600" />
                                                <span className="text-white font-bold">{task.standLocation}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button
                                                onClick={() => handleAcceptTask(task.id)}
                                                className={`${task.status === 'IN_PROGRESS' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-yellow-500 hover:bg-yellow-400'} text-black text-xs font-black px-4 py-2 rounded-lg transition-all flex items-center gap-2 ml-auto shadow-lg shadow-yellow-500/10`}
                                            >
                                                {task.status === 'IN_PROGRESS' ? 'RESUME' : 'ACCEPT'} <Play size={14} fill="currentColor" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ACTIVE RESTOCK WORKFLOW */}
            {activeTask && (
                <div className="space-y-6">
                    <button onClick={() => setActiveTaskId(null)} className="text-gray-500 hover:text-white text-xs font-bold flex items-center gap-2 mb-2 transition-colors">
                        <ArrowRight className="rotate-180" size={14} /> RELEASE TASK
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Task Specs */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#1a1d31]/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-white tracking-tight uppercase">Restock In Progress</h3>
                                        <p className="text-yellow-400/60 font-medium flex items-center gap-2 uppercase text-xs tracking-widest">
                                            Task {activeTask.id} • Assigned to You
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Item Information</div>
                                        <div className="space-y-1">
                                            <div className="text-2xl font-black text-white">{activeTask.item}</div>
                                            <div className="text-sm text-blue-400 font-mono">{activeTask.barcode}</div>
                                            <div className="text-xl font-bold text-gray-400">{activeTask.quantity} {activeTask.unit}</div>
                                        </div>
                                    </div>
                                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Route Details</div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-500/10 rounded-lg">
                                                    <MapPin className="text-gray-400" size={16} />
                                                </div>
                                                <div className="text-sm font-medium text-gray-400">From: <span className="text-white font-bold">{activeTask.origin || 'Warehouse'}</span></div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-500/10 rounded-lg">
                                                    <MapPin className="text-red-500" size={16} />
                                                </div>
                                                <div className="text-sm font-medium text-gray-400">To: <span className="text-white font-bold">{activeTask.standLocation}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                        <AlertCircle size={14} className="text-yellow-400" /> Safety Workflow Protocol
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex gap-2">
                                        <div className={`flex-1 p-4 rounded-xl text-center border transition-all ${hasPhoto ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-black/20 border-white/5 text-gray-500'}`}>
                                            <div className="text-[10px] font-black uppercase mb-1">Step 1</div>
                                            <div className="font-bold">Photo Proof</div>
                                        </div>
                                        <div className={`flex-1 p-4 rounded-xl text-center border transition-all ${hasPhoto ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-black/20 border-white/5 text-gray-500'}`}>
                                            <div className="text-[10px] font-black uppercase mb-1">Step 2</div>
                                            <div className="font-bold">QR Verification</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Control Panel */}
                        <div className="space-y-4">
                            <button
                                onClick={() => setShowCamera(true)}
                                className={`w-full p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 group ${hasPhoto
                                    ? 'bg-green-500/10 border-green-500 text-green-500'
                                    : 'bg-[#1a1d31] border-white/10 text-white hover:border-yellow-500/50'}`}
                            >
                                <div className={`p-5 rounded-full ${hasPhoto ? 'bg-green-500/20' : 'bg-white/5 group-hover:scale-110 transition-transform'}`}>
                                    <Camera size={40} className={hasPhoto ? 'text-green-500' : 'text-yellow-400'} />
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-black uppercase tracking-tight">{hasPhoto ? 'Proof Captured' : 'Take Arrival Photo'}</div>
                                    <div className="text-[10px] font-bold uppercase opacity-50">At {activeTask.standLocation}</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setShowQrScan(true)}
                                disabled={!hasPhoto}
                                className={`w-full p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 group shadow-2xl ${hasPhoto
                                    ? 'bg-yellow-500 border-yellow-400 text-black hover:bg-yellow-400 animate-pulse'
                                    : 'bg-black/20 border-white/5 text-gray-500 cursor-not-allowed grayscale'}`}
                            >
                                <div className={`p-5 rounded-full ${hasPhoto ? 'bg-black/10' : 'bg-white/5'}`}>
                                    <QrCode size={40} />
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-black uppercase tracking-tight">Scan Zone QR</div>
                                    {!hasPhoto && <div className="text-[10px] font-black uppercase mt-1 opacity-60">Locked: Take Photo First</div>}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CAMERA MODAL */}
            {showCamera && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowCamera(false)}>
                    <div className="bg-[#1a1d31] p-10 rounded-[3rem] border border-white/10 text-center space-y-6 max-w-sm w-full animate-zoomIn" onClick={e => e.stopPropagation()}>
                        <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera size={48} className="text-yellow-500 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Arrival Proof</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">Ensure the item and the destination marking are clearly visible in the frame.</p>
                        <button
                            onClick={() => { setShowCamera(false); setHasPhoto(true); }}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 transition-all font-black"
                        >
                            Log Photo Proof
                        </button>
                        <button onClick={() => setShowCamera(false)} className="text-gray-600 text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">Cancel</button>
                    </div>
                </div>
            )}

            {/* QR SCAN MODAL */}
            {showQrScan && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" onClick={() => setShowQrScan(false)}>
                    <div className="bg-[#1a1d31] p-10 rounded-[3rem] border border-yellow-500/30 text-center space-y-8 max-w-sm w-full animate-zoomIn" onClick={e => e.stopPropagation()}>
                        <div className="relative w-64 h-64 mx-auto border-4 border-yellow-500/40 rounded-[2rem] overflow-hidden flex items-center justify-center bg-black/80 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                            <QrCodeIcon size={120} className="text-yellow-500/20" />
                            <div className="absolute inset-x-0 top-0 h-1 bg-yellow-500/80 animate-scanLine" />
                            <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Scanning Zone QR</h2>
                            <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mt-1">Locate tag at {activeTask?.standLocation}</p>
                        </div>
                        <button
                            onClick={handleCompleteTask}
                            className="w-full bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={24} /> Verify & Complete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestockTab;
