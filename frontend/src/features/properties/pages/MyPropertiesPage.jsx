import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {
    Calendar, Sliders, Power, EyeOff, Search, Plus, MapPin,
    Home, HelpCircle, Activity, Sparkles, Building2, CheckCircle, Loader2, Lock
} from 'lucide-react';
import {toast} from 'sonner';

import PropertyAvailabilityModal from '../components/My-properties/PropertyAvailabilityModal/index';
import PropertyEditModal from '../components/My-properties/PropertyEditModal/index';
import apiClient from "../../../core/api/apiClient.js";

const MyPropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, ACTIVE, INACTIVE, BLOCKED

    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [confirmingId, setConfirmingId] = useState(null);

    useEffect(() => {
        fetchMyProperties();
    }, []);

    const handleToggleActive = async (id, currentStatus) => {
        if (confirmingId !== id) {
            setConfirmingId(id);
            return;
        }
        setConfirmingId(null);
        const newStatus = !currentStatus;
        try {
            await apiClient.patch(`/properties/${id}/status`, {isActive: newStatus});
            setProperties(prev => prev.map(p => p.id === id ? {...p, isActive: newStatus} : p));
            toast.success(newStatus ? 'Listing is now Live & Active!' : 'Listing temporarily paused');
        } catch {
            toast.error('Could not update property status.');
        }
    };

    const fetchMyProperties = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get('/properties/host');
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
            toast.error('Failed to load your properties', {
                description: 'Please check your connection and try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Updated: modal now sends { propertyBlockRules, roomCategories } instead of a flat blockedDates array
    const handleSaveAvailability = async (id, availabilityUpdate) => {
        try {
            const response = await apiClient.put(`/properties/${id}/availability`, availabilityUpdate);
            const updatedProperty = response.data;

            setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p));
            setSelectedProperty(prev => prev?.id === id ? updatedProperty : prev);

            toast.success('Availability schedule updated successfully', {
                description: 'Block rules have been saved.',
                duration: 3000
            });
        } catch (error) {
            console.error('Error saving availability:', error);
            toast.error('Failed to save calendar', {
                description: 'Your block rules could not be saved.'
            });
        }
    };

    const handleSaveEdit = async (id, fields) => {
        try {
            const response = await apiClient.put(`/properties/${id}`, fields);
            setProperties(prev => prev.map(p => p.id === id ? response.data : p));

            toast.success('Listing details updated', {
                description: 'Your changes have been saved to the server.',
                duration: 3000
            });
        } catch (error) {
            console.error('Error saving edits:', error);
            toast.error('Failed to update listing', {
                description: 'Please check your inputs and try again.'
            });
        }
    };

    // Derived from BlockRules now, not a bookedDates field (which doesn't exist on Property)
    const hasActiveBlocks = (property) => {
        const propertyLevel = property.propertyBlockRules?.length > 0;
        const roomLevel = property.roomCategories?.some(r => r.roomBlockRules?.length > 0);
        return propertyLevel || roomLevel;
    };

    const filteredProperties = properties.filter(prop => {
        const matchesSearch =
            prop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.address?.country?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'ACTIVE') return prop.isActive;
        if (activeFilter === 'INACTIVE') return !prop.isActive;
        if (activeFilter === 'BLOCKED') return prop.isActive && hasActiveBlocks(prop);

        return true;
    });

    const totalCount = properties.length;
    const activeCount = properties.filter(p => p.isActive).length;
    const inactiveCount = properties.filter(p => !p.isActive).length;
    const blockedCount = properties.filter(p => p.isActive && hasActiveBlocks(p)).length;

    return (
        <div className="min-h-screen bg-[#0B0F19] text-[#FAFAF8] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Upper Breadcrumb & Header */}
                <div
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1A1D26] pb-6">
                    <div>
                        <div
                            className="flex items-center gap-2 text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider mb-1">
                            <span>Host Management</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FB4C]"/>
                            <span>Dashboard</span>
                        </div>
                        <h1
                            className="text-3xl font-black text-[#FAFAF8] tracking-tight flex items-center gap-2"
                            style={{fontFamily: "'Outfit', sans-serif"}}
                        >
                            My Properties
                            {!isLoading && (
                                <span
                                    className="text-xs font-bold px-2.5 py-1 bg-[#1A2A0A] text-[#C8FB4C] border border-[#C8FB4C]/25 rounded-full tracking-wide">
                                    {activeCount} Live & Active
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-[#8A8FA8] mt-1.5">
                            Manage availability, modify listing parameters, and pause/activate your hosting listings.
                        </p>
                    </div>

                    <Link
                        to="/list-property"
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-[#C8FB4C] hover:bg-[#b5e243] active:scale-95 text-[#0F1117] text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(200,251,76,0.15)] transition-all duration-200"
                    >
                        <Plus className="w-4 h-4 text-[#0F1117]"/>
                        List a New Property
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#C8FB4C] animate-spin mb-4"/>
                        <p className="text-[#8A8FA8] text-sm font-medium animate-pulse">Loading your properties...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Dashboard Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div
                                className="bg-[#111622] border border-[#1A1D26] p-5 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider">Total
                                        Listings</p>
                                    <h3 className="text-2xl font-black mt-1 text-[#FAFAF8]">{totalCount}</h3>
                                </div>
                                <div
                                    className="w-10 h-10 rounded-xl bg-[#1A1D26] border border-[#2A2D38] flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-[#8A8FA8]"/>
                                </div>
                            </div>

                            <div
                                className="bg-[#111622] border border-[#1A1D26] p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
                                <div
                                    className="absolute top-0 right-0 w-24 h-24 bg-[#C8FB4C]/2 rounded-full blur-2xl pointer-events-none"/>
                                <div>
                                    <p className="text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider">Live &
                                        Active</p>
                                    <h3 className="text-2xl font-black mt-1 text-[#C8FB4C] flex items-center gap-1.5">
                                        {activeCount}
                                        {activeCount > 0 && (
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span
                                                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FB4C] opacity-75"></span>
                                                <span
                                                    className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C8FB4C]"></span>
                                            </span>
                                        )}
                                    </h3>
                                </div>
                                <div
                                    className="w-10 h-10 rounded-xl bg-[#1A2A0A] border border-[#C8FB4C]/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-[#C8FB4C]"/>
                                </div>
                            </div>

                            {/* Blocked Dates (was "Booked Stays" — now derived from BlockRules, not a nonexistent bookedDates field) */}
                            <div
                                className="bg-[#111622] border border-[#1A1D26] p-5 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider">Blocked
                                        Dates</p>
                                    <h3 className="text-2xl font-black mt-1 text-indigo-400">{blockedCount}</h3>
                                </div>
                                <div
                                    className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-indigo-400"/>
                                </div>
                            </div>

                            <div
                                className="bg-[#111622] border border-[#1A1D26] p-5 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#8A8FA8] uppercase tracking-wider">Paused
                                        Listings</p>
                                    <h3 className="text-2xl font-black mt-1 text-[#8A8FA8]">{inactiveCount}</h3>
                                </div>
                                <div
                                    className="w-10 h-10 rounded-xl bg-[#1A1D26] border border-[#2A2D38] flex items-center justify-center">
                                    <EyeOff className="w-5 h-5 text-[#8A8FA8]"/>
                                </div>
                            </div>
                        </div>

                        {/* Filters, Tab pills & Search Area */}
                        <div
                            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#111622] border border-[#1A1D26] p-4 rounded-2xl">
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                                {[
                                    {id: 'ALL', label: 'All Listings', count: totalCount},
                                    {id: 'ACTIVE', label: 'Active', count: activeCount},
                                    {id: 'BLOCKED', label: 'Blocked Dates', count: blockedCount},
                                    {id: 'INACTIVE', label: 'Inactive', count: inactiveCount}
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

                            <div className="relative flex-1 lg:max-w-md w-full">
                                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8A8FA8]"/>
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
                                    const blocked = hasActiveBlocks(property);
                                    const coverImg = property.images?.coverImageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

                                    const rooms = property.roomCategories || [];
                                    const isStandalone = rooms.length === 1 && rooms[0].roomType === 'ENTIRE_PLACE';

                                    const prices = rooms.map(r => r.basePrice).filter(p => p != null);
                                    const minPrice = prices.length ? Math.min(...prices) : 0;
                                    const maxPrice = prices.length ? Math.max(...prices) : 0;
                                    const priceLabel = prices.length === 0
                                        ? 'N/A'
                                        : minPrice === maxPrice
                                            ? `$${minPrice}`
                                            : `$${minPrice}–$${maxPrice}`;

                                    const totalInventory = rooms.reduce((sum, r) => sum + (r.totalInventory || 0), 0);

                                    const typeLabel = isStandalone
                                        ? 'Entire Place'
                                        : rooms.length > 1
                                            ? `${rooms.length} Room Types`
                                            : rooms[0]?.roomType?.replace('_', ' ') || '';

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

                                                <div className="absolute top-4 left-4 z-10">
                                                    {isLive ? (
                                                        <span
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide bg-[#1A2A0A]/95 text-[#C8FB4C] border border-[#C8FB4C]/20 shadow-lg">
                                                            <span
                                                                className="w-1.5 h-1.5 rounded-full bg-[#C8FB4C] animate-pulse"/>
                                                            Live & Active
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide bg-gray-900/90 text-gray-400 border border-gray-700/30 shadow-lg">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"/>
                                                            Temporarily Disabled
                                                        </span>
                                                    )}
                                                </div>

                                                <span
                                                    className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm border border-white/5 text-white/80 text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider uppercase">
                                                    {property.propertyType?.replace('_', ' ')}
                                                </span>

                                                {!isStandalone && totalInventory > 0 && (
                                                    <span
                                                        className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm border border-white/5 text-white/80 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                                        {totalInventory} rooms total
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content Card Body */}
                                            <div className="p-5 flex flex-col flex-grow gap-4">
                                                <div>
                                                    <span
                                                        className="flex items-center gap-1 text-[11px] font-bold text-[#8A8FA8] mb-1">
                                                        <MapPin className="w-3.5 h-3.5 text-[#C8FB4C]"/>
                                                        {property.address?.city}, {property.address?.country}
                                                    </span>
                                                    <h3 className="text-base font-extrabold text-[#FAFAF8] group-hover:text-[#C8FB4C] transition-colors line-clamp-1">
                                                        {property.name}
                                                    </h3>
                                                    <p className="text-xs text-[#8A8FA8] mt-1 font-medium uppercase tracking-wide">
                                                        {typeLabel}
                                                    </p>
                                                </div>

                                                <div
                                                    className="flex items-center justify-between border-t border-b border-[#1A1D26]/70 py-3 text-xs font-semibold text-[#8A8FA8]">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[11px]">
                                                            {rooms.length > 1 ? 'From:' : 'Price:'}
                                                        </span>
                                                        <span
                                                            className="text-[#FAFAF8] font-extrabold text-sm">{priceLabel}</span>
                                                        <span className="text-[10px] text-[#8A8FA8]/70">/ night</span>
                                                    </div>

                                                    {isLive && blocked && (
                                                        <span
                                                            className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-500/20">
                                                            <Lock className="w-3 h-3"/>
                                                            Dates Blocked
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Card Actions Footer */}
                                                <div className="grid grid-cols-3 gap-2 mt-auto pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedProperty(property);
                                                            setIsAvailabilityOpen(true);
                                                        }}
                                                        className="flex flex-col items-center justify-center gap-1.5 py-2.5 bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] hover:border-[#C8FB4C]/50 rounded-xl transition-all duration-200 group/btn cursor-pointer"
                                                        title="Manage Availability Calendar"
                                                    >
                                                        <Calendar
                                                            className="w-4 h-4 text-[#8A8FA8] group-hover/btn:text-[#C8FB4C]"/>
                                                        <span
                                                            className="text-[9px] font-bold text-[#8A8FA8] group-hover/btn:text-[#FAFAF8] tracking-wider uppercase">Calendar</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedProperty(property);
                                                            setIsEditOpen(true);
                                                        }}
                                                        className="flex flex-col items-center justify-center gap-1.5 py-2.5 bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] hover:border-[#C8FB4C]/50 rounded-xl transition-all duration-200 group/btn cursor-pointer"
                                                        title="Edit Listing Parameters"
                                                    >
                                                        <Sliders
                                                            className="w-4 h-4 text-[#8A8FA8] group-hover/btn:text-[#C8FB4C]"/>
                                                        <span
                                                            className="text-[9px] font-bold text-[#8A8FA8] group-hover/btn:text-[#FAFAF8] tracking-wider uppercase">Parameters</span>
                                                    </button>

                                                    {confirmingId === property.id ? (
                                                        <div
                                                            className="col-span-1 flex flex-col items-center justify-center gap-1 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                                                            <span
                                                                className="text-[8px] font-bold text-rose-300 uppercase tracking-wider text-center leading-tight px-1">
                                                                Sure?
                                                            </span>
                                                            <div className="flex gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleActive(property.id, property.isActive)}
                                                                    className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[9px] font-bold rounded-md transition-all cursor-pointer"
                                                                >
                                                                    Yes
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setConfirmingId(null)}
                                                                    className="px-2 py-0.5 bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] text-[#8A8FA8] text-[9px] font-bold rounded-md transition-all cursor-pointer"
                                                                >
                                                                    No
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
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
                                                            <Power className="w-4 h-4"/>
                                                            <span
                                                                className="text-[9px] font-bold tracking-wider uppercase">
                                                                {property.isActive ? 'Pause' : 'Activate'}
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div
                                className="bg-[#111622] border border-[#1A1D26] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                                <div
                                    className="w-16 h-16 rounded-full bg-[#1A2A0A] flex items-center justify-center border border-[#C8FB4C]/20 mb-4 animate-pulse">
                                    <EyeOff className="w-6 h-6 text-[#C8FB4C]"/>
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
                    </>
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