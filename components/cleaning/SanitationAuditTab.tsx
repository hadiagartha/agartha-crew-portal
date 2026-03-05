import React, { useState } from 'react';
import { ShieldAlert, Camera, MapPin, CheckCircle2, ChevronRight, AlertTriangle, ScanLine } from 'lucide-react';

interface AuditTask {
    id: string;
    location: string;
    description: string;
    status: 'PENDING' | 'COMPLETED';
}

const mockAudits: AuditTask[] = [
    {
        id: 'AUD-901',
        location: 'Food Court - Tables 1-10',
        description: 'Routine surface ATP swab after peak lunch hours.',
        status: 'PENDING'
    },
    {
        id: 'AUD-902',
        location: 'Restroom Block A - Sinks',
        description: 'Hourly sanitation verification.',
        status: 'PENDING'
    },
    {
        id: 'AUD-885',
        location: 'Main Concourse - Benches',
        description: 'Morning opening routine swab.',
        status: 'COMPLETED'
    }
];

const SanitationAuditTab: React.FC = () => {
    const [audits, setAudits] = useState<AuditTask[]>(mockAudits);
    const [activeAudit, setActiveAudit] = useState<AuditTask | null>(null);
    const [atpReading, setAtpReading] = useState('');
    const [hasPhoto, setHasPhoto] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleStartAudit = (audit: AuditTask) => {
        setActiveAudit(audit);
        setAtpReading('');
        setHasPhoto(false);
        setSubmitSuccess(false);
    };

    const handleMockPhoto = () => {
        setHasPhoto(true);
    };

    const handleSubmit = () => {
        if (!atpReading || !hasPhoto || !activeAudit) return;

        setAudits(prev => prev.map(a =>
            a.id === activeAudit.id ? { ...a, status: 'COMPLETED' } : a
        ));

        setSubmitSuccess(true);
        setTimeout(() => {
            setActiveAudit(null);
            setSubmitSuccess(false);
        }, 2000);
    };

    const pendingAudits = audits.filter(a => a.status === 'PENDING');
    const completedAudits = audits.filter(a => a.status === 'COMPLETED');

    if (activeAudit) {
        return (
            <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
                <div className="mb-6 shrink-0">
                    <button
                        onClick={() => setActiveAudit(null)}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-widest mb-4"
                    >
                        <ChevronRight className="rotate-180" size={16} /> Back to Audit List
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                        <ScanLine className="text-purple-400" size={32} /> Perform Audit
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-12 w-full max-w-2xl mx-auto">
                    {submitSuccess ? (
                        <div className="bg-[#2d3142] border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl animate-scaleIn">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="text-emerald-400" size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Audit Recorded</h2>
                            <p className="text-gray-400">The ATP reading and photo proof have been securely transmitted to Compliance Management.</p>
                        </div>
                    ) : (
                        <div className="bg-[#2d3142] border border-gray-700 rounded-3xl p-6 shadow-2xl">
                            <div className="mb-6 pb-6 border-b border-gray-700">
                                <span className="font-mono text-xs font-black tracking-widest text-purple-400 mb-2 block">{activeAudit.id}</span>
                                <h2 className="text-xl font-black text-white mb-2">{activeAudit.location}</h2>
                                <p className="text-sm text-gray-400">{activeAudit.description}</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                        <ScanLine size={14} className="text-purple-400" /> ATP Swab Reading
                                    </label>
                                    <input
                                        type="number"
                                        value={atpReading}
                                        onChange={(e) => setAtpReading(e.target.value)}
                                        placeholder="Enter RLU value"
                                        className="w-full bg-[#1a1d29] border border-gray-700 rounded-xl py-4 px-5 text-white font-mono text-lg focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2 flex items-center gap-1.5">
                                        <AlertTriangle size={12} /> Results are blind. A manager will be notified if thresholds are exceeded.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                        <Camera size={14} className="text-blue-400" /> Photo Proof
                                    </label>
                                    {!hasPhoto ? (
                                        <button
                                            onClick={handleMockPhoto}
                                            className="w-full h-32 bg-[#1a1d29] border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group"
                                        >
                                            <Camera size={32} className="group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-sm uppercase tracking-widest">Capture Swab Location</span>
                                        </button>
                                    ) : (
                                        <div className="w-full h-32 bg-[#1a1d29] border border-emerald-500/50 rounded-xl flex items-center justify-center gap-3 text-emerald-400 shadow-inner">
                                            <CheckCircle2 size={24} />
                                            <span className="font-bold text-sm uppercase tracking-widest">Photo Attached</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!atpReading || !hasPhoto}
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all mt-4 flex justify-center items-center gap-2 ${atpReading && hasPhoto
                                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40 hover:-translate-y-1 active:scale-95'
                                            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <ShieldAlert size={18} /> Submit Blind Audit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
            <div className="mb-6 shrink-0">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3 mb-1">
                    <ShieldAlert className="text-purple-400" size={32} /> Hygiene Audit
                </h1>
                <p className="text-gray-400 text-sm md:text-base font-medium">Perform blind sanitation checks and attach proof.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 space-y-6">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2 border-b border-gray-700/50 pb-2">
                        Pending Audits ({pendingAudits.length})
                    </h3>
                    <div className="space-y-3">
                        {pendingAudits.length === 0 ? (
                            <div className="text-center py-8 bg-[#2d3142]/50 rounded-2xl border border-dashed border-gray-700 text-gray-500 text-sm">
                                No pending audits at this time.
                            </div>
                        ) : (
                            pendingAudits.map(audit => (
                                <div key={audit.id} className="bg-[#2d3142] border-l-4 border-l-purple-500 border-t border-r border-b border-gray-700 rounded-r-2xl p-4 shadow-lg hover:bg-[#34394c] transition-colors cursor-pointer group" onClick={() => handleStartAudit(audit)}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-purple-400" />
                                            <h4 className="font-bold text-lg text-white">{audit.location}</h4>
                                        </div>
                                        <span className="font-mono text-xs font-black tracking-widest text-gray-500 group-hover:text-purple-400 transition-colors">
                                            {audit.id}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4 pl-6 line-clamp-1">{audit.description}</p>
                                    <div className="pl-6 flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                                        Perform Audit <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2 border-b border-gray-700/50 pb-2">
                        Today's Completed Audits
                    </h3>
                    <div className="space-y-3">
                        {completedAudits.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 text-xs uppercase tracking-widest font-bold">
                                No audits completed today.
                            </div>
                        ) : (
                            completedAudits.map(audit => (
                                <div key={audit.id} className="bg-[#1a1d29] border border-gray-700 rounded-xl p-3 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        <div>
                                            <div className="font-bold text-gray-300">{audit.location}</div>
                                            <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{audit.id}</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                        Submitted
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SanitationAuditTab;
