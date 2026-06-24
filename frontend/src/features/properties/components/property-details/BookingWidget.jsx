import React from 'react';
import { Star, Users, ShieldCheck } from 'lucide-react';

const BookingWidget = ({
    price,
    hasReviews,
    percentageRating,
    checkIn,
    checkOut,
    guests,
    nights,
    baseRate,
    cleaningFee,
    serviceFee,
    total,
    onCheckInChange,
    onCheckOutChange,
    onGuestsChange,
    onReserve,
}) => (
    <div className="bg-[#0F1117] border border-[#1A1D26] rounded-2xl p-6 sticky top-24 space-y-5">

        {/* Price + rating badge */}
        <div className="flex items-baseline justify-between">
            <div>
                <span className="text-2xl font-black text-[#FAFAF8]">${price}</span>
                <span className="text-xs text-[#3A3D48] font-bold uppercase tracking-wider"> / night</span>
            </div>
            {hasReviews && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#C8FB4C] bg-[#1A2A0A] px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-[#C8FB4C]" /> {percentageRating}%
                </span>
            )}
        </div>

        {/* Date + guest pickers */}
        <div className="border border-[#2A2D38] rounded-xl overflow-hidden divide-y divide-[#2A2D38]">
            <div className="grid grid-cols-2 divide-x divide-[#2A2D38]">
                <div className="p-3 bg-[#1A1D26] hover:bg-[#2A2D38] transition-colors">
                    <label className="block text-[9px] font-extrabold text-[#3A3D48] uppercase tracking-wider mb-1">
                        Check-in
                    </label>
                    <input
                        type="date"
                        value={checkIn}
                        onChange={e => onCheckInChange(e.target.value)}
                        className="text-xs font-bold text-[#FAFAF8] bg-transparent focus:outline-none w-full cursor-pointer"
                    />
                </div>
                <div className="p-3 bg-[#1A1D26] hover:bg-[#2A2D38] transition-colors">
                    <label className="block text-[9px] font-extrabold text-[#3A3D48] uppercase tracking-wider mb-1">
                        Check-out
                    </label>
                    <input
                        type="date"
                        value={checkOut}
                        onChange={e => onCheckOutChange(e.target.value)}
                        className="text-xs font-bold text-[#FAFAF8] bg-transparent focus:outline-none w-full cursor-pointer"
                    />
                </div>
            </div>
            <div className="p-3 bg-[#1A1D26] hover:bg-[#2A2D38] transition-colors">
                <label className="block text-[9px] font-extrabold text-[#3A3D48] uppercase tracking-wider mb-1">
                    Guests
                </label>
                <div className="flex items-center justify-between">
                    <select
                        value={guests}
                        onChange={e => onGuestsChange(parseInt(e.target.value, 10))}
                        className="text-xs font-bold text-[#FAFAF8] bg-transparent focus:outline-none w-full cursor-pointer appearance-none"
                    >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                    <Users className="w-4 h-4 text-[#3A3D48] pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Reserve button */}
        <button
            onClick={onReserve}
            className="w-full py-3.5 bg-[#C8FB4C] hover:opacity-90 text-[#0F1117] font-bold rounded-xl transition-opacity text-sm cursor-pointer"
        >
            Reserve stay
        </button>
        <p className="text-[10px] text-[#3A3D48] text-center font-semibold">You won't be charged yet</p>

        {/* Fee breakdown */}
        <div className="pt-4 border-t border-[#1A1D26] space-y-2.5 text-xs text-[#8A8FA8] font-semibold">
            {[
                [`$${price} × ${nights} night${nights > 1 ? 's' : ''}`, `$${baseRate}`],
                ['Cleaning fee', `$${cleaningFee}`],
                ['StayHive service fee', `$${serviceFee}`],
            ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                    <span className="underline decoration-dotted cursor-pointer hover:text-[#FAFAF8] transition-colors">
                        {label}
                    </span>
                    <span>{val}</span>
                </div>
            ))}
            <div className="flex justify-between text-sm font-black text-[#FAFAF8] pt-3 border-t border-[#1A1D26]">
                <span>Total before taxes</span>
                <span>${total}</span>
            </div>
        </div>

        {/* Protection badge */}
        <div className="p-3.5 bg-[#1A2A0A] border border-[#2A4010] rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#C8FB4C] shrink-0 mt-0.5" />
            <div>
                <span className="text-[10px] font-extrabold text-[#A8D44A] uppercase tracking-wider block mb-0.5">
                    StayHive Protection
                </span>
                <p className="text-[10px] text-[#6A8A3A] leading-relaxed">
                    Verified photos, secured escrow processing, and automated refunds if canceled within 24h.
                </p>
            </div>
        </div>
    </div>
);

export default BookingWidget;
