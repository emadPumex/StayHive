import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import PropertyCapacityBar from './PropertyCapacityBar';
import PropertyAmenities from './PropertyAmenities';

const RoomDetailsModal = ({ room, isOpen, onClose, onConfirmSelect }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen || !room) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0C10]/85 backdrop-blur-md transition-all duration-300">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="bg-[#0F1117] border border-[#1A1D26] rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.7)] relative z-10 animate-in fade-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between p-5 border-b border-[#1A1D26] bg-[#0F1117]">
                    <div>
                        <span className="text-[10px] font-bold text-[#C8FB4C] uppercase tracking-widest bg-[#1A2A0A] px-2 py-0.5 rounded-md">
                            Room Details
                        </span>
                        <h3 className="text-lg font-bold text-[#FAFAF8] mt-1">{room.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-[#1A1D26]/50 hover:bg-[#1A1D26] text-[#8A8FA8] hover:text-[#FAFAF8] transition-all duration-200"
                        aria-label="Close details"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {((room.images?.imageUrls?.length) || room.images?.coverImageUrl) && (
                        <div className="relative group">
                            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
                                {room.images?.imageUrls?.length ? (
                                    room.images.imageUrls.map((url, index) => (
                                        <div key={index} className="w-[92%] sm:w-[88%] h-60 flex-shrink-0 snap-start">
                                            <img
                                                src={url}
                                                alt={`${room.name} gallery item ${index + 1}`}
                                                className="w-full h-full object-cover rounded-2xl select-none pointer-events-none border border-[#1A1D26]"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full h-60 flex-shrink-0 snap-start">
                                        <img
                                            src={room.images?.coverImageUrl}
                                            alt={room.name}
                                            className="w-full h-full object-cover rounded-2xl select-none pointer-events-none border border-[#1A1D26]"
                                        />
                                    </div>
                                )}
                            </div>
                            {room.images?.imageUrls?.length > 1 && (
                                <div className="absolute right-3 bottom-3 bg-[#0B0C10]/80 backdrop-blur text-[10px] text-[#8A8FA8] font-bold px-2.5 py-1.5 rounded-xl tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-[#1A1D26]">
                                    Drag or Swipe &rarr;
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-[#0B0C10]/40 border border-[#1A1D26] rounded-2xl p-1">
                        <PropertyCapacityBar
                            accommodates={room.accommodates || 1}
                            bedrooms={room.bedroomCount || 0}
                            beds={room.bedCount || 0}
                            bathrooms={room.bathrooms || 1}
                            isRange={false}
                        />
                    </div>

                    <div className="border-t border-[#1A1D26] pt-5">
                        <h4 className="text-xs font-bold text-[#8A8FA8] uppercase tracking-wider mb-3">
                            Included Room Amenities
                        </h4>
                        <PropertyAmenities propertyAmenities={[]} roomAmenities={room.roomAmenities || []} />
                    </div>
                </div>

                <div className="p-4 border-t border-[#1A1D26] bg-[#0F1117] flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-[#8A8FA8] font-medium">Rate for this room type</p>
                        <p className="text-base font-extrabold text-[#C8FB4C] tabular-nums">
                            ${room.basePrice}<span className="text-[#6A8A3A] text-xs font-semibold">/night</span>
                        </p>
                    </div>
                    <button
                        onClick={() => onConfirmSelect(room.id)}
                        className="px-5 py-2.5 bg-[#C8FB4C] hover:bg-[#b2e240] text-[#0F1117] text-xs font-bold rounded-xl shadow-lg transition-colors duration-200"
                    >
                        Select Room Type
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsModal;