import React, { useState } from 'react';
import { PackageOpen, MapPin, QrCode, Camera, AlertTriangle, History, ShieldAlert, Check } from 'lucide-react';
import { useGlobalState } from './GlobalStateContext';
import { Incident, IncidentSeverity } from '../types';

export const ManualRestockTab: React.FC = () => {
    const { updateCentralStorage } = useGlobalState();
    const [destination, setDestination] = useState('');
    const [item, setItem] = useState('');
    const [qty, setQty] = useState('');
    const [unit, setUnit] = useState('pcs');
    const [isPartial, setIsPartial] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(qty, 10) || 0;
        updateCentralStorage(item, -amount);
        window.alert(`Manual Restock Logged: ${amount} ${unit} of ${item} to ${destination}`);
        setDestination('');
        setItem('');
        setQty('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#2d3142] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8 animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <PackageOpen className="text-orange-400" size={28} />
                <div>
                    <h3 className="text-xl font-bold text-white">Ad-hoc Restock Logging</h3>
                    <p className="text-gray-400 text-sm">Log requests coming via radio or walk-ins.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-xs text-gray-500 uppercase font-black tracking-tighter">Destination Node</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" size={18} />
                        <input
                            required
                            placeholder="e.g. Zone D Medical Room"
                            className="w-full bg-[#1a1d29] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-orange-500 outline-none transition-all"
                            value={destination}
                            onChange={e => setDestination(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs text-gray-500 uppercase font-black tracking-tighter">Inventory Deduction</label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <input
                                required
                                placeholder="Item Name / SKU"
                                className="w-full bg-[#1a1d29] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-orange-500 outline-none transition-all"
                                value={item}
                                onChange={e => setItem(e.target.value)}
                            />
                        </div>
                        <button type="button" className="p-4 bg-[#1a1d29] border border-white/10 rounded-2xl text-orange-400 hover:border-orange-500 transition-all">
                            <QrCode size={24} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs text-gray-500 uppercase font-black tracking-tighter">Verified Amount</label>
                    <div className="flex gap-3">
                        <input
                            required
                            type="number"
                            placeholder="0"
                            className="w-32 bg-[#1a1d29] border border-white/10 rounded-2xl px-5 py-4 text-white text-center text-xl font-bold focus:border-orange-500 outline-none transition-all"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                        />
                        <select
                            className="bg-[#1a1d29] border border-white/10 rounded-2xl px-4 py-4 text-white flex-1"
                            value={unit}
                            onChange={e => setUnit(e.target.value)}
                        >
                            <option>pcs</option>
                            <option>kgs</option>
                            <option>liters</option>
                            <option>boxes</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-orange-500/5 border border-orange-500/10 p-5 rounded-2xl">
                    <ShieldAlert className="text-orange-400 shrink-0" size={24} />
                    <div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="partial"
                                checked={isPartial}
                                onChange={e => setIsPartial(e.target.checked)}
                                className="accent-orange-500"
                            />
                            <label htmlFor="partial" className="text-white font-bold text-sm">Partial Fulfillment</label>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase">Select if warehouse stock is insufficient for full request.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button type="button" className="flex-1 bg-transparent border border-white/10 text-gray-400 font-bold py-4 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                    <Camera size={20} /> Capture Visual Proof
                </button>
                <button type="submit" className="flex-[2] bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Finalize Deduction
                </button>
            </div>
        </form>
    );
};

export const IncidentReportTab: React.FC<{ initialData?: Partial<Incident> }> = ({ initialData }) => {
    const { logistics_incidents, addLogisticsIncident } = useGlobalState();
    const [type, setType] = useState(initialData?.type || 'Missing Items');
    const [item, setItem] = useState(initialData?.item_id || '');
    const [expected, setExpected] = useState(initialData?.expected_qty?.toString() || '');
    const [actual, setActual] = useState(initialData?.actual_qty?.toString() || '');
    const [desc, setDesc] = useState(initialData?.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newIncident: Incident = {
            id: `INC-${Date.now()}`,
            timestamp: new Date(),
            type,
            severity: IncidentSeverity.HIGH,
            description: desc,
            status: 'OPEN',
            reportedBy: 'Runner-Alpha',
            item_id: item,
            expected_qty: parseInt(expected, 10),
            actual_qty: parseInt(actual, 10)
        };
        addLogisticsIncident(newIncident);
        window.alert('High-Priority Incident Flashed to Management');
        // Clear or redirect
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 bg-[#2d3142] p-8 rounded-3xl border border-red-500/20 shadow-2xl space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <ShieldAlert className="text-red-500" size={28} />
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Log Discrepancy / Damage</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase">Incident Category</label>
                            <select
                                className="w-full bg-[#1a1d29] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500"
                                value={type}
                                onChange={e => setType(e.target.value)}
                            >
                                <option>Missing Items</option>
                                <option>Damaged on Arrival</option>
                                <option>Quantity Mismatch</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase">Item SKU / Name</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-[#1a1d29] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500"
                                    value={item}
                                    onChange={e => setItem(e.target.value)}
                                    placeholder="Scan or Type..."
                                />
                                <button type="button" className="p-3 bg-[#1a1d29] border border-white/10 rounded-xl text-red-500"><QrCode size={20} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase">Expected Qty</label>
                            <input
                                type="number"
                                className="w-full bg-[#1a1d29] border border-white/10 rounded-xl px-4 py-3 text-white"
                                value={expected}
                                onChange={e => setExpected(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase">Actual Physical Qty</label>
                            <input
                                type="number"
                                className="w-full bg-[#1a1d29] border border-white/10 rounded-xl px-4 py-3 text-white"
                                value={actual}
                                onChange={e => setActual(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-black uppercase">Variance Analysis / Description</label>
                        <textarea
                            className="w-full bg-[#1a1d29] border border-white/10 rounded-2xl px-4 py-3 text-white h-32 resize-none focus:border-red-500"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder="Detail the issue for the audit trail..."
                        />
                    </div>

                    <div className="flex gap-4">
                        <button type="button" className="flex-1 bg-[#1a1d29] border border-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:border-red-500/50">
                            <Camera size={22} className="text-red-500" /> Evidence Upload
                        </button>
                        <button type="submit" className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            Flash Audit Alert
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-[#2d3142]/50 p-6 rounded-3xl border border-white/5 space-y-6">
                <h4 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
                    <History className="text-gray-500" size={16} /> Recent Incident Feed
                </h4>
                <div className="space-y-4">
                    {logistics_incidents.map(inc => (
                        <div key={inc.id} className="bg-[#1a1d29] p-4 rounded-xl border-l-4 border-red-500">
                            <div className="text-xs text-gray-500 uppercase font-bold">{inc.id} • {inc.type}</div>
                            <div className="text-white font-medium mt-1">{inc.item_id}</div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold">UNDER REVIEW</span>
                                <span className="text-[10px] text-gray-500">{new Date(inc.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                    {logistics_incidents.length === 0 && (
                        <div className="text-center py-12 text-gray-500 italic text-sm">No unresolved incidents.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
