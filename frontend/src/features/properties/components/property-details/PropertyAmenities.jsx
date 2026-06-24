import React from 'react';
import { Check } from 'lucide-react';

const PropertyAmenities = ({ amenities = [] }) => (
    <div className="bg-[#0F1117] border border-[#1A1D26] p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-black text-[#FAFAF8]">Amenities offered</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {amenities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#8A8FA8] font-medium">
                    <div className="p-1.5 bg-[#1A2A0A] text-[#C8FB4C] rounded-lg shrink-0">
                        <Check className="w-3.5 h-3.5" />
                    </div>
                    {a}
                </div>
            ))}
        </div>
    </div>
);

export default PropertyAmenities;
