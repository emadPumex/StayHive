import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Star, Sparkles, Heart} from 'lucide-react';

const PropertyCard = ({property}) => {
    const {id, name, summary, propertyType, reviewScores, host, address, images} = property;
    const [liked, setLiked] = useState(false);

    const rooms = property.roomCategories || [];
    const prices = rooms.map(r => r.basePrice).filter(p => typeof p === 'number' && p > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const hasPriceRange = new Set(prices).size > 1;

    const rating = reviewScores?.reviewScoresRating;
    const isSuperhost = host?.hostIsSuperhost;
    const imageUrl = images?.coverImageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

    return (
        <Link to={`/property/${id}`} className="block group">
            <div
                className="bg-[#0F1117] border border-[#1A1D26] rounded-2xl overflow-hidden hover:border-[#2A2D38] transition-colors duration-300">

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#1A1D26]">
                    <img
                        src={imageUrl}
                        alt={name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <button
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLiked(!liked);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-[#0F1117]/80 hover:bg-[#0F1117] rounded-full flex items-center justify-center transition-colors z-10"
                        aria-label={liked ? 'Remove from saved' : 'Save'}
                    >
                        <Heart
                            className={`w-4 h-4 transition-all ${liked ? 'fill-rose-500 text-rose-500' : 'text-[#8A8FA8]'}`}/>
                    </button>

                    {isSuperhost && (
                        <span
                            className="absolute top-3 left-3 flex items-center gap-1 bg-[#C8FB4C] text-[#0F1117] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                            <Sparkles className="w-3 h-3"/> Superhost
                        </span>
                    )}

                    {propertyType && (
                        <span
                            className="absolute bottom-3 left-3 bg-[#0F1117]/70 text-[#8A8FA8] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase">
                            {propertyType}
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-[#8A8FA8] line-clamp-1">
                            {address?.city}, {address?.country}
                        </span>
                        {rating && (
                            <span
                                className="flex items-center gap-1 text-[11px] font-bold text-[#C8FB4C] bg-[#1A2A0A] px-2 py-0.5 rounded-md shrink-0">
                                <Star className="w-3 h-3 fill-[#C8FB4C]"/> {rating}%
                            </span>
                        )}
                    </div>

                    <h3 className="text-sm font-bold text-[#FAFAF8] line-clamp-1 group-hover:text-[#C8FB4C] transition-colors">
                        {name}
                    </h3>

                    {summary && (
                        <p className="text-xs text-[#8A8FA8] line-clamp-2">{summary}</p>
                    )}

                    <p className="text-sm mt-1">
                        {hasPriceRange && <span className="text-[#3A3D48] text-xs">from </span>}
                        <span className="font-black text-[#FAFAF8]">${minPrice}</span>
                        <span className="text-[#3A3D48] text-xs"> / night</span>
                    </p>
                </div>

            </div>
        </Link>
    );
};

export default PropertyCard;