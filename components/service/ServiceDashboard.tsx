import React, { useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { Users, Ticket, AlertTriangle, CheckCircle, BarChart3, Fingerprint } from 'lucide-react';

const ServiceDashboard: React.FC = () => {
    const {
        live_guest_count,
        setLiveGuestCount,
        addPromoCode,
        crowdControlLevel,
        setCrowdControlLevel
    } = useGlobalState();

    const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS'>('IDLE');
    const [promoInput, setPromoInput] = useState('');
    const [showPromoSuccess, setShowPromoSuccess] = useState(false);

    const handleSimulateScan = () => {
        setScanStatus('SCANNING');
        setTimeout(() => {
            setScanStatus('SUCCESS');
            setLiveGuestCount(prev => prev + 1);
            setTimeout(() => setScanStatus('IDLE'), 1500);
        }, 600);
    };

    const handlePromoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (promoInput.trim()) {
            addPromoCode(promoInput.trim(), 'ServiceCrew-01');
            setPromoInput('');
            setShowPromoSuccess(true);
            setTimeout(() => setShowPromoSuccess(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29]">
            {/* Header section */}
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142] flex flex-wrap gap-4 md:gap-6 items-center justify-between bg-[#1a1d29]/80 backdrop-blur-md sticky top-0 z-20">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-2 md:gap-3">
                        <Users className="text-blue-400" size={24} /> Service Dashboard
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">Guest Analytics, Flow, and Marketing Attribution</p>
                </div>
                <div className="bg-[#2d3142] px-4 py-2 rounded-xl border border-blue-500/30 flex flex-col items-center">
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Live Count</span>
                    <span className="text-2xl font-mono font-bold text-blue-400">{live_guest_count}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-visible lg:overflow-hidden">
                {/* LEFT COLUMN: INTAKE & ATTRIBUTION */}
                <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-[#2d3142] bg-[#1a1d29]/50 lg:overflow-y-auto hide-scrollbar">
                    <div className="p-4 md:p-6 space-y-6">
                        {/* Intake & Validation */}
                        <div className="bg-[#2d3142]/80 p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Fingerprint size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">Intake & Validation</h3>
                            </div>

                            <div className="flex flex-col items-center justify-center p-8 bg-[#1a1d29] rounded-xl border border-gray-600 border-dashed mb-6 relative overflow-hidden min-h-[200px]">
                                {scanStatus === 'SCANNING' && (
                                    <div className="absolute inset-0 bg-blue-500/10 animate-pulse flex items-center justify-center">
                                        <div className="w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                                    </div>
                                )}
                                {scanStatus === 'SUCCESS' ? (
                                    <div className="flex flex-col items-center text-green-400 animate-in zoom-in-95">
                                        <CheckCircle className="w-16 h-16 mb-2" />
                                        <span className="font-bold text-lg">Guest Validated!</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-500">
                                        <Fingerprint className="w-16 h-16 mb-4 opacity-20" />
                                        <span className="font-medium text-sm">Waiting for Guest QR...</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSimulateScan}
                                disabled={scanStatus !== 'IDLE'}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${scanStatus === 'IDLE'
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                                    }`}
                            >
                                <Fingerprint size={24} />
                                Simulate QR Scan
                            </button>
                        </div>

                        {/* Marketing Attribution */}
                        <div className="bg-[#2d3142]/80 p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                    <Ticket size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">Marketing Attribution</h3>
                            </div>
                            <p className="text-gray-400 text-xs mb-6 leading-relaxed">Enter promotional or referral codes provided by guests during validation.</p>

                            <form onSubmit={handlePromoSubmit} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={promoInput}
                                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                    placeholder="e.g. VIP-SUMMER-24"
                                    className="flex-1 bg-[#1a1d29] border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all uppercase font-mono"
                                />
                                <button
                                    type="submit"
                                    disabled={!promoInput.trim()}
                                    className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-600/10 whitespace-nowrap"
                                >
                                    Log Code
                                </button>
                            </form>
                            {showPromoSuccess && (
                                <p className="text-green-400 text-xs mt-3 animate-fadeIn flex items-center gap-1">
                                    <CheckCircle size={14} /> Promo code recorded successfully.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: CROWD CONTROL */}
                <div className="w-full lg:w-1/2 flex flex-col lg:overflow-y-auto hide-scrollbar bg-black/20">
                    <div className="p-4 md:p-6 h-full flex flex-col">
                        <div className="bg-[#2d3142]/80 p-6 rounded-2xl border border-gray-700/50 shadow-xl flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                                    <BarChart3 size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">Crowd Control Logic</h3>
                            </div>
                            <p className="text-gray-400 text-xs mb-8 leading-relaxed">
                                Monitor incoming guest flow. If capacity spikes, activate Execute Crowd Control mode to open auxiliary lanes and deploy queue management protocols.
                            </p>

                            <div className="flex-1 flex flex-col justify-center items-center gap-8 bg-[#1a1d29]/50 p-6 md:p-10 rounded-2xl border border-gray-700/30">
                                <div className="text-center">
                                    <h4 className="text-white font-bold mb-2">Capacity Spike Detected?</h4>
                                    <p className="text-gray-500 text-xs max-w-xs mx-auto">Observe the queue length. Are wait times exceeding optimal operational limits?</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                    <button
                                        onClick={() => setCrowdControlLevel('NORMAL')}
                                        className={`flex-1 py-4 rounded-xl font-bold transition-all border ${crowdControlLevel === 'NORMAL'
                                            ? 'bg-green-500/10 text-green-400 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                                            : 'bg-black/20 text-gray-500 border-gray-700 hover:border-gray-500'
                                            }`}
                                    >
                                        <span className="block text-lg">NO</span>
                                        <span className="text-[10px] font-normal opacity-60 block mt-1">STANDARD FLOW</span>
                                    </button>
                                    <button
                                        onClick={() => setCrowdControlLevel('ELEVATED')}
                                        className={`flex-1 py-4 rounded-xl font-bold transition-all border relative overflow-hidden ${crowdControlLevel === 'ELEVATED'
                                            ? 'bg-red-500/10 text-red-400 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                                            : 'bg-black/20 text-gray-500 border-gray-700 hover:border-gray-500'
                                            }`}
                                    >
                                        <span className="relative z-10 block text-lg">YES</span>
                                        <span className="relative z-10 text-[10px] font-normal opacity-60 block mt-1">EXECUTE CONTROL</span>
                                        {crowdControlLevel === 'ELEVATED' && (
                                            <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                                        )}
                                    </button>
                                </div>

                                {crowdControlLevel === 'ELEVATED' && (
                                    <div className="w-full p-4 bg-red-500/5 border border-red-500/20 rounded-xl animate-fadeIn">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertTriangle className="text-red-400" size={16} />
                                            <h5 className="text-red-400 font-bold text-xs uppercase tracking-wider">Critical Protocol Active</h5>
                                        </div>
                                        <ul className="text-gray-300 text-xs space-y-2">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                                Open auxiliary validation lanes 3-5 immediately.
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                                Notify Experience Crew for guest engagement.
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                                Deploy mobile validation units to queue tail.
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDashboard;
