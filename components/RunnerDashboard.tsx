import React, { useState } from 'react';
import { Truck, Package, ClipboardCheck, AlertTriangle, ListFilter, ClipboardList } from 'lucide-react';
import POTab from './POTab';
import RestockTab from './RestockTab';
import { ManualRestockTab, IncidentReportTab } from './LogisticsTabs';
import AuditTab from './AuditTab';
import { Incident } from '../types';

const RunnerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'PO' | 'RESTOCK' | 'MANUAL' | 'INCIDENT' | 'AUDIT'>('PO');
    const [incidentData, setIncidentData] = useState<Partial<Incident> | null>(null);

    const handleTriggerIncident = (data: Partial<Incident>) => {
        setIncidentData(data);
        setActiveTab('INCIDENT');
    };

    const tabs = [
        { id: 'PO', label: 'Purchase Orders', icon: Package, color: 'text-blue-400' },
        { id: 'RESTOCK', label: 'Restock Tasks', icon: Truck, color: 'text-yellow-400' },
        { id: 'MANUAL', label: 'Manual Entry', icon: ListFilter, color: 'text-orange-400' },
        { id: 'INCIDENT', label: 'Report Incident', icon: AlertTriangle, color: 'text-red-400' },
        { id: 'AUDIT', label: 'Stock Audit', icon: ClipboardCheck, color: 'text-purple-400' },
    ];

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full pb-20">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#1a1d31]/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Truck className="text-blue-400" size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Logistics & Fulfillment</h2>
                            <p className="text-blue-400/60 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Operational Tactical Dashboard
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-black/20 px-6 py-3 rounded-2xl border border-white/5 text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Tasks</div>
                        <div className="text-2xl font-black text-white">12</div>
                    </div>
                    <div className="bg-black/20 px-6 py-3 rounded-2xl border border-white/5 text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Efficiency</div>
                        <div className="text-2xl font-black text-green-400">98%</div>
                    </div>
                </div>
            </div>

            {/* Premium Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-[#1a1d31]/60 backdrop-blur-md rounded-2xl border border-white/5 sticky top-4 z-50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as any);
                            if (tab.id !== 'INCIDENT') setIncidentData(null);
                        }}
                        className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-white/10 text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-white/10'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className={activeTab === tab.id ? tab.color : 'text-gray-600'} size={18} />
                        <span className="text-sm whitespace-nowrap">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 min-h-[600px]">
                {activeTab === 'PO' && <POTab onTriggerIncident={handleTriggerIncident} />}
                {activeTab === 'RESTOCK' && <RestockTab />}
                {activeTab === 'MANUAL' && <ManualRestockTab />}
                {activeTab === 'INCIDENT' && <IncidentReportTab initialData={incidentData || undefined} />}
                {activeTab === 'AUDIT' && <AuditTab />}
            </div>

            {/* Performance Footer */}
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">API: Operational</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Inventory Sync: Active</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter opacity-50">
                    <ClipboardList size={12} />
                    Agartha Logistics Protocol v4.2.0
                </div>
            </div>
        </div>
    );
};

export default RunnerDashboard;
