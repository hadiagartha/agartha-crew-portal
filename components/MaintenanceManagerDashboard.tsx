import React from 'react';
import { useGlobalState } from './GlobalStateContext';
import {
    Activity,
    Ticket,
    AlertTriangle,
    CheckCircle,
    Map as MapIcon,
    Shield,
    ExternalLink,
    Clock
} from 'lucide-react';

const MaintenanceManagerDashboard: React.FC = () => {
    const {
        technical_incidents,
        zone_statuses,
        service_tickets
    } = useGlobalState();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Green': return 'fill-green-500/20 stroke-green-500/40';
            case 'Yellow': return 'fill-yellow-500/20 stroke-yellow-500/40';
            case 'Degraded': return 'fill-red-500/20 stroke-red-500/40';
            default: return 'fill-gray-500/10 stroke-gray-500/20';
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case 'Green': return 'text-green-400';
            case 'Yellow': return 'text-yellow-400';
            case 'Degraded': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Shield className="text-blue-500" /> Maintenance Command Center
                    </h2>
                    <p className="text-gray-400 text-sm">Strategic Oversight & Technical Triage</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#2d3142] p-4 rounded-xl border border-gray-700 flex flex-col items-center min-w-[120px]">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Tickets</span>
                        <div className="flex items-center gap-2">
                            <Ticket size={18} className="text-blue-400" />
                            <span className="text-2xl font-mono font-bold text-white">
                                {service_tickets.filter(t => t.status !== 'COMPLETED').length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Global Health Map */}
                <div className="lg:col-span-2 bg-[#2d3142]/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 flex flex-col h-full">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                        <MapIcon size={16} className="text-blue-400" /> Global Health Map
                    </h3>

                    <div className="flex-1 min-h-[400px] relative flex items-center justify-center p-4">
                        <svg viewBox="0 0 800 600" className="w-full h-full max-h-[500px]">
                            {/* Simplified Zone Layout */}
                            {/* Z-01: Alpha (Top Left) */}
                            <path
                                d="M 50 50 L 350 50 L 350 250 L 50 250 Z"
                                className={`transition-all duration-500 stroke-2 ${getStatusColor(zone_statuses['Z-01'])}`}
                            />
                            <text x="200" y="150" textAnchor="middle" className="fill-white font-bold text-sm">ALPHA (Z-01)</text>
                            <text x="200" y="175" textAnchor="middle" className={`text-xs font-mono font-bold ${getStatusTextColor(zone_statuses['Z-01'])}`}>
                                {zone_statuses['Z-01']?.toUpperCase()}
                            </text>

                            {/* Z-02: Beta (Top Right) */}
                            <path
                                d="M 400 50 L 750 50 L 750 250 L 400 250 Z"
                                className={`transition-all duration-500 stroke-2 ${getStatusColor(zone_statuses['Z-02'])}`}
                            />
                            <text x="575" y="150" textAnchor="middle" className="fill-white font-bold text-sm">BETA (Z-02)</text>
                            <text x="575" y="175" textAnchor="middle" className={`text-xs font-mono font-bold ${getStatusTextColor(zone_statuses['Z-02'])}`}>
                                {zone_statuses['Z-02']?.toUpperCase()}
                            </text>

                            {/* Z-03: Gamma (Bottom Left) */}
                            <path
                                d="M 50 300 L 350 300 L 350 550 L 50 550 Z"
                                className={`transition-all duration-500 stroke-2 ${getStatusColor(zone_statuses['Z-03'])}`}
                            />
                            <text x="200" y="425" textAnchor="middle" className="fill-white font-bold text-sm">GAMMA (Z-03)</text>
                            <text x="200" y="450" textAnchor="middle" className={`text-xs font-mono font-bold ${getStatusTextColor(zone_statuses['Z-03'])}`}>
                                {zone_statuses['Z-03']?.toUpperCase()}
                            </text>

                            {/* Z-04: Delta (Bottom Right) */}
                            <path
                                d="M 400 300 L 750 300 L 750 550 L 400 550 Z"
                                className={`transition-all duration-500 stroke-2 ${getStatusColor(zone_statuses['Z-04'])}`}
                            />
                            <text x="575" y="425" textAnchor="middle" className="fill-white font-bold text-sm">DELTA (Z-04)</text>
                            <text x="575" y="450" textAnchor="middle" className={`text-xs font-mono font-bold ${getStatusTextColor(zone_statuses['Z-04'])}`}>
                                {zone_statuses['Z-04']?.toUpperCase()}
                            </text>
                        </svg>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700/50">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500" />
                            <span className="text-xs text-gray-400">Green (Nominal)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500" />
                            <span className="text-xs text-gray-400">Yellow (Warning)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" />
                            <span className="text-xs text-gray-400">Degraded (Critical)</span>
                        </div>
                    </div>
                </div>

                {/* Right: Active Service Tickets */}
                <div className="bg-[#2d3142]/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 flex flex-col h-fit max-h-[700px]">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                        <Ticket size={16} className="text-yellow-400" /> Active Service Tickets
                    </h3>

                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {service_tickets.filter(t => t.status !== 'COMPLETED').length === 0 ? (
                            <div className="text-center py-10 opacity-30">
                                <CheckCircle size={40} className="mx-auto mb-3" />
                                <p className="text-sm">No pending tickets</p>
                            </div>
                        ) : (
                            service_tickets
                                .filter(t => t.status !== 'COMPLETED')
                                .reverse()
                                .map(ticket => (
                                    <div key={ticket.id} className="bg-[#1a1d29] p-4 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter ${ticket.type === 'EXTERNAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                }`}>
                                                {ticket.type}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-mono">{ticket.id}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-white mb-1">{ticket.item}</h4>
                                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                                            <span>Zone: {ticket.zoneId}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} /> {ticket.status}</span>
                                        </div>
                                        <button className="w-full mt-3 py-2 bg-[#2d3142] hover:bg-blue-600 text-gray-300 hover:text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                                            <ExternalLink size={12} /> Dispatch Unit
                                        </button>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom: Technical Incident Audit Trail */}
            <div className="bg-[#2d3142]/30 p-6 rounded-2xl border border-gray-700/30">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Activity size={16} /> Technical Audit Trail
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {technical_incidents.slice(0, 8).reverse().map(incident => (
                        <div key={incident.id} className="bg-[#1a1d29]/50 p-4 rounded-xl border border-gray-800 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-gray-500">{new Date(incident.timestamp).toLocaleTimeString()}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${incident.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {incident.status}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-white truncate">{incident.item}</p>
                            <p className="text-[10px] text-gray-400 line-clamp-2">{incident.reason}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MaintenanceManagerDashboard;
