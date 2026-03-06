import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, Circle, Camera, AlertTriangle, Send, RefreshCw } from 'lucide-react';

interface ChecklistTask {
    id: string;
    text: string;
    isCompleted: boolean;
    requiresPhoto?: boolean;
    photoAttached?: boolean;
    notes?: string;
    category: string;
    isHighTraffic?: boolean;
}

const initialTasks: ChecklistTask[] = [
    // Restrooms
    { id: 't1', category: 'Restrooms', text: 'Restock Toilet Paper', isCompleted: false, isHighTraffic: true, requiresPhoto: true },
    { id: 't2', category: 'Restrooms', text: 'Sanitize High-Touch Surfaces', isCompleted: false, isHighTraffic: true, requiresPhoto: true },
    { id: 't3', category: 'Restrooms', text: 'Floor Mop', isCompleted: false, isHighTraffic: true, requiresPhoto: true },

    // Public Spaces
    { id: 't4', category: 'Public Spaces', text: 'Empty Trash Bins', isCompleted: false },
    { id: 't5', category: 'Public Spaces', text: 'Wipe Down Benches', isCompleted: false },
    { id: 't6', category: 'Public Spaces', text: 'Clear Debris from Pathways', isCompleted: false }
];

const CleaningDailyChecklistTab: React.FC = () => {
    const [tasks, setTasks] = useState<ChecklistTask[]>(initialTasks);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');
    const [showEscalationToast, setShowEscalationToast] = useState(false);
    const [showSyncToast, setShowSyncToast] = useState(false);

    // Calculate Progress
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Check if Restrooms category is complete
    useEffect(() => {
        const restroomTasks = tasks.filter(t => t.category === 'Restrooms');
        const allRestroomsDone = restroomTasks.length > 0 && restroomTasks.every(t => t.isCompleted);

        if (allRestroomsDone) {
            setShowSyncToast(true);
            const timer = setTimeout(() => setShowSyncToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [tasks]);

    const handleToggleTask = (id: string) => {
        setTasks(prev => prev.map(task => {
            if (task.id === id) {
                // If it requires a photo and is being marked complete, simulate photo attachment
                const willComplete = !task.isCompleted;
                return {
                    ...task,
                    isCompleted: willComplete,
                    photoAttached: willComplete && task.requiresPhoto ? true : task.photoAttached
                };
            }
            return task;
        }));
    };

    const handleSaveNote = (id: string) => {
        if (!noteText.trim()) {
            setActiveNoteId(null);
            return;
        }

        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, notes: noteText } : task
        ));

        // Trigger Escalation Toast
        setShowEscalationToast(true);
        setTimeout(() => setShowEscalationToast(false), 4000);

        setNoteText('');
        setActiveNoteId(null);
    };

    const handleReset = () => {
        setTasks(initialTasks.map(t => ({ ...t, isCompleted: false, photoAttached: false, notes: undefined })));
    };

    const renderTaskGroup = (category: string) => {
        const groupTasks = tasks.filter(t => t.category === category);
        if (groupTasks.length === 0) return null;

        return (
            <div key={category} className="mb-8">
                <h3 className="text-yellow-400 font-black uppercase tracking-widest text-sm mb-4 border-b border-gray-700 pb-2">
                    {category}
                </h3>
                <div className="space-y-4">
                    {groupTasks.map(task => (
                        <div key={task.id} className={`bg-[#2d3142] border ${task.isCompleted ? 'border-emerald-500/50' : 'border-gray-700'} rounded-2xl p-4 transition-all`}>
                            <div className="flex items-start gap-4">
                                <button
                                    onClick={() => handleToggleTask(task.id)}
                                    className="shrink-0 mt-0.5 transition-transform hover:scale-110"
                                >
                                    {task.isCompleted ? (
                                        <CheckCircle2 className="text-emerald-400" size={24} />
                                    ) : (
                                        <Circle className="text-gray-500" size={24} />
                                    )}
                                </button>

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <span className={`text-base font-bold ${task.isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
                                            {task.text}
                                        </span>
                                        {task.requiresPhoto && (
                                            <span className={`text-[#3b82f6] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30 flex items-center gap-1 w-fit ${task.isCompleted ? 'opacity-50' : ''}`}>
                                                <Camera size={12} /> {task.photoAttached ? 'Photo Logged' : 'Photo Req'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Notes Section */}
                                    {task.notes ? (
                                        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-200 flex gap-2">
                                            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="font-bold text-[10px] uppercase tracking-wider text-amber-500 mb-1">Reported Issue</div>
                                                {task.notes}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            {activeNoteId === task.id ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={noteText}
                                                        onChange={(e) => setNoteText(e.target.value)}
                                                        placeholder="Report broken fixture or issue..."
                                                        className="flex-1 bg-[#1a1d29] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleSaveNote(task.id)}
                                                        className="bg-amber-500 hover:bg-amber-400 text-black p-2 rounded-lg"
                                                    >
                                                        <Send size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setActiveNoteId(task.id);
                                                        setNoteText('');
                                                    }}
                                                    className="text-gray-500 hover:text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                                                >
                                                    + Add Note / Issue
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn p-4 md:p-6 text-white overflow-hidden relative">

            {/* Header & Progress */}
            <div className="mb-6 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3 mb-2">
                        <ClipboardCheck className="text-yellow-400" size={32} /> Daily Checklist
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-medium">Routine sanitation and facility maintenance checks.</p>
                </div>

                <div className="flex items-center gap-4 bg-[#2d3142] p-4 rounded-2xl border border-gray-700 shadow-xl shrink-0">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-700" />
                            <circle
                                cx="32" cy="32" r="28"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray="175.9"
                                strokeDashoffset={175.9 - (175.9 * progressPercentage) / 100}
                                className="text-yellow-400 transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-sm">
                            {progressPercentage}%
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Shift Progress</div>
                        <div className="text-lg font-bold">
                            {completedTasks} <span className="text-gray-500">of</span> {totalTasks} <span className="text-gray-500 text-sm">Tasks</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-24">
                {renderTaskGroup('Restrooms')}
                {renderTaskGroup('Public Spaces')}

                <div className="mt-8 flex justify-center pb-8">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <RefreshCw size={14} /> Reset Shift Tasks
                    </button>
                </div>
            </div>

            {/* Toasts / Notifications */}
            {showEscalationToast && (
                <div className="absolute top-6 right-6 bg-amber-500 text-black px-4 py-3 rounded-xl shadow-[0_10px_40px_rgba(245,158,11,0.3)] animate-slideInRight flex items-center gap-3 font-bold text-sm z-50 border border-amber-400">
                    <AlertTriangle size={18} />
                    Issue Logged to Facility Maintenance
                </div>
            )}

            {showSyncToast && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.4)] animate-slideUp flex items-center gap-3 font-bold text-sm z-50 border border-blue-400">
                    <ClipboardCheck size={18} />
                    Experience Crew Notified: Restrooms Sanitized
                </div>
            )}
        </div>
    );
};

export default CleaningDailyChecklistTab;
