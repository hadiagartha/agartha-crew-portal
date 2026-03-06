import React, { useState } from 'react';
import { Search, Package, MapPin, Clock, Camera, CheckCircle2, User, Phone, FileText, Upload } from 'lucide-react';

type ItemType = 'Lost' | 'Found';
type ItemStatus = 'Open' | 'Matched' | 'Claimed';

interface LostFoundItem {
    id: string;
    type: ItemType;
    itemName: string;
    description: string;
    location: string;
    dateReported: Date;
    status: ItemStatus;
    contactName?: string;
    contactPhone?: string;
}

const INITIAL_ITEMS: LostFoundItem[] = [
    {
        id: `LF-001`,
        type: 'Lost',
        itemName: 'Children\'s Backpack',
        description: 'Blue backpack with dinosaur pattern. Contains a small tablet and a jacket.',
        location: 'Crystal Caves Cafe',
        dateReported: new Date(Date.now() - 1000 * 60 * 45),
        status: 'Open',
        contactName: 'Mark Johnson',
        contactPhone: '555-0192'
    },
    {
        id: `LF-002`,
        type: 'Found',
        itemName: 'Smartphone',
        description: 'Black smartphone with clear case. Lock screen has a picture of a dog.',
        location: 'Zone 02 Restrooms',
        dateReported: new Date(Date.now() - 1000 * 60 * 120),
        status: 'Open'
    }
];

