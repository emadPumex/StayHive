import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {
    ArrowLeft, Star, Bed, Bath, Users, Sparkles, MapPin,
    ShieldCheck, Check, ShieldAlert, Heart, Share2, MessageSquare
} from 'lucide-react';
import {toast} from 'sonner';
import {getListingById} from '../api/propertyApi';

const LoaderSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C8FB4C] border-t-transparent"/>
);

const PropertyDetailsPage = () => {
    const {id} = useParams();
    const [property, setProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [checkIn, setCheckIn] = useState('2026-06-12');
    const [checkOut, setCheckOut] = useState('2026-06-19');
    const [guests, setGuests] = useState(2);

    const getNights = () => {
        try {
            const diff = new Date(checkOut) - new Date(checkIn);
            return Math.ceil(diff / 86400000) || 7;
        } catch {
            return 7;
        }
    };

    const getInitials = (name) =>
        name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setIsLoading(true);
                setError(null);
                setProperty(await getListingById(id));
            } catch (err) {
                setError(err.message || 'Property could not be loaded.');
            } finally {
                setIsLoading(false);
            }
        })();
    }, [id]);

    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <LoaderSpinner/>
            <span className="text-sm font-semibold text-[#8A8FA8]">Loading stay details...</span>
        </div>
    );

    if (error || !property) return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="p-3 bg-red-950 text-red-400 rounded-2xl inline-flex mb-4">
                <ShieldAlert className="w-8 h-8"/>
            </div>
            <h3 className="text-lg font-bold text-[#FAFAF8] mb-1">Stay detail error</h3>
            <p className="text-sm text-[#8A8FA8] mb-6">{error || 'Property could not be loaded.'}</p>
            <Link to="/properties"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8FB4C] text-[#0F1117] font-bold rounded-xl text-xs hover:opacity-90 transition-opacity">
                <ArrowLeft className="w-4 h-4"/> Back to listings
            </Link>
        </div>
    );

    const {
        property: propertyData = {},
        review: reviews = []
    } = property || {};

    const {
        name,
        propertyType,
        roomType,
        price,
        accommodates,
        bedrooms,
        beds,
        bathrooms,
        amenities,
        reviewScores,
        host,
        address,
        images,
        summary,
        averageRating
    } = propertyData;

    const rating = reviewScores?.reviewScoresRating || (averageRating ? Math.round(averageRating * 20) : null);
    const isSuperhost = host?.hostIsSuperhost;
    
    const mainImage = images?.pictureUrl || images?.coverImageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
    const otherImages = images?.imageUrls || [];
    const gridImages = [
        mainImage,
        ...otherImages.filter(url => url !== mainImage),
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
    ].slice(0, 5);

    const nights = getNights();
    const baseRate = (price || 0) * nights;
    const cleaningFee = 75;
    const serviceFee = Math.round(baseRate * 0.08);
    const total = baseRate + cleaningFee + serviceFee;

    const handleReserve = () => {
        if (!checkIn || !checkOut) {
            toast.error('Please select both check-in and check-out dates.');
            return;
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (checkOutDate <= checkInDate) {
            toast.error('Check-out date must be after check-in date.');
            return;
        }
        toast.success('Secure gateway loaded', {
            description: `${nights} nights · ${guests} guest(s) · Total: $${total}`
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
                <Link to="/properties"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#8A8FA8] hover:text-[#C8FB4C] transition-colors">
                    <ArrowLeft className="w-4 h-4"/> Back to explore
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className="p-2 border border-[#2A2D38] bg-[#1A1D26] hover:border-[#8A8FA8] rounded-xl transition-colors cursor-pointer"
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-[#8A8FA8]'}`}/>
                    </button>
                    <button
                        className="p-2 border border-[#2A2D38] bg-[#1A1D26] hover:border-[#8A8FA8] rounded-xl transition-colors text-[#8A8FA8] cursor-pointer">
                        <Share2 className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {/* Title block */}
            <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
              className="bg-[#1A1D26] text-[#8A8FA8] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider border border-[#2A2D38]">
            {propertyType}
          </span>
                    {isSuperhost && (
                        <span
                            className="flex items-center gap-1 bg-[#1A2A0A] text-[#A8D44A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
              <Sparkles className="w-3 h-3"/> Superhost
            </span>
                    )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#FAFAF8] tracking-tight leading-tight"
                    style={{fontFamily: "'Outfit', sans-serif"}}>
                    {name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-[#8A8FA8] mt-2 flex-wrap">
                    <MapPin className="w-4 h-4 text-[#C8FB4C] shrink-0"/>
                    <span>{address?.market}, {address?.country}</span>
                    {rating && (
                        <>
                            <span>•</span>
                            <span
                                className="flex items-center gap-1 text-[11px] font-bold text-[#C8FB4C] bg-[#1A2A0A] px-2 py-0.5 rounded-md shrink-0">
                <Star className="w-3 h-3 fill-[#C8FB4C]"/> {rating}%
              </span>
                        </>
                    )}
                </div>
            </div>

            {/* Image grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8">
                <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:h-[400px] overflow-hidden bg-[#1A1D26]">
                    <img src={gridImages[0]} alt={name}
                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                </div>
                <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-[400px]">
                    {gridImages.slice(1, 5).map((url, i) => (
                        <div key={i} className="overflow-hidden bg-[#1A1D26]">
                            <img src={url} alt={`${name} ${i + 1}`}
                                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Capacity bar */}
                    <div
                        className="grid grid-cols-4 gap-4 bg-[#0F1117] border border-[#1A1D26] p-5 rounded-2xl text-center">
                        {[
                            {icon: Users, label: 'Guests', val: `${accommodates} max`},
                            {icon: Bed, label: 'Bedrooms', val: `${bedrooms} ${bedrooms === 1 ? 'room' : 'rooms'}`},
                            {icon: Bed, label: 'Beds', val: `${beds || bedrooms} beds`},
                            {icon: Bath, label: 'Baths', val: `${parseFloat(bathrooms) || 0} baths`},
                        ].map(({icon: Icon, label, val}, i) => (
                            <div key={label} className={`py-1 ${i > 0 ? 'border-l border-[#1A1D26]' : ''}`}>
                                <Icon className="w-5 h-5 text-[#C8FB4C] mx-auto mb-1.5"/>
                                <div
                                    className="text-[10px] text-[#3A3D48] font-extrabold uppercase tracking-wider">{label}</div>
                                <div className="text-sm font-bold text-[#FAFAF8] mt-1">{val}</div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="bg-[#0F1117] border border-[#1A1D26] p-6 rounded-2xl space-y-3">
                        <h3 className="text-base font-black text-[#FAFAF8]">About this stay</h3>
                        <p className="text-sm text-[#8A8FA8] leading-relaxed">
                            {summary || 'Enjoy a verified, clean booking experience directly linked to property owners.'}
                        </p>
                        <p className="text-sm text-[#3A3D48] leading-relaxed">
                            Configured as <span className="font-semibold text-[#8A8FA8]">{roomType}</span>. Ideal for
                            tourists, business nomads, and luxury travelers.
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="bg-[#0F1117] border border-[#1A1D26] p-6 rounded-2xl space-y-4">
                        <h3 className="text-base font-black text-[#FAFAF8]">Amenities offered</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {amenities?.map((a, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-[#8A8FA8] font-medium">
                                    <div className="p-1.5 bg-[#1A2A0A] text-[#C8FB4C] rounded-lg shrink-0">
                                        <Check className="w-3.5 h-3.5"/>
                                    </div>
                                    {a}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Host */}
                    {host && (
                        <div
                            className="bg-[#0F1117] border border-[#1A1D26] p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5">
                            <img src={host.hostThumbnailUrl} alt={host.hostName}
                                 className="w-14 h-14 rounded-full object-cover border-2 border-[#2A2D38] shrink-0"/>
                            <div className="space-y-2 text-center sm:text-left">
                                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                                    <h4 className="text-sm font-black text-[#FAFAF8]">Hosted by {host.hostName}</h4>
                                    {isSuperhost && (
                                        <span
                                            className="bg-[#1A2A0A] text-[#A8D44A] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5"/> Superhost
                    </span>
                                    )}
                                </div>
                                <p className="text-xs text-[#3A3D48] leading-relaxed">
                                    StayHive verified partners complete regular quality, internet bandwidth, and
                                    sanitization inspections for a premium stay.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    <div className="bg-[#0F1117] border border-[#1A1D26] p-6 rounded-2xl space-y-5">
                        <div
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1D26]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#1A1D26] text-[#8A8FA8] rounded-xl">
                                    <MessageSquare className="w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-[#FAFAF8]">Guest experiences</h3>
                                    <p className="text-[11px] text-[#3A3D48] font-semibold uppercase tracking-wider">
                                        {reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}
                                    </p>
                                </div>
                            </div>
                            {rating && reviews.length > 0 && (
                                <div
                                    className="flex items-center gap-3 bg-[#1A1D26] border border-[#2A2D38] px-4 py-2 rounded-xl self-start">
                                    <div className="flex items-center gap-1 text-[#C8FB4C]">
                                        <Star className="w-4 h-4 fill-[#C8FB4C]"/>
                                        <span
                                            className="text-sm font-black text-[#FAFAF8]">{(rating / 20).toFixed(1)}</span>
                                    </div>
                                    <div className="w-px h-4 bg-[#2A2D38]"/>
                                    <span
                                        className="text-[11px] font-bold text-[#3A3D48] uppercase tracking-wide">Excellent</span>
                                </div>
                            )}
                        </div>

                        {reviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews.map((review, i) => (
                                    <div key={i}
                                         className="p-4 bg-[#1A1D26] border border-[#2A2D38] rounded-xl space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 bg-[#C8FB4C] text-[#0F1117] text-xs font-black rounded-xl flex items-center justify-center shrink-0">
                                                {getInitials(review.reviewerName)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#FAFAF8]">{review.reviewerName}</p>
                                                <p className="text-[10px] text-[#3A3D48] font-bold">Stayed recently</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({length: 5}).map((_, si) => (
                                                <Star key={si}
                                                      className={`w-3 h-3 ${si < review.rating ? 'text-[#C8FB4C] fill-[#C8FB4C]' : 'text-[#2A2D38]'}`}/>
                                            ))}
                                        </div>
                                        <p className="text-xs text-[#8A8FA8] leading-relaxed italic">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#2A2D38] rounded-xl gap-3">
                                <div className="p-3 bg-[#1A1D26] text-[#3A3D48] rounded-full">
                                    <MessageSquare className="w-6 h-6 stroke-[1.5]"/>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#FAFAF8]">No reviews yet</p>
                                    <p className="text-xs text-[#3A3D48] mt-1 max-w-xs leading-relaxed">Be the first to
                                        experience this stay and share your review with the StayHive community.</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right — Booking card */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0F1117] border border-[#1A1D26] rounded-2xl p-6 sticky top-24 space-y-5">

                        <div className="flex items-baseline justify-between">
                            <div>
                                <span className="text-2xl font-black text-[#FAFAF8]">${price}</span>
                                <span
                                    className="text-xs text-[#3A3D48] font-bold uppercase tracking-wider"> / night</span>
                            </div>
                            {rating && (
                                <span
                                    className="flex items-center gap-1 text-[11px] font-bold text-[#C8FB4C] bg-[#1A2A0A] px-2 py-0.5 rounded-md">
                  <Star className="w-3 h-3 fill-[#C8FB4C]"/> {rating}%
                </span>
                            )}
                        </div>

                        {/* Date / guest picker */}
                        <div className="border border-[#2A2D38] rounded-xl overflow-hidden divide-y divide-[#2A2D38]">
                            <div className="grid grid-cols-2 divide-x divide-[#2A2D38]">
                                <div className="p-3 bg-[#1A1D26] hover:bg-[#2A2D38] transition-colors">
                                    <label
                                        className="block text-[9px] font-extrabold text-[#3A3D48] uppercase tracking-wider mb-1">Check-in</label>
                                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                                           className="text-xs font-bold text-[#FAFAF8] bg-transparent focus:outline-none w-full cursor-pointer"/>
                                </div>
                                <div className="p-3 bg-[#1A1D26] hover:bg-[#2A2D38] transition-colors">
                                    <label
                                        className="block text-[9px] font-extrabold text-[#3A3D48] uppercase tracking-wider mb-1">Check-out</label>
                                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                                           className="text-xs font-bold text-[#FAFAF8] bg-transparent focus:outline-none w-full cursor-pointer"/>
                                </div>
                            </div>
                            <div className="p-3 bg-[#1A1D26] hover:bg-[#2A2D38] transition-colors">
                                <label
                                    className="block text-[9px] font-extrabold text-[#3A3D48] uppercase tracking-wider mb-1">Guests</label>
                                <div className="flex items-center justify-between">
                                    <select value={guests} onChange={e => setGuests(parseInt(e.target.value, 10))}
                                            className="text-xs font-bold text-[#FAFAF8] bg-transparent focus:outline-none w-full cursor-pointer appearance-none">
                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n}
                                                                             value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                                    </select>
                                    <Users className="w-4 h-4 text-[#3A3D48] pointer-events-none"/>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleReserve}
                            className="w-full py-3.5 bg-[#C8FB4C] hover:opacity-90 text-[#0F1117] font-bold rounded-xl transition-opacity text-sm cursor-pointer"
                        >
                            Reserve stay
                        </button>
                        <p className="text-[10px] text-[#3A3D48] text-center font-semibold">You won't be charged yet</p>

                        {/* Ledger */}
                        <div
                            className="pt-4 border-t border-[#1A1D26] space-y-2.5 text-xs text-[#8A8FA8] font-semibold">
                            {[
                                [`$${price} × ${nights} night${nights > 1 ? 's' : ''}`, `$${baseRate}`],
                                ['Cleaning fee', `$${cleaningFee}`],
                                ['StayHive service fee', `$${serviceFee}`],
                            ].map(([label, val]) => (
                                <div key={label} className="flex justify-between">
                                    <span
                                        className="underline decoration-dotted cursor-pointer hover:text-[#FAFAF8] transition-colors">{label}</span>
                                    <span>{val}</span>
                                </div>
                            ))}
                            <div
                                className="flex justify-between text-sm font-black text-[#FAFAF8] pt-3 border-t border-[#1A1D26]">
                                <span>Total before taxes</span>
                                <span>${total}</span>
                            </div>
                        </div>

                        {/* Trust badge */}
                        <div className="p-3.5 bg-[#1A2A0A] border border-[#2A4010] rounded-xl flex items-start gap-2.5">
                            <ShieldCheck className="w-5 h-5 text-[#C8FB4C] shrink-0 mt-0.5"/>
                            <div>
                                <span
                                    className="text-[10px] font-extrabold text-[#A8D44A] uppercase tracking-wider block mb-0.5">StayHive Protection</span>
                                <p className="text-[10px] text-[#6A8A3A] leading-relaxed">
                                    Verified photos, secured escrow processing, and automated refunds if canceled within
                                    24h.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default PropertyDetailsPage;