import React, { useState } from 'react';
import { HeartPulse, MapPin, AlertTriangle, CheckCircle2, Navigation, FileText, Plus, Thermometer } from 'lucide-react';

interface MedicalIncident {
    id: string;
    timestamp: Date;
    severity: 'MINOR' | 'MODERATE' | 'EMERGENCY';
    location: string;
    description: string;
    suppliesUsed: string[];
}

const SUPPLIES_CATALOG = [
    'Adhesive Bandages',
    'Antiseptic Wipes',
    'Gauze Pads',
    'Medical Tape',
    'Ice Pack',
    'Burn Gel',
    'CPR Mask',
    'EpiPen',
    'AED Used'
];

const mockHistory: MedicalIncident[] = [
    {
        id: 'MED-1042',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        severity: 'MINOR',
        location: 'Sector 7, Retail Edge',
        description: 'Guest scraped knee on a fixture. Cleaned and bandaged.',
        suppliesUsed: ['Adhesive Bandages', 'Antiseptic Wipes']
    }
];

const MedicalLogTab: React.FC = () => {
    const [history, setHistory] = useState<MedicalIncident[]>(mockHistory);
    const [viewMode, setViewMode] = useState<'LIST' | 'ENTRY'>('LIST');

    // Form State
    const [severity, setSeverity] = useState<'MINOR' | 'MODERATE' | 'EMERGENCY'>('MINOR');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSupplies, setSelectedSupplies] = useState<string[]>([]);
    const [syncPending, setSyncPending] = useState(false);

    const toggleSupply = (supply: string) => {
        setSelectedSupplies(prev =>
            prev.includes(supply) ? prev.filter(s => s !== supply) : [...prev, supply]
        );
    };

    const handleSubmit = () => {
        if (!location || !description) return;

        const newLog: MedicalIncident = {
            id: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date(),
            severity,
            location,
            description,
            suppliesUsed: selectedSupplies
        };

        setHistory(prev => [newLog, ...prev]);
        setSyncPending(true);

        // Reset form
        setSeverity('MINOR');
        setLocation('');
        setDescription('');
        setSelectedSupplies([]);
        setViewMode('LIST');
    };

    const handleSync = () => {
        setTimeout(() => setSyncPending(false), 500);
    };

    const getSeverityColor = (sev: MedicalIncident['severity']) => {
        switch (sev) {
            case 'EMERGENCY': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'MODERATE': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'MINOR': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        }
    };

    if (viewMode === 'ENTRY') {
        return (
            <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
                <div className="mb-6 flex justify-between items-center shrink-0">
                    <button
                        onClick={() => setViewMode('LIST')}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-widest"
                    >
                        <Navigation className="rotate-180" size={16} /> Back
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-12 max-w-2xl mx-auto w-full">
                    <div className="bg-[#2d3142] rounded-3xl p-6 border border-gray-700 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                                <HeartPulse className="text-rose-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-widest">New Medical Log</h2>
                                <p className="text-sm text-gray-400 font-medium">Document first-aid & consumables</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Severity */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Severity Level</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['MINOR', 'MODERATE', 'EMERGENCY'] as const).map(sev => (
                                        <button
                                            key={sev}
                                            onClick={() => setSeverity(sev)}
                                            className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${severity === sev
                                                    ? sev === 'EMERGENCY' ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-900/40'
                                                        : sev === 'MODERATE' ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-900/40'
                                                            : 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-900/40'
                                                    : 'bg-[#1a1d29] border-gray-700 text-gray-400 hover:border-gray-500'
                                                }`}
                                        >
                                            {sev}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Location of Incident</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Near Main Entrance"
                                        className="w-full bg-[#1a1d29] border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Incident Details</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the incident and assistance provided..."
                                    rows={3}
                                    className="w-full bg-[#1a1d29] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-rose-500 transition-colors resize-none"
                                />
                            </div>

                            {/* Consumables Used */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                    <Thermometer size={14} className="text-gray-400" /> Supplies Used
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SUPPLIES_CATALOG.map(supply => {
                                        const isSelected = selectedSupplies.includes(supply);
                                        return (
                                            <button
                                                key={supply}
                                                onClick={() => toggleSupply(supply)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${isSelected
                                                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                                                        : 'bg-[#1a1d29] border-gray-700 text-gray-400 hover:border-gray-500'
                                                    }`}
                                            >
                                                {supply}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!location || !description}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 mt-8 ${location && description
                                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 hover:-translate-y-1'
                                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                <CheckCircle2 size={20} /> Submit Log & Update Stock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
            <div className="mb-6 flex justify-between items-start shrink-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3 mb-1">
                        <HeartPulse className="text-rose-500" size={32} /> Medical Log
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-medium">Document first-aid assistance & consumables.</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <button
                        onClick={() => setViewMode('ENTRY')}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-rose-900/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 uppercase text-xs tracking-wider"
                    >
                        <Plus size={16} /> New Log
                    </button>

                    {syncPending && (
                        <button
                            onClick={handleSync}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg shadow-lg shadow-emerald-900/40 animate-pulse flex items-center gap-1 transition-all hover:scale-105 uppercase text-[10px] tracking-wider"
                        >
                            Sync Logs (<CheckCircle2 size={12} />)
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 space-y-4">
                {history.length === 0 ? (
                    <div className="text-center py-12 bg-[#2d3142]/50 rounded-2xl border border-dashed border-gray-700">
                        <FileText className="text-gray-600 w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-bold mb-1 uppercase tracking-widest">No Recent Logs</h3>
                        <p className="text-gray-600 text-sm">Create a new entry to log an incident.</p>
                    </div>
                ) : (
                    history.map(log => (
                        <div key={log.id} className="bg-[#2d3142] border border-gray-700 rounded-2xl p-4 shadow-lg hover:border-gray-500 transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-gray-700/50 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-black tracking-widest bg-[#1a1d29] px-2 py-1 rounded text-white border border-gray-700 shadow-inner">
                                        {log.id}
                                    </span>
                                    <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md border ${getSeverityColor(log.severity)}`}>
                                        {log.severity}
                                    </span>
                                    {log.severity === 'EMERGENCY' && (
                                        <span className="text-[10px] uppercase tracking-widest font-black bg-red-600 text-white px-2 py-1 rounded-md shadow-lg shadow-red-900/50 animate-pulse">
                                            Report Sent
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-400 font-mono font-bold bg-[#1a1d29] px-2 py-1 rounded-lg">
                                    {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <h3 className="font-medium text-white mb-2 leading-snug">{log.description}</h3>

                            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3 font-bold bg-[#1a1d29]/50 inline-flex px-2 py-1 rounded-md">
                                <MapPin size={12} className="text-rose-400" /> {log.location}
                            </div>

                            {log.suppliesUsed.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {log.suppliesUsed.map((supply, i) => (
                                        <span key={i} className="text-[10px] bg-rose-500/10 text-rose-300 font-medium px-2 py-0.5 rounded-full border border-rose-500/20">
                                            {supply}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicalLogTab;
