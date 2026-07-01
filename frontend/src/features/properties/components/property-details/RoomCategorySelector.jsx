import React from 'react';

const RoomCategorySelector = ({rooms, selectedRoomId, onSelect}) => {
    if (!rooms || rooms.length === 0) return null;

    return (
        <div className="bg-[#0F1117] border border-[#1A1D26] p-6 rounded-2xl space-y-4">
            <div className="space-y-1">
                <h3 className="text-lg font-black text-[#FAFAF8]">Available Room Types</h3>
                <p className="text-sm text-[#8A8FA8]">Click a room to view details and select it for booking.</p>
            </div>

            <div className="grid gap-3">
                {rooms.map(r => {
                    // Visually highlight if it's the currently selected room for the booking widget
                    const active = (selectedRoomId || rooms[0].id) === r.id;

                    return (
                        <button
                            key={r.id}
                            onClick={() => onSelect(r.id)}
                            className={`flex gap-4 p-4 rounded-2xl border text-left transition-all duration-200
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FB4C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117]
                                ${active
                                ? 'border-[#C8FB4C]/40 bg-[#1A2A0A] shadow-[0_0_0_1px_#C8FB4C,0_4px_16px_-4px_rgba(200,251,76,0.15)]'
                                : 'border-[#2A2D38] bg-[#1A1D26] hover:border-[#3A3D48] hover:-translate-y-0.5'}`}
                        >
                            <img
                                src={r.images?.coverImageUrl || '/api/placeholder/80/80'}
                                alt={r.name}
                                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                {r.id && (
                                    <span
                                        className="inline-block self-start text-[9px] font-extrabold text-[#C8FB4C] uppercase tracking-wider bg-[#1A2A0A] px-2 py-0.5 rounded-md mb-1.5">
                                        {r.id.replace(/_/g, ' ')}
                                    </span>
                                )}
                                <p className="font-bold text-[#FAFAF8] text-base truncate">{r.name}</p>
                                <p className="text-xs text-[#8A8FA8] mt-0.5">
                                    {r.accommodates} guests · {r.bedroomCount} bedrooms · {r.bathrooms} bath
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-sm font-bold text-[#C8FB4C] tabular-nums">
                                        ${r.basePrice}<span
                                        className="text-[#6A8A3A] font-semibold text-xs">/night</span>
                                    </p>
                                    <span
                                        className="text-xs text-[#8A8FA8] font-medium hover:text-[#FAFAF8] transition-colors">
                                        View details &rarr;
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RoomCategorySelector;