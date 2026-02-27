import React, { useState } from 'react';
import { useGlobalState } from './GlobalStateContext';
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
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="text-blue-400 w-8 h-8" />
                        Service Dashboard
                    </h2>
                    <p className="text-gray-400 mt-2">Guest Analytics, Flow, and Marketing Attribution</p>
                </div>
                <div className="bg-[#2d3142] p-4 rounded-xl border border-blue-500/30 flex flex-col items-center min-w-[120px]">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Live Count</span>
                    <span className="text-3xl font-bold text-blue-400">{live_guest_count}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Column - Intake & Validation */}
                <div className="space-y-6">
                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Fingerprint className="text-blue-400 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Intake & Validation</h3>
                        </div>

                        <div className="flex flex-col items-center justify-center p-8 bg-[#1a1d29] rounded-xl border border-gray-600 border-dashed mb-6 relative overflow-hidden">
                            {scanStatus === 'SCANNING' && (
                                <div className="absolute inset-0 bg-blue-500/10 animate-pulse flex items-center justify-center">
                                    <div className="w-full h-1 bg-blue-400/50 absolute top-0 animate-[scan_1.5s_ease-in-out_infinite]" />
                                </div>
                            )}
                            {scanStatus === 'SUCCESS' ? (
                                <div className="flex flex-col items-center text-green-400 animate-fadeIn">
                                    <CheckCircle className="w-16 h-16 mb-2" />
                                    <span className="font-bold text-lg">Guest Validated!</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Fingerprint className="w-16 h-16 mb-4 opacity-50" />
                                    <span className="font-medium">Waiting for Guest QR...</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSimulateScan}
                            disabled={scanStatus !== 'IDLE'}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${scanStatus === 'IDLE'
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Simulate QR Scan
                        </button>
                    </div>

                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Ticket className="text-purple-400 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Marketing Attribution</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Enter promotional or referral codes provided by guests during validation.</p>

                        <form onSubmit={handlePromoSubmit} className="flex gap-3">
                            <input
                                type="text"
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                placeholder="e.g. VIP-SUMMER-24"
                                className="flex-1 bg-[#1a1d29] border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all uppercase"
                            />
                            <button
                                type="submit"
                                disabled={!promoInput.trim()}
                                className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:text-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                            >
                                Log Code
                            </button>
                        </form>
                        {showPromoSuccess && (
                            <p className="text-green-400 text-sm mt-3 animate-fadeIn flex items-center gap-1">
                                <CheckCircle w-4 h-4 /> Promo code recorded.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column - Crowd Control */}
                <div className="space-y-6">
                    <div className="bg-[#2d3142] p-6 rounded-2xl border border-gray-700 shadow-xl h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <BarChart3 className="text-yellow-400 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Crowd Control Logic</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-8">
                            Monitor incoming guest flow. If capacity spikes, activate Execute Crowd Control mode to open new lanes.
                        </p>

                        <div className="flex-1 flex flex-col justify-center items-center gap-8 bg-[#1a1d29] p-8 rounded-xl border border-gray-700/50">
                            <div className="text-center">
                                <h4 className="text-lg font-bold text-gray-300 mb-2">Capacity Spike Detected?</h4>
                                <p className="text-gray-500 text-sm max-w-xs">Observe the queue length. Are wait times exceeding optimal operational limits?</p>
                            </div>

                            <div className="flex space-x-4 w-full">
                                <button
                                    onClick={() => setCrowdControlLevel('NORMAL')}
                                    className={`flex-1 py-4 rounded-xl font-bold transition-all relative overflow-hidden ${crowdControlLevel === 'NORMAL'
                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                            : 'bg-[#2d3142] text-gray-400 border border-gray-600 hover:bg-[#343a4f]'
                                        }`}
                                >
                                    <span className="relative z-10 block">NO</span>
                                    <span className="relative z-10 text-xs font-normal opacity-80 block mt-1">Maintain Standard Flow</span>
                                </button>
                                <button
                                    onClick={() => setCrowdControlLevel('ELEVATED')}
                                    className={`flex-1 py-4 rounded-xl font-bold transition-all relative overflow-hidden ${crowdControlLevel === 'ELEVATED'
                                            ? 'bg-red-500/20 text-red-400 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                            : 'bg-[#2d3142] text-gray-400 border border-gray-600 hover:bg-[#343a4f]'
                                        }`}
                                >
                                    <span className="relative z-10 block">YES</span>
                                    <span className="relative z-10 text-xs font-normal opacity-80 block mt-1">Execute Crowd Control</span>
                                    {crowdControlLevel === 'ELEVATED' && (
                                        <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                                    )}
                                </button>
                            </div>

                            {crowdControlLevel === 'ELEVATED' && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg w-full flex items-start gap-3 animate-fadeIn">
                                    <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="text-red-400 font-bold text-sm">Action Required</h5>
                                        <ul className="text-gray-300 text-sm mt-2 space-y-1 list-disc list-inside">
                                            <li>Open auxiliary validation lanes 3, 4, and 5.</li>
                                            <li>Deploy overflow queue stanchions.</li>
                                            <li>Notify Experience Crew to engage waiting guests.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServiceDashboard;
