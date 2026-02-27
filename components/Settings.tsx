import React, { useState } from 'react';
import { Bell, LogOut, Shield, Volume2, User, Layout } from 'lucide-react';
import { StaffMember, AppMode } from '../types';

interface SettingsProps {
   onLogout: () => void;
   staff: StaffMember;
   appMode: AppMode;
   onChangeMode: (mode: AppMode) => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, staff, appMode, onChangeMode }) => {
   const [notifications, setNotifications] = useState(true);
   const [sound, setSound] = useState(true);

   return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fadeIn md:h-full md:overflow-y-auto">
         <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
         <p className="text-gray-400 mb-8">Manage application preferences and account access.</p>

         <div className="space-y-6">
            {/* App Mode Section */}
            <div className="bg-[#2d3142] rounded-xl border border-white/5 overflow-hidden shadow-lg">
               <div className="p-4 border-b border-white/5 bg-[#343a4f]/50">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                     <Layout size={14} className="text-yellow-400" /> Application Mode
                  </h3>
               </div>
               <div className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <div className="text-white font-bold text-sm mb-1">Interface Mode</div>
                        <div className="text-xs text-gray-400">Switch between Operations and Maintenance views.</div>
                     </div>
                     <div className="flex bg-[#1a1d29] p-1 rounded-lg border border-gray-700">
                        <select
                           value={appMode}
                           onChange={(e) => onChangeMode(e.target.value as AppMode)}
                           className="bg-[#1a1d29] text-white border-none outline-none text-xs font-bold py-2 px-3 focus:ring-2 focus:ring-yellow-400/50 rounded cursor-pointer"
                        >

                           <option value="INTERNAL_MAINTENANCE">Internal Maintenance</option>
                           <option value="EXTERNAL_MAINTENANCE">External Vendor</option>
                           <option value="SERVICE_CREW">Service Crew</option>
                           <option value="SECURITY_CREW">Security Crew</option>
                           <option value="HEALTH_CREW">Health Crew</option>
                           <option value="CLEANING_CREW">Cleaning Crew</option>
                           <option value="FNB">F&B Crew</option>
                           <option value="RUNNER">Runner Crew</option>
                           <option value="EXPERIENCE_CREW">Experience Crew</option>
                           <option value="GIFTSHOP_CREW">Gift Shop Crew</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-[#2d3142] rounded-xl border border-white/5 overflow-hidden shadow-lg">
               <div className="p-4 border-b border-white/5 bg-[#343a4f]/50">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                     <Bell size={14} className="text-yellow-400" /> Notifications & Alerts
                  </h3>
               </div>
               <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between group">
                     <div>
                        <div className="text-white font-bold text-sm mb-1">Push Notifications</div>
                        <div className="text-xs text-gray-400">Receive real-time alerts for incidents and zone assignments.</div>
                     </div>
                     <button
                        onClick={() => setNotifications(!notifications)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none ring-2 ring-transparent focus:ring-yellow-400/20 ${notifications ? 'bg-yellow-400' : 'bg-gray-600'}`}
                     >
                        <div className={`w-4 h-4 rounded-full bg-[#1a1d29] shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                     </button>
                  </div>

                  <div className="h-px bg-white/5 w-full" />

                  <div className="flex items-center justify-between group">
                     <div>
                        <div className="text-white font-bold text-sm mb-1 flex items-center gap-2">Sound Effects</div>
                        <div className="text-xs text-gray-400">Play audio cues for scanner success and critical alerts.</div>
                     </div>
                     <button
                        onClick={() => setSound(!sound)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none ring-2 ring-transparent focus:ring-yellow-400/20 ${sound ? 'bg-yellow-400' : 'bg-gray-600'}`}
                     >
                        <div className={`w-4 h-4 rounded-full bg-[#1a1d29] shadow-md transform transition-transform duration-300 ${sound ? 'translate-x-6' : 'translate-x-0'}`} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Account Section */}
            <div className="bg-[#2d3142] rounded-xl border border-white/5 overflow-hidden shadow-lg">
               <div className="p-4 border-b border-white/5 bg-[#343a4f]/50">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                     <Shield size={14} className="text-yellow-400" /> Account
                  </h3>
               </div>
               <div className="p-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1a1d29] border border-gray-600 flex items-center justify-center text-gray-400">
                           <User size={24} />
                        </div>
                        <div>
                           <div className="text-white font-bold">{staff.name}</div>
                           <div className="text-xs text-gray-500 font-mono mt-0.5">
                              ID: {staff.staff_id} • {staff.role}
                              {staff.current_zone_id && ` • Zone ${staff.current_zone_id.replace('Z-', '')}`}
                           </div>
                        </div>
                     </div>
                     <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/50 rounded-lg transition-all font-bold text-sm group"
                     >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Log Out
                     </button>
                  </div>
               </div>
            </div>

            <div className="text-center pt-12 pb-6">
               <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                  Agartha World Operations System v2.4.1
               </div>
               <div className="text-[10px] text-gray-700 mt-1">
                  Secure connection established via node US-WEST-4
               </div>
            </div>
         </div>
      </div>
   );
};

export default Settings;