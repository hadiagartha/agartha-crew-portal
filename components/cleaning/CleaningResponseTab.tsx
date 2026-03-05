import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle2, Navigation, AlertOctagon, Info } from 'lucide-react';

interface ResponseTask {
    id: string;
    type: 'MEDICAL' | 'SPILL' | 'GENERAL';
    location: string;
    description: string;
    timestamp: Date;
    status: 'PENDING' | 'EN_ROUTE' | 'COMPLETED';
    acknowledgedAt?: Date;
    completedAt?: Date;
}

const mockQueue: ResponseTask[] = [
    {
        id: 'REQ-0192',
        type: 'MEDICAL',
        location: 'Zone 4, Sector B',
        description: 'Visitor requesting first-aid for minor cut.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        status: 'PENDING'
    },
    {
        id: 'REQ-0193',
        type: 'SPILL',
        location: 'Food Court, Level 2',
        description: 'Large beverage spill. Slippery floor.',
        timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
        status: 'EN_ROUTE',
        acknowledgedAt: new Date(Date.now() - 1000 * 60 * 8)
    },
    {
        id: 'REQ-0194',
        type: 'GENERAL',
        location: 'Restroom Block C',
        description: 'Routine scheduled sanitation check overdue.',
        timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
        status: 'PENDING'
    }
];

const formatDuration = (ms: number) => {
    if (ms < 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const CleaningResponseTab: React.FC = () => {
    const [tasks, setTasks] = useState<ResponseTask[]>(mockQueue);
    const [now, setNow] = useState(new Date());
    const [syncPending, setSyncPending] = useState(false);

    // Live timer
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAcknowledge = (id: string) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, status: 'EN_ROUTE', acknowledgedAt: new Date() } : t
        ));
        setSyncPending(true);
    };

    const handleComplete = (id: string) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, status: 'COMPLETED', completedAt: new Date() } : t
        ));
        setSyncPending(true);
    };

    const handleSync = () => {
        // Mock sync to repository/ops
        setTimeout(() => setSyncPending(false), 500);
    };

    const getTypeColor = (type: ResponseTask['type']) => {
        switch (type) {
            case 'MEDICAL': return 'text-red-500 border-red-500 bg-red-500/10 shadow-red-900/20';
            case 'SPILL': return 'text-amber-400 border-amber-400 bg-amber-400/10 shadow-amber-900/20';
            default: return 'text-blue-400 border-blue-400 bg-blue-400/10 shadow-blue-900/20';
        }
    };

    const getTypeIcon = (type: ResponseTask['type']) => {
        switch (type) {
            case 'MEDICAL': return <AlertOctagon size={24} className="text-red-500" />;
            case 'SPILL': return <AlertTriangle size={24} className="text-amber-400" />;
            default: return <Info size={24} className="text-blue-400" />;
        }
    };

    const activeTasks = tasks.filter(t => t.status !== 'COMPLETED').sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">
            <div className="mb-6 flex justify-between items-start shrink-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3 mb-1">
                        <AlertTriangle className="text-red-500" size={32} /> Response Queue
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-medium">Real-time coordination for urgent operations.</p>
                </div>
                {syncPending && (
                    <button
                        onClick={handleSync}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-emerald-900/40 animate-pulse flex items-center gap-2 transition-all hover:scale-105 uppercase text-xs tracking-wider"
                    >
                        Accept All Logs
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-12">
                {activeTasks.length === 0 && (
                    <div className="text-center py-12 bg-[#2d3142]/50 rounded-2xl border border-dashed border-gray-700">
                        <CheckCircle2 className="text-gray-600 w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-bold mb-1 uppercase tracking-widest">No Active Alerts</h3>
                        <p className="text-gray-600 text-sm">Zone is currently clear of pending responses.</p>
                    </div>
                )}
                {activeTasks.map(task => {
                    const elapsedMs = now.getTime() - task.timestamp.getTime();
                    const isMedical = task.type === 'MEDICAL';
                    const isOverdue = elapsedMs > 1000 * 60 * 10; // 10 mins

                    return (
                        <div key={task.id} className={`bg-[#2d3142] border ${getTypeColor(task.type)} rounded-2xl p-4 md:p-5 shadow-lg flex flex-col sm:flex-row gap-4 sm:items-center relative overflow-hidden group transition-all hover:-translate-y-1`}>
                            {/* Alert Indicator Bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-current opacity-70" />

                            <div className="flex-shrink-0 bg-[#1a1d29] p-3 rounded-xl border border-gray-700">
                                {getTypeIcon(task.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 border-b border-gray-700/50 pb-2 mb-2">
                                    <span className="font-mono text-xs font-black tracking-widest bg-[#1a1d29] px-2 py-1 rounded text-white flex items-center gap-1.5 opacity-80">
                                        {task.id}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-widest font-black opacity-80">
                                        {task.type}
                                    </span>
                                    <span className={`ml-auto font-mono text-sm font-black flex items-center gap-1.5 ${isOverdue ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
                                        <Clock size={14} /> {formatDuration(elapsedMs)}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-white line-clamp-2 md:line-clamp-1 mb-1">{task.description}</h3>
                                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                    <MapPin size={14} className="text-blue-400" /> <span className="font-bold text-gray-300">{task.location}</span>
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                                {task.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleAcknowledge(task.id)}
                                        className="flex-1 sm:w-36 py-2.5 px-4 rounded-xl font-black uppercase text-xs tracking-wider border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex justify-center items-center gap-2 active:scale-95"
                                    >
                                        <Navigation size={16} /> Acknowledge
                                    </button>
                                )}
                                {task.status === 'EN_ROUTE' && (
                                    <button
                                        onClick={() => handleComplete(task.id)}
                                        className="flex-1 sm:w-36 py-2.5 px-4 rounded-xl font-black uppercase text-xs tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex justify-center items-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle2 size={16} /> Mark Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {completedTasks.length > 0 && (
                    <div className="pt-6 mt-6 border-t border-gray-700/50">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 px-2">Recently Completed Responses</h4>
                        <div className="space-y-3">
                            {completedTasks.slice(0, 5).map(task => {
                                const responseTime = task.completedAt && task.acknowledgedAt
                                    ? task.completedAt.getTime() - task.timestamp.getTime()
                                    : 0;

                                return (
                                    <div key={task.id} className="bg-[#1a1d29] border border-gray-700 rounded-xl p-3 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-3 text-sm">
                                            {getTypeIcon(task.type)}
                                            <div>
                                                <div className="font-bold text-gray-300">{task.location}</div>
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{task.id} • {task.type}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-emerald-400 text-sm flex items-center gap-1"><CheckCircle2 size={14} /> Completed</div>
                                            <div className="text-[10px] text-gray-500 font-mono">Response: {formatDuration(responseTime)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CleaningResponseTab;
