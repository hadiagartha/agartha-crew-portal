import React from 'react';
import {
    MapPin,
    Wrench,
    ClipboardCheck,
    AlertTriangle,
    Calendar,
    Settings,
    Video,
    History,
    Megaphone,
    Coffee,
    Truck,
    ShieldAlert,
    HeartPulse,
    Sparkles,
    Package,
    Users,
    LayoutDashboard,
    ClipboardList,
    PackageOpen,
    RefreshCcw,
    Trash2
} from 'lucide-react';
import { View, AppMode, allowedViewsForMode } from '../types';

interface HomeProps {
    appMode: AppMode;
    onViewChange: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ appMode, onViewChange }) => {
    const allowedViews = allowedViewsForMode(appMode).filter(view => view !== View.HOME);

    const allWidgets: { id: View; label: string; icon: any; color: string; bg: string }[] = [
        { id: View.ZONE_CHECK_IN, label: 'Zone Check-In', icon: MapPin, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: View.SERVICE_DASHBOARD, label: 'Service Dashboard', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { id: View.FNB_POS_LITE, label: 'POS-Lite', icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { id: View.FNB_STOCK_STATUS, label: 'Stock Status', icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: View.FNB_RESTOCK_REQUESTS, label: 'Restock Requests', icon: Truck, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { id: View.FNB_WASTE_LOG, label: 'Waste Log', icon: Trash2, color: 'text-red-400', bg: 'bg-red-400/10' },
        { id: View.FNB_PREP_BATCHES, label: 'Prep Batches', icon: RefreshCcw, color: 'text-green-400', bg: 'bg-green-400/10' },

        { id: View.LOGISTICS_PO, label: 'Purchase Orders (Inbound)', icon: Truck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: View.LOGISTICS_RESTOCK, label: 'Dispatch Queue', icon: Package, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { id: View.LOGISTICS_MANUAL, label: 'Manual Restock', icon: PackageOpen, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { id: View.LOGISTICS_INCIDENT, label: 'Report Incident', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10' },
        { id: View.LOGISTICS_AUDIT, label: 'Stock Counting (Audit)', icon: ClipboardList, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { id: View.SECURITY_DASHBOARD, label: 'Security Tactical', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10' },
        { id: View.HEALTH_DASHBOARD, label: 'Medical Triage', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { id: View.EXPERIENCE_DASHBOARD, label: 'Experience Control', icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { id: View.CLEANING_RESPONSE_QUEUE, label: 'Response Queue', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
        { id: View.CLEANING_MEDICAL_LOG, label: 'Medical Incident Log', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { id: View.CLEANING_STOCK, label: 'Consumable Tracking', icon: ClipboardList, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { id: View.CLEANING_RESTOCK, label: 'Supply Restock', icon: PackageOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: View.CLEANING_AUDIT, label: 'Hygiene Audit', icon: ShieldAlert, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { id: View.DAILY_CHECKLIST, label: 'Daily Checklist', icon: ClipboardCheck, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { id: View.ZONE_SURVEILLANCE, label: 'Zone Surveillance', icon: Video, color: 'text-slate-400', bg: 'bg-slate-400/10' },
        { id: View.INCIDENTS, label: 'Incidents', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { id: View.SHIFT_SCHEDULE, label: 'Shift Schedule', icon: Calendar, color: 'text-sky-400', bg: 'bg-sky-400/10' },
        { id: View.MAINTENANCE_LOG, label: 'Maintenance Tactical', icon: Wrench, color: 'text-teal-400', bg: 'bg-teal-400/10' },
        { id: View.MAINTENANCE_MANAGER_DASHBOARD, label: 'Maintenance Command', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
        { id: View.CHECK_IN_LOG, label: 'Check-In Log', icon: History, color: 'text-gray-400', bg: 'bg-gray-400/10' },
        { id: View.RETAIL_RECEIVING, label: 'Inbound Shipments', icon: Truck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { id: View.RETAIL_STATUS, label: 'Availability', icon: Package, color: 'text-pink-400', bg: 'bg-pink-400/10' },
        { id: View.RETAIL_RESTOCK, label: 'Restock Requests', icon: PackageOpen, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { id: View.RETAIL_DAMAGE_LOG, label: 'Damage Log', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
        { id: View.RETAIL_AUDIT, label: 'Cycle Counts', icon: ClipboardList, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { id: View.EXTERNAL_MAINTENANCE_DASHBOARD, label: 'Vendor Portal', icon: Wrench, color: 'text-lime-400', bg: 'bg-lime-400/10' },
        { id: View.ANNOUNCEMENTS, label: 'Announcements', icon: Megaphone, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { id: View.SETTINGS, label: 'Settings', icon: Settings, color: 'text-gray-300', bg: 'bg-gray-300/10' },
    ];

    const filteredWidgets = allWidgets.filter(widget => allowedViews.some(v => v === widget.id));

    const getWelcomeMessage = () => {
        switch (appMode) {
            case 'INTERNAL_MAINTENANCE': return 'Maintenance Systems Online';
            case 'SERVICE_CREW': return 'Service Portal Active';
            case 'SECURITY_CREW': return 'Security Protocol Engaged';
            case 'HEALTH_CREW': return 'Medical Systems Ready';
            case 'CLEANING_CREW': return 'Sanitation Specialist Portal';
            case 'FNB': return 'F&B Operations Command';
            case 'RUNNER': return 'Logistics Runner Hub';
            case 'EXPERIENCE_CREW': return 'Experience Control Center';
            case 'GIFTSHOP_CREW': return 'Gift Shop Crew Hub';
            default: return 'Welcome back, explorer';
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 h-full animate-fadeIn overflow-y-auto hide-scrollbar">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-4">
                    <LayoutDashboard className="text-yellow-400 w-10 h-10" />
                    {getWelcomeMessage()}
                </h1>
                <p className="text-gray-400 text-lg">Select a module to begin your operations.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filteredWidgets.map((widget) => (
                    <button
                        key={widget.id}
                        onClick={() => onViewChange(widget.id)}
                        className="group relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl bg-[#2d3142]/40 border border-white/5 hover:border-yellow-400/50 hover:bg-[#2d3142]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/10"
                    >
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${widget.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <widget.icon className={`${widget.color} w-5 h-5 md:w-6 md:h-6`} />
                        </div>
                        <span className="text-white font-bold text-xs md:text-sm text-center group-hover:text-yellow-400 transition-colors uppercase tracking-wider">
                            {widget.label}
                        </span>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
