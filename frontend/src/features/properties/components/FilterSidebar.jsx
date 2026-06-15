import React, { useEffect, useState } from 'react';
import {
  X, MapPin, Home, DollarSign, Users, Sparkles,
  UserCheck, Star, Calendar, ShieldCheck, RefreshCw
} from 'lucide-react';
import { getLocationsMetadata } from '../api/propertyApi';

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#1A1D26]">
      <Icon className="w-4 h-4 text-[#C8FB4C]" />
      <span className="text-xs font-semibold text-[#FAFAF8] tracking-tight">{title}</span>
    </div>
);

const selectCls = "w-full bg-[#1A1D26] border border-[#2A2D38] rounded-lg py-2 px-3 text-sm text-[#FAFAF8] focus:outline-none focus:border-[#C8FB4C] transition-colors cursor-pointer";
const counterBtn = "w-7 h-7 bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] text-[#FAFAF8] font-bold rounded-full flex items-center justify-center transition-colors cursor-pointer text-sm";

const amenitiesList = ['Wifi','Kitchen','Air conditioning','Pool','Free parking','Washer','Dryer','Heating','Pets allowed'];
const propertyTypes  = ['Apartment','House','Villa','Cabin','Loft','Condo'];
const roomTypes      = ['Entire home/apt','Private room','Shared room'];

