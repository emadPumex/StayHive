import React from 'react';
import {Users, Bed, Bath} from 'lucide-react';

const PropertyCapacityBar = ({accommodates, bedrooms, beds, bathrooms, isRange}) => {
    const stats = [
        {icon: Users, label: 'Guests', val: `${accommodates} max`},
        {icon: Bed, label: 'Bedrooms', val: `${bedrooms} ${bedrooms === 1 ? 'room' : 'rooms'}`},
        {icon: Bed, label: 'Beds', val: `${beds || bedrooms} beds`},
        {icon: Bath, label: 'Baths', val: `${bathrooms} baths`},
    ];

    return (
        <div className="grid grid-cols-4 gap-4 bg-[#0F1117] border border-[#1A1D26] p-5 rounded-2xl text-center">
            {isRange && (<p className="col-span-4 text-[10px] text-[#3A3D48] font-bold uppercase tracking-wider -mb-1">
                Showing first available room · varies by selection
            </p>)}
            {stats.map(({icon: Icon, label, val}, i) => (
                <div key={label} className={`py-1 ${i > 0 ? 'border-l border-[#1A1D26]' : ''}`}>
                    <Icon className="w-5 h-5 text-[#C8FB4C] mx-auto mb-1.5"/>
                    <div className="text-[10px] text-white font-extrabold uppercase tracking-wider">{label}</div>
                    <div className="text-sm font-bold text-[j] mt-1 text-white">{val}</div>
                </div>
            ))}
        </div>
    );
};

export default PropertyCapacityBar;
