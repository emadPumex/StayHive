import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Calendar, Sliders, Power, EyeOff, Search, Plus, MapPin, 
    Home, HelpCircle, Activity, Sparkles, Building2, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
    getHostProperties, togglePropertyActive, updatePropertyDetails, updatePropertyBlockedDates 
} from '../api/hostPropertiesStore';
import PropertyAvailabilityModal from '../components/PropertyAvailabilityModal';
import PropertyEditModal from '../components/PropertyEditModal';

const MyPropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, ACTIVE, INACTIVE, BOOKED
    
    // Modal states
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        setProperties(getHostProperties());
    }, []);

    // Handlers
    const handleToggleActive = (id, currentStatus) => {
        const updated = togglePropertyActive(id);
        setProperties(updated);
        toast.success(
            currentStatus ? 'Listing temporarily paused' : 'Listing is now Live & Active!', 
            {
                description: currentStatus 
                    ? 'Guests cannot view or book this listing.' 
                    : 'Your listing is visible to travelers.',
                duration: 3000
            }
        );
    };

    const handleSaveAvailability = (id, blockedDates) => {
        const updated = updatePropertyBlockedDates(id, blockedDates);
        setProperties(updated);
        toast.success('Availability schedule updated successfully', {
            description: 'Custom host-blocked dates have been saved.',
            duration: 3000
        });
    };

    const handleSaveEdit = (id, fields) => {
        const updated = updatePropertyDetails(id, fields);
        setProperties(updated);
        toast.success('Listing details updated', {
            description: 'Your changes have been saved to local storage.',
            duration: 3000
        });
    };

    // Filtering logic
    const filteredProperties = properties.filter(prop => {
        // Search filter
        const matchesSearch = 
            prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.address.country.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        // Status Filter
        if (activeFilter === 'ACTIVE') return prop.isActive;
        if (activeFilter === 'INACTIVE') return !prop.isActive;
        if (activeFilter === 'BOOKED') return prop.isActive && prop.bookedDates?.length > 0;

        return true;
    });

    // Counts for stats
    const totalCount = properties.length;
    const activeCount = properties.filter(p => p.isActive).length;
    const inactiveCount = properties.filter(p => !p.isActive).length;
    const bookedCount = properties.filter(p => p.isActive && p.bookedDates?.length > 0).length;

    return (
        <div className="min-h-screen bg-[#0B0F19] text-[#FAFAF8] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Upper Breadcrumb & Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1A1D26] pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider mb-1">
                            <span>Host Management</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FB4C]" />
                            <span>Dashboard</span>
                        </div>
                        <h1 
                            className="text-3xl font-black text-[#FAFAF8] tracking-tight flex items-center gap-2"
                            style={{fontFamily: "'Outfit', sans-serif"}}
                        >
                            My Properties
                            <span className="text-xs font-bold px-2.5 py-1 bg-[#1A2A0A] text-[#C8FB4C] border border-[#C8FB4C]/25 rounded-full tracking-wide">
                                {activeCount} Live & Active
                            </span>
                        </h1>
                        <p className="text-sm text-[#8A8FA8] mt-1.5">
                            Manage availability, modify listing parameters, and pause/activate your hosting listings.
                        </p>
                    </div>

                    <Link 
                        to="/list-property"
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-[#C8FB4C] hover:bg-[#b5e243] active:scale-95 text-[#0F1117] text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(200,251,76,0.15)] transition-all duration-200"
                    >
                        <Plus className="w-4 h-4 text-[#0F1117]" />
                        List a New Property
                    </Link>
                </div>

                {/* Stats Dashboard Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-[#111622] border border-[#1A1D26] p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider">Total Listings</p>
                            <h3 className="text-2xl font-black mt-1 text-[#FAFAF8]">{totalCount}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#1A1D26] border border-[#2A2D38] flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[#8A8FA8]" />
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-[#111622] border border-[#1A1D26] p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8FB4C]/2 rounded-full blur-2xl pointer-events-none" />
                        <div>
                            <p className="text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider">Live & Active</p>
                            <h3 className="text-2xl font-black mt-1 text-[#C8FB4C] flex items-center gap-1.5">
                                {activeCount}
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FB4C] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C8FB4C]"></span>
                                </span>
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#1A2A0A] border border-[#C8FB4C]/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-[#C8FB4C]" />
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-[#111622] border border-[#1A1D26] p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider">Booked Stays</p>
                            <h3 className="text-2xl font-black mt-1 text-indigo-400">{bookedCount}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-[#111622] border border-[#1A1D26] p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider">Paused Listings</p>
                            <h3 className="text-2xl font-black mt-1 text-[#8A8FA8]">{inactiveCount}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#1A1D26] border border-[#2A2D38] flex items-center justify-center">
                            <EyeOff className="w-5 h-5 text-[#8A8FA8]" />
                        </div>
                    </div>
                </div>

                {/* Filters, Tab pills & Search Area */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#111622] border border-[#1A1D26] p-4 rounded-2xl">
                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                        {[
                            { id: 'ALL', label: 'All Listings', count: totalCount },
                            { id: 'ACTIVE', label: 'Active', count: activeCount },
                            { id: 'BOOKED', label: 'Booked', count: bookedCount },
                            { id: 'INACTIVE', label: 'Inactive', count: inactiveCount }
                        ].map(tab => {
                            const isActive = activeFilter === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveFilter(tab.id)}
                                    className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 border transition-all duration-200 cursor-pointer select-none shrink-0 ${
                                        isActive 
                                            ? 'bg-[#1A2A0A] border-[#C8FB4C] text-[#C8FB4C]' 
                                            : 'bg-[#1A1D26]/60 border-[#2A2D38] text-[#8A8FA8] hover:text-[#FAFAF8] hover:border-[#3A3D48]'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-extrabold ${
                                        isActive ? 'bg-[#C8FB4C] text-[#0F1117]' : 'bg-[#1A1D26] text-[#8A8FA8]'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1 lg:max-w-md w-full">
                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8A8FA8]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search properties by title or location..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1D26]/60 border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-xs text-[#FAFAF8] font-medium transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Properties Grid Layout */}
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map(property => {
                            const isLive = property.isActive;
                            const isBooked = property.bookedDates?.length > 0;
                            const coverImg = property.images?.coverImageUrl || property.images?.pictureUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

                            return (
                                <div 
                                    key={property.id}
                                    className="bg-[#111622] border border-[#1A1D26] hover:border-[#2A344D] rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 group shadow-lg hover:shadow-2xl hover:-translate-y-1 animate-fade-in-up"
                                >
                                    {/* Cover Image Container */}
                                    <div className="relative aspect-[16/9] overflow-hidden bg-[#1A1D26]">
                                        <img 
                                            src={coverImg} 
                                            alt={property.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />

                                        {/* Dynamic status pill */}
                                        <div className="absolute top-4 left-4 z-10">
                                            {isLive ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide bg-[#1A2A0A]/95 text-[#C8FB4C] border border-[#C8FB4C]/20 shadow-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8FB4C] animate-pulse" />
                                                    Live & Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide bg-gray-900/90 text-gray-400 border border-gray-700/30 shadow-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                                    Temporarily Disabled
                                                </span>
                                            )}
                                        </div>

                                        {/* Property Type Badge */}
                                        <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm border border-white/5 text-white/80 text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider uppercase">
                                            {property.propertyType}
                                        </span>
                                    </div>

                                    {/* Content Card Body */}
                                    <div className="p-5 flex flex-col flex-grow gap-4">
                                        <div>
                                            <span className="flex items-center gap-1 text-[11px] font-bold text-[#8A8FA8] mb-1">
                                                <MapPin className="w-3.5 h-3.5 text-[#C8FB4C]" />
                                                {property.address?.city}, {property.address?.country}
                                            </span>
                                            <h3 className="text-base font-extrabold text-[#FAFAF8] group-hover:text-[#C8FB4C] transition-colors line-clamp-1">
                                                {property.name}
                                            </h3>
                                            <p className="text-xs text-[#8A8FA8] mt-1 font-medium uppercase tracking-wide">
                                                {property.roomType?.replace('_', ' ')}
                                            </p>
                                        </div>

                                        {/* Status and Booked state rings */}
                                        <div className="flex items-center justify-between border-t border-b border-[#1A1D26]/70 py-3 text-xs font-semibold text-[#8A8FA8]">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[11px]">Price:</span>
                                                <span className="text-[#FAFAF8] font-extrabold text-sm">${property.price}</span>
                                                <span className="text-[10px] text-[#8A8FA8]/70">/ night</span>
                                            </div>
                                            
                                            {isLive && isBooked && (
                                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-500/20">
                                                    Guest Occupied
                                                </span>
                                            )}
                                        </div>

                                        {/* Card Actions Footer */}
                                        <div className="grid grid-cols-3 gap-2 mt-auto pt-1">
                                            {/* Manage Availability */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedProperty(property);
                                                    setIsAvailabilityOpen(true);
                                                }}
                                                className="flex flex-col items-center justify-center gap-1.5 py-2.5 bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] hover:border-[#C8FB4C]/50 rounded-xl transition-all duration-200 group/btn cursor-pointer"
                                                title="Manage Availability Calendar"
                                            >
                                                <Calendar className="w-4 h-4 text-[#8A8FA8] group-hover/btn:text-[#C8FB4C]" />
                                                <span className="text-[9px] font-bold text-[#8A8FA8] group-hover/btn:text-[#FAFAF8] tracking-wider uppercase">Calendar</span>
                                            </button>

                                            {/* Edit Listing */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedProperty(property);
                                                    setIsEditOpen(true);
                                                }}
                                                className="flex flex-col items-center justify-center gap-1.5 py-2.5 bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] hover:border-[#C8FB4C]/50 rounded-xl transition-all duration-200 group/btn cursor-pointer"
                                                title="Edit Listing Parameters"
                                            >
                                                <Sliders className="w-4 h-4 text-[#8A8FA8] group-hover/btn:text-[#C8FB4C]" />
                                                <span className="text-[9px] font-bold text-[#8A8FA8] group-hover/btn:text-[#FAFAF8] tracking-wider uppercase">Parameters</span>
                                            </button>

                                            {/* Pause/Activate Toggle */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleActive(property.id, property.isActive)}
                                                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 border rounded-xl transition-all duration-200 cursor-pointer ${
                                                    property.isActive 
                                                        ? 'bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40 text-rose-400' 
                                                        : 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400'
                                                }`}
                                                title={property.isActive ? "Pause Listing" : "Activate Listing"}
                                            >
                                                <Power className="w-4 h-4" />
                                                <span className="text-[9px] font-bold tracking-wider uppercase">
                                                    {property.isActive ? 'Pause' : 'Activate'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-[#111622] border border-[#1A1D26] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#1A2A0A] flex items-center justify-center border border-[#C8FB4C]/20 mb-4 animate-pulse">
                            <EyeOff className="w-6 h-6 text-[#C8FB4C]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#FAFAF8] mb-1">No properties found</h3>
                        <p className="text-sm text-[#8A8FA8] max-w-sm mb-6 leading-relaxed">
                            Try adjusting your filters or search query, or add a new property to get started.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setActiveFilter('ALL');
                            }}
                            className="px-5 py-2.5 bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer"
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </div>

            {/* Dialogs / Modals */}
            <PropertyAvailabilityModal 
                isOpen={isAvailabilityOpen}
                onClose={() => {
                    setIsAvailabilityOpen(false);
                    setSelectedProperty(null);
                }}
                property={selectedProperty}
                onSave={handleSaveAvailability}
            />

            <PropertyEditModal 
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedProperty(null);
                }}
                property={selectedProperty}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default MyPropertiesPage;