const ExperienceLostAndFoundTab: React.FC = () => {
    const [items, setItems] = useState<LostFoundItem[]>(INITIAL_ITEMS);
    const [activeTab, setActiveTab] = useState<ItemType>('Lost');
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    const filteredItems = items.filter(item => item.type === activeTab);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName.trim() || !description.trim() || !location.trim()) return;

        const newItem: LostFoundItem = {
            id: `LF-00${items.length + 1}`,
            type: activeTab,
            itemName,
            description,
            location,
            dateReported: new Date(),
            status: 'Open',
            contactName: contactName.trim() ? contactName : undefined,
            contactPhone: contactPhone.trim() ? contactPhone : undefined,
        };

        setItems([newItem, ...items]);

        // Reset form
        setItemName('');
        setDescription('');
        setLocation('');
        setContactName('');
        setContactPhone('');
        setShowForm(false);
    };

    const handleStatusChange = (id: string, newStatus: ItemStatus) => {
        setItems(items.map(i => i.id === id ? { ...i, status: newStatus } : i));
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1d29] overflow-hidden">
            {/* Header */}
            <div className="flex-none p-6 border-b border-[#2d3142] bg-[#1a1d29]/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Search className="text-blue-400" size={28} />
                            Lost & Found Center
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Manage guest lost items and found property reports.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        {showForm ? 'Cancel Report' : `Report ${activeTab} Item`}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-6xl mx-auto">

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 bg-[#2d3142] p-1.5 rounded-xl w-full max-w-md">
                        <button
                            onClick={() => { setActiveTab('Lost'); setShowForm(false); }}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'Lost'
                                    ? 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Lost Items ({items.filter(i => i.type === 'Lost' && i.status === 'Open').length})
                        </button>
                        <button
                            onClick={() => { setActiveTab('Found'); setShowForm(false); }}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'Found'
                                    ? 'bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Found Items ({items.filter(i => i.type === 'Found' && i.status === 'Open').length})
                        </button>
                    </div>

                    {/* Report Form */}
                    {showForm && (
                        <div className="bg-[#2d3142] border border-blue-500/30 rounded-2xl p-6 mb-8 shadow-xl animate-fadeIn">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">
                                File New {activeTab} Report
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Item Name / Category <span className="text-red-400">*</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Package size={16} className="text-gray-500" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={itemName}
                                                onChange={(e) => setItemName(e.target.value)}
                                                placeholder="e.g. Black iPhone 13, Red Backpack"
                                                className="w-full bg-[#1a1d29] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Last Seen / Found Location <span className="text-red-400">*</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin size={16} className="text-gray-500" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="e.g. Near Zone 02 Entrance"
                                                className="w-full bg-[#1a1d29] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Detailed Description <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                            <FileText size={16} className="text-gray-500" />
                                        </div>
                                        <textarea
                                            required
                                            rows={3}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Brand, identifying marks, contents, background wallpaper, etc."
                                            className="w-full bg-[#1a1d29] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 custom-scrollbar"
                                        />
                                    </div>
                                </div>

                                {/* Optional Contact Info for Lost Items */}
                                {activeTab === 'Lost' && (
                                    <div className="border-t border-gray-700 pt-5 mt-5">
                                        <h4 className="text-sm font-bold text-white mb-4">Guest Contact Information (Optional)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User size={16} className="text-gray-500" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={contactName}
                                                        onChange={(e) => setContactName(e.target.value)}
                                                        placeholder="Guest Name"
                                                        className="w-full bg-[#1a1d29] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Phone size={16} className="text-gray-500" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={contactPhone}
                                                        onChange={(e) => setContactPhone(e.target.value)}
                                                        placeholder="Phone Number / Email"
                                                        className="w-full bg-[#1a1d29] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Found' && (
                                    <div className="border-t border-gray-700 pt-5 mt-5 flex items-center gap-4">
                                        <button type="button" className="flex items-center gap-2 bg-[#1a1d29] border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-blue-500 px-4 py-3 rounded-lg transition-colors w-full md:w-auto">
                                            <Camera size={18} />
                                            <span className="text-sm">Capture Photo Proof</span>
                                        </button>
                                        <span className="text-xs text-gray-500 hidden md:inline-block">Helps identify the item quickly when claimed.</span>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-5 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1d29] transition-colors font-medium text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold transition-shadow shadow-[0_0_15px_rgba(37,99,235,0.3)] shadow-blue-500/20 text-sm flex items-center gap-2"
                                    >
                                        <Upload size={16} />
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.length === 0 ? (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-[#2d3142]/30 border border-dashed border-gray-700 rounded-2xl">
                                <Search size={48} className="text-gray-600 mb-4" />
                                <h3 className="text-lg font-bold text-gray-400 mb-2">No {activeTab} Items Reported</h3>
                                <p className="text-gray-500 max-w-sm">
                                    {activeTab === 'Lost'
                                        ? "Guests haven't reported any lost items at the moment."
                                        : "No items have been found and turned in."}
                                </p>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div
                                    key={item.id}
                                    className={`bg-[#2d3142] border rounded-2xl p-5 shadow-lg flex flex-col h-full transition-all hover:translate-y-[-2px] ${item.status === 'Open' ? 'border-gray-700 hover:border-blue-500/30' :
                                            item.status === 'Matched' ? 'border-yellow-500/30' : 'border-green-500/30 opacity-70'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-xs font-mono text-gray-500 bg-[#1a1d29] px-2 py-0.5 rounded border border-gray-700 w-max">{item.id}</span>
                                            <h3 className="font-bold text-white text-lg leading-tight">{item.itemName}</h3>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${item.status === 'Open' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                item.status === 'Matched' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                    'bg-green-500/10 border-green-500/20 text-green-400'
                                            }`}>
                                            {item.status === 'Matched' && <Search size={12} />}
                                            {item.status === 'Claimed' && <CheckCircle2 size={12} />}
                                            {item.status}
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-5 leading-relaxed flex-grow line-clamp-3">
                                        {item.description}
                                    </p>

                                    <div className="space-y-3 bg-[#1a1d29] p-3 rounded-xl border border-gray-700/50 mb-4">
                                        <div className="flex items-start gap-2">
                                            <MapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                            <span className="text-xs text-gray-300">{item.location}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Clock size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                            <span className="text-xs text-gray-300">
                                                {item.dateReported.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {item.dateReported.toLocaleDateString()}
                                            </span>
                                        </div>
                                        {item.contactName && (
                                            <div className="flex items-start gap-2 pt-2 border-t border-gray-700/50">
                                                <User size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                                <span className="text-xs text-gray-300">{item.contactName} {item.contactPhone && <span className="text-gray-500 ml-1">({item.contactPhone})</span>}</span>
                                            </div>
                                        )}
                                    </div>

                                    {item.status === 'Open' && (
                                        <button
                                            onClick={() => handleStatusChange(item.id, activeTab === 'Lost' ? 'Matched' : 'Claimed')}
                                            className="w-full py-2.5 rounded-lg font-bold text-sm bg-[#1a1d29] border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            {activeTab === 'Lost' ? 'Mark Found' : 'Mark Claimed'}
                                        </button>
                                    )}
                                    {item.status === 'Matched' && (
                                        <button
                                            onClick={() => handleStatusChange(item.id, 'Claimed')}
                                            className="w-full py-2.5 rounded-lg font-bold text-sm bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 text-yellow-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Set as Claimed
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceLostAndFoundTab;
