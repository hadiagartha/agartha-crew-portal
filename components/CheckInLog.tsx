import React, { useState } from 'react';
import { Search, Filter, Clock, AlertTriangle, CheckCircle2, User, MapPin, Download } from 'lucide-react';
import { CheckInRecord } from '../types';

interface CheckInLogProps {
  logs: CheckInRecord[];
}

const CheckInLog: React.FC<CheckInLogProps> = ({ logs }) => {
  const [filter, setFilter] = useState('');

  // Filter logs based on search
  const filteredLogs = logs.filter(log => 
    log.name.toLowerCase().includes(filter.toLowerCase()) || 
    log.staffId.toLowerCase().includes(filter.toLowerCase()) ||
    log.zone.toLowerCase().includes(filter.toLowerCase())
  );

  // Calculate Stats
  const totalEntries = filteredLogs.length;
  const lateCount = filteredLogs.filter(l => l.status === 'LATE').length;
  const onTimeCount = totalEntries - lateCount;
  const latePercentage = totalEntries > 0 ? Math.round((lateCount / totalEntries) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#1a1d29] overflow-hidden">
      
      {/* Header & Stats */}
      <div className="p-4 md:p-8 pb-4 border-b border-[#2d3142] shrink-0">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Staff Check-In Log</h2>
              <p className="text-gray-400 text-sm">Attendance history and zone assignment tracking</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2d3142] border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors text-sm font-bold w-full md:w-auto justify-center">
               <Download size={16} /> Export CSV
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Shifts */}
            <div className="bg-[#2d3142] p-4 rounded-xl border border-white/5 shadow-lg flex items-center justify-between">
               <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Shifts Logged</p>
                  <div className="text-2xl font-bold text-white font-mono">{totalEntries}</div>
               </div>
               <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Clock size={20} />
               </div>
            </div>

            {/* On Time */}
            <div className="bg-[#2d3142] p-4 rounded-xl border border-white/5 shadow-lg flex items-center justify-between">
               <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">On Time Arrivals</p>
                  <div className="text-2xl font-bold text-green-400 font-mono">{onTimeCount}</div>
               </div>
               <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                  <CheckCircle2 size={20} />
               </div>
            </div>

            {/* Late Stats */}
            <div className="bg-[#2d3142] p-4 rounded-xl border border-red-500/20 shadow-lg flex items-center justify-between relative overflow-hidden">
               <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
               <div className="relative z-10">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Total Late Arrivals</p>
                  <div className="flex items-baseline gap-2">
                     <div className="text-2xl font-bold text-red-500 font-mono">{lateCount}</div>
                     <span className="text-xs text-red-400/70 font-bold">({latePercentage}%)</span>
                  </div>
               </div>
               <div className="relative z-10 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle size={20} />
               </div>
            </div>
         </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row gap-4 shrink-0">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
               type="text" 
               placeholder="Search by name, ID, or zone..." 
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="w-full bg-[#2d3142] border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:border-yellow-400 transition-colors"
            />
         </div>
         <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2d3142] border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors text-sm w-full md:w-auto">
            <Filter size={16} /> Filter
         </button>
      </div>

      {/* Table & Cards */}
      <div className="flex-1 md:overflow-y-auto px-4 md:px-8 pb-8">
         {/* Desktop Table */}
         <div className="hidden md:block bg-[#2d3142] rounded-xl border border-white/5 overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
               <thead>
                  <tr className="bg-[#1a1d29] text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-700">
                     <th className="p-4">Staff Member</th>
                     <th className="p-4">Assigned Zone</th>
                     <th className="p-4">Date</th>
                     <th className="p-4">Check-In</th>
                     <th className="p-4">Check-Out</th>
                     <th className="p-4 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-700/50">
                  {filteredLogs.map((log) => (
                     <tr key={log.id} className="hover:bg-[#343a4f] transition-colors group">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#1a1d29] border border-gray-600 flex items-center justify-center text-gray-400">
                                 <User size={14} />
                              </div>
                              <div>
                                 <div className="text-white font-bold text-sm">{log.name}</div>
                                 <div className="text-gray-500 text-xs font-mono">{log.staffId}</div>
                              </div>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <MapPin size={14} className="text-gray-500" />
                              {log.zone}
                           </div>
                        </td>
                        <td className="p-4 text-gray-300 text-sm font-mono">{log.date}</td>
                        <td className={`p-4 text-sm font-mono font-bold ${log.status === 'LATE' ? 'text-red-400' : 'text-green-400'}`}>
                           {log.checkInTime}
                        </td>
                        <td className="p-4 text-gray-400 text-sm font-mono">
                           {log.checkOutTime || '--:--'}
                        </td>
                        <td className="p-4 text-right">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                              ${log.status === 'LATE' 
                                 ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                                 : 'bg-green-500/10 text-green-500 border border-green-500/20'}
                           `}>
                              {log.status === 'LATE' && <AlertTriangle size={10} />}
                              {log.status}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            
            {filteredLogs.length === 0 && (
               <div className="p-12 text-center text-gray-500 text-sm">
                  No records found matching your search.
               </div>
            )}
         </div>

         {/* Mobile Cards */}
         <div className="md:hidden space-y-4">
            {filteredLogs.map((log) => (
               <div key={log.id} className="bg-[#2d3142] rounded-xl border border-white/5 p-4 shadow-lg space-y-4">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1a1d29] border border-gray-600 flex items-center justify-center text-gray-400">
                           <User size={18} />
                        </div>
                        <div>
                           <div className="text-white font-bold text-sm">{log.name}</div>
                           <div className="text-gray-500 text-[10px] font-mono">{log.staffId}</div>
                        </div>
                     </div>
                     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                        ${log.status === 'LATE' 
                           ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                           : 'bg-green-500/10 text-green-500 border border-green-500/20'}
                     `}>
                        {log.status}
                     </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700/50">
                     <div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Zone</div>
                        <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                           <MapPin size={12} className="text-gray-500" />
                           {log.zone}
                        </div>
                     </div>
                     <div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Date</div>
                        <div className="text-gray-300 text-xs font-mono">{log.date}</div>
                     </div>
                     <div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Check-In</div>
                        <div className={`text-xs font-mono font-bold ${log.status === 'LATE' ? 'text-red-400' : 'text-green-400'}`}>
                           {log.checkInTime}
                        </div>
                     </div>
                     <div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Check-Out</div>
                        <div className="text-gray-400 text-xs font-mono">
                           {log.checkOutTime || '--:--'}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
            {filteredLogs.length === 0 && (
               <div className="p-12 text-center text-gray-500 text-sm">
                  No records found matching your search.
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default CheckInLog;