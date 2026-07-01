import React from 'react';
import { Star, Users, ShieldCheck } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BookingWidget = ({
                           price,
                           accommodates,
                           totalInventory,
                           roomId,
                           hasReviews,
                           percentageRating,
                           checkIn,       // e.g., "2026-07-04"
                           checkOut,      // e.g., "2026-07-05"
                           guests,
                           nights,
                           baseRate,
                           cleaningFee,
                           serviceFee,
                           total,
                           blockedDates = [], // Array of ISO strings: ["2026-07-04T00:00:00.000+00:00"]
                           onCheckInChange,
                           onCheckOutChange,
                           onGuestsChange,
                           onReserve,
                       }) => {

    const soldOut = totalInventory === 0;
    const overCapacity = guests > accommodates;

    // 1. Convert the backend ISO array into clean JS Date Objects for the calendar view
    const excludedDatesList = blockedDates.map(dateStr => new Date(dateStr));

    // 2. Format local date back to "YYYY-MM-DD" string when a calendar day is picked
    const formatToBackendString = (dateObj) => {
        if (!dateObj) return "";
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="bg-[#0F1117] border border-[#1A1D26] rounded-2xl p-6 sticky top-24 space-y-5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">

            {/* Price + rating badge */}
            <div className="flex items-baseline justify-between">
                <div>
                    <span className="text-[26px] font-black text-[#FAFAF8] tabular-nums">${price}</span>
                    <span className="text-xs text-[#3A3D48] font-bold uppercase tracking-wider"> / night</span>
                </div>
                {hasReviews && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#C8FB4C] bg-[#1A2A0A] px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-[#C8FB4C]" /> {percentageRating}%
                    </span>
                )}
            </div>

            {/* Date + guest pickers */}
            <div className="border border-[#2A2D38] rounded-2xl divide-y divide-[#2A2D38] overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-[#2A2D38]">

                    {/* Check-in DatePicker */}
                    <div className="p-3 bg-[#1A1D26] hover:bg-[#2A2D38] transition-colors relative z-20">
                        <label className="block text-[9px] font-extrabold text-[#3A3D48] uppercase tracking-wider mb-1">
                            Check-in
                        </label>
                        <DatePicker
                            selected={checkIn ? new Date(`${checkIn}T00:00:00`) : null}
                            onChange={(date) => onCheckInChange(formatToBackendString(date))}
                            minDate={new Date()}
                            excludeDates={excludedDatesList}
                            portalId="datepicker-portal"
                            popperClassName="z-[9999]"
                            popperPlacement="bottom-start"
                            placeholderText="Select date"
                            className="text-xs font-bold text-[#FAFAF8] bg-transparent focus:outline-none w-full cursor-pointer tabular-nums"
                        />
                    </div>

                    {/* Check-out DatePicker */}
                    <div className="p-3 bg-[#1A1D26] hover:bg-[#2A2D38] transition-colors relative z-20">
                        <label className="block text-[9px] font-extrabold text-[#3A3D48] uppercase tracking-wider mb-1">
                            Check-out
                        </label>
                        <DatePicker
                            selected={checkOut ? new Date(`${checkOut}T00:00:00`) : null}
                            onChange={(date) => onCheckOutChange(formatToBackendString(date))}
                            minDate={checkIn ? new Date(`${checkIn}T00:00:00`) : new Date()}
                            excludeDates={excludedDatesList}
                            popperClassName="z-[9999]"
                            popperPlacement="bottom-start"
                            portalId="datepicker-portal"
                            placeholderText="Select date"
                            className="text-xs font-bold text-[#FAFAF8] bg-transparent focus:outline-none w-full cursor-pointer tabular-nums"
                        />
                    </div>
                </div>

                {/* Guest dropdown element — capped to room capacity */}
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
                            {Array.from({ length: accommodates || 6 }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                        <Users className="w-4 h-4 text-[#3A3D48] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Inline warnings */}
            {overCapacity && (
                <p className="text-[10px] font-bold text-[#F87171] text-center -mt-2">
                    Max {accommodates} guest{accommodates > 1 ? 's' : ''} for this room
                </p>
            )}
            {totalInventory != null && totalInventory <= 3 && totalInventory > 0 && (
                <p className="text-[10px] font-bold text-[#F87171] text-center -mt-2">
                    Only {totalInventory} left at this price
                </p>
            )}

            {/* Reserve button */}
            <button
                onClick={onReserve}
                disabled={soldOut || overCapacity}
                className={`w-full py-3.5 font-bold rounded-xl text-sm transition-all duration-200 active:scale-[0.98]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FB4C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117] ${
                    soldOut || overCapacity
                        ? 'bg-[#2A2D38] text-[#3A3D48] cursor-not-allowed'
                        : 'bg-[#C8FB4C] hover:bg-[#D4FF66] text-[#0F1117] cursor-pointer shadow-[0_4px_20px_-4px_rgba(200,251,76,0.5)] hover:shadow-[0_6px_24px_-4px_rgba(200,251,76,0.65)]'
                }`}
            >
                {soldOut ? 'Sold out' : overCapacity ? 'Too many guests' : 'Reserve stay'}
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
                        <span className="underline decoration-dotted decoration-[#3A3D48] underline-offset-2 cursor-pointer hover:text-[#FAFAF8] transition-colors">
                            {label}
                        </span>
                        <span className="tabular-nums">{val}</span>
                    </div>
                ))}
                <div className="flex justify-between text-[15px] font-black text-[#FAFAF8] pt-3 border-t border-[#1A1D26]">
                    <span>Total before taxes</span>
                    <span className="tabular-nums">${total}</span>
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
};

export default BookingWidget;