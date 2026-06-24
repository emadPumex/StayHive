import React from 'react';
import { MapPin, Star, Sparkles } from 'lucide-react';

const PropertyHero = ({
    name,
    propertyType,
    isSuperhost,
    address,
    hasReviews,
    formattedRating,
    reviewCount,
}) => (
    <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-[#1A1D26] text-[#8A8FA8] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider border border-[#2A2D38]">
                {propertyType}
            </span>
            {isSuperhost && (
                <span className="flex items-center gap-1 bg-[#1A2A0A] text-[#A8D44A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                    <Sparkles className="w-3 h-3" /> Superhost
                </span>
            )}
        </div>

        <h1
            className="text-2xl sm:text-3xl font-black text-[#FAFAF8] tracking-tight leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {name}
        </h1>

        <div className="flex items-center gap-2 text-sm text-[#8A8FA8] mt-2 flex-wrap">
            <MapPin className="w-4 h-4 text-[#C8FB4C] shrink-0" />
            <span>{address?.city}, {address?.country}</span>
            {hasReviews && (
                <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#C8FB4C] bg-[#1A2A0A] px-2 py-0.5 rounded-md shrink-0">
                        <Star className="w-3 h-3 fill-[#C8FB4C]" /> {formattedRating} ({reviewCount})
                    </span>
                </>
            )}
        </div>
    </div>
);

export default PropertyHero;
