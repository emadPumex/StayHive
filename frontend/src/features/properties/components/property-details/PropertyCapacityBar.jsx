import React from 'react';
import { Users, Bed, Bath } from 'lucide-react';

const PropertyCapacityBar = ({ accommodates, bedrooms, beds, bathrooms }) => {
    const stats = [
        { icon: Users, label: 'Guests',   val: `${accommodates} max` },
        { icon: Bed,   label: 'Bedrooms', val: `${bedrooms} ${bedrooms === 1 ? 'room' : 'rooms'}` },
        { icon: Bed,   label: 'Beds',     val: `${beds || bedrooms} beds` },
        { icon: Bath,  label: 'Baths',    val: `${bathrooms} baths` },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 bg-[#0F1117] border border-[#1A1D26] p-5 rounded-2xl text-center">
            {stats.map(({ icon: Icon, label, val }, i) => (
                <div key={label} className={`py-1 ${i > 0 ? 'border-l border-[#1A1D26]' : ''}`}>
                    <Icon className="w-5 h-5 text-[#C8FB4C] mx-auto mb-1.5" />
                    <div className="text-[10px] text-[#3A3D48] font-extrabold uppercase tracking-wider">{label}</div>
                    <div className="text-sm font-bold text-[#FAFAF8] mt-1">{val}</div>
                </div>
            ))}
        </div>
    );
};

export default PropertyCapacityBar;
