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
  X,
  Coffee,
  Truck,
  ShieldAlert,
  HeartPulse,
  Sparkles,
  Package,
  Lock,
  Users,
  LayoutDashboard,
  PackageOpen,
  ClipboardList,
  RefreshCcw,
  Trash2
} from 'lucide-react';
import { View, AppMode, allowedViewsForMode } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  appMode: AppMode;
  isOpen?: boolean;
  onClose?: () => void;
  isOnShift?: boolean;
  hasUnreadAnnouncements?: boolean; // New prop for notification dot
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, appMode, isOpen, onClose, isOnShift = true, hasUnreadAnnouncements = false }) => {
  const allowedViews = allowedViewsForMode(appMode);

  // Dashboards that require a shift check-in
  const shiftRequiredViews = [
    View.RUNNER_DASHBOARD,
    View.SECURITY_DASHBOARD,
    View.HEALTH_DASHBOARD,
    View.EXPERIENCE_DASHBOARD,
    View.CLEANING_DASHBOARD,
    View.GIFTSHOP_DASHBOARD,
    View.MAINTENANCE_LOG,
    View.SERVICE_DASHBOARD,
    View.LOGISTICS_PO,
    View.LOGISTICS_RESTOCK,
    View.LOGISTICS_MANUAL,
    View.LOGISTICS_INCIDENT,
    View.LOGISTICS_AUDIT,
    View.FNB_POS_LITE,
    View.FNB_STOCK_STATUS,
    View.FNB_RESTOCK_REQUESTS,
    View.FNB_WASTE_LOG,
    View.FNB_PREP_BATCHES,
    View.RETAIL_RECEIVING,
    View.RETAIL_STATUS,
    View.RETAIL_RESTOCK,
    View.RETAIL_DAMAGE_LOG,
    View.RETAIL_AUDIT
  ];

  const allNavItems = [
    { id: View.HOME, label: 'Home', icon: LayoutDashboard },
    { id: View.ZONE_CHECK_IN, label: 'Zone Check-In', icon: MapPin },
    { id: View.LOGISTICS_PO, label: 'Purchase Orders (Inbound)', icon: Truck },
    { id: View.LOGISTICS_RESTOCK, label: 'Dispatch Queue', icon: Package },
    { id: View.LOGISTICS_MANUAL, label: 'Manual Restock', icon: PackageOpen },
    { id: View.LOGISTICS_INCIDENT, label: 'Report Incident', icon: ShieldAlert },
    { id: View.LOGISTICS_AUDIT, label: 'Stock Counting (Audit)', icon: ClipboardList },
    { id: View.SERVICE_DASHBOARD, label: 'Service Dashboard', icon: Users },

    // F&B Specific Tabs
    { id: View.FNB_POS_LITE, label: 'POS-Lite (Fulfillment)', icon: Coffee },
    { id: View.FNB_STOCK_STATUS, label: 'Stock Status', icon: ClipboardList },
    { id: View.FNB_RESTOCK_REQUESTS, label: 'Restock Requests', icon: Truck },
    { id: View.FNB_WASTE_LOG, label: 'Waste Log', icon: Trash2 },
    { id: View.FNB_PREP_BATCHES, label: 'Prep Batches', icon: RefreshCcw },

    { id: View.SECURITY_DASHBOARD, label: 'Security Tactical', icon: ShieldAlert },
    { id: View.HEALTH_DASHBOARD, label: 'Medical Triage', icon: HeartPulse },
    { id: View.EXPERIENCE_DASHBOARD, label: 'Experience Control', icon: Sparkles },
    { id: View.CLEANING_DASHBOARD, label: 'Sanitation Command', icon: Sparkles },
    { id: View.DAILY_CHECKLIST, label: 'Daily Checklist', icon: ClipboardCheck },
    { id: View.ZONE_SURVEILLANCE, label: 'Zone Surveillance', icon: Video },
    { id: View.INCIDENTS, label: 'Incidents', icon: AlertTriangle },
    { id: View.SHIFT_SCHEDULE, label: 'Shift Schedule', icon: Calendar },
    { id: View.MAINTENANCE_LOG, label: 'Maintenance Tactical', icon: Wrench },
    { id: View.MAINTENANCE_MANAGER_DASHBOARD, label: 'Maintenance Command', icon: ShieldAlert },
    { id: View.CHECK_IN_LOG, label: 'Check-In Log', icon: History },
    { id: View.RETAIL_RECEIVING, label: 'Inbound Shipments', icon: Truck },
    { id: View.RETAIL_STATUS, label: 'Retail Status', icon: Package },
    { id: View.RETAIL_RESTOCK, label: 'Restock Requests', icon: PackageOpen },
    { id: View.RETAIL_DAMAGE_LOG, label: 'Damage & Return Log', icon: AlertTriangle },
    { id: View.RETAIL_AUDIT, label: 'Cycle Counts (Audit)', icon: ClipboardList },

    { id: View.EXTERNAL_MAINTENANCE_DASHBOARD, label: 'Vendor Portal', icon: Wrench },
    { id: View.ANNOUNCEMENTS, label: 'Announcements', icon: Megaphone },
    { id: View.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const filteredItems = allNavItems
    .filter(item => allowedViews.includes(item.id))
    .map(item => {
      // Dynamic relabeling based on mode
      if (appMode === 'SERVICE_CREW' && item.id === View.ZONE_CHECK_IN) {
        return { ...item, label: 'Ticket Validation' };
      }
      return item;
    });

  const getModeLabel = () => {
    switch (appMode) {
      case 'INTERNAL_MAINTENANCE': return 'Maintenance';
      case 'SERVICE_CREW': return 'Service';
      case 'SECURITY_CREW': return 'Security';
      case 'HEALTH_CREW': return 'Health & Medical';
      case 'CLEANING_CREW': return 'Sanitation Specialist';
      case 'FNB': return 'F&B Specialist';
      case 'RUNNER': return 'Logistics Runner';
      case 'EXPERIENCE_CREW': return 'Experience Lead';
      case 'GIFTSHOP_CREW': return 'Retail Specialist';
      default: return 'Staff Member';
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1a1d29] border-r border-[#2d3142]">
      <div className="flex items-center justify-between p-4 mb-2 md:mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-3">
          {getModeLabel()}
        </p>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 px-3 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = currentView === item.id;
          const isRestricted = shiftRequiredViews.includes(item.id) && !isOnShift;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isRestricted) {
                  // If restricted, selecting it will trigger the restricted overlay in App.tsx
                  onViewChange(item.id);
                } else {
                  onViewChange(item.id);
                }
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${isActive && !isRestricted
                ? 'bg-[#2d3142] text-yellow-400 shadow-lg shadow-black/20'
                : 'text-gray-400 hover:bg-[#2d3142]/50 hover:text-gray-200'
                } ${isRestricted ? 'opacity-50' : ''}`}
            >
              <item.icon
                size={20}
                className={isActive && !isRestricted ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-gray-500 group-hover:text-gray-300'}
              />
              <span className="font-medium text-sm">{item.label}</span>
              {isRestricted && (
                <Lock size={14} className="ml-auto text-gray-500" />
              )}
              {item.id === View.ANNOUNCEMENTS && hasUnreadAnnouncements && !isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse" />
              )}
              {isActive && !isRestricted && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1d29] transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex w-64 shrink-0 h-full">
        <SidebarContent />
      </nav>
    </>
  );
};

export default Sidebar;