import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';

interface DispatchCall {
    id: string;
    location: string;
    description: string;
    receivedAt: Date;
    status: 'EN_ROUTE' | 'ON_SCENE' | 'TREATMENT_COMPLETE';
    completedAt?: Date;
}

const mockDispatches: DispatchCall[] = [
    { id: 'DSP-8492', location: 'Zone 4 - Nebula Coaster', description: 'Guest reporting dizziness', receivedAt: new Date(Date.now() - 120000), status: 'EN_ROUTE' },
    { id: 'DSP-8493', location: 'Zone 1 - Main Entrance', description: 'Minor laceration on hand', receivedAt: new Date(Date.now() - 450000), status: 'ON_SCENE' },
];

const HealthResponseTrackerTab: React.FC = () => {
    const [dispatches, setDispatches] = useState<DispatchCall[]>(mockDispatches);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const updateStatus = (id: string, newStatus: 'EN_ROUTE' | 'ON_SCENE' | 'TREATMENT_COMPLETE') => {
        setDispatches(prev => prev.map(d => {
            if (d.id === id) {
                return {
                    ...d,
                    status: newStatus,
                    completedAt: newStatus === 'TREATMENT_COMPLETE' ? new Date() : undefined
                };
            }
            return d;
        }));
    };

    const getElapsedTime = (start: Date, end?: Date) => {
        const endTime = end || currentTime;
        const diffInSeconds = Math.floor((endTime.getTime() - start.getTime()) / 1000);
        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = diffInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] pb-24 md:pb-0 overflow-y-auto hide-scrollbar space-y-4 p-4">

            <div className="flex items-center gap-3 mb-2">
                <Navigation className="text-blue-400 w-8 h-8" />
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Active Dispatches</h2>
                    <p className="text-gray-400 text-xs mt-1">Ops Coordination Tracker</p>
                </div>
            </div>

            <div className="space-y-4">
                {dispatches.filter(d => d.status !== 'TREATMENT_COMPLETE').map(dispatch => (
                    <div key={dispatch.id} className="bg-[#2d3142]/80 border border-blue-500/30 rounded-2xl p-4 shadow-lg overflow-hidden relative">
                        {/* Flashing indicator for EN_ROUTE */}
                        {dispatch.status === 'EN_ROUTE' && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse"></div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-3 pl-2 gap-3">
                            <div>
                                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-wider">
                                    {dispatch.id}
                                </span>
                                <h3 className="text-white font-bold text-lg mt-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400 shrink-0" />
                                    {dispatch.location}
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">{dispatch.description}</p>
                            </div>

                            <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Time to Scene</span>
                                <div className={`flex items-center gap-2 font-mono text-xl font-bold px-3 py-1 rounded-lg w-full sm:w-auto justify-center sm:justify-start ${dispatch.status === 'EN_ROUTE' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'}`}>
                                    <Clock size={16} className={dispatch.status === 'EN_ROUTE' ? 'animate-pulse' : ''} />
                                    {getElapsedTime(dispatch.receivedAt)}
                                </div>
                            </div>
                        </div>

                        {/* Status Toggles */}
                        <div className="flex flex-col sm:flex-row bg-[#1a1d29] rounded-xl p-1 border border-gray-700/50 ml-0 sm:ml-2 gap-1 sm:gap-0">
                            <button
                                onClick={() => updateStatus(dispatch.id, 'EN_ROUTE')}
                                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${dispatch.status === 'EN_ROUTE' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Navigation size={14} /> EN ROUTE
                            </button>
                            <button
                                onClick={() => updateStatus(dispatch.id, 'ON_SCENE')}
                                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${dispatch.status === 'ON_SCENE' ? 'bg-yellow-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <AlertCircle size={14} /> ON SCENE
                            </button>
                            <button
                                onClick={() => updateStatus(dispatch.id, 'TREATMENT_COMPLETE')}
                                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-gray-500 hover:bg-green-600 hover:text-white`}
                            >
                                <CheckCircle2 size={14} /> COMPLETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Completed Dispatches / Metrics */}
            <div className="mt-8">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest pl-2 mb-3">Recent Completed Dispatches</h3>
                <div className="space-y-3">
                    {dispatches.filter(d => d.status === 'TREATMENT_COMPLETE').map(dispatch => (
                        <div key={dispatch.id} className="bg-[#1a1d29] border border-gray-800 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center opacity-70 gap-2 sm:gap-0">
                            <div>
                                <span className="text-xs font-bold text-gray-500 block sm:inline">{dispatch.id} - {dispatch.location}</span>
                                <p className="text-xs text-green-500 flex items-center gap-1 mt-1 font-bold">
                                    <CheckCircle2 size={12} /> Treatment Complete
                                </p>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-800">
                                <span className="text-[10px] text-gray-600 uppercase font-bold sm:block inline mr-2 sm:mr-0">Total Response Time</span>
                                <span className="font-mono text-gray-400 font-bold">{getElapsedTime(dispatch.receivedAt, dispatch.completedAt)}</span>
                            </div>
                        </div>
                    ))}
                    {dispatches.filter(d => d.status === 'TREATMENT_COMPLETE').length === 0 && (
                        <div className="text-center p-6 border border-dashed border-gray-700 rounded-xl text-gray-500 text-sm">
                            No completed dispatches for this shift.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default HealthResponseTrackerTab;
