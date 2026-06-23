import React, { useState, useEffect } from 'react';
import { X, Sliders, Check, BedDouble, Bath, Users, DollarSign } from 'lucide-react';
import { PROPERTY_TYPES, ROOM_TYPES } from './list-property/constants';

// ─── Constants ────────────────────────────────────────────────────────────────

const CANCELLATION_POLICIES = [
    { value: 'FLEXIBLE',     label: 'Flexible',     desc: 'Full refund 1 day prior to arrival' },
    { value: 'MODERATE',     label: 'Moderate',     desc: 'Full refund 5 days prior to arrival' },
    { value: 'STRICT',       label: 'Strict',       desc: 'Full refund within 48 hrs of booking' },
    { value: 'SUPER_STRICT', label: 'Super Strict', desc: 'No refunds' },
];

const AMENITY_OPTIONS = [
    'Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Heating',
    'Washer', 'Dryer', 'TV', 'Pool', 'Hot tub', 'Gym', 'EV charger',
    'Breakfast included', 'Workspace', 'Smoke alarm', 'Carbon monoxide alarm',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FieldLabel = ({ children }) => (
    <label className="text-[10px] font-bold text-[#8A8FA8] uppercase tracking-widest">
        {children}
    </label>
);

const FieldError = ({ msg }) =>
    msg ? <p className="text-[11px] font-semibold text-rose-400 mt-0.5">{msg}</p> : null;

const TextInput = ({ value, onChange, placeholder, className = '' }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-2.5 bg-[#13161F] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-medium transition-colors duration-200 w-full ${className}`}
    />
);

const SelectInput = ({ value, onChange, children, className = '' }) => (
    <select
        value={value}
        onChange={onChange}
        className={`px-3.5 py-2.5 bg-[#13161F] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-xs text-[#FAFAF8] font-semibold transition-colors duration-200 w-full ${className}`}
    >
        {children}
    </select>
);

const CounterField = ({ label, icon: Icon, value, onChange, min = 0, max = 20 }) => (
    <div className="flex flex-col gap-1.5">
        <FieldLabel>{label}</FieldLabel>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#13161F] border border-[#2A2D38] rounded-xl">
            <Icon className="w-3.5 h-3.5 text-[#8A8FA8] shrink-0" />
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1A1D26] hover:bg-[#2A2D38] text-[#8A8FA8] hover:text-[#FAFAF8] font-bold text-sm transition-colors cursor-pointer select-none"
            >
                −
            </button>
            <span className="flex-1 text-center text-sm font-bold text-[#FAFAF8] tabular-nums">{value}</span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1A1D26] hover:bg-[#2A2D38] text-[#8A8FA8] hover:text-[#FAFAF8] font-bold text-sm transition-colors cursor-pointer select-none"
            >
                +
            </button>
        </div>
    </div>
);

const SectionHeader = ({ children }) => (
    <div className="flex items-center gap-3 pt-2">
        <span className="text-[10px] font-black text-[#8A8FA8] uppercase tracking-widest whitespace-nowrap">{children}</span>
        <div className="flex-1 h-px bg-[#1A1D26]" />
    </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────

const PropertyEditModal = ({ isOpen, onClose, property, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [propertyType, setPropertyType] = useState('APARTMENT');
    const [roomType, setRoomType] = useState('ENTIRE_PLACE');
    const [city, setCity] = useState('');
    const [summary, setSummary] = useState('');
    const [accommodates, setAccommodates] = useState(1);
    const [bedrooms, setBedrooms] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [cancellationPolicy, setCancellationPolicy] = useState('FLEXIBLE');
    const [amenities, setAmenities] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Sync on open / property change
    useEffect(() => {
        if (property && isOpen) {
            setName(property.name || '');
            setPrice(property.price || 0);
            setPropertyType(property.propertyType || 'APARTMENT');
            setRoomType(property.roomType || 'ENTIRE_PLACE');
            setCity(property.address?.city || '');
            setSummary(property.summary || '');
            setAccommodates(property.accommodates || 1);
            setBedrooms(property.bedrooms || 1);
            setBathrooms(property.bathrooms || 1);
            setCancellationPolicy(property.cancellationPolicy || 'FLEXIBLE');

            // Core Change: Deep copy existing array to retain all items from DB
            if (Array.isArray(property.amenities)) {
                setAmenities([...property.amenities]);
            } else {
                setAmenities([]);
            }

            setErrors({});
            setIsSaving(false);
        }
    }, [property, isOpen]);

    if (!isOpen || !property) return null;

    // ── Validation ──────────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = 'Property name is required.';
        if (!price || Number(price) <= 0) e.price = 'Price must be greater than $0.';
        if (!city.trim()) e.city = 'City is required.';
        return e;
    };

    // ── Case-Insensitive Amenity toggle ─────────────────────────────────────
    const toggleAmenity = (item) => {
        setAmenities(prev => {
            const exists = prev.some(a => a.toLowerCase() === item.toLowerCase());
            if (exists) {
                return prev.filter(a => a.toLowerCase() !== item.toLowerCase());
            } else {
                return [...prev, item]; // Safely appends alongside the existing selections
            }
        });
    };

    // ── Helper to check active state regardless of string casing ─────────────
    const isAmenityActive = (item) => {
        return amenities.some(a => a.toLowerCase() === item.toLowerCase());
    };

    // ── Submit ──────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setIsSaving(true);
        try {
            await onSave(property.id, {
                name,
                price: Number(price),
                propertyType,
                roomType,
                city,
                summary,
                accommodates,
                bedrooms,
                bathrooms,
                cancellationPolicy,
                amenities,
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl bg-[#0F1117] border border-[#1A1D26] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="px-6 py-5 border-b border-[#1A1D26] flex items-center justify-between bg-[#0F1117] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1A2A0A] flex items-center justify-center border border-[#C8FB4C]/20">
                            <Sliders className="w-4 h-4 text-[#C8FB4C]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#FAFAF8] leading-tight">Edit Listing</h3>
                            <p className="text-[11px] text-[#8A8FA8] mt-0.5 font-medium line-clamp-1">
                                {property.name}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] rounded-xl transition-all duration-200 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Scrollable Body ── */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1">

                    {/* ── Section: Basics ── */}
                    <SectionHeader>Listing Details</SectionHeader>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <FieldLabel>Property Title</FieldLabel>
                        <TextInput
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Minimalist Concrete Loft"
                        />
                        <FieldError msg={errors.name} />
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-1.5">
                        <FieldLabel>Description</FieldLabel>
                        <textarea
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                            placeholder="Describe what makes this place special..."
                            rows={3}
                            className="px-4 py-2.5 bg-[#13161F] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-medium transition-colors duration-200 resize-none w-full"
                        />
                    </div>

                    {/* Price + City */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Price / Night (USD)</FieldLabel>
                            <div className="relative">
                                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8FA8] pointer-events-none" />
                                <input
                                    type="number"
                                    value={price}
                                    min={1}
                                    onChange={e => setPrice(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-[#13161F] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-bold transition-colors duration-200"
                                />
                            </div>
                            <FieldError msg={errors.price} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>City</FieldLabel>
                            <TextInput
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="e.g. Kyoto"
                            />
                            <FieldError msg={errors.city} />
                        </div>
                    </div>

                    {/* Type selectors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Property Type</FieldLabel>
                            <SelectInput value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                                {PROPERTY_TYPES.map(t => (
                                    <option key={t.value} value={t.value} className="bg-[#0F1117]">
                                        {t.value.charAt(0) + t.value.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Room Type</FieldLabel>
                            <SelectInput value={roomType} onChange={e => setRoomType(e.target.value)}>
                                {ROOM_TYPES.map(t => (
                                    <option key={t.value} value={t.value} className="bg-[#0F1117]">
                                        {t.value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>
                    </div>

                    {/* ── Section: Capacity ── */}
                    <SectionHeader>Capacity</SectionHeader>

                    <div className="grid grid-cols-3 gap-3">
                        <CounterField label="Guests"    icon={Users}     value={accommodates} onChange={setAccommodates} min={1} max={30} />
                        <CounterField label="Bedrooms"  icon={BedDouble}  value={bedrooms}     onChange={setBedrooms}     min={0} max={20} />
                        <CounterField label="Bathrooms" icon={Bath}       value={bathrooms}    onChange={setBathrooms}    min={1} max={20} />
                    </div>

                    {/* ── Section: Policy ── */}
                    <SectionHeader>Cancellation Policy</SectionHeader>

                    <div className="grid grid-cols-2 gap-2">
                        {CANCELLATION_POLICIES.map(pol => {
                            const isSelected = cancellationPolicy === pol.value;
                            return (
                                <button
                                    key={pol.value}
                                    type="button"
                                    onClick={() => setCancellationPolicy(pol.value)}
                                    className={`flex flex-col items-start gap-0.5 px-3.5 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'bg-[#1A2A0A] border-[#C8FB4C]/50 text-[#C8FB4C]'
                                            : 'bg-[#13161F] border-[#2A2D38] text-[#8A8FA8] hover:border-[#3A3D48] hover:text-[#FAFAF8]'
                                    }`}
                                >
                                    <span className="text-xs font-bold">{pol.label}</span>
                                    <span className={`text-[10px] font-medium leading-tight ${isSelected ? 'text-[#C8FB4C]/70' : 'text-[#8A8FA8]/70'}`}>
                                        {pol.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Section: Amenities ── */}
                    <SectionHeader>Amenities</SectionHeader>

                    <div className="flex flex-wrap gap-2">
                        {AMENITY_OPTIONS.map(item => {
                            const active = isAmenityActive(item);
                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleAmenity(item)}
                                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-150 cursor-pointer select-none ${
                                        active
                                            ? 'bg-[#1A2A0A] border-[#C8FB4C]/40 text-[#C8FB4C]'
                                            : 'bg-[#13161F] border-[#2A2D38] text-[#8A8FA8] hover:border-[#3A3D48] hover:text-[#FAFAF8]'
                                    }`}
                                >
                                    {active && <span className="mr-1">✓</span>}
                                    {item}
                                </button>
                            );
                        })}
                    </div>

                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 border-t border-[#1A1D26] bg-[#0F1117] flex items-center justify-between gap-4 shrink-0">
                    <p className="text-[10px] text-[#8A8FA8] font-medium">
                        Country cannot be changed — create a new listing to relist elsewhere.
                    </p>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-5 py-2 bg-[#C8FB4C] hover:bg-[#b5e243] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1117] text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(200,251,76,0.12)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                        >
                            {isSaving ? (
                                <span className="w-4 h-4 border-2 border-[#0F1117]/30 border-t-[#0F1117] rounded-full animate-spin" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyEditModal;