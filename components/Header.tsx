import React, { useState, useEffect } from 'react';
import { Clock, Menu } from 'lucide-react';

import { StaffMember, AppMode } from '../types';

interface HeaderProps {
  isOnShift: boolean;
  staff?: StaffMember;
  onMenuToggle?: () => void;
  appMode: AppMode;
}

const Header: React.FC<HeaderProps> = ({ isOnShift, staff, onMenuToggle, appMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-[#1a1d29] border-b border-[#2d3142] flex items-center justify-between px-4 md:px-6 shrink-0 relative z-20">
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="flex items-center gap-3">
          <svg
            className="h-8 w-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
            viewBox="0 0 44.51 42.38"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="currentColor" d="M28.76.2c21.05,8.29,21.12,34.66-.48,42.1-.74.25-1.55-.15-1.79-.9-.24-.72.13-1.5.83-1.77,3.75-1.48,7.1-3.9,9.45-7.03,7.87-10.31,1.76-23.46-9.93-27.07-3.62-1.32-1.72-6.62,1.92-5.33h0Z" />
            <path fill="currentColor" d="M16.23,42.3C-5.38,34.85-5.28,8.49,15.75.2c1.46-.58,3.11.14,3.68,1.61.59,1.51-.22,3.23-1.76,3.73-3.6,1.18-6.93,3.28-9.38,6.14-5.2,5.78-5.42,14.81-.55,20.94,2.36,3.12,5.71,5.55,9.45,7.03,1.68.67.77,3.22-.96,2.67h0Z" />
          </svg>
        </div>
        <div className="hidden sm:block h-6 w-px bg-[#2d3142] mx-2" />
        <p className="hidden sm:block text-xs text-gray-400 uppercase tracking-widest font-semibold pt-0.5">
          {appMode === 'OPS' ? 'Operations' :
            appMode === 'INTERNAL_MAINTENANCE' ? 'Maintenance' :
              appMode === 'SERVICE_CREW' ? 'Service' :
                appMode === 'SECURITY_CREW' ? 'Security' :
                  appMode === 'HEALTH_CREW' ? 'Health & Medical' :
                    appMode === 'CLEANING_CREW' ? 'Cleaning' : 'Portal'}
        </p>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 text-gray-400 text-sm font-mono hidden lg:flex">
          <Clock size={16} />
          <span>
            {currentTime.toLocaleDateString()} &nbsp;
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className={`flex items-center gap-2 bg-[#2d3142] px-3 py-1.5 rounded-full border transition-colors duration-500 ${isOnShift ? 'border-yellow-400/20' : 'border-gray-600/30'}`}>
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isOnShift ? 'bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-gray-500'}`} />
          <span className={`text-xs font-bold tracking-wider transition-colors duration-500 ${isOnShift ? 'text-yellow-400' : 'text-gray-400'}`}>
            {isOnShift ? 'ON SHIFT' : 'OFF'}
          </span>
          {staff && <span className="text-gray-500 text-xs hidden sm:inline">| ID: {staff.staff_id}</span>}
        </div>
      </div>
    </header>
  );
};

export default Header;