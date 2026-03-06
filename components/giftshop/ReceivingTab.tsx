import React, { useState } from 'react';
import { Truck, CheckCircle2, Camera, UserCheck, AlertCircle, Package, Inbox } from 'lucide-react';
import { Incident } from '../../types';

interface ShipmentItem {
    id: string;
    item: string;
    category: 'APPAREL' | 'SOUVENIR' | 'COLLECTIBLE' | 'ACCESSORY';
    expected: number;
    received: number;
    photoProof: string | null;
}

interface Shipment {
    id: string;
    manifest: string;
    status: 'PENDING' | 'VERIFIED' | 'COMPLETED';
    items: ShipmentItem[];
}

const mockShipments: Shipment[] = [
    {
        id: 'SHP-101',
        manifest: 'Daily Replenishment - AM',
        status: 'PENDING',
        items: [
            { id: 'i1', item: 'Leviathan Plushie', category: 'SOUVENIR', expected: 80, received: 0, photoProof: null },
            { id: 'i2', item: 'Aether Crystal Replica', category: 'COLLECTIBLE', expected: 15, received: 0, photoProof: null },
            { id: 'i3', item: 'Zone 4 T-Shirt (L)', category: 'APPAREL', expected: 45, received: 0, photoProof: null },
        ]
    }
];

interface ReceivingTabProps {
    incidents?: Incident[];
    onUpdateIncidentStatus?: (id: string, status: Incident['status']) => void;
}

const ReceivingTab: React.FC<ReceivingTabProps> = ({ incidents = [], onUpdateIncidentStatus }) => {
    const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
    const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

    const activeShipment = shipments.find(s => s.id === selectedShipmentId);

    const handleQtyChange = (itemId: string, qty: string) => {
        if (!activeShipment) return;
        setShipments(prev => prev.map(s => {
            if (s.id !== activeShipment.id) return s;
            return {
                ...s,
                items: s.items.map(i => i.id === itemId ? { ...i, received: parseInt(qty) || 0 } : i)
            };
        }));
    };

    const handlePhotoUpload = (itemId: string) => {
        if (!activeShipment) return;
        setShipments(prev => prev.map(s => {
            if (s.id !== activeShipment.id) return s;
            return {
                ...s,
                items: s.items.map(i => i.id === itemId ? { ...i, photoProof: 'simulated_photo_url.jpg' } : i)
            };
        }));
    };

    const handleAcceptAll = () => {
        if (!activeShipment) return;

        // Check if all items have photos
        const missingPhotos = activeShipment.items.some(i => !i.photoProof);
        if (missingPhotos) {
            alert("Please provide proof of delivery for all items before accepting.");
            return;
        }

        setShipments(prev => prev.map(s => s.id === activeShipment.id ? { ...s, status: 'COMPLETED' } : s));
        setSelectedShipmentId(null);
    };

    if (selectedShipmentId && activeShipment) {
        return (
            <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
                <button
                    onClick={() => setSelectedShipmentId(null)}
                    className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
                >
                    <div className="w-10 h-10 rounded-full bg-[#2d3142] flex items-center justify-center border border-gray-700 group-hover:bg-gray-800 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><path d="m15 18-6-6 6-6" /></svg>
                    </div>
                    <div>
                        <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Return to queue</div>
                        <h2 className="text-xl sm:text-3xl font-bold">{activeShipment.manifest}</h2>
                    </div>
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-20 md:mb-24">
                    <div className="bg-[#2d3142] rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                        <div className="p-4 bg-[#1a1d29] border-b border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-gray-300">Manifest Contents</h3>
                            <span className="text-xs font-bold px-3 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/20">
                                {activeShipment.items.length} SKUs Expected
                            </span>
                        </div>

                        <div className="divide-y divide-gray-700/50">
                            {activeShipment.items.map(item => (
                                <div key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between hover:bg-white/[0.02] transition-colors relative">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-lg">{item.item}</h4>
                                            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-[#1a1d29] text-gray-400 border border-gray-700">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">Expected System Qty: <strong className="text-white">{item.expected}</strong></div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                        <div className="flex-1 min-w-[140px]">
                                            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 flex justify-between">
                                                <span>Actual Received</span>
                                                <button
                                                    onClick={() => handleQtyChange(item.id, item.expected.toString())}
                                                    className="text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    Match
                                                </button>
                                            </label>
                                            <div className="flex h-12">
                                                <button
                                                    onClick={() => handleQtyChange(item.id, Math.max(0, item.received - 1).toString())}
                                                    className="w-12 bg-white/5 border border-white/10 rounded-l-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors font-bold text-xl active:bg-white/20"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-full bg-[#1a1d29] border-y border-white/10 px-2 text-white font-bold focus:outline-none focus:bg-[#1a1d29]/80 transition-all text-center text-xl hide-arrows"
                                                    value={item.received || ''}
                                                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleQtyChange(item.id, (item.received + 1).toString())}
                                                    className="w-12 bg-white/5 border border-white/10 rounded-r-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors font-bold text-xl active:bg-white/20"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Proof of Delivery</label>
                                            <button
                                                onClick={() => handlePhotoUpload(item.id)}
                                                className={`h-12 w-full rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm ${item.photoProof
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                                    }`}
                                            >
                                                {item.photoProof ? (
                                                    <><CheckCircle2 size={18} /> Verified</>
                                                ) : (
                                                    <><Camera size={18} /> Take Photo</>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fixed bottom action bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#1a1d29] via-[#1a1d29] to-transparent pointer-events-none">
                    <div className="pointer-events-auto max-w-2xl mx-auto flex items-center justify-center gap-4">
                        <button
                            onClick={handleAcceptAll}
                            className="flex-1 max-w-sm bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest py-4 md:py-5 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <CheckCircle2 size={24} /> ACCEPT ALL
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white relative">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-2">
                    <Truck className="text-blue-400" size={32} /> Inbound Shipments
                </h1>
                <p className="text-gray-400 text-sm md:text-base">Verify and log new retail merchandise arriving at the shop.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {shipments.map(shipment => (
                    <div
                        key={shipment.id}
                        onClick={() => shipment.status !== 'COMPLETED' ? setSelectedShipmentId(shipment.id) : null}
                        className={`bg-[#2d3142] rounded-2xl p-5 md:p-6 border transition-all ${shipment.status === 'COMPLETED'
                            ? 'border-gray-700 opacity-60'
                            : 'border-white/10 hover:border-blue-500/50 cursor-pointer shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`text-[10px] sm:text-xs font-black px-2 py-1 rounded tracking-widest uppercase mb-3 inline-block ${shipment.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {shipment.status}
                                </span>
                                <h3 className="font-bold text-lg leading-tight">{shipment.manifest}</h3>
                                <p className="text-gray-400 text-xs mt-1 font-mono">{shipment.id}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Package className="text-blue-400" size={24} />
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                            <div className="flex -space-x-2">
                                {/* Visual Category Tags */}
                                {Array.from(new Set(shipment.items.map(i => i.category))).slice(0, 3).map((cat, idx) => (
                                    <div key={idx} className="w-8 h-8 rounded-full bg-[#1a1d29] border border-gray-600 flex items-center justify-center text-[10px] font-bold" title={cat as string}>
                                        {(cat as string).charAt(0)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-white">{shipment.items.reduce((acc, curr) => acc + curr.expected, 0)}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Units</div>
                            </div>
                        </div>
                    </div>
                ))}

                {shipments.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-3xl cursor-default">
                        <Truck className="text-gray-600 w-16 h-16 mb-4" />
                        <h3 className="text-gray-400 font-bold mb-1">No Active Shipments</h3>
                        <p className="text-gray-600 text-sm">You are all caught up for now.</p>
                    </div>
                )}
            </div>

            {/* LOST AND FOUND SECTION */}
            <div className="mt-16 mb-6 md:mb-8 border-t border-gray-700 pt-8">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-2">
                    <Inbox className="text-amber-400" size={32} /> Lost & Found Intake
                </h2>
                <p className="text-gray-400 text-sm md:text-base">Receive items from Runners and log them for guest pickup.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {incidents.filter(inc => inc.type === 'Lost and Found' && (inc.status === 'IN_TRANSIT' || inc.status === 'AT_GIFT_SHOP')).map(incident => (
                    <div
                        key={incident.id}
                        className="bg-[#2d3142] rounded-2xl p-5 md:p-6 border border-amber-500/20 shadow-xl"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`text-[10px] sm:text-xs font-black px-2 py-1 rounded tracking-widest uppercase mb-3 inline-block ${incident.status === 'AT_GIFT_SHOP' ? 'bg-amber-500/20 text-amber-500' : 'bg-purple-500/20 text-purple-400'
                                    }`}>
                                    {incident.status.replace('_', ' ')}
                                </span>
                                <h3 className="font-bold text-lg leading-tight line-clamp-2">{incident.description}</h3>
                                <p className="text-gray-400 text-xs mt-1 font-mono">{incident.id}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0 ml-4">
                                <Package className="text-amber-400" size={24} />
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-700/50 flex gap-3">
                            {incident.status === 'IN_TRANSIT' && onUpdateIncidentStatus && (
                                <button
                                    onClick={() => onUpdateIncidentStatus(incident.id, 'AT_GIFT_SHOP')}
                                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CheckCircle2 size={18} /> Receive Item
                                </button>
                            )}
                            {incident.status === 'AT_GIFT_SHOP' && onUpdateIncidentStatus && (
                                <button
                                    onClick={() => onUpdateIncidentStatus(incident.id, 'RESOLVED')}
                                    className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <UserCheck size={18} /> Mark as Claimed
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {incidents.filter(inc => inc.type === 'Lost and Found' && (inc.status === 'IN_TRANSIT' || inc.status === 'AT_GIFT_SHOP')).length === 0 && (
                    <div className="col-span-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-3xl cursor-default">
                        <Inbox className="text-gray-600 w-12 h-12 mb-3" />
                        <h3 className="text-gray-400 font-bold mb-1">No Pending Items</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceivingTab;
