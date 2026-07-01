import React from 'react';
import { Sparkles, BadgeCheck } from 'lucide-react';

const PropertyHostCard = ({ host, isSuperhost }) => {
    if (!host) return null;

    return (
        <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.04)] p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5">

            {/* Avatar — gradient ring matches reviewer fallback-avatar gradient */}
            <div className="shrink-0 p-[2px] rounded-full bg-gradient-to-br from-[#C8FB4C] to-[#7CA82E]">
                <img
                    src={host.profileImageUrl}
                    alt={host.hostName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#0F1117]"
                />
            </div>

            <div className="space-y-2.5 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <h4 className="text-[15px] font-black text-[#FAFAF8] tracking-[-0.01em]">
                        Hosted by {host.hostName}
                    </h4>
                    {isSuperhost && (
                        <span className="flex items-center gap-1 bg-[#C8FB4C]/10 border border-[#C8FB4C]/25 text-[#A8D44A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-[0.06em]">
                            <Sparkles className="w-3 h-3" /> Superhost
                        </span>
                    )}
                </div>
                <p className="text-xs text-[#8A8FA8] leading-relaxed max-w-md">
                    StayHive verified partners complete regular quality, internet bandwidth, and
                    sanitization inspections for a premium stay.
                </p>
                <div className="flex items-center gap-1.5 justify-center sm:justify-start text-[10px] font-bold text-[#3A3D48] uppercase tracking-wider pt-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#C8FB4C]" />
                    Verified host
                </div>
            </div>
        </div>
    );
};

export default PropertyHostCard;