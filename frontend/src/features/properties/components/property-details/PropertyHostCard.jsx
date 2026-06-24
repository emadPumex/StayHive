import React from 'react';
import { Sparkles } from 'lucide-react';

const PropertyHostCard = ({ host, isSuperhost }) => {
    if (!host) return null;

    return (
        <div className="bg-[#0F1117] border border-[#1A1D26] p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
                src={host.profileImageUrl}
                alt={host.hostName}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#2A2D38] shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <h4 className="text-sm font-black text-[#FAFAF8]">Hosted by {host.hostName}</h4>
                    {isSuperhost && (
                        <span className="bg-[#1A2A0A] text-[#A8D44A] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Superhost
                        </span>
                    )}
                </div>
                <p className="text-xs text-[#3A3D48] leading-relaxed">
                    StayHive verified partners complete regular quality, internet bandwidth, and
                    sanitization inspections for a premium stay.
                </p>
            </div>
        </div>
    );
};

export default PropertyHostCard;
