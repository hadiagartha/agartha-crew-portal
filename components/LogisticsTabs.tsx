import React, { useState, useEffect } from 'react';
import { PackageOpen, MapPin, QrCode, Camera, AlertTriangle, History, ShieldAlert, Check, ArrowRight, Play, CheckCircle2, QrCode as QrCodeIcon } from 'lucide-react';
import { useGlobalState } from './GlobalStateContext';
import { Incident, IncidentSeverity, ManualRestockLog } from '../types';

export const ManualRestockTab: React.FC = () => {
    const { central_storage, updateCentralStorage, manual_restock_logs, addManualRestockLog } = useGlobalState();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [item, setItem] = useState('');
    const [barcode, setBarcode] = useState('');
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState('pcs');
    const [hasPhoto, setHasPhoto] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [showQrScan, setShowQrScan] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleBarcodeChange = (val: string) => {
        setBarcode(val);
        if (val.length >= 3) {
            setItem('Detected Item ' + val.substring(0, 3).toUpperCase());
            setUnit('pcs');
        } else {
            setItem('');
            setUnit('');
        }
    };

    const availableStock = central_storage[item] || 0;
    const requestedAmount = parseInt(qty, 10) || 0;

    const handleSubmit = () => {
        if (!hasPhoto) {
            window.alert('Mandatory: Capture visual proof of the request/items first.');
            return;
        }
        setShowQrScan(true);
    };

    const handleFinalize = () => {
        const amountToDeduct = requestedAmount;
        updateCentralStorage(item, -amountToDeduct);

        const newLog: any = {
            id: `MAN-${Date.now()}`,
            origin,
            destination,
            item,
            barcode,
            quantity: amountToDeduct,
            unit,
            timestamp: new Date(),
            photoProof: 'verified_physical_move',
            zoneQrVerified: true
        };
        addManualRestockLog(newLog);

        window.alert(`Manual Restock Finalized & Logged to Audit Trail.`);
        setOrigin('');
        setDestination('');
        setItem('');
        setBarcode('');
        setQty('');
        setHasPhoto(false);
        setShowQrScan(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn pb-20 text-white">
            <div className="flex justify-between items-center mb-2">
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors"
                >
                    <History size={16} /> {showHistory ? 'View Logging Form' : 'View Shift History'}
                </button>
            </div>

            {!showHistory ? (
                <div className="bg-[#1a1d31]/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-orange-500/10 rounded-[1.5rem] border border-orange-500/20">
                            <PackageOpen className="text-orange-400" size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Manual Restock Entry</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Log Unscheduled Material Movements</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Route */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Route</label>
                            <div className="flex gap-3">
                                <div className="relative group flex-1">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50 group-focus-within:text-orange-400 transition-colors" size={20} />
                                    <input
                                        placeholder="From"
                                        className="w-full bg-black/30 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold"
                                        value={origin}
                                        onChange={e => setOrigin(e.target.value)}
                                    />
                                </div>
                                <div className="relative group flex-1">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50 group-focus-within:text-orange-400 transition-colors" size={20} />
                                    <input
                                        placeholder="To"
                                        className="w-full bg-black/30 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold"
                                        value={destination}
                                        onChange={e => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Item ID / Barcode */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Item Identification</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <input
                                        placeholder="Scan Barcode"
                                        className="w-full bg-black/30 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-mono text-sm"
                                        value={barcode}
                                        onChange={e => handleBarcodeChange(e.target.value)}
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-white transition-colors">
                                        <QrCode size={18} />
                                    </button>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center text-gray-400 font-bold overflow-hidden whitespace-nowrap text-xs">
                                    {item || 'Scan to detect name'}
                                </div>
                            </div>
                        </div>

                        {/* Qty & Unit */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Quantity</label>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-black/30 border border-white/5 rounded-2xl px-5 py-4 text-white text-center text-xl font-black focus:outline-none focus:border-orange-500/50 transition-all"
                                        value={qty}
                                        onChange={e => setQty(e.target.value)}
                                    />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-center text-gray-500 font-black uppercase tracking-widest text-xs min-w-[80px]">
                                    {item ? unit : '---'}
                                </div>
                            </div>
                        </div>

                        {/* Photo Proof */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Movement Verification</label>
                            <button
                                onClick={() => setShowCamera(true)}
                                className={`w-full border-2 border-dashed rounded-2xl py-4 flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-xs ${hasPhoto ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-black/10 border-white/10 text-gray-500 hover:border-orange-500/50 hover:text-orange-400'}`}
                            >
                                <Camera size={20} /> {hasPhoto ? 'Physical Proof Recorded' : 'Capture Item Photo'}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={!origin || !destination || !item || !qty || !hasPhoto}
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black uppercase tracking-widest py-5 rounded-[1.5rem] shadow-xl shadow-orange-900/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3"
                        >
                            <Play size={20} fill="currentColor" /> Initialize Audit Log
                        </button>
                    </div>
                </div>
            ) : (
                /* MANUAL HISTORY TABLE */
                <div className="bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Timestamp & ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Item & Barcode</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Route</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Qty</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manual_restock_logs.map(log => (
                                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-6 font-bold">
                                        <div className="text-white">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div className="text-[9px] text-gray-500 font-black uppercase mt-1">{log.id}</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-sm font-bold text-gray-200">{log.item}</div>
                                        <div className="text-[10px] text-orange-400 font-mono mt-0.5">{log.barcode}</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                            <MapPin size={12} className="text-red-400" />
                                            <span className="text-gray-500">{log.origin || 'Warehouse'}</span>
                                            <ArrowRight size={10} className="mx-1 text-gray-600" />
                                            <span className="text-white">{log.destination}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className="bg-white/5 px-2 py-1 rounded font-black text-xs">
                                            -{log.quantity} {log.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <span className="text-green-500 font-black text-[10px] uppercase tracking-widest flex items-center justify-end gap-1">
                                            <CheckCircle2 size={12} /> QR SECURED
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {manual_restock_logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-600 italic text-sm font-bold uppercase tracking-widest">
                                        No ad-hoc movements logged this shift.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODALS */}
            {showCamera && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowCamera(false)}>
                    <div className="bg-[#1a1d31] p-10 rounded-[3rem] border border-white/10 text-center space-y-6 max-w-sm w-full animate-zoomIn" onClick={e => e.stopPropagation()}>
                        <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera size={48} className="text-orange-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Manual Log Proof</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">Capture the physical item or the requester's badge for the official audit trail.</p>
                        <button
                            onClick={() => { setShowCamera(false); setHasPhoto(true); }}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all"
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
                    <div className="bg-[#1a1d31] p-10 rounded-[3rem] border border-orange-500/30 text-center space-y-8 max-w-sm w-full animate-zoomIn" onClick={e => e.stopPropagation()}>
                        <div className="relative w-64 h-64 mx-auto border-4 border-orange-500/40 rounded-[2rem] overflow-hidden flex items-center justify-center bg-black/80 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                            <QrCodeIcon size={120} className="text-orange-500/20" />
                            <div className="absolute inset-x-0 top-0 h-1 bg-orange-500/80 animate-scanLine" />
                            <div className="absolute inset-0 bg-orange-500/5 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Authorize Deduction</h2>
                            <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mt-1">Scan QR at node: {destination}</p>
                        </div>
                        <button
                            onClick={handleFinalize}
                            className="w-full bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={24} /> Verify & Submit Log
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const IncidentReportTab: React.FC<{ initialData?: Partial<Incident> }> = ({ initialData }) => {
    const { logistics_incidents, addLogisticsIncident } = useGlobalState();
    const [type, setType] = useState('Damaged/Broken');
    const [item, setItem] = useState(initialData?.item_id || '');
    const [desc, setDesc] = useState(initialData?.description || '');
    const [hasEvidence, setHasEvidence] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    useEffect(() => {
        if (initialData) {
            setType('Damaged/Broken');
            setItem(initialData.item_id || '');
            setDesc(initialData.description || '');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasEvidence) {
            window.alert('Mandatory: Please upload visual evidence representing the incident.');
            return;
        }

        const newIncident: Incident = {
            id: `INC-${Date.now()}`,
            timestamp: new Date(),
            type,
            severity: IncidentSeverity.HIGH,
            description: desc,
            status: 'OPEN',
            reportedBy: 'Runner-Alpha',
            item_id: item
        };
        addLogisticsIncident(newIncident);
        window.alert('HIGH-PRIORITY ALERT: Incident broadcasted to Ops & Compliance.');

        // Reset
        setHasEvidence(false);
        setItem('');
        setDesc('');
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn pb-20 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ADAPTIVE FORM */}
                <div className="lg:col-span-2 bg-[#1a1d31]/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-red-500/20 shadow-2xl space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                            <ShieldAlert className="text-red-500" size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Adaptive Incident Logger</h3>
                            <p className="text-red-400 font-bold text-[10px] uppercase tracking-widest">Protocol Deviation Enforcement</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Incident Category</label>
                                <select
                                    className="w-full bg-black/30 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-red-500/50 transition-all appearance-none"
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option>Damaged/Broken</option>
                                    <option>Degraded Items</option>
                                    <option>System Discrepancy</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Item ID / Barcode</label>
                                <div className="relative">
                                    <input
                                        required
                                        className="w-full bg-black/30 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-red-500/50 transition-all"
                                        value={item}
                                        onChange={e => setItem(e.target.value)}
                                        placeholder="Scan Item..."
                                    />
                                    <QrCode className="absolute right-5 top-1/2 -translate-y-1/2 text-red-500/50" size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Removed CONDITIONAL QUANTITY FIELDS */}

                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Visual Evidence & Description</label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCamera(true)}
                                    className={`flex-1 border-2 border-dashed rounded-2xl py-8 flex flex-col items-center justify-center gap-2 transition-all ${hasEvidence ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-black/10 border-white/10 text-gray-500 hover:border-red-500/50 hover:text-red-400'}`}
                                >
                                    <Camera size={32} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {hasEvidence ? 'Evidence Locked' : 'Photo of Damage/Degradation'}
                                    </span>
                                </button>
                                <textarea
                                    className="flex-[2] bg-black/30 border border-white/5 rounded-2xl px-6 py-4 text-white h-full min-h-[140px] resize-none focus:border-red-500/50 outline-none font-medium leading-relaxed"
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    placeholder="Explain the discrepancy for the compliance team..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[2rem] shadow-2xl shadow-red-900/30 transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                            <span className="flex items-center justify-center gap-3">
                                <ShieldAlert size={20} className="group-hover:animate-bounce" /> FLASH HIGH-PRIORITY ALERT
                            </span>
                        </button>
                    </form>
                </div>

                {/* INCIDENT LOG TABLE */}
                <div className="space-y-6">
                    <div className="bg-[#2d3142]/50 p-6 rounded-[2rem] border border-white/5 space-y-6">
                        <h4 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-[0.1em]">
                            <History className="text-red-500" size={16} /> Audit Status Feed
                        </h4>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {logistics_incidents.map(inc => (
                                <div key={inc.id} className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-3 group hover:border-red-500/20 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="text-[10px] text-gray-500 uppercase font-black">{inc.id}</div>
                                        <div className="text-[10px] text-red-500 font-black uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">Under Review</div>
                                    </div>
                                    <div className="font-bold text-sm text-white group-hover:text-red-400 transition-colors uppercase">{inc.type}</div>
                                    <div className="text-xs text-gray-400 font-medium">{inc.item_id}</div>
                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                        <span className="text-[9px] text-gray-500 font-bold">{new Date(inc.timestamp).toLocaleString()}</span>
                                        <button className="text-[9px] text-blue-400 font-black uppercase hover:underline">View Detail</button>
                                    </div>
                                </div>
                            ))}
                            {logistics_incidents.length === 0 && (
                                <div className="text-center py-20 text-gray-600 font-black uppercase tracking-widest text-[10px] opacity-50">
                                    All clear. No active discrepancies.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CAMERA MODAL */}
            {showCamera && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setShowCamera(false)}>
                    <div className="bg-[#1a1d31] p-10 rounded-[3rem] border border-white/10 text-center space-y-6 max-w-sm w-full animate-zoomIn" onClick={e => e.stopPropagation()}>
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera size={48} className="text-red-500 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Record Evidence</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">Clearly document the damaged item or the shortage area for the audit trail.</p>
                        <button
                            onClick={() => { setShowCamera(false); setHasEvidence(true); }}
                            className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all"
                        >
                            Capture Evidence
                        </button>
                        <button onClick={() => setShowCamera(false)} className="text-gray-600 text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
