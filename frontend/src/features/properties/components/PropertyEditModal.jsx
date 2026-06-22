import React, { useState, useEffect } from 'react';
import { X, Sliders, Check, HelpCircle } from 'lucide-react';
import { PROPERTY_TYPES, ROOM_TYPES, COUNTRIES } from './list-property/constants';

const PropertyEditModal = ({ isOpen, onClose, property, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [propertyType, setPropertyType] = useState('APARTMENT');
    const [roomType, setRoomType] = useState('ENTIRE_PLACE');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (property) {
            setName(property.name || '');
            setPrice(property.price || 0);
            setPropertyType(property.propertyType || 'APARTMENT');
            setRoomType(property.roomType || 'ENTIRE_PLACE');
            setCity(property.address?.city || '');
            setCountry(property.address?.country || '');
            setErrors({});
        }
    }, [property, isOpen]);

    if (!isOpen || !property) return null;

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = 'Property name is required.';
        if (!price || Number(price) <= 0) e.price = 'Enter a valid price greater than $0.';
        if (!city.trim()) e.city = 'City is required.';
        if (!country) e.country = 'Select a country.';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        onSave(property.id, {
            name,
            price: Number(price),
            propertyType,
            roomType,
            city,
            country
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            {/* Modal Box */}
            <form 
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-[#0F1117] border border-[#1A1D26] rounded-3xl overflow-hidden shadow-2xl flex flex-col transform scale-100 transition-all duration-300 animate-modal-zoom"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-[#1A1D26] flex items-center justify-between bg-[#131722]/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A2A0A] flex items-center justify-center border border-[#C8FB4C]/20">
                            <Sliders className="w-5 h-5 text-[#C8FB4C]" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#FAFAF8] tracking-tight">Edit Property Listing</h3>
                            <p className="text-xs text-[#8A8FA8]">Update pricing, layout types, and location metadata</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose}
                        className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] rounded-xl transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Form */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] bg-[#0F1117]">
                    
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#FAFAF8] uppercase tracking-wider">Property Title</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="px-4 py-2.5 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-medium transition-all duration-200"
                            placeholder="e.g. Minimalist Concrete Loft"
                        />
                        {errors.name && <p className="text-[11px] font-semibold text-rose-500">{errors.name}</p>}
                    </div>

                    {/* Price per night */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#FAFAF8] uppercase tracking-wider">Price per night ($ USD)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-sm font-bold text-[#8A8FA8]">$</span>
                            <input 
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="w-full pl-8 pr-4 py-2.5 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-bold transition-all duration-200"
                                placeholder="0"
                            />
                        </div>
                        {errors.price && <p className="text-[11px] font-semibold text-rose-500">{errors.price}</p>}
                    </div>

                    {/* Grid of Selectors */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Property Type */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#FAFAF8] uppercase tracking-wider">Property Type</label>
                            <select 
                                value={propertyType}
                                onChange={e => setPropertyType(e.target.value)}
                                className="px-3.5 py-2.5 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-xs text-[#FAFAF8] font-semibold transition-all duration-200"
                            >
                                {PROPERTY_TYPES.map(type => (
                                    <option key={type.value} value={type.value} className="bg-[#0F1117] text-[#FAFAF8]">
                                        {type.value.charAt(0) + type.value.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Room Type */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#FAFAF8] uppercase tracking-wider">Room Type</label>
                            <select 
                                value={roomType}
                                onChange={e => setRoomType(e.target.value)}
                                className="px-3.5 py-2.5 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-xs text-[#FAFAF8] font-semibold transition-all duration-200"
                            >
                                {ROOM_TYPES.map(type => (
                                    <option key={type.value} value={type.value} className="bg-[#0F1117] text-[#FAFAF8]">
                                        {type.value.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Location Info (Grid) */}
                    <div className="grid grid-cols-2 gap-4 border-t border-[#1A1D26]/60 pt-4 mt-2">
                        {/* City */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#FAFAF8] uppercase tracking-wider">City</label>
                            <input 
                                type="text"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="px-4 py-2.5 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-xs text-[#FAFAF8] font-medium transition-all duration-200"
                                placeholder="e.g. Kyoto"
                            />
                            {errors.city && <p className="text-[11px] font-semibold text-rose-500">{errors.city}</p>}
                        </div>

                        {/* Country */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#FAFAF8] uppercase tracking-wider">Country</label>
                            <select 
                                value={country}
                                onChange={e => setCountry(e.target.value)}
                                className="px-3.5 py-2.5 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-xs text-[#FAFAF8] font-semibold transition-all duration-200"
                            >
                                <option value="" className="bg-[#0F1117]">Select Country</option>
                                {COUNTRIES.map(c => (
                                    <option key={c} value={c} className="bg-[#0F1117] text-[#FAFAF8]">{c}</option>
                                ))}
                            </select>
                            {errors.country && <p className="text-[11px] font-semibold text-rose-500">{errors.country}</p>}
                        </div>
                    </div>
                </div>

                {/* Footer Action Row */}
                <div className="p-6 border-t border-[#1A1D26] bg-[#131722]/50 flex items-center justify-end gap-4 shrink-0">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-xs font-bold text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-6 py-2.5 bg-[#C8FB4C] hover:bg-[#b5e243] active:scale-95 text-[#0F1117] text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(200,251,76,0.15)] transition-all duration-200 flex items-center gap-1.5"
                    >
                        <Check className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PropertyEditModal;
