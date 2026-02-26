import React from 'react';
import { AlertCircle, Megaphone } from 'lucide-react';
import { Alert, StaffMember } from '../types';

interface BroadcastsProps {
  alerts: Alert[];
  staff: StaffMember;
  onAcknowledge: (alert: Alert) => void;
}

const Broadcasts: React.FC<BroadcastsProps> = ({ alerts, staff, onAcknowledge }) => {
  const redAlerts = alerts.filter(a => a.severity === 'high' || a.severity === 'critical' || a.alert_type === 'health_pulse');
  const generalAnnouncements = alerts.filter(a => !redAlerts.includes(a));

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-6 mb-6">
      {/* Red Alerts Section */}
      {redAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest px-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Active System Operations
          </h3>
          <div className="grid gap-3">
            {redAlerts.map(alert => {
              const isHealthPulse = alert.alert_type === 'health_pulse';
              return (
                <div
                  key={alert.id}
                  className={`relative overflow-hidden bg-[#2d3142] border border-red-500/30 rounded-xl p-4 md:p-5 flex items-start gap-4 transition-all shadow-lg animate-pulse-subtle`}
                >
                  <div className="bg-red-500/10 p-2.5 rounded-lg text-red-500 shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-widest truncate">
                        {isHealthPulse ? 'HEALTH PULSE • ' : ''}{alert.severity} Priority • {alert.zone_name || 'Global'}
                      </span>
                      <span className="text-xs text-red-400/60 font-mono">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{alert.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* General Announcements Section */}
      {generalAnnouncements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
            General Bulletins
          </h3>
          <div className="grid gap-3">
            {generalAnnouncements.map(alert => {
              return (
                <div
                  key={alert.id}
                  className={`bg-[#2d3142] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-start gap-4 transition-all hover:bg-[#343a4f]`}
                >
                  <div className={`p-2.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 self-start`}>
                    <Megaphone size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1.5">
                      <span className={`text-xs font-bold uppercase tracking-widest text-blue-400/80 truncate`}>
                        {alert.zone_name || 'Global Update'}
                      </span>
                      <span className={`text-xs text-gray-500 font-mono`}>
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-gray-300 text-sm leading-relaxed`}>{alert.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Broadcasts;