const FilterSidebar = ({ filters, onChangeFilters, onClearFilters, isMobileDrawer = false, onCloseMobile }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [locations, setLocations] = useState({ countries: [], marketsByCountry: {} });

  useEffect(() => { setLocalFilters(filters); }, [filters]);

  useEffect(() => {
    (async () => {
      try {
        const meta = await getLocationsMetadata();
        setLocations(meta || { countries: [], marketsByCountry: {} });
      } catch (err) { console.error('Failed to fetch metadata:', err); }
    })();
  }, []);

  const handleUpdate = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    if (key === 'country') updated.market = '';
    setLocalFilters(updated);
    onChangeFilters(updated);
  };

  const handleCounter = (key, dir) => {
    const cur = parseInt(localFilters[key], 10) || 0;
    const next = Math.max(0, dir === 'inc' ? cur + 1 : cur - 1);
    handleUpdate(key, next === 0 ? '' : next);
  };

  const toggleAmenity = (a) => {
    const cur = localFilters.amenities || [];
    handleUpdate('amenities', cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a]);
  };

  const Counter = ({ label, sub, field }) => (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#FAFAF8]">{label}</p>
          <p className="text-[10px] text-[#8A8FA8]">{sub}</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className={counterBtn} onClick={() => handleCounter(field, 'dec')}>−</button>
          <span className="text-sm font-semibold text-[#FAFAF8] w-4 text-center">{localFilters[field] || 0}</span>
          <button type="button" className={counterBtn} onClick={() => handleCounter(field, 'inc')}>+</button>
        </div>
      </div>
  );

  const cancelPolicies = ['Flexible', 'Moderate', 'Strict'];

  const content = (
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1D26]">
          <div>
            <h2 className="text-base font-bold text-[#FAFAF8]">Filters</h2>
            <p className="text-[11px] text-[#8A8FA8]">Refine your perfect stay</p>
          </div>
          <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs font-semibold text-[#C8FB4C] hover:opacity-75 transition-opacity"
          >
            <RefreshCw className="w-3 h-3" /> Clear all
          </button>
        </div>

        {/* Location */}
        <div>
          <SectionHeader icon={MapPin} title="Location" />
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8A8FA8] mb-1">Country</label>
              <select value={localFilters.country || ''} onChange={e => handleUpdate('country', e.target.value)} className={selectCls}>
                <option value="">Any country</option>
                {locations.countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8A8FA8] mb-1">City / Market</label>
              <select
                  value={localFilters.market || ''}
                  onChange={e => handleUpdate('market', e.target.value)}
                  disabled={!localFilters.country}
                  className={`${selectCls} ${!localFilters.country ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <option value="">Any city</option>
                {localFilters.country && locations.marketsByCountry[localFilters.country]?.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <SectionHeader icon={Home} title="Property Type" />
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8A8FA8] mb-1">Type</label>
              <select value={localFilters.propertyType || ''} onChange={e => handleUpdate('propertyType', e.target.value)} className={selectCls}>
                <option value="">Any type</option>
                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8A8FA8] mb-1">Room setup</label>
              <select value={localFilters.roomType || ''} onChange={e => handleUpdate('roomType', e.target.value)} className={selectCls}>
                <option value="">Any setup</option>
                {roomTypes.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Price */}
        <div>
          <SectionHeader icon={DollarSign} title="Price Range" />
          <div className="grid grid-cols-2 gap-3">
            {[['minPrice','Min ($)','0'],['maxPrice','Max ($)','500']].map(([field, label, ph]) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold text-[#8A8FA8] mb-1">{label}</label>
                  <input
                      type="number"
                      value={localFilters[field] || ''}
                      onChange={e => handleUpdate(field, e.target.value)}
                      placeholder={ph}
                      className="w-full bg-[#1A1D26] border border-[#2A2D38] rounded-lg py-2 px-3 text-sm text-[#FAFAF8] placeholder-[#3A3D48] focus:outline-none focus:border-[#C8FB4C] transition-colors"
                  />
                </div>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div>
          <SectionHeader icon={Users} title="Capacity" />
          <div className="space-y-4">
            <Counter label="Guests"    sub="Total accommodates" field="accommodates" />
            <Counter label="Bedrooms"  sub="Separate rooms"     field="bedrooms"     />
            <Counter label="Bathrooms" sub="Total bathrooms"    field="bathrooms"    />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <SectionHeader icon={Sparkles} title="Amenities" />
          <div className="space-y-2">
            {amenitiesList.map(a => {
              const checked = (localFilters.amenities || []).includes(a);
              return (
                  <label key={a} className="flex items-center gap-3 text-xs text-[#8A8FA8] hover:text-[#FAFAF8] cursor-pointer transition-colors select-none">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAmenity(a)}
                        className="rounded border-[#2A2D38] bg-[#1A1D26] text-[#C8FB4C] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    {a}
                  </label>
              );
            })}
          </div>
        </div>

        {/* Host & Availability */}
        <div>
          <SectionHeader icon={UserCheck} title="Host & Availability" />
          <div className="space-y-3">
            {[
              { field: 'isSuperhost', label: 'Superhost listings only', checked: localFilters.isSuperhost || false },
              { field: 'available30', label: 'Available next 30 days',  checked: localFilters.available30  || false },
            ].map(({ field, label, checked }) => (
                <label key={field} className="flex items-center gap-3 text-xs text-[#8A8FA8] hover:text-[#FAFAF8] cursor-pointer transition-colors select-none">
                  <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => handleUpdate(field, e.target.checked)}
                      className="rounded border-[#2A2D38] bg-[#1A1D26] text-[#C8FB4C] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">{label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <SectionHeader icon={Star} title="Minimum Rating" />
          <select value={localFilters.minRating || ''} onChange={e => handleUpdate('minRating', e.target.value)} className={selectCls}>
            <option value="">Any rating</option>
            <option value="90">Excellent (90+)</option>
            <option value="80">Very good (80+)</option>
            <option value="70">Good (70+)</option>
          </select>
        </div>

        {/* Cancellation */}
        <div>
          <SectionHeader icon={ShieldCheck} title="Cancellation Policy" />
          <div className="grid grid-cols-3 gap-1 bg-[#1A1D26] p-1 rounded-xl">
            {cancelPolicies.map(p => (
                <button
                    key={p}
                    type="button"
                    onClick={() => handleUpdate('cancellationPolicy', localFilters.cancellationPolicy === p ? '' : p)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        localFilters.cancellationPolicy === p
                            ? 'bg-[#C8FB4C] text-[#0F1117]'
                            : 'text-[#8A8FA8] hover:text-[#FAFAF8]'
                    }`}
                >
                  {p}
                </button>
            ))}
          </div>
        </div>

      </div>
  );

  if (isMobileDrawer) {
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={onCloseMobile} className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-xs bg-[#0F1117] border-l border-[#1A1D26] h-full flex flex-col z-10">
            <button
                onClick={onCloseMobile}
                className="absolute top-4 left-4 p-1.5 rounded-lg border border-[#2A2D38] text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="overflow-y-auto flex-1 px-5 pt-14 pb-8">{content}</div>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-[#0F1117] border border-[#1A1D26] rounded-2xl p-5 sticky top-20 self-start max-h-[85vh] overflow-y-auto">
        {content}
      </div>
  );
};

export default FilterSidebar;