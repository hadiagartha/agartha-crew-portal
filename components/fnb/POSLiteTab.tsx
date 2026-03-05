import React, { useMemo, useState } from 'react';
import { useGlobalState } from '../GlobalStateContext';
import { CheckCircle, Clock, PackageOpen, AlertTriangle } from 'lucide-react';

const POSLiteTab: React.FC = () => {
    const { fnb_orders, completeFNBOrder } = useGlobalState();
    const [searchTerm, setSearchTerm] = useState('');

    const pendingOrders = useMemo(() => {
        return fnb_orders
            .filter(o => o.status === 'PENDING' || o.status === 'PREPARING')
            .filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())))
            .sort((a, b) => {
                if (a.priority && !b.priority) return -1;
                if (!a.priority && b.priority) return 1;
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
    }, [fnb_orders, searchTerm]);

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] animate-fadeIn">
            {/* Header section */}
            <div className="flex-none p-4 md:p-6 border-b border-[#2d3142] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <PackageOpen className="text-yellow-400" /> POS-Lite (Fulfillment)
                    </h2>
                    <p className="text-gray-400 text-sm">Process rapid transactions and real-time inventory deduction.</p>
                </div>
                <div className="w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search Order ID or Item..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 bg-[#2d3142] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingOrders.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 bg-[#2d3142]/30 rounded-2xl border border-gray-700 border-dashed">
                            <CheckCircle className="text-gray-500 w-16 h-16 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Queue is Empty</h3>
                            <p className="text-gray-400">All pending orders have been fulfilled.</p>
                        </div>
                    ) : (
                        pendingOrders.map(order => (
                            <div key={order.id} className={`bg-[#2d3142] rounded-2xl border ${order.priority ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gray-700'} overflow-hidden flex flex-col`}>
                                <div className={`p-4 border-b ${order.priority ? 'bg-red-500/10 border-red-500/30' : 'bg-[#1a1d29]/50 border-gray-700'} flex justify-between items-center`}>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-lg font-bold text-white">{order.id}</span>
                                        {order.priority && (
                                            <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={12} /> Priority</span>
                                        )}
                                    </div>
                                    <div className="text-gray-400 text-sm flex items-center gap-1">
                                        <Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="p-4 flex-1">
                                    <ul className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-white font-medium block">{item.name}</span>
                                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm ${item.category === 'PREPARED ITEM' ? 'bg-amber-500/20 text-amber-400' :
                                                            item.category === 'DRINK' ? 'bg-blue-500/20 text-blue-400' :
                                                                item.category === 'RETAIL' ? 'bg-purple-500/20 text-purple-400' :
                                                                    'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <div className="text-xl font-black text-gray-300 bg-[#1a1d29] px-3 py-1 rounded">
                                                    x{item.quantity}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 mt-auto">
                                    <button
                                        onClick={() => completeFNBOrder(order.id)}
                                        className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex justify-center items-center gap-2"
                                    >
                                        <CheckCircle size={20} /> Complete Order
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default POSLiteTab;
