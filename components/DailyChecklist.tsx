import React, { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { AppMode } from '../types';

interface DailyChecklistProps {
  appMode?: AppMode;
}

const DailyChecklist: React.FC<DailyChecklistProps> = ({ appMode }) => {
  const baseTasks = [
    'Inspect lighting system (Zone 4 Entry)',
    'Check audio output (Ambience emitters)',
    'Test RFID reader at Staff Gate A',
    'Verify positioning alignment (Leviathan-03)',
    'Test emergency exit lighting',
    'Verify Creature Containment Locks (Sector 4B)',
    'Calibrate Temperature Sensors',
    'Check Hydraulic Fluid Levels (Leviathan-03)',
    'Clear Ventilation Ducts of Debris',
    'Test Communication Intercoms',
    'Verify Safety Barrier Integrity',
    'Submit Morning Status Report'
  ];

  const fnbTasks = [
    'Calibrate Fridge Thermometers',
    'Sanitize Food Prep Surfaces',
    'Check Expiration Labels on Perishables',
    'Refill Sanitation Stations',
    'Verify Cash Register Float',
    'Test Inventory Scanner'
  ];

  const tasks = appMode === 'FNB' ? fnbTasks : baseTasks;

  // State to track indices of completed tasks
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const toggleTask = (index: number) => {
    setCompletedTasks(prev => {
      let newTasks;
      if (prev.includes(index)) {
        newTasks = prev.filter(i => i !== index);
      } else {
        newTasks = [...prev, index];
      }

      if (newTasks.length === tasks.length) {
        setShowPopup(true);
      }

      return newTasks;
    });
  };

  const markAllComplete = () => {
    // If all are already checked, do nothing or toggle off. 
    // Usually 'Mark All' implies filling them.
    if (completedTasks.length === tasks.length) {
      return;
    }
    setCompletedTasks(tasks.map((_, idx) => idx));
    setShowPopup(true);
  };

  const progress = Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <div className="relative p-4 md:p-8 md:h-full max-w-4xl mx-auto flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Daily Checklist</h2>
          <p className="text-sm md:text-base text-gray-400">Zone 04 - Deep Caverns</p>
        </div>
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-bold text-yellow-400 font-mono">{progress}%</div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Completion</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#2d3142] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-[#2d3142] rounded-xl overflow-hidden border border-white/5 flex-1 md:overflow-y-auto">
        {tasks.map((task, idx) => {
          const isChecked = completedTasks.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => toggleTask(idx)}
              className={`flex items-center p-4 border-b border-[#1a1d29] hover:bg-[#343a4f] transition-all cursor-pointer group select-none
                ${isChecked ? 'bg-[#343a4f]/50' : ''}
              `}
            >
              <div className={`w-6 h-6 rounded border mr-4 flex items-center justify-center shrink-0 transition-all duration-200
                ${isChecked
                  ? 'bg-yellow-400 border-yellow-400 text-[#1a1d29]'
                  : 'border-gray-500 group-hover:border-yellow-400 bg-[#1a1d29]'}
              `}>
                <Check size={16} className={`transition-transform duration-200 ${isChecked ? 'scale-100' : 'scale-0'}`} />
              </div>
              <span className={`text-sm md:text-base transition-colors duration-200 ${isChecked ? 'text-white font-medium line-through opacity-50' : 'text-gray-200'}`}>
                {task}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={markAllComplete}
          className="w-full md:w-auto bg-[#2d3142] text-gray-300 px-6 py-3 rounded-lg border border-gray-600 hover:text-[#1a1d29] hover:bg-yellow-400 hover:border-yellow-400 transition-all font-bold flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} />
          Mark All Complete
        </button>
      </div>

      {/* Completion Popup */}
      {showPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#1a1d29]/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
          <div className="bg-[#2d3142] border border-green-500/30 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform animate-in zoom-in-95 duration-300 scale-100">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">All Set!</h2>
            <p className="text-gray-400 mb-8 text-sm">Zone checklist verification complete. System logs updated.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full py-3 bg-green-500 hover:bg-green-400 text-[#1a1d29] font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyChecklist;