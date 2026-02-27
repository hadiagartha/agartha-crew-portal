import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  CheckCircle,
  Loader2,
  Camera,
  Phone,
  MapPin,
  LogOut,
  AlertOctagon,
  Timer,
  Clock
} from 'lucide-react';
import { View } from '../types';

interface ZoneCheckInProps {
  onViewChange: (view: View) => void;
  isOnShift: boolean;
  onCheckInComplete: (timestamp: Date) => void;
  onCheckOutComplete: () => void;
}

const ZoneCheckIn: React.FC<ZoneCheckInProps> = ({ onViewChange, isOnShift, onCheckInComplete, onCheckOutComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Real-time Clock State
  const [now, setNow] = useState(new Date());

  // Define Shift Schedule: 08:00 AM to 05:00 PM
  const shiftStartTime = new Date();
  shiftStartTime.setHours(8, 0, 0, 0);

  const shiftEndTime = new Date();
  shiftEndTime.setHours(17, 0, 0, 0);

  // Late Logic
  const isLateStart = now > shiftStartTime;

  // Mock Refs for simulation
  const scanIntervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Update time every second
    timerRef.current = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  // Reset steps when not on shift
  useEffect(() => {
    if (!isOnShift) {
      setCurrentStep(1);
    }
  }, [isOnShift]);

  const steps = [
    'Permission',
    'Scan QR',
    'Verify',
    'Type Check',
    'Update',
    'Confirm'
  ];

  const getTimerStatus = () => {
    const diff = shiftEndTime.getTime() - now.getTime();
    const isOvertime = diff < 0;
    const absDiff = Math.abs(diff);

    const hrs = Math.floor(absDiff / (1000 * 60 * 60));
    const mins = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((absDiff % (1000 * 60)) / 1000);

    const formatted = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    return { isOvertime, formatted };
  };

  const { isOvertime, formatted: timeDisplay } = getTimerStatus();

  const startScanning = () => {
    setIsCameraActive(true);
    setCurrentStep(2);

    // Simulate scanning progress
    setScanProgress(0);
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = window.setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanIntervalRef.current!);
          finishScanning();
          return 100;
        }
        return prev + 2; // Speed of scan
      });
    }, 50);
  };

  const finishScanning = () => {
    // Automatically progress through the system checks (steps 3, 4, 5)
    setTimeout(() => setCurrentStep(3), 500); // Verify
    setTimeout(() => setCurrentStep(4), 1500); // Type
    setTimeout(() => setCurrentStep(5), 2500); // Update
    setTimeout(() => {
      setCurrentStep(6); // Confirm
      setIsCameraActive(false);
      onCheckInComplete(new Date()); // Notify parent app with timestamp
    }, 3500);
  };

  const handleCheckOut = () => {
    setIsCheckingOut(true);
    // Simulate checkout network request
    setTimeout(() => {
      onCheckOutComplete();
      setIsCheckingOut(false);
    }, 2000);
  };

  // Render Functions for Different States
  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="flex flex-col items-center justify-center py-8 gap-6 text-center border border-dashed border-[#2d3142] rounded-xl bg-[#1a1d29]/50">
          <div className="w-16 h-16 bg-[#2d3142] rounded-full flex items-center justify-center">
            <Camera className="text-gray-400" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Camera Access Required</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              We need access to your camera to scan the Zone or Creature QR code for validation.
            </p>
          </div>
          <button
            onClick={startScanning}
            className="bg-[#2d3142] text-white border border-gray-600 px-6 py-2 rounded-lg font-medium hover:border-yellow-400 hover:text-yellow-400 transition-colors"
          >
            Grant Permission & Scan
          </button>
        </div>
      );
    }

    if (currentStep >= 2 && currentStep < 6) {
      return (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center border border-[#2d3142]">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>

          {/* Scanning Overlay */}
          <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 border-2 border-yellow-400 rounded-lg flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm shadow-[0_0_20px_rgba(250,204,21,0.2)]">
            <div className="absolute inset-x-0 h-0.5 bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)] animate-[scan_2s_ease-in-out_infinite] top-0" />
            <QrCode className="text-white/50" size={64} />
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-8">
            <div className="flex justify-between text-xs text-yellow-400 font-mono mb-2">
              <span>SCANNING...</span>
              <span>{Math.round(scanProgress)}%</span>
            </div>
            <div className="h-1 bg-[#2d3142] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-100 ease-linear"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            <div className="mt-4 flex flex-col gap-1">
              {currentStep >= 3 && <div className="text-xs text-green-400 flex items-center gap-2"><CheckCircle size={12} /> QR Code Validated</div>}
              {currentStep >= 4 && <div className="text-xs text-green-400 flex items-center gap-2"><CheckCircle size={12} /> Type: ZONE_MARKER_A4</div>}
              {currentStep >= 5 && <div className="text-xs text-green-400 flex items-center gap-2"><CheckCircle size={12} /> Staff Location Updated</div>}
            </div>
          </div>
        </div>
      );
    }

    // Fallback
    return null;
  };

  // View for Active Shift
  const renderActiveShiftPanel = () => {
    if (isCheckingOut) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
          <Loader2 className="animate-spin text-red-500" size={64} />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Ending Shift...</h2>
            <p className="text-gray-400">Syncing logs and deactivating credentials.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Zone Unlocked</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          You are currently checked into Zone 04. Your role-specific dashboard is active in the sidebar.
        </p>

        <div className="w-full max-w-sm bg-[#1a1d29] rounded-2xl p-6 border border-gray-700 shadow-xl mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 text-sm">Shift Start</span>
            <span className="font-mono text-white">08:00 AM</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 text-sm">Shift End</span>
            <span className="font-mono text-white">05:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Time Elapsed</span>
            <span className="font-mono text-yellow-400 font-bold">{timeDisplay}</span>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <p className="text-xs text-red-400/80 mb-3 font-bold uppercase tracking-widest">End of Shift Actions</p>
          <button
            onClick={handleCheckOut}
            className="w-full bg-[#1a1d29] hover:bg-red-500/10 text-red-400 hover:text-red-500 border border-red-500/30 hover:border-red-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group shadow-lg"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Scan Out / End Shift
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8">
      {/* LEFT COLUMN: Main Stepper or Active Dashboard */}
      <div className="flex-1 flex flex-col gap-8">

        {/* Render Stepper Header only if NOT on shift */}
        {!isOnShift && (
          <>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Zone Check-In</h2>
              <p className="text-sm md:text-base text-gray-400">Complete the validation sequence to begin your shift operations.</p>
            </div>

            {/* Compact Stepper UI */}
            <div className="flex items-center w-full justify-between px-2 overflow-x-auto pb-2">
              {steps.map((label, index) => {
                const stepNum = index + 1;
                const isCompleted = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 relative z-10 w-full min-w-[50px]">
                    {/* Connector Line */}
                    {index !== 0 && (
                      <div className={`absolute top-3 right-[50%] w-full h-[2px] -z-10 
                             ${isCompleted ? 'bg-yellow-500' : isCurrent ? 'bg-yellow-500' : 'bg-[#2d3142]'}`}
                      />
                    )}

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                          ${isCompleted ? 'bg-yellow-500 text-[#1a1d29]' : isCurrent ? 'bg-yellow-500 text-[#1a1d29] ring-4 ring-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-[#2d3142] text-gray-500'}
                        `}>
                      {isCompleted ? <CheckCircle size={14} /> : stepNum}
                    </div>
                    <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-wider block
                          ${isCurrent ? 'text-yellow-400' : 'text-gray-600'}
                        `}>{label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Dynamic Content Area */}
        <div className={`bg-[#2d3142] rounded-2xl p-4 md:p-8 shadow-xl border border-white/5 min-h-[400px] transition-all duration-500 ${isOnShift ? 'border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]' : ''}`}>
          {isOnShift ? renderActiveShiftPanel() : renderStepContent()}
        </div>

      </div>

      {/* RIGHT COLUMN: Info */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 order-first lg:order-last">

        {/* Assigned Zone Card */}
        <div className={`bg-[#2d3142] rounded-xl p-6 border shadow-lg relative overflow-hidden group transition-all duration-300
            ${isOnShift ? 'border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 'border-gray-700/50 grayscale opacity-80'}
        `}>
          <div className={`absolute top-0 right-0 text-[#1a1d29] text-[10px] font-bold px-2 py-1 rounded-bl-lg transition-colors
             ${isOnShift
              ? 'bg-gradient-to-l from-yellow-400 to-yellow-500'
              : isLateStart
                ? 'bg-red-500 text-white' // Late logic applied here
                : 'bg-gray-600 text-gray-300'
            }
          `}>
            {isOnShift ? 'ACTIVE ASSIGNMENT' : isLateStart ? 'LATE CHECK-IN' : 'PENDING CHECK-IN'}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className={`bg-[#1a1d29] p-3 rounded-lg border transition-colors ${isOnShift ? 'border-gray-700' : 'border-gray-800'}`}>
              <MapPin className={isOnShift ? 'text-yellow-400' : 'text-gray-600'} size={24} />
            </div>
            <div>
              <h3 className={`font-bold transition-colors ${isOnShift ? 'text-white' : 'text-gray-400'}`}>Zone 04</h3>
              <p className="text-gray-500 text-xs">Deep Caverns Sector</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-500">Shift Start</span>
              <span className={`font-mono ${isLateStart ? 'text-red-400 font-bold' : 'text-white'}`}>08:00 AM</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-500">Shift End</span>
              <span className="font-mono text-white">05:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Supervisor</span>
              <span className="text-white">M. Chen</span>
            </div>
          </div>

          <button className="w-full mt-5 bg-[#1a1d29] hover:bg-gray-800 border border-gray-700 text-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors">
            <Phone size={14} /> Contact Supervisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoneCheckIn;