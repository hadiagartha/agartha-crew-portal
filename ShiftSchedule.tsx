import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Coffee } from 'lucide-react';

const ShiftSchedule: React.FC = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Simulated Calendar Data with breaks
  const calendarData = [
    { day: 1, type: 'OFF' },
    { day: 2, type: 'OFF' },
    { day: 3, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: 4, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: 5, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: 6, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: 7, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    
    { day: 8, type: 'OFF' },
    { day: 9, type: 'OFF' },
    { day: 10, type: 'SHIFT', start: '14:00', end: '22:00', zone: 'Z-02', breakTime: '18:00-18:30' },
    { day: 11, type: 'SHIFT', start: '14:00', end: '22:00', zone: 'Z-02', breakTime: '18:00-18:30' },
    { day: 12, type: 'SHIFT', start: '14:00', end: '22:00', zone: 'Z-02', breakTime: '18:00-18:30' },
    { day: 13, type: 'SHIFT', start: '14:00', end: '22:00', zone: 'Z-02', breakTime: '18:00-18:30' },
    { day: 14, type: 'SHIFT', start: '14:00', end: '22:00', zone: 'Z-02', breakTime: '18:00-18:30', isToday: true }, // Today
    
    { day: 15, type: 'OFF' },
    { day: 16, type: 'OFF' },
    { day: 17, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: 18, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: 19, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: 20, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: 21, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    
    { day: 22, type: 'OFF' },
    { day: 23, type: 'OFF' },
    { day: 24, type: 'SHIFT', start: '06:00', end: '14:00', zone: 'Z-01', breakTime: '10:00-10:30' },
    { day: 25, type: 'SHIFT', start: '06:00', end: '14:00', zone: 'Z-01', breakTime: '10:00-10:30' },
    { day: 26, type: 'SHIFT', start: '06:00', end: '14:00', zone: 'Z-01', breakTime: '10:00-10:30' },
    { day: 27, type: 'SHIFT', start: '06:00', end: '14:00', zone: 'Z-01', breakTime: '10:00-10:30' },
    { day: 28, type: 'SHIFT', start: '06:00', end: '14:00', zone: 'Z-01', breakTime: '10:00-10:30' },
    
    { day: 29, type: 'OFF' },
    { day: 30, type: 'OFF' },
    { day: 31, type: 'SHIFT', start: '08:00', end: '16:00', zone: 'Z-04', breakTime: '12:00-12:30' },
    { day: null, type: 'NEXT' }, // Padding
    { day: null, type: 'NEXT' },
    { day: null, type: 'NEXT' },
    { day: null, type: 'NEXT' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1a1d29] p-4 md:p-8 overflow-hidden">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 shrink-0 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Shift Roster</h2>
          <p className="text-gray-400 text-sm">October 2023</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center bg-[#2d3142] rounded-lg border border-[#3e445b] p-1">
            <button className="p-2 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 text-sm font-bold text-white min-w-[80px] text-center">October</span>
            <button className="p-2 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <button className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-yellow-400/20 transition-all">
            <CalendarIcon size={16} /> <span className="hidden sm:inline">Today</span>
          </button>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 md:gap-6 mb-4 text-xs shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-gray-400">Standard Shift</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span className="text-gray-400">Evening Shift</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-[#2d3142] border border-gray-700"></div>
           <span className="text-gray-400">Day Off</span>
        </div>
      </div>

      {/* Calendar Grid & Mobile List */}
      <div className="flex-1 bg-[#2d3142] border border-white/5 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[400px]">
        {/* Desktop Calendar */}
        <div className="hidden md:block overflow-auto h-full">
            <div className="min-w-[700px] h-full flex flex-col">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-[#1a1d29] bg-[#2d3142]">
                {daysOfWeek.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {day}
                    </div>
                ))}
                </div>

                {/* Days Body */}
                <div className="grid grid-cols-7 grid-rows-5 flex-1 bg-[#1a1d29] gap-px border-l border-b border-[#1a1d29]">
                {calendarData.map((item, index) => {
                    // Visual styling based on shift type
                    const isOff = item.type === 'OFF';
                    const isToday = item.isToday;
                    const isShift = item.type === 'SHIFT';
                    const isNextMonth = item.type === 'NEXT';

                    if (isNextMonth) {
                    return <div key={index} className="bg-[#1a1d29] opacity-50" />;
                    }

                    return (
                    <div 
                        key={index} 
                        className={`relative p-2 flex flex-col transition-colors group
                        ${isToday ? 'bg-[#2d3142] ring-inset ring-1 ring-yellow-400' : 'bg-[#1a1d29] hover:bg-[#202433]'}
                        ${!isNextMonth ? 'border-[#2d3142]' : ''}
                        `}
                    >
                        {/* Day Number */}
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-sm font-medium ${isToday ? 'text-yellow-400 font-bold' : 'text-gray-500 group-hover:text-gray-300'}`}>
                            {item.day}
                            </span>
                            {isToday && (
                            <span className="text-[10px] bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#1a1d29] px-1.5 py-0.5 rounded font-bold uppercase">Today</span>
                            )}
                        </div>

                        {/* Shift Content */}
                        {isShift && (
                        <div className={`mt-auto p-2 rounded-lg border text-xs space-y-1.5 cursor-pointer hover:translate-y-[-2px] transition-transform
                            ${item.start === '14:00' 
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-200' 
                                : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'}
                        `}>
                            <div className="flex items-center gap-1.5 font-bold">
                                <Clock size={10} />
                                {item.start} - {item.end}
                            </div>
                            
                            {/* Break Time */}
                            <div className={`flex items-center gap-1.5 font-medium border-t border-dashed pt-1 mt-1 opacity-70 ${item.start === '14:00' ? 'border-blue-500/30' : 'border-yellow-400/30'}`}>
                                <Coffee size={10} />
                                {item.breakTime}
                            </div>

                            <div className={`flex items-center gap-1.5 opacity-80 pt-1 ${item.start === '14:00' ? 'text-blue-300' : 'text-yellow-200'}`}>
                                <MapPin size={10} />
                                {item.zone}
                            </div>
                        </div>
                        )}

                        {/* Off Day */}
                        {isOff && (
                        <div className="mt-auto h-full max-h-[60px] flex items-center justify-center rounded-lg border border-dashed border-[#2d3142]">
                            <span className="text-[#2d3142] group-hover:text-gray-600 text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-1 transition-colors">
                                <Coffee size={14} /> Off Duty
                            </span>
                        </div>
                        )}
                    </div>
                    );
                })}
                </div>
            </div>
        </div>

        {/* Mobile Shift List */}
        <div className="md:hidden p-4 space-y-4">
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Upcoming Shifts</div>
            {calendarData.filter(item => item.day !== null && item.type !== 'NEXT' && item.day >= (new Date().getDate() - 7)).map((item, index) => {
                const isToday = item.isToday;
                const isShift = item.type === 'SHIFT';
                const isOff = item.type === 'OFF';

                return (
                    <div 
                        key={index} 
                        className={`p-4 rounded-xl border transition-all ${
                            isToday ? 'bg-[#2d3142] border-yellow-400 shadow-lg' : 'bg-[#1a1d29] border-gray-700'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isToday ? 'bg-yellow-400 text-[#1a1d29]' : 'bg-[#2d3142] text-gray-400'}`}>
                                    {item.day}
                                </div>
                                <div className="text-xs font-bold text-white">
                                    {daysOfWeek[(index + 1) % 7]}, Oct {item.day}
                                </div>
                            </div>
                            {isToday && (
                                <span className="text-[9px] bg-yellow-400 text-[#1a1d29] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Today</span>
                            )}
                        </div>

                        {isShift ? (
                            <div className={`p-3 rounded-lg border ${
                                item.start === '14:00' 
                                    ? 'bg-blue-500/5 border-blue-500/20' 
                                    : 'bg-yellow-400/5 border-yellow-400/10'
                            }`}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-300">
                                        <Clock size={14} className="text-gray-500" />
                                        <span className="font-mono font-bold">{item.start} - {item.end}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-300">
                                        <MapPin size={14} className="text-gray-500" />
                                        <span className="font-bold">{item.zone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 col-span-2 border-t border-gray-700/50 pt-2 mt-1">
                                        <Coffee size={14} className="text-gray-500" />
                                        <span>Break: {item.breakTime}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-gray-500 py-2">
                                <Coffee size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Off Duty</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default ShiftSchedule;