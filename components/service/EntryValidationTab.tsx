import React, { useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { QrCode, Search, Keyboard, CheckCircle, XCircle, Users, RefreshCw, Smartphone, Mail, MapPin, ClipboardCheck } from 'lucide-react';

interface QueuedGuest {
    id: string;
    name: string;
    type: string;
    scannedAt: Date;
}

const EntryValidationTab: React.FC = () => {
    const { live_guest_count, setLiveGuestCount } = useGlobalState();
    const dailyTarget = 10000;

    const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'GRANTED' | 'DENIED'>('IDLE');
    const [lastGuestTag, setLastGuestTag] = useState<string>('None');
    const [lastGuestName, setLastGuestName] = useState<string>('');
    const [ticketInput, setTicketInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [ValidationMessage, setValidationMessage] = useState<string>('');

    const [queuedGuests, setQueuedGuests] = useState<QueuedGuest[]>([]);

    const handleSimulateQR = () => {
        setScanState('SCANNING');
        setValidationMessage('Accessing Camera...');

        setTimeout(() => {
            // 80% chance of success
            if (Math.random() > 0.2) {
                const guestName = `Guest ${Math.floor(Math.random() * 9000) + 1000}`;
                const types = ['VIP', 'Standard', 'Child', 'Staff'];
                const guestType = types[Math.floor(Math.random() * types.length)];

                setScanState('GRANTED');
                setLastGuestTag(guestType);
                setLastGuestName(guestName);
                setValidationMessage('Access Granted');

                // Queue the guest
                setQueuedGuests(prev => [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    name: guestName,
                    type: guestType,
                    scannedAt: new Date()
                }]);

            } else {
                setScanState('DENIED');
                setValidationMessage(Math.random() > 0.5 ? 'Invalid Ticket' : 'Already Scanned');
            }

            setTimeout(() => {
                setScanState('IDLE');
                setValidationMessage('');
            }, 2500);
        }, 800);
    };

    const handleManualSubmit = (e: React.FormEvent, method: 'ID' | 'EMAIL') => {
        e.preventDefault();

        const value = method === 'ID' ? ticketInput : emailInput;
        if (!value.trim()) return;

        setScanState('SCANNING');
        setValidationMessage(`Verifying ${method}...`);

        setTimeout(() => {
            const guestName = method === 'ID' ? `ID-${value}` : value.split('@')[0];
            const guestType = method === 'ID' ? 'Standard' : 'Online Booking';

            setScanState('GRANTED');
            setLastGuestTag(guestType);
            setLastGuestName(guestName);
            setValidationMessage('Access Granted');

            setQueuedGuests(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                name: guestName,
                type: guestType,
                scannedAt: new Date()
            }]);

            if (method === 'ID') setTicketInput('');
            if (method === 'EMAIL') setEmailInput('');

            setTimeout(() => {
                setScanState('IDLE');
                setValidationMessage('');
            }, 2500);
        }, 600);
    };

    const handleAcceptAll = () => {
        if (queuedGuests.length === 0) return;

        // Push the updated guest count to the global repository state
        setLiveGuestCount(prev => prev + queuedGuests.length);
        setQueuedGuests([]);
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] pb-24 md:pb-0 overflow-y-auto hide-scrollbar">
            {/* Mobile Card View Header */}
            <div className="bg-[#2d3142]/90 backdrop-blur-md p-4 sticky top-0 z-20 border-b border-gray-700/50 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <MapPin className="text-blue-400" size={20} />
                            Main Entrance - Gate 1
                        </h2>
                        <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Active Access Point
                        </p>
                    </div>

                    {/* Last Guest Tag */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Last Guest</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${lastGuestTag === 'VIP' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                            lastGuestTag === 'Child' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                                lastGuestTag === 'Staff' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                                    lastGuestTag === 'None' ? 'bg-gray-700 text-gray-400 border-gray-600' :
                                        'bg-green-500/20 text-green-400 border-green-500/50'
                            }`}>
                            {lastGuestTag}
                        </div>
                    </div>
                </div>

                {/* Live Capacity Tracker */}
                <div className="bg-[#1a1d29] rounded-xl p-3 border border-gray-700/50 flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-end relative z-10">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Live Capacity Tracker</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-mono font-bold text-white">{live_guest_count}</span>
                                <span className="text-sm text-gray-500 font-mono">/ {dailyTarget}</span>
                            </div>
                        </div>
                        <Users className="text-gray-600 w-8 h-8" />
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 relative z-10">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (live_guest_count / dailyTarget) * 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Full-Screen Validation Output Overlay (only visible when scanning/result) */}
                {scanState !== 'IDLE' && (
                    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-xl transition-all duration-300 ${scanState === 'GRANTED' ? 'bg-green-900/40' :
                        scanState === 'DENIED' ? 'bg-red-900/40' : 'bg-blue-900/40'
                        }`}>
                        <div className={`p-8 rounded-3xl border shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 w-full max-w-sm ${scanState === 'GRANTED' ? 'bg-green-950/80 border-green-500/50 shadow-green-500/20' :
                            scanState === 'DENIED' ? 'bg-red-950/80 border-red-500/50 shadow-red-500/20' : 'bg-blue-950/80 border-blue-500/50 shadow-blue-500/20'
                            }`}>
                            {scanState === 'SCANNING' && (
                                <>
                                    <div className="relative mb-6">
                                        <QrCode className="w-24 h-24 text-blue-400 opacity-50" />
                                        <div className="absolute inset-0 border-2 border-blue-400 rounded-xl animate-pulse"></div>
                                        <div className="w-full h-1 bg-blue-300 absolute top-0 shadow-[0_0_15px_rgba(147,197,253,1)] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{ValidationMessage}</h2>
                                </>
                            )}

                            {scanState === 'GRANTED' && (
                                <>
                                    <CheckCircle className="w-24 h-24 text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                                    <h2 className="text-3xl font-bold text-white mb-2">{ValidationMessage}</h2>
                                    <p className="text-green-300 text-lg font-medium">{lastGuestName}</p>
                                    <div className="mt-4 px-4 py-1.5 bg-green-500/20 rounded-full text-green-400 font-bold uppercase tracking-wider text-sm border border-green-500/30">
                                        {lastGuestTag}
                                    </div>
                                </>
                            )}

                            {scanState === 'DENIED' && (
                                <>
                                    <XCircle className="w-24 h-24 text-red-400 mb-6 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
                                    <h2 className="text-3xl font-bold text-white mb-2 text-red-400">{ValidationMessage}</h2>
                                    <p className="text-gray-400 mt-2">Please direct guest to resolution desk.</p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Triple-Method Entry Section */}

                {/* Primary Action (QR) */}
                <div className="bg-[#2d3142]/50 p-6 rounded-2xl border border-blue-500/20 flex flex-col items-center shadow-lg">
                    <button
                        onClick={handleSimulateQR}
                        className="w-32 h-32 rounded-full bg-blue-600 hover:bg-blue-500 flex flex-col items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 mb-4"
                    >
                        <QrCode size={48} className="mb-1" />
                        <span className="font-bold">SCAN QR</span>
                    </button>
                    <p className="text-gray-400 text-sm font-medium">Primary Entry Method</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Manual Method A (Ticket ID) */}
                    <div className="bg-[#2d3142]/50 p-5 rounded-2xl border border-gray-700/50 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Keyboard className="text-purple-400" size={20} />
                            <h3 className="text-white font-bold">Manual ID Entry</h3>
                        </div>
                        <form onSubmit={(e) => handleManualSubmit(e, 'ID')} className="flex gap-2">
                            <input
                                type="text"
                                value={ticketInput}
                                onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                                placeholder="TKT-XXXX-XXXX"
                                className="flex-1 bg-[#1a1d29] border border-gray-600 text-white rounded-xl px-4 py-3 font-mono text-center text-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all uppercase"
                            />
                            <button
                                type="submit"
                                disabled={!ticketInput}
                                className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold px-6 rounded-xl transition-all"
                            >
                                GO
                            </button>
                        </form>
                    </div>

                    {/* Manual Method B (Email) */}
                    <div className="bg-[#2d3142]/50 p-5 rounded-2xl border border-gray-700/50 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="text-yellow-400" size={20} />
                            <h3 className="text-white font-bold">Email Search</h3>
                        </div>
                        <form onSubmit={(e) => handleManualSubmit(e, 'EMAIL')} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    placeholder="guest@example.com"
                                    className="w-full bg-[#1a1d29] border border-gray-600 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!emailInput}
                                className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold px-4 rounded-xl transition-all"
                            >
                                Find
                            </button>
                        </form>
                    </div>
                </div>

                {/* Manual Repository Sync */}
                <div className="bg-[#2d3142]/80 border border-green-500/20 p-5 rounded-2xl shadow-xl mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="text-green-400" size={20} />
                            <h3 className="text-white font-bold">Manual Repository Sync</h3>
                        </div>
                        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-lg">
                            {queuedGuests.length} Queued
                        </span>
                    </div>

                    {queuedGuests.length > 0 ? (
                        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 hide-scrollbar">
                            {queuedGuests.map(guest => (
                                <div key={guest.id} className="flex items-center justify-between bg-[#1a1d29] p-3 rounded-xl border border-gray-700/50">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm">{guest.name}</span>
                                        <span className="text-gray-500 text-xs">{guest.scannedAt.toLocaleTimeString()}</span>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 rounded border border-gray-600 text-gray-400">
                                        {guest.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 bg-[#1a1d29]/50 rounded-xl border border-dashed border-gray-700 text-gray-500 mb-4">
                            <ClipboardCheck size={24} className="mb-2 opacity-50" />
                            <p className="text-sm font-medium">All entries synced</p>
                        </div>
                    )}

                    <button
                        onClick={handleAcceptAll}
                        disabled={queuedGuests.length === 0}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] disabled:shadow-none"
                    >
                        <RefreshCw size={20} className={queuedGuests.length > 0 ? "animate-spin-slow" : ""} />
                        Accept all - Push to Repository
                    </button>
                    <p className="text-center text-[10px] text-gray-500 mt-3 font-semibold uppercase tracking-wider">
                        Pending entries must be synced to update global target
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EntryValidationTab;
