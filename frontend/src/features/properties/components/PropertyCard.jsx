import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Bed, Bath, Users, Sparkles, MapPin, Heart } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const { id, name, propertyType, roomType, price, accommodates, bedrooms, bathrooms, amenities, reviewScores, host, address, images } = property;
  const [liked, setLiked] = useState(false);

  const rating      = reviewScores?.reviewScoresRating;
  const isSuperhost = host?.hostIsSuperhost;
  const imageUrl    = images?.pictureUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

  return (
      <Link to={`/property/${id}`} className="block group">
        <div className="bg-[#0F1117] border border-[#1A1D26] rounded-2xl overflow-hidden flex flex-col h-full hover:border-[#2A2D38] transition-colors duration-300">

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1D26] shrink-0">
            <img
                src={imageUrl}
                alt={name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Like */}
            <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
                className="absolute top-3 right-3 w-8 h-8 bg-[#0F1117]/80 hover:bg-[#0F1117] rounded-full flex items-center justify-center transition-colors z-10"
                aria-label={liked ? 'Remove from saved' : 'Save'}
            >
              <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-rose-500 text-rose-500' : 'text-[#8A8FA8]'}`} />
            </button>

            {/* Superhost */}
            {isSuperhost && (
                <span className="absolute top-3 left-3 flex items-center gap-1 bg-[#C8FB4C] text-[#0F1117] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
              <Sparkles className="w-3 h-3" /> Superhost
            </span>
            )}

            {/* Type */}
            <span className="absolute bottom-3 left-3 bg-[#0F1117]/70 text-[#8A8FA8] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase">
            {propertyType}
          </span>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col flex-grow gap-3">

            {/* Location + Rating */}
            <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-[#8A8FA8]">
              <MapPin className="w-3.5 h-3.5 text-[#C8FB4C] shrink-0" />
              {address?.market}, {address?.country}
            </span>
              {rating && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#C8FB4C] bg-[#1A2A0A] px-2 py-0.5 rounded-md shrink-0">
                <Star className="w-3 h-3 fill-[#C8FB4C]" /> {rating}%
              </span>
              )}
            </div>

            {/* Name */}
            <div>
              <h3 className="text-sm font-bold text-[#FAFAF8] line-clamp-1 group-hover:text-[#C8FB4C] transition-colors">{name}</h3>
              <p className="text-[11px] text-[#3A3D48] mt-0.5">{roomType}</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-1 py-2 border-t border-b border-[#1A1D26] text-[11px] text-[#8A8FA8] font-medium">
              <div className="flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 shrink-0" /> {accommodates}
              </div>
              <div className="flex items-center justify-center gap-1 border-l border-r border-[#1A1D26]">
                <Bed className="w-3.5 h-3.5 shrink-0" /> {bedrooms}
              </div>
              <div className="flex items-center justify-center gap-1">
                <Bath className="w-3.5 h-3.5 shrink-0" /> {parseFloat(bathrooms)}
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1">
              {amenities?.slice(0, 3).map(a => (
                  <span key={a} className="text-[10px] font-semibold bg-[#1A1D26] text-[#8A8FA8] px-2 py-0.5 rounded-md">
                {a}
              </span>
              ))}
              {amenities?.length > 3 && (
                  <span className="text-[10px] text-[#3A3D48] px-1.5 py-0.5">+{amenities.length - 3} more</span>
              )}
            </div>

            {/* Price */}
            <div className="pt-2 mt-auto border-t border-[#1A1D26]">
              <span className="text-lg font-black text-[#FAFAF8]">${price}</span>
              <span className="text-xs text-[#3A3D48] font-medium"> / night</span>
            </div>

          </div>
        </div>
      </Link>
  );
};

export default PropertyCard;