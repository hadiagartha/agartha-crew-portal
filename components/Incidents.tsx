import React, { useState } from 'react';
import { AlertTriangle, Send, List, Plus, Search, Filter, MoreHorizontal, Clock, User, X, FileText, Activity } from 'lucide-react';
import { IncidentSeverity, Incident } from '../types';

interface IncidentsProps {
  incidents: Incident[];
  onAddIncident: (incident: Incident) => void;
  onUpdateIncidentStatus: (id: string, status: Incident['status']) => void;
  defaultTab?: 'REPORT' | 'LOG';
}

const Incidents: React.FC<IncidentsProps> = ({ incidents, onAddIncident, onUpdateIncidentStatus, defaultTab }) => {
  const [activeTab, setActiveTab] = useState<'REPORT' | 'LOG'>(defaultTab ?? 'REPORT');
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Update active tab if defaultTab changes
  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);
  
  // Form State
  const [severity, setSeverity] = useState<IncidentSeverity>(IncidentSeverity.LOW);
  const [type, setType] = useState('Creature Malfunction');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!description.trim()) return;

    const newIncident: Incident = {
      id: `INC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      timestamp: new Date(),
      type,
      severity,
      description,
      status: 'OPEN',
      reportedBy: '8842-A'
    };

    onAddIncident(newIncident);
    setActiveTab('LOG');
    setOpenActionId(null);
    
    // Reset form
    setDescription('');
    setSeverity(IncidentSeverity.LOW);
    setType('Creature Malfunction');
  };

  const toggleAction = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionId(prev => prev === id ? null : id);
  };

  const getSeverityColor = (sev: IncidentSeverity) => {
    switch (sev) {
      case IncidentSeverity.HIGH: return 'text-[#ff4757] bg-[#ff4757]/10 border-[#ff4757]/20';
      case IncidentSeverity.MEDIUM: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case IncidentSeverity.LOW: return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-blue-400 bg-blue-400/10';
      case 'INVESTIGATING': return 'text-yellow-500 bg-yellow-500/10';
      case 'RESOLVED': return 'text-gray-400 bg-gray-500/10';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub Header / Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-8 py-6 border-b border-[#2d3142] shrink-0 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Incidents & Safety</h2>
        <div className="flex bg-[#1a1d29] p-1 rounded-lg border border-[#2d3142] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('REPORT')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'REPORT' ? 'bg-[#2d3142] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Plus size={16} /> Report New
          </button>
          <button
            onClick={() => setActiveTab('LOG')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'LOG' ? 'bg-[#2d3142] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <List size={16} /> Incident Log
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 flex-1">
        {activeTab === 'REPORT' ? (
          <div className="max-w-2xl mx-auto animate-fadeIn">
            <div className="bg-[#2d3142] p-4 md:p-6 rounded-xl border border-white/5 space-y-6 shadow-xl">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Incident Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#1a1d29] text-white border border-gray-700 rounded-lg p-3 outline-none focus:border-yellow-400"
                >
                  <option>Creature Malfunction</option>
                  <option>Zone System Failure</option>
                  <option>Safety Hazard</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                 <label className="block text-gray-400 text-sm mb-2">Severity Level</label>
                 <div className="flex flex-col sm:flex-row gap-2">
                   {[IncidentSeverity.LOW, IncidentSeverity.MEDIUM, IncidentSeverity.HIGH].map((lvl) => (
                     <button
                       key={lvl}
                       onClick={() => setSeverity(lvl)}
                       className={`flex-1 py-3 rounded-lg font-bold border transition-all ${
                         severity === lvl 
                          ? lvl === IncidentSeverity.HIGH ? 'bg-[#ff4757] border-[#ff4757] text-white' : lvl === IncidentSeverity.MEDIUM ? 'bg-yellow-500 border-yellow-500 text-[#1a1d29]' : 'bg-green-500 border-green-500 text-[#1a1d29]'
                          : 'bg-[#1a1d29] border-gray-700 text-gray-400 hover:border-gray-500'
                       }`}
                     >
                       {lvl}
                     </button>
                   ))}
                 </div>
                 {severity === IncidentSeverity.HIGH && (
                   <div className="mt-2 text-[#ff4757] text-xs flex items-center gap-2 animate-pulse">
                     <AlertTriangle size={12} /> High severity triggers immediate alert to Operations Dashboard.
                   </div>
                 )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1a1d29] text-white border border-gray-700 rounded-lg p-3 outline-none focus:border-yellow-400" 
                  placeholder="Describe the incident details..."
                />
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full bg-[#ff4757] hover:bg-[#e84142] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={18} /> Submit Report
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto animate-fadeIn pb-24">
             {/* Filter Bar */}
             <div className="flex flex-col sm:flex-row gap-4 mb-6">
               <div className="flex-1 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search ID, type, or description..." 
                   className="w-full pl-10 pr-4 py-2.5 bg-[#2d3142] border border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none"
                 />
               </div>
               <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2d3142] border border-gray-700 rounded-lg text-gray-300 hover:text-white">
                 <Filter size={18} /> Filter
               </button>
             </div>

             {/* Desktop Table View */}
             <div className="hidden md:block bg-[#2d3142] rounded-xl border border-white/5 shadow-lg relative overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[800px]">
                 <thead>
                   <tr className="bg-[#1a1d29] text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                     <th className="p-4 font-medium rounded-tl-xl">Incident ID</th>
                     <th className="p-4 font-medium">Timestamp</th>
                     <th className="p-4 font-medium">Type</th>
                     <th className="p-4 font-medium">Severity</th>
                     <th className="p-4 font-medium">Status</th>
                     <th className="p-4 font-medium">Staff</th>
                     <th className="p-4 font-medium rounded-tr-xl">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-700/50">
                   {incidents.map((inc) => (
                     <tr key={inc.id} className="hover:bg-[#343a4f] transition-colors group relative">
                       <td className="p-4 text-white font-mono text-sm font-medium">{inc.id}</td>
                       <td className="p-4 text-gray-300 text-sm">
                         <div className="flex items-center gap-2">
                           <Clock size={14} className="text-gray-500" />
                           {inc.timestamp.toLocaleDateString()} {inc.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                       </td>
                       <td className="p-4 text-white text-sm">{inc.type}</td>
                       <td className="p-4">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${getSeverityColor(inc.severity)}`}>
                           {inc.severity.toUpperCase()}
                         </span>
                       </td>
                       <td className="p-4">
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(inc.status)}`}>
                           <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                           {inc.status}
                         </span>
                       </td>
                       <td className="p-4 text-gray-400 text-sm">
                         <div className="flex items-center gap-2">
                            <User size={14} /> {inc.reportedBy}
                         </div>
                       </td>
                       <td className="p-4 relative">
                         <button 
                           onClick={(e) => toggleAction(inc.id, e)}
                           className={`p-1.5 rounded-lg transition-colors ${openActionId === inc.id ? 'bg-yellow-400 text-[#1a1d29]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                         >
                           <MoreHorizontal size={18} />
                         </button>
                         
                         {/* Dropdown / Popover for Description and Actions */}
                         {openActionId === inc.id && (
                           <div className="absolute right-10 top-0 z-50 w-80 bg-[#1a1d29] border border-yellow-400/30 rounded-xl shadow-2xl p-0 overflow-hidden animate-fadeIn backdrop-blur-sm">
                              <div className="bg-[#2d3142]/80 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                                <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                  <FileText size={12} className="text-yellow-400" /> Incident Details
                                </span>
                                <button onClick={() => setOpenActionId(null)} className="text-gray-400 hover:text-white transition-colors">
                                  <X size={14}/>
                                </button>
                              </div>
                              <div className="p-4">
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans text-wrap break-words">
                                  {inc.description}
                                </p>
                                
                                <div className="mt-4 pt-4 border-t border-gray-800">
                                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Update Status</div>
                                   <div className="flex gap-2">
                                     {(['OPEN', 'INVESTIGATING', 'RESOLVED'] as const).map((statusOption) => (
                                       <button
                                         key={statusOption}
                                         onClick={() => {
                                            onUpdateIncidentStatus(inc.id, statusOption);
                                            setOpenActionId(null); 
                                         }}
                                         className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-all ${
                                           inc.status === statusOption
                                             ? getStatusColor(statusOption) + ' border-transparent ring-1 ring-white/20'
                                             : 'bg-[#1a1d29] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                                         }`}
                                       >
                                         {statusOption}
                                       </button>
                                     ))}
                                   </div>
                                </div>
                              </div>
                           </div>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {incidents.length === 0 && (
                 <div className="p-8 text-center text-gray-500">
                   No incidents found.
                 </div>
               )}
             </div>

             {/* Mobile Card View */}
             <div className="md:hidden space-y-4">
                {incidents.map((inc) => (
                  <div key={inc.id} className="bg-[#2d3142] rounded-xl border border-white/5 p-4 shadow-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-mono text-sm font-bold">{inc.id}</div>
                        <div className="text-gray-500 text-[10px] flex items-center gap-1 mt-1">
                          <Clock size={10} />
                          {inc.timestamp.toLocaleDateString()} {inc.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityColor(inc.severity)}`}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-white text-sm font-medium">{inc.type}</div>
                    <p className="text-gray-400 text-xs line-clamp-3">{inc.description}</p>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(inc.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                        {inc.status}
                      </span>
                      <button 
                        onClick={(e) => toggleAction(inc.id, e)}
                        className="text-yellow-400 text-xs font-bold uppercase tracking-widest"
                      >
                        Details & Actions
                      </button>
                    </div>

                    {/* Mobile Details Modal-like Overlay */}
                    {openActionId === inc.id && (
                      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-[#1a1d29] w-full max-w-sm rounded-2xl border border-yellow-400/30 shadow-2xl overflow-hidden">
                          <div className="bg-[#2d3142] px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                            <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                              <FileText size={12} className="text-yellow-400" /> Incident Details
                            </span>
                            <button onClick={() => setOpenActionId(null)} className="text-gray-400 hover:text-white">
                              <X size={18}/>
                            </button>
                          </div>
                          <div className="p-6 space-y-6">
                            <div>
                              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Description</div>
                              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {inc.description}
                              </p>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-800">
                               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3">Update Status</div>
                               <div className="grid grid-cols-3 gap-2">
                                 {(['OPEN', 'INVESTIGATING', 'RESOLVED'] as const).map((statusOption) => (
                                   <button
                                     key={statusOption}
                                     onClick={() => {
                                        onUpdateIncidentStatus(inc.id, statusOption);
                                        setOpenActionId(null); 
                                     }}
                                     className={`py-2 rounded text-[10px] font-bold border transition-all ${
                                       inc.status === statusOption
                                         ? getStatusColor(statusOption) + ' border-transparent ring-1 ring-white/20'
                                         : 'bg-[#1a1d29] border-gray-700 text-gray-400'
                                     }`}
                                   >
                                     {statusOption}
                                   </button>
                                 ))}
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {incidents.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No incidents found.
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;