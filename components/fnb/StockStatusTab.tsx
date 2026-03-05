import React, { useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { ToggleLeft, ToggleRight, Search, ListFilter, ArrowRight } from 'lucide-react';

const StockStatusTab: React.FC = () => {
    const { fnb_menu_items, toggleFNBItemStatus } = useGlobalState();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    const filteredItems = fnb_menu_items
        .filter(item => categoryFilter === 'ALL' || item.category === categoryFilter)
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const categories = ['ALL', 'RAW INGREDIENT', 'PREPARED ITEM', 'RETAIL', 'DRINK'];

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn">
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <ListFilter className="text-blue-400" /> Stock Status
                    </h2>
                    <p className="text-gray-400 text-sm">Manage digital visibility of F&B offerings.</p>
                </div>
            </div>

            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-gray-500" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#2d3142] border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-[#2d3142] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none appearance-none"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-4 md:px-6 pb-6">
                <div className="flex flex-col gap-4">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-[#2d3142] rounded-2xl border border-gray-700 overflow-hidden shadow-lg transition-all">
                            {/* Always visible header */}
                            <div
                                className="p-5 cursor-pointer flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                                onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
                            >
                                <div className="flex gap-4 items-center">
                                    <div>
                                        <div className="text-lg font-bold text-white leading-tight">{item.name}</div>
                                        <div className="text-sm text-gray-400 mt-1 font-medium">Stock: <span className={`font-mono font-bold ${item.currentStock <= item.lowStockThreshold ? 'text-red-400' : 'text-green-400'}`}>{item.currentStock}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${item.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {item.status}
                                    </span>
                                    <div className={`text-gray-500 transition-transform ${expandedItemId === item.id ? 'rotate-90' : ''}`}>
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {expandedItemId === item.id && (
                                <div className="px-5 pb-5 pt-3 border-t border-gray-700/50 bg-black/20 animate-fadeIn flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Category</div>
                                            <span className="text-xs font-bold text-gray-300 bg-[#1a1d29] border border-gray-700 px-3 py-1.5 rounded-lg">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Manual Toggle</div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFNBItemStatus(item.id, item.status === 'Available' ? 'Out of Stock' : 'Available'); }}
                                                className={`transition-colors flex items-center justify-end w-full ${item.status === 'Available' ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                                                title="Toggle Visibility"
                                            >
                                                {item.status === 'Available' ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="p-8 text-center text-gray-500 bg-[#2d3142] rounded-2xl border border-gray-700">
                            No menu items found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockStatusTab;
