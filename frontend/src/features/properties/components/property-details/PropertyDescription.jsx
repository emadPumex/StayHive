import React from 'react';

const PropertyDescription = ({ summary, roomType }) => (
    <div className="bg-[#0F1117] border border-[#1A1D26] p-6 rounded-2xl space-y-3">
        <h3 className="text-base font-black text-[#FAFAF8]">About this stay</h3>
        <p className="text-sm text-[#8A8FA8] leading-relaxed">
            {summary || 'Enjoy a verified, clean booking experience directly linked to property owners.'}
        </p>
        <p className="text-sm text-[#3A3D48] leading-relaxed">
            Configured as <span className="font-semibold text-[#8A8FA8]">{roomType}</span>. Ideal for
            tourists, business nomads, and luxury travelers.
        </p>
    </div>
);

export default PropertyDescription;
