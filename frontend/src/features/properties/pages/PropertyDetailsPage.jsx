import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

import { getListingById } from '../api/propertyApi';
import { useAuth } from '../../../context/AuthContext';

import PropertyToolbar     from '../components/property-details/PropertyToolbar';
import PropertyHero        from '../components/property-details/PropertyHero';
import PropertyImageGrid   from '../components/property-details/PropertyImageGrid';
import PropertyCapacityBar from '../components/property-details/PropertyCapacityBar';
import PropertyDescription from '../components/property-details/PropertyDescription';
import PropertyAmenities   from '../components/property-details/PropertyAmenities';
import PropertyHostCard    from '../components/property-details/PropertyHostCard';
import ReviewsSection      from '../components/property-details/ReviewsSection';
import BookingWidget       from '../components/property-details/BookingWidget';

/* ── Loader ── */
const LoaderSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C8FB4C] border-t-transparent" />
);

const PropertyDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    /* ── Data ── */
    const [propertyPayload, setPropertyPayload] = useState(null);
    const [isLoading, setIsLoading]             = useState(true);
    const [error, setError]                     = useState(null);

    /* ── UI state ── */
    const [isLiked,   setIsLiked]   = useState(false);
    const [checkIn,   setCheckIn]   = useState('2026-06-12');
    const [checkOut,  setCheckOut]  = useState('2026-06-19');
    const [guests,    setGuests]    = useState(2);

    /* ── Fetch ── */
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setIsLoading(true);
                setError(null);
                setPropertyPayload(await getListingById(id));
            } catch (err) {
                setError(err.message || 'Property could not be loaded.');
            } finally {
                setIsLoading(false);
            }
        })();
    }, [id]);

    /* ── Derived values ── */
    const { property = {}, reviews = [] } = propertyPayload || {};

    const {
        name, propertyType, roomType,
        price = 0, accommodates = 1, bedrooms = 0, beds, bathrooms = 1,
        amenities = [], host, address, images, summary,
    } = property;

    const averageRating    = property.averageRating ?? 0.0;
    const reviewCount      = property.reviewCount   ?? 0;
    const hasReviews       = reviewCount > 0 && averageRating > 0;
    const formattedRating  = useMemo(() => averageRating.toFixed(1), [averageRating]);
    const percentageRating = useMemo(() => Math.round(averageRating * 20), [averageRating]);
    const isSuperhost      = host?.hostIsSuperhost;

    const mainImage  = images?.coverImageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
    const otherImages = images?.imageUrls || [];
    const gridImages = useMemo(() => [
        mainImage,
        ...otherImages.filter(url => url !== mainImage),
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80',
    ].slice(0, 5), [mainImage, otherImages]);

    const nights     = (() => { try { return Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000) || 7; } catch { return 7; } })();
    const baseRate   = price * nights;
    const cleaningFee = property?.cleaningFee ?? 0;
    const serviceFee = Math.round(baseRate * 0.08);
    const total      = baseRate + cleaningFee + serviceFee;

    const handleReserve = () => {
        if (!checkIn || !checkOut) { toast.error('Please select both check-in and check-out dates.'); return; }
        if (new Date(checkOut) <= new Date(checkIn)) { toast.error('Check-out date must be after check-in date.'); return; }
        toast.success('Secure gateway loaded', { description: `${nights} nights · ${guests} guest(s) · Total: $${total}` });
    };

    /* ── Loading / Error states ── */
    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <LoaderSpinner />
            <span className="text-sm font-semibold text-[#8A8FA8]">Loading stay details...</span>
        </div>
    );

    if (error || !propertyPayload) return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="p-3 bg-red-950 text-red-400 rounded-2xl inline-flex mb-4">
                <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#FAFAF8] mb-1">Stay detail error</h3>
            <p className="text-sm text-[#8A8FA8] mb-6">{error || 'Property could not be loaded.'}</p>
            <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8FB4C] text-[#0F1117] font-bold rounded-xl text-xs hover:opacity-90 transition-opacity"
            >
                <ArrowLeft className="w-4 h-4" /> Back to listings
            </Link>
        </div>
    );

    /* ── Main render ── */
    return (
        <div className="min-h-screen bg-[#0B0C10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">

            <PropertyToolbar isLiked={isLiked} onToggleLike={() => setIsLiked(v => !v)} />

            <PropertyHero
                name={name}
                propertyType={propertyType}
                isSuperhost={isSuperhost}
                address={address}
                hasReviews={hasReviews}
                formattedRating={formattedRating}
                reviewCount={reviewCount}
            />

            <PropertyImageGrid gridImages={gridImages} name={name} />

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                    <PropertyCapacityBar
                        accommodates={accommodates}
                        bedrooms={bedrooms}
                        beds={beds}
                        bathrooms={bathrooms}
                    />
                    <PropertyDescription summary={summary} roomType={roomType} />
                    <PropertyAmenities amenities={amenities} />
                    <PropertyHostCard host={host} isSuperhost={isSuperhost} />
                    <ReviewsSection
                        initialReviews={reviews}
                        averageRating={averageRating}
                        hasReviews={hasReviews}
                        formattedRating={formattedRating}
                        user={user}
                        propertyId={id}
                        propertyHostId={host?.hostId}
                    />
                </div>

                {/* Right column — sticky booking widget */}
                <div className="lg:col-span-1">
                    <BookingWidget
                        price={price}
                        hasReviews={hasReviews}
                        percentageRating={percentageRating}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={guests}
                        nights={nights}
                        baseRate={baseRate}
                        cleaningFee={cleaningFee}
                        serviceFee={serviceFee}
                        total={total}
                        onCheckInChange={setCheckIn}
                        onCheckOutChange={setCheckOut}
                        onGuestsChange={setGuests}
                        onReserve={handleReserve}
                    />
                </div>
            </div>
        </div>
        </div>
    );
};

export default PropertyDetailsPage;