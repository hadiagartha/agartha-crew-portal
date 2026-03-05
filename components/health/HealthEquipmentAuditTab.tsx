import React, { useState } from 'react';
import { ShieldCheck, HeartPulse, Building2, Camera, UploadCloud, CheckCircle, AlertOctagon } from 'lucide-react';

interface EquipmentAuditTarget {
    id: string;
    type: 'AED_STATION' | 'FIRST_AID_KIT';
    location: string;
    lastAudited: string;
    status: 'PENDING' | 'AUDITING' | 'COMPLETED';
}

const auditList: EquipmentAuditTarget[] = [
    { id: 'EQP-AED-01', type: 'AED_STATION', location: 'Zone 1 - Main Entrance', lastAudited: 'Yesterday', status: 'PENDING' },
    { id: 'EQP-FAK-12', type: 'FIRST_AID_KIT', location: 'Zone 4 - Restrooms', lastAudited: '2 days ago', status: 'PENDING' },
    { id: 'EQP-AED-05', type: 'AED_STATION', location: 'Zone 3 - Food Court', lastAudited: 'Today 08:00 AM', status: 'PENDING' },
];

const HealthEquipmentAuditTab: React.FC = () => {
    const [targets, setTargets] = useState<EquipmentAuditTarget[]>(auditList);
    const [activeAudit, setActiveAudit] = useState<EquipmentAuditTarget | null>(null);

    // Blind Gate Inputs
    const [enteredExpiry, setEnteredExpiry] = useState('');
    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleStartAudit = (target: EquipmentAuditTarget) => {
        setActiveAudit(target);
        setTargets(prev => prev.map(t =>
            t.id === target.id ? { ...t, status: 'AUDITING' } : t
        ));
    };

    const handleSimulatePhotoUpload = () => {
        setUploading(true);
        setTimeout(() => {
            setIsPhotoUploaded(true);
            setUploading(false);
        }, 1500);
    };

    const handleSubmitAudit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeAudit || !enteredExpiry || !isPhotoUploaded) return;

        // Logic Gate: Manual Acceptance updates Safety Database
        setTargets(prev => prev.map(t =>
            t.id === activeAudit.id ? { ...t, status: 'COMPLETED', lastAudited: 'Just now' } : t
        ));

        // Reset
        setActiveAudit(null);
        setEnteredExpiry('');
        setIsPhotoUploaded(false);
    };

    const handleCancel = () => {
        if (!activeAudit) return;
        setTargets(prev => prev.map(t =>
            t.id === activeAudit.id ? { ...t, status: 'PENDING' } : t
        ));
        setActiveAudit(null);
        setEnteredExpiry('');
        setIsPhotoUploaded(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] pb-24 md:pb-0 overflow-y-auto hide-scrollbar p-4 space-y-4 relative">

            <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-teal-400 w-8 h-8" />
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Equipment Audit</h2>
                    <p className="text-gray-400 text-xs mt-1">AED & First Aid Safety Checks</p>
                </div>
            </div>

            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2 mb-3 mt-4">Required Shifts Targets</div>

            <div className="grid gap-3">
                {targets.filter(t => t.status !== 'COMPLETED').map(target => (
                    <div key={target.id} className={`bg-[#2d3142]/80 border ${target.status === 'AUDITING' ? 'border-teal-500/50 block shadow-[0_0_15px_rgba(20,184,166,0.2)]' : 'border-gray-700/50'} rounded-2xl p-4 transition-all relative overflow-hidden`}>

                        {target.status === 'AUDITING' && <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>}

                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3 sm:gap-0">
                            <div className="flex items-start gap-3">
                                {target.type === 'AED_STATION' ? (
                                    <div className="bg-red-500/20 p-2 rounded-lg shrink-0">
                                        <HeartPulse className="text-red-400 w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="bg-blue-500/20 p-2 rounded-lg shrink-0">
                                        <Building2 className="text-blue-400 w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">
                                        {target.type.replace('_', ' ')}
                                    </h3>
                                    <span className="font-mono text-xs text-gray-400 block mt-0.5">{target.id}</span>
                                    <p className="text-gray-300 text-sm mt-1">{target.location}</p>
                                </div>
                            </div>

                            <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-700/50 sm:border-none">
                                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Last Audit</span>
                                <span className="text-xs text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded border border-gray-700 inline-block">
                                    {target.lastAudited}
                                </span>
                            </div>
                        </div>

                        {target.status === 'PENDING' && (
                            <button
                                onClick={() => handleStartAudit(target)}
                                disabled={activeAudit !== null}
                                className="w-full mt-4 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors border border-gray-600 hover:border-teal-500"
                            >
                                Begin Audit Protocol
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Blind Gate Audit Form Overlay Container */}
            {activeAudit && (
                <div className="fixed bottom-0 left-0 w-full bg-[#1a1d29] border-t border-teal-500/30 z-50 p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(20,184,166,0.15)] animate-in slide-in-from-bottom-5">

                    <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="pr-2">
                            <h3 className="text-teal-400 font-bold text-lg flex items-center gap-2 leading-tight">
                                <ShieldCheck size={20} className="shrink-0" /> Blind Safety Gate
                            </h3>
                            <p className="text-gray-400 text-xs mt-1">Target: <span className="text-white font-mono">{activeAudit.id}</span></p>
                        </div>
                        <button onClick={handleCancel} className="text-gray-500 hover:text-white text-sm font-bold bg-gray-800 px-3 py-2 rounded-lg shrink-0">Cancel</button>
                    </div>

                    <form onSubmit={handleSubmitAudit} className="space-y-5">
                        <div className="bg-[#2d3142] p-4 rounded-xl border border-gray-700">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <AlertOctagon size={14} className="text-yellow-400" /> Enter Exact Expiry Date
                            </label>
                            <p className="text-[10px] text-gray-400 mb-3">System target is hidden. Inspect pads/meds and type date exactly as seen.</p>
                            <input
                                type="text"
                                placeholder="MM/YYYY or DD-MON-YY"
                                value={enteredExpiry}
                                onChange={e => setEnteredExpiry(e.target.value)}
                                className="w-full bg-[#1a1d29] border border-gray-600 text-white text-center font-mono text-lg rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition-colors"
                            />
                        </div>

                        <div className="bg-[#2d3142] p-4 rounded-xl border border-gray-700">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Camera size={14} className="text-blue-400" /> Equipment Status Photo
                            </label>
                            <p className="text-[10px] text-gray-400 mb-3">Capture 'Ready' indicator to log into Safety Repository.</p>

                            <button
                                type="button"
                                onClick={handleSimulatePhotoUpload}
                                disabled={uploading || isPhotoUploaded}
                                className={`w-full py-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${isPhotoUploaded ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                                    uploading ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 animate-pulse' :
                                        'bg-[#1a1d29] border-gray-600 text-gray-400 hover:border-teal-500 hover:text-teal-400 hover:bg-teal-500/5'
                                    }`}
                            >
                                {isPhotoUploaded ? (
                                    <>
                                        <CheckCircle size={32} className="mb-2" />
                                        <span className="font-bold">Proof Verified</span>
                                    </>
                                ) : uploading ? (
                                    <>
                                        <UploadCloud size={32} className="mb-2 animate-bounce" />
                                        <span className="font-bold">Uploading Visual...</span>
                                    </>
                                ) : (
                                    <>
                                        <Camera size={32} className="mb-2" />
                                        <span className="font-bold">Tap to Scan / Upload</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!enteredExpiry || !isPhotoUploaded}
                            className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] disabled:shadow-none"
                        >
                            Accept & Update Central Safety Log
                        </button>
                    </form>
                </div>
            )}

            {/* Completed Audits */}
            <div className="mt-8">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest pl-2 mb-3">Completed Today</h3>
                <div className="space-y-2">
                    {targets.filter(t => t.status === 'COMPLETED').map(target => (
                        <div key={target.id} className="bg-[#1a1d29] border border-gray-800 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center opacity-70 gap-2 sm:gap-0">
                            <div>
                                <span className="text-white text-sm font-bold">{target.id}</span>
                                <p className="text-green-500 text-[10px] font-bold uppercase flex items-center gap-1 mt-1">
                                    <CheckCircle size={12} /> Verified
                                </p>
                            </div>
                            <span className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-1 font-mono self-start sm:self-auto">
                                {target.lastAudited}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default HealthEquipmentAuditTab;
