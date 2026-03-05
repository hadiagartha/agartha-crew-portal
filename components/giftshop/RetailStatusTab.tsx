import React, { useState } from 'react';
import { Package, Search, ToggleLeft, ToggleRight, ListFilter } from 'lucide-react';

interface RetailItem {
    id: string;
    name: string;
    variant: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    isVisible: boolean;
}

const mockRetailItems: RetailItem[] = [
    { id: '1', name: 'Zone 4 T-Shirt', variant: 'Large / Black', stock: 45, status: 'In Stock', isVisible: true },
    { id: '2', name: 'Leviathan Plushie', variant: 'Standard', stock: 12, status: 'Low Stock', isVisible: true },
    { id: '3', name: 'Aether Crystal Replica', variant: 'Glow Edition', stock: 0, status: 'Out of Stock', isVisible: false },
    { id: '4', name: 'Bioluminescent Lantern', variant: 'Blue', stock: 8, status: 'Low Stock', isVisible: true },
];

const RetailStatusTab: React.FC = () => {
    const [items, setItems] = useState<RetailItem[]>(mockRetailItems);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleVisibility = (id: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item));
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variant.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn">
            {/* Header section */}
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <Package className="text-blue-400" /> Retail Status
                    </h2>
                    <p className="text-gray-400 text-sm">Manage shelf visibility and digital storefront display.</p>
                </div>
            </div>

            <div className="p-4 md:p-6 pb-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-gray-500" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search retail products..."
                        className="w-full bg-[#2d3142] border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto px-4 md:px-6 pb-6 mt-4">
                <div className="bg-[#2d3142] rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1a1d29] border-b border-gray-700 text-xs md:text-sm uppercase tracking-wider text-gray-400">
                                <th className="p-4 font-semibold">Item & Variant</th>
                                <th className="p-4 font-semibold text-center">On-Hand Qty</th>
                                <th className="p-4 font-semibold text-center hidden sm:table-cell">Status</th>
                                <th className="p-4 font-semibold text-right">Display Toggle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {filteredItems.map(item => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white md:text-lg">{item.name}</div>
                                        <div className="text-xs text-gray-400 mt-1">{item.variant}</div>
                                        {/* Mobile status badge */}
                                        <div className="sm:hidden mt-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'In Stock' ? 'bg-green-500/10 text-green-400' :
                                                    item.status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-red-500/10 text-red-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-xl font-bold font-mono ${item.stock > 10 ? 'text-white' : item.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                            {item.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center hidden sm:table-cell">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${item.status === 'In Stock' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                item.status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleVisibility(item.id)}
                                            className={`transition-colors flex items-center justify-end w-full ${item.isVisible ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-gray-400'
                                                }`}
                                            title="Toggle Storefront Visibility"
                                        >
                                            {item.isVisible ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                        </button>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                            {item.isVisible ? 'Visible' : 'Hidden'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No items found matching "{searchTerm}".
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

export default RetailStatusTab;
