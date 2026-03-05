import React, { useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { ToggleLeft, ToggleRight, Search, ListFilter } from 'lucide-react';

const StockStatusTab: React.FC = () => {
    const { fnb_menu_items, toggleFNBItemStatus } = useGlobalState();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

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
                <div className="bg-[#2d3142] rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1a1d29] border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400">
                                <th className="p-4 font-semibold">Menu Item</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold text-center">Current Stock</th>
                                <th className="p-4 font-semibold text-center">Status</th>
                                <th className="p-4 font-semibold text-right">Manual Toggle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {filteredItems.map(item => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 text-white font-medium">{item.name}</td>
                                    <td className="p-4">
                                        <span className="text-xs font-mono text-gray-300 bg-[#1a1d29] px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`font-mono font-bold ${item.currentStock <= item.lowStockThreshold ? 'text-red-400' : 'text-green-400'}`}>
                                            {item.currentStock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleFNBItemStatus(item.id, item.status === 'Available' ? 'Out of Stock' : 'Available')}
                                            className={`transition-colors ${item.status === 'Available' ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                                            title="Toggle Visibility"
                                        >
                                            {item.status === 'Available' ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No menu items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockStatusTab;
