import React, { useState } from 'react';
import { Sparkles, Users, Wrench, Siren, HeartPulse, CheckCircle2, QrCode as QrCodeIcon, MessageSquare, AlertTriangle } from 'lucide-react';
import { Incident, StaffMember, IncidentSeverity } from '../types';

interface ExperienceDashboardProps {
    handleAddIncident: (incident: Incident) => void;
    staff: StaffMember;
    zoneStatuses?: Record<string, 'Ready' | 'Cleaning'>;
}

const ExperienceDashboard: React.FC<ExperienceDashboardProps> = ({
    handleAddIncident,
    staff,
    zoneStatuses = {}
}) => {
    const [patrolProgress, setPatrolProgress] = useState(0);
    const [isPatrolling, setIsPatrolling] = useState(false);
    const [patrolLogged, setPatrolLogged] = useState(false);
    const [highlightText, setHighlightText] = useState('');
    const [highlights, setHighlights] = useState<{ time: string, text: string }[]>([
        { time: '09:14 AM', text: "Kids totally believed the dragon was real. Lots of photos taken." }
    ]);

    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Projector 4B Alignment Check', done: false },
        { id: 2, text: 'Crystal Cave Audio Levels (Ambient)', done: false },
        { id: 3, text: 'Interactive Moss Sensors Calibrated', done: true },
        { id: 4, text: 'Fog Machine Fluid Levels', done: false }
    ]);

    const handleOneTapEscalation = (type: 'Medical' | 'Security' | 'Maintenance') => {
        let severity = IncidentSeverity.MEDIUM;
        if (type === 'Medical') severity = IncidentSeverity.HIGH;

        const newIncident: Incident = {
            id: `INC-EXP-${Date.now()}`,
            timestamp: new Date(),
            type: `${type} Escalation`,
            severity,
            description: `Accelerated escalation from Experience Crew in ${staff.current_zone_id || 'Sector'}.`,
            status: 'OPEN',
            reportedBy: staff.staff_id,
            zone_id: staff.current_zone_id || 'Z-01'
        };
        handleAddIncident(newIncident);
        window.alert(`${type} team mobilized to your location.`);
    };

    const handleLogPatrol = () => {
        setIsPatrolling(true);
        setPatrolProgress(0);

        const interval = setInterval(() => {
            setPatrolProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setPatrolLogged(true);
                        setIsPatrolling(false);
                    }, 1000);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
    };

    const handleAddHighlight = () => {
        if (!highlightText.trim()) return;
        setHighlights([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: highlightText }, ...highlights]);
        setHighlightText('');
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-full">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Sparkles className="text-yellow-400" size={28} /> Experience Control
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mt-1">Manage guest narrative, crowd flow, and rapid response.</p>
                </div>

                <div className="flex items-center gap-2 bg-[#2d3142] p-2 rounded-xl border border-gray-700">
                    <span className="text-sm text-gray-400 font-bold px-2 block hidden md:block">Zone {staff.current_zone_id?.replace('Z-', '') || '01'} Status:</span>
                    <div className={`px-4 py-2 rounded-lg font-bold text-sm ${zoneStatuses[staff.current_zone_id || 'Z-01'] === 'Cleaning' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                        {zoneStatuses[staff.current_zone_id || 'Z-01'] === 'Cleaning' ? 'Cleaning in Progress' : 'Ready for Guests'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">

                {/* Emergency Escalation (High Priority UI) */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => handleOneTapEscalation('Medical')}
                        className="bg-red-600/20 hover:bg-red-600 border border-red-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.1)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                        <HeartPulse size={32} className="text-red-500 group-hover:text-white mb-2" />
                        <span className="font-bold text-red-500 group-hover:text-white uppercase tracking-widest text-sm">Medical Emergency</span>
                    </button>

                    <button
                        onClick={() => handleOneTapEscalation('Security')}
                        className="bg-blue-600/20 hover:bg-blue-600 border border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    >
                        <Siren size={32} className="text-blue-500 group-hover:text-white mb-2" />
                        <span className="font-bold text-blue-500 group-hover:text-white uppercase tracking-widest text-sm">Security Response</span>
                    </button>

                    <button
                        onClick={() => handleOneTapEscalation('Maintenance')}
                        className="bg-purple-600/20 hover:bg-purple-600 border border-purple-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 group transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                    >
                        <Wrench size={32} className="text-purple-500 group-hover:text-white mb-2" />
                        <span className="font-bold text-purple-500 group-hover:text-white uppercase tracking-widest text-sm">Tech/Mech Failure</span>
                    </button>
                </div>

                {/* Guest Flow Widget */}
                <div className="col-span-1 bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="text-blue-400" /> Crowd Density
                    </h3>

                    <div className="flex-1 min-h-[150px] bg-[#1a1d29] rounded-xl border border-gray-700/50 relative flex items-center justify-center overflow-hidden shadow-inner flex-col gap-3 p-4">
                        <div className="text-center">
                            <div className="text-4xl font-black text-red-400 mb-1 animate-pulse">87%</div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Zone Capacity</p>
                        </div>
                        <AlertTriangle size={24} className="text-red-400 animate-pulse absolute top-4 right-4" />
                        <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                    </div>

                    <button
                        onClick={() => window.alert('Wayfinding signs updated. Guests are being redirected via alternate scenic route.')}
                        className="w-full mt-4 bg-[#1a1d29] border border-blue-500/30 hover:bg-blue-500/10 text-blue-400 py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                        Toggle Diversion Protocol
                    </button>
                </div>

                {/* Narrative Checklist and Patrol */}
                <div className="col-span-1 bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-400" /> Magic Maintenance
                    </h3>

                    <div className="flex-1 space-y-2 mb-6">
                        {checklist.map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-[#1a1d29] p-3 rounded-lg border border-gray-700/50">
                                <input
                                    type="checkbox"
                                    checked={item.done}
                                    onChange={(e) => setChecklist(p => p.map(i => i.id === item.id ? { ...i, done: e.target.checked } : i))}
                                    className="w-4 h-4 rounded bg-[#2d3142] border-gray-600 text-purple-500 focus:ring-purple-500"
                                />
                                <span className={`text-sm ${item.done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {!patrolLogged ? (
                        <button
                            onClick={handleLogPatrol}
                            className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mt-auto"
                        >
                            <QrCodeIcon size={18} /> Initialize Area Patrol
                        </button>
                    ) : (
                        <div className="w-full bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold mt-auto">
                            <CheckCircle2 size={16} /> Patrol Authenticated
                        </div>
                    )}
                </div>

                {/* Guest Highlights Feed */}
                <div className="col-span-1 bg-[#2d3142] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="text-yellow-400" /> Guest Highlights
                    </h3>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Log a positive interaction..."
                            value={highlightText}
                            onChange={(e) => setHighlightText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddHighlight()}
                            className="flex-1 bg-[#1a1d29] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500/50"
                        />
                        <button onClick={handleAddHighlight} className="bg-yellow-500/20 text-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-500/30 transition-colors">
                            Add
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {highlights.map((h, i) => (
                            <div key={i} className="bg-[#1a1d29] p-3 rounded-lg border-l-2 border-yellow-500/50">
                                <span className="text-[10px] text-gray-500 font-mono mb-1 block">{h.time}</span>
                                <p className="text-sm text-gray-300 italic">"{h.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* QR Scanner Overlay for Patrol */}
            {isPatrolling && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-xl font-bold text-white mb-4">Verifying Location Authenticity</h2>
                        <div className="w-64 h-64 border-4 border-purple-500 rounded-3xl relative overflow-hidden flex items-center justify-center bg-[#1a1d29]">
                            {patrolProgress < 100 ? (
                                <>
                                    <div className="absolute inset-0 bg-purple-500/10" />
                                    <div
                                        className="absolute top-0 left-0 w-full h-1 bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,1)]"
                                        style={{ transform: `translateY(${patrolProgress * 2.5}px)` }}
                                    />
                                    <QrCodeIcon size={80} className="text-purple-500/50" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 animate-in zoom-in-95">
                                    <CheckCircle2 size={80} className="text-green-400 animate-pulse" />
                                </div>
                            )}
                        </div>
                        <p className="text-purple-400 font-mono text-sm">Authenticating Zone Sigil... {patrolProgress}%</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperienceDashboard;
