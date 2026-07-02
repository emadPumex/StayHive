import React from 'react';
import {AMENITY_CATALOG} from '../utils';

const AmenityPicker = ({selectedIds, onToggle, catalog = AMENITY_CATALOG}) => (
    <div className="flex flex-wrap gap-2">
        {catalog.map(item => {
            const active = selectedIds.includes(item.id);
            const Icon = item.icon;
            return (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggle(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-150 cursor-pointer select-none ${
                        active
                            ? 'bg-[#1A2A0A] border-[#C8FB4C]/40 text-[#C8FB4C]'
                            : 'bg-[#13161F] border-[#2A2D38] text-[#8A8FA8] hover:border-[#3A3D48] hover:text-[#FAFAF8]'
                    }`}
                >
                    {Icon && <Icon className="w-3 h-3"/>}
                    {item.label}
                </button>
            );
        })}
    </div>
);

export default AmenityPicker;