import React, { useState } from 'react';
import { Activity, Thermometer, Droplets, HeartPulse, Brain, CheckSquare, Stethoscope, AlertTriangle, User } from 'lucide-react';

interface IncidentLog {
    id: string;
    timestamp: Date;
    patientCategory: 'GUEST' | 'CREW' | 'VENDOR';
    severity: 'MINOR' | 'MODERATE' | 'EMERGENCY';
    summary: string;
    vitals: {
        hr: string;
        bp: string;
        temp: string;
        spo2: string;
    };
    status: 'DRAFT' | 'READY_TO_SYNC' | 'SYNCED';
}

const HealthIncidentLogTab: React.FC = () => {
    const [patientCategory, setPatientCategory] = useState<'GUEST' | 'CREW' | 'VENDOR'>('GUEST');
    const [severity, setSeverity] = useState<'MINOR' | 'MODERATE' | 'EMERGENCY'>('MINOR');
    const [summary, setSummary] = useState('');
    const [vitals, setVitals] = useState({ hr: '', bp: '', temp: '', spo2: '' });

    const [logs, setLogs] = useState<IncidentLog[]>([]);

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();

        if (!summary.trim()) return;

        const newLog: IncidentLog = {
            id: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date(),
            patientCategory,
            severity,
            summary,
            vitals,
            status: 'READY_TO_SYNC'
        };

        setLogs(prev => [newLog, ...prev]);

        // Reset form
        setSummary('');
        setVitals({ hr: '', bp: '', temp: '', spo2: '' });
        setPatientCategory('GUEST');
        setSeverity('MINOR');
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
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                            <div className="flex border border-gray-700 rounded-lg overflow-hidden font-bold text-xs bg-[#1a1d29]">
                                {['GUEST', 'CREW', 'VENDOR'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setPatientCategory(cat as any)}
                                        className={`flex-1 py-2 text-center transition-colors ${patientCategory === cat ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Severity</label>
                            <div className="flex border border-gray-700 rounded-lg overflow-hidden font-bold text-xs bg-[#1a1d29]">
                                <button type="button" onClick={() => setSeverity('MINOR')} className={`flex-1 py-2 text-center transition-colors ${severity === 'MINOR' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>MINOR</button>
                                <button type="button" onClick={() => setSeverity('MODERATE')} className={`flex-1 py-2 text-center transition-colors ${severity === 'MODERATE' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>MOD</button>
                                <button type="button" onClick={() => setSeverity('EMERGENCY')} className={`flex-1 py-2 text-center transition-colors ${severity === 'EMERGENCY' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>EMERG</button>
                            </div>
                        </div>
                    </div>

                    {/* Vitals Log */}
                    <div className="bg-[#1a1d29] p-3 rounded-xl border border-gray-700/50">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                            <Activity size={14} className="text-red-400" />
                            Vitals Log
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <HeartPulse className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={16} />
                                <input type="number" placeholder="HR mbp" value={vitals.hr} onChange={e => setVitals({ ...vitals, hr: e.target.value })} className="w-full bg-[#2d3142] border border-gray-700 text-white text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-red-500" />
                            </div>
                            <div className="relative">
                                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={16} />
                                <input type="text" placeholder="BP mmHg" value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} className="w-full bg-[#2d3142] border border-gray-700 text-white text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-red-500" />
                            </div>
                            <div className="relative">
                                <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" size={16} />
                                <input type="number" step="0.1" placeholder="Temp °C" value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} className="w-full bg-[#2d3142] border border-gray-700 text-white text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-red-500" />
                            </div>
                            <div className="relative">
                                <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                <input type="number" placeholder="SpO2 %" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} className="w-full bg-[#2d3142] border border-gray-700 text-white text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Treatment Summary</label>
                        <textarea
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                            placeholder="Describe injury and assistance provided..."
                            className="w-full bg-[#1a1d29] border border-gray-700 text-white text-sm rounded-lg p-3 outline-none focus:border-red-500 h-24 resize-none"
                        ></textarea>
                    </div>

                    <button type="submit" disabled={!summary.trim()} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] disabled:shadow-none">
                        Save to Local Queue
                    </button>
                </form>
            </div>

            {/* Sync Hub & History */}
            <div className="px-4">
                <div className="bg-[#2d3142]/80 border border-blue-500/20 p-5 rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="text-blue-400" size={20} />
                            <h3 className="text-white font-bold">Repository Sync</h3>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${readyToSyncCount > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-400'}`}>
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
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-gray-400">{log.id}</span>
                                        <span className="text-[10px] text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${log.severity === 'MINOR' ? 'bg-green-500/20 text-green-400 border-green-500/50' : log.severity === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                                            {log.severity}
                                        </span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-blue-500/20 text-blue-400 border-blue-500/50 uppercase">
                                            {log.patientCategory}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-300 line-clamp-2 mb-2">{log.summary}</p>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                                    <div className="flex gap-3 text-xs text-gray-500 font-mono">
                                        <span>HR:{log.vitals.hr || '-'}</span>
                                        <span>BP:{log.vitals.bp || '-'}</span>
                                    </div>
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
