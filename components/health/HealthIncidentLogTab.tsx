import React, { useState } from 'react';
import { Activity, Thermometer, Droplets, HeartPulse, Brain, CheckSquare, Stethoscope, AlertTriangle, User } from 'lucide-react';

interface IncidentLog {
    id: string;
    timestamp: Date;
    patientCategory: 'GUEST' | 'CREW' | 'VENDOR';
    personName: string;
    incidentDescription: string;
    treatmentDescription: string;
    status: 'DRAFT' | 'READY_TO_SYNC' | 'SYNCED';
}

const HealthIncidentLogTab: React.FC = () => {
    const [patientCategory, setPatientCategory] = useState<'GUEST' | 'CREW' | 'VENDOR'>('GUEST');
    const [personName, setPersonName] = useState('');
    const [incidentDescription, setIncidentDescription] = useState('');
    const [treatmentDescription, setTreatmentDescription] = useState('');

    const [logs, setLogs] = useState<IncidentLog[]>([]);

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();

        if (!personName.trim() || !incidentDescription.trim() || !treatmentDescription.trim()) return;

        const newLog: IncidentLog = {
            id: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date(),
            patientCategory,
            personName,
            incidentDescription,
            treatmentDescription,
            status: 'READY_TO_SYNC'
        };

        setLogs(prev => [newLog, ...prev]);

        // Reset form
        setPersonName('');
        setIncidentDescription('');
        setTreatmentDescription('');
        setPatientCategory('GUEST');
    };

    const handleManualSync = () => {
        setLogs(prev => prev.map(log =>
            log.status === 'READY_TO_SYNC' ? { ...log, status: 'SYNCED' } : log
        ));
    };

    const readyToSyncCount = logs.filter(l => l.status === 'READY_TO_SYNC').length;

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] pb-24 md:pb-0 overflow-y-auto hide-scrollbar space-y-4">

            {/* Header / Active Form area */}
            <div className="bg-[#2d3142]/90 backdrop-blur-md p-5 border-b border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Stethoscope className="text-red-400 w-8 h-8" />
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">New Incident Log</h2>
                        <p className="text-gray-400 text-xs mt-1">Record primary care & vitals</p>
                    </div>
                </div>

                <form onSubmit={handleSaveDraft} className="space-y-4">

                    {/* Selectors */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                            <div className="flex border border-gray-700 rounded-lg overflow-hidden font-bold text-xs bg-[#1a1d29]">
                                {['GUEST', 'CREW', 'VENDOR'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setPatientCategory(cat as any)}
                                        className={`flex-1 py-3 text-center transition-colors ${patientCategory === cat ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name of Person</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Enter full name..."
                                    value={personName}
                                    onChange={e => setPersonName(e.target.value)}
                                    className="w-full bg-[#1a1d29] border border-gray-700 text-white text-sm rounded-lg pl-9 pr-3 py-3 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Medical Incident</label>
                            <textarea
                                value={incidentDescription}
                                onChange={e => setIncidentDescription(e.target.value)}
                                placeholder="Describe the injury or illness..."
                                className="w-full bg-[#1a1d29] border border-gray-700 text-white text-sm rounded-lg p-3 outline-none focus:border-blue-500 h-24 resize-none"
                            ></textarea>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Crew Treatment</label>
                            <textarea
                                value={treatmentDescription}
                                onChange={e => setTreatmentDescription(e.target.value)}
                                placeholder="Describe the assistance or treatment provided..."
                                className="w-full bg-[#1a1d29] border border-gray-700 text-white text-sm rounded-lg p-3 outline-none focus:border-blue-500 h-24 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" disabled={!personName.trim() || !incidentDescription.trim() || !treatmentDescription.trim()} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 mt-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:shadow-none mb-4">
                        Save to Local Queue
                    </button>
                </form>
            </div>

            {/* Sync Hub & History */}
            <div className="px-4">
                <div className="bg-[#2d3142]/80 border border-blue-500/20 p-5 rounded-2xl shadow-xl flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="text-blue-400" size={20} />
                            <h3 className="text-white font-bold">Repository Sync</h3>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg self-start sm:self-auto ${readyToSyncCount > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-400'}`}>
                            {readyToSyncCount} Pending
                        </span>
                    </div>

                    {readyToSyncCount > 0 && (
                        <button onClick={handleManualSync} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] mb-4 flex justify-center items-center gap-2">
                            <AlertTriangle size={18} />
                            Accept {readyToSyncCount} Logs to Global Repository
                        </button>
                    )}

                    <div className="space-y-3">
                        {logs.map((log) => (
                            <div key={log.id} className="bg-[#1a1d29] p-3 rounded-xl border border-gray-700/50">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-gray-400">{log.id}</span>
                                        <span className="text-[10px] text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex gap-1 flex-wrap">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-blue-500/20 text-blue-400 border-blue-500/50 uppercase">
                                            {log.patientCategory}
                                        </span>
                                    </div>
                                </div>
                                <h4 className="font-bold text-white text-sm mb-1">{log.personName}</h4>
                                <p className="text-xs text-gray-300 line-clamp-2 mb-1"><span className="text-gray-500 font-bold">Inc:</span> {log.incidentDescription}</p>
                                <p className="text-xs text-gray-300 line-clamp-2 mb-2"><span className="text-gray-500 font-bold">Tx:</span> {log.treatmentDescription}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-800">
                                    {log.status === 'SYNCED' ? (
                                        <span className="text-[10px] text-green-500 flex items-center gap-1 font-bold"><CheckSquare size={12} /> SYNCED</span>
                                    ) : (
                                        <span className="text-[10px] text-yellow-500 flex items-center gap-1 font-bold"><AlertTriangle size={12} /> PENDING</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-700 rounded-xl">
                                No logs recorded for this shift.
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HealthIncidentLogTab;
