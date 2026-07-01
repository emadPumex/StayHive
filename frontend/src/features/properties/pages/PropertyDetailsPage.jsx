import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../../../context/AuthContext';
import { usePropertyDetails } from '../components/property-details/hooks/usePropertyDetails';
import { computeBookingTotals } from '../components/property-details/utils/bookingMath.js';

import RoomCategorySelector from '../components/property-details/RoomCategorySelector';
import RoomDetailsModal     from '../components/property-details/RoomDetailsModal';
import PropertyToolbar      from '../components/property-details/PropertyToolbar';
import PropertyHero         from '../components/property-details/PropertyHero';
import PropertyImageGrid    from '../components/property-details/PropertyImageGrid';
import PropertyCapacityBar  from '../components/property-details/PropertyCapacityBar';
import PropertyDescription  from '../components/property-details/PropertyDescription';
import PropertyAmenities    from '../components/property-details/PropertyAmenities';
import PropertyHostCard     from '../components/property-details/PropertyHostCard';
import ReviewsSection       from '../components/property-details/ReviewsSection';
import BookingWidget        from '../components/property-details/BookingWidget';

const LoaderSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C8FB4C] border-t-transparent" />
);

const PropertyDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const {
        property, reviews, rooms, isMultiUnit,
        averageRating, reviewCount, hasReviews, formattedRating, percentageRating,
        gridImages, isLoading, error,
    } = usePropertyDetails(id);

    const [isLiked, setIsLiked] = useState(false);
    const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
    const [checkOut, setCheckOut] = useState(() => {
        const t = new Date(); t.setDate(t.getDate() + 1);
        return t.toISOString().slice(0, 10);
    });
    const [guests, setGuests] = useState(2);

    // confirmedRoomId = what BookingWidget actually books.
    // previewRoomId = whatever the modal is currently showing — NOT yet committed.
    const [confirmedRoomId, setConfirmedRoomId] = useState(null);
    const [previewRoomId, setPreviewRoomId] = useState(null);

    const bookingRoom = rooms.find(r => r.id === confirmedRoomId) || rooms[0] || property;
    const previewRoom = rooms.find(r => r.id === previewRoomId) || null;

    const { name, propertyType, host, address, summary } = property;
    const isSuperhost = host?.hostIsSuperhost;

    const blockedDates = [
        ...(property.propertyBlockRules || []),
        ...(bookingRoom.roomBlockRules || []),
    ];
    const accommodates = bookingRoom.accommodates || property.accommodates || 1;
    const propertyAmenities = property.propertyAmenities || [];

    const { price, nights, baseRate, cleaningFee, serviceFee, total } =
        computeBookingTotals({ room: bookingRoom, property, checkIn, checkOut });

    const handleReserve = () => {
        if (!checkIn || !checkOut) return toast.error('Please select both check-in and check-out dates.');
        if (new Date(checkOut) <= new Date(checkIn)) return toast.error('Check-out date must be after check-in date.');
        toast.success('Secure gateway loaded', { description: `${nights} nights · ${guests} guest(s) · Total: $${total}` });
    };

    const handleConfirmRoomSelect = (roomId) => {
        setConfirmedRoomId(roomId);
        setPreviewRoomId(null);
        toast.success(`Selected: ${rooms.find(r => r.id === roomId)?.name}`);
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <LoaderSpinner />
            <span className="text-sm font-semibold text-[#8A8FA8]">Loading stay details...</span>
        </div>
    );

    if (error || !property?.id) return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="p-3 bg-red-950 text-red-400 rounded-2xl inline-flex mb-4">
                <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#FAFAF8] mb-1">Stay detail error</h3>
            <p className="text-sm text-[#8A8FA8] mb-6">{error || 'Property could not be loaded.'}</p>
            <Link to="/properties" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8FB4C] text-[#0F1117] font-bold rounded-xl text-xs hover:opacity-90 transition-opacity">
                <ArrowLeft className="w-4 h-4" /> Back to listings
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B0C10] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">

                <PropertyToolbar isLiked={isLiked} onToggleLike={() => setIsLiked(v => !v)} />
                <PropertyHero
                    name={name} propertyType={propertyType} isSuperhost={isSuperhost} address={address}
                    hasReviews={hasReviews} formattedRating={formattedRating} reviewCount={reviewCount}
                />
                <PropertyImageGrid gridImages={gridImages} name={name} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        {!isMultiUnit && (
                            <PropertyCapacityBar
                                accommodates={property.accommodates || 1}
                                bedrooms={property.bedroomCount || 0}
                                beds={property.bedCount || 0}
                                bathrooms={property.bathrooms || 1}
                                isRange={false}
                            />
                        )}

                        <PropertyDescription summary={summary} roomType={property.roomType} />
                        <PropertyAmenities propertyAmenities={propertyAmenities} roomAmenities={[]} />

                        {isMultiUnit && (
                            <RoomCategorySelector
                                rooms={rooms}
                                selectedRoomId={confirmedRoomId}
                                onSelect={setPreviewRoomId}
                            />
                        )}

                        <PropertyHostCard host={host} isSuperhost={isSuperhost} />
                        <ReviewsSection
                            initialReviews={reviews} averageRating={averageRating} hasReviews={hasReviews}
                            formattedRating={formattedRating} user={user} propertyId={id} propertyHostId={host?.hostId}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <BookingWidget
                            key={bookingRoom.id || 'base'}
                            price={price} hasReviews={hasReviews} percentageRating={percentageRating}
                            checkIn={checkIn} checkOut={checkOut} guests={guests} accommodates={accommodates}
                            totalInventory={bookingRoom.totalInventory} roomId={bookingRoom.id}
                            nights={nights} baseRate={baseRate} cleaningFee={cleaningFee} serviceFee={serviceFee} total={total}
                            blockedDates={blockedDates}
                            onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} onGuestsChange={setGuests}
                            onReserve={handleReserve}
                        />
                    </div>
                </div>
            </div>

            <RoomDetailsModal
                room={previewRoom}
                isOpen={Boolean(previewRoom)}
                onClose={() => setPreviewRoomId(null)}
                onConfirmSelect={handleConfirmRoomSelect}
            />
        </div>
    );
};

export default PropertyDetailsPage;