import React, {useState, useEffect, useCallback} from 'react';
import {SlidersHorizontal, AlertCircle, Inbox, ChevronLeft, ChevronRight, Loader2} from 'lucide-react';
import {getListings} from '../api/propertyApi';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';

const INITIAL_FILTERS = {
    search: '', country: '', city: '', propertyType: '', roomType: '',
    minPrice: '', maxPrice: '', minAccommodates: '', minBedrooms: '', minBathrooms: '',
    amenities: [], isSuperhost: false, minRating: '',
    cancellationPolicy: '', checkIn: '', checkOut: '', page: 0, limit: 6,
};

const PropertyListingPage = () => {
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [listingsData, setListingsData] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobileDrawerOpen, setMobileDrawer] = useState(false);

    const fetchListings = useCallback(async (f) => {
        setIsLoading(true);
        setError(null);
        try {
            setListingsData(await getListings(f));
        } catch (err) {
            setError(err.message || 'Failed to fetch properties.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchListings(filters);
    }, [filters, fetchListings]);

    const handleSearch = ({search, country, city}) => setFilters(p => ({...p, search, country, city, page: 0}));
    const handleFilterChange = (updated) => setFilters(p => ({...p, ...updated, page: 0}));
    const handleClearAll = () => setFilters(INITIAL_FILTERS);
    const handlePageChange = (n) => {
        if (n >= 0 && n < listingsData.totalPages) {
            setFilters(p => ({...p, page: n}));
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const activeCount = [
        filters.country, filters.city, filters.propertyType, filters.roomType,
        filters.minPrice, filters.maxPrice, filters.minAccommodates, filters.minBedrooms,
        filters.minBathrooms, filters.isSuperhost, filters.minRating,
        filters.cancellationPolicy, filters.checkIn, filters.checkOut,
    ].filter(Boolean).length + (filters.amenities?.length || 0);

    const hasActive = activeCount > 0 || filters.search;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#FAFAF8] tracking-tight"
                        style={{fontFamily: "'Outfit', sans-serif"}}>
                        Explore Stays
                    </h1>
                    <p className="text-xs text-[#8A8FA8] mt-1">
                        Verified spaces, design lofts, and ocean villas around the world.
                    </p>
                </div>

                {/* Mobile filter button */}
                <button
                    onClick={() => setMobileDrawer(true)}
                    className="flex lg:hidden items-center gap-2 px-4 py-2.5 bg-[#C8FB4C] text-[#0F1117] font-bold rounded-xl text-xs transition-opacity hover:opacity-90 cursor-pointer w-fit"
                >
                    <SlidersHorizontal className="w-4 h-4"/>
                    Filters
                    {activeCount > 0 && (
                        <span
                            className="bg-[#0F1117] text-[#C8FB4C] font-extrabold px-1.5 py-0.5 text-[9px] rounded-full">
              {activeCount}
            </span>
                    )}
                </button>
            </div>

            {/* Search */}
            <SearchBar
                onSearch={handleSearch}
                initialSearch={filters.search}
                initialCountry={filters.country}
                initialCity={filters.city}
            />

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Desktop sidebar */}
                <div className="hidden lg:block lg:col-span-1">
                    <FilterSidebar filters={filters} onChangeFilters={handleFilterChange}
                                   onClearFilters={handleClearAll}/>
                </div>

                {/* Mobile drawer */}
                {isMobileDrawerOpen && (
                    <FilterSidebar
                        filters={filters}
                        onChangeFilters={handleFilterChange}
                        onClearFilters={handleClearAll}
                        isMobileDrawer
                        onCloseMobile={() => setMobileDrawer(false)}
                    />
                )}

                {/* Listings */}
                <div className="lg:col-span-3 flex flex-col min-h-[50vh]">

                    {/* Results bar */}
                    <div
                        className="flex items-center justify-between mb-4 text-xs font-bold text-[#3A3D48] uppercase tracking-wider px-1">
                        <span>{listingsData.totalElements} stays found</span>
                        {hasActive && (
                            <button onClick={handleClearAll}
                                    className="text-[#C8FB4C] hover:opacity-75 normal-case font-bold cursor-pointer transition-opacity">
                                Reset filters
                            </button>
                        )}
                    </div>

                    {/* Loading */}
                    {isLoading ? (
                        <div className="flex-grow flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="w-7 h-7 text-[#C8FB4C] animate-spin"/>
                            <span className="text-xs font-semibold text-[#8A8FA8] tracking-wider uppercase">Loading stays...</span>
                        </div>

                        /* Error */
                    ) : error ? (
                        <div
                            className="flex-grow flex flex-col items-center justify-center py-12 text-center bg-[#0F1117] border border-[#1A1D26] rounded-2xl p-6">
                            <div className="p-3 bg-red-950 text-red-400 rounded-xl mb-4">
                                <AlertCircle className="w-6 h-6"/>
                            </div>
                            <h3 className="text-sm font-bold text-[#FAFAF8] mb-1">Database request offline</h3>
                            <p className="text-xs text-[#8A8FA8] mb-5 max-w-xs">{error}</p>
                            <button
                                onClick={() => fetchListings(filters)}
                                className="px-4 py-2 bg-[#C8FB4C] text-[#0F1117] font-bold rounded-xl text-xs hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>

                        /* Empty */
                    ) : listingsData.content.length === 0 ? (
                        <div
                            className="flex-grow flex flex-col items-center justify-center py-12 text-center bg-[#0F1117] border border-[#1A1D26] rounded-2xl p-6">
                            <div className="p-4 bg-[#1A1D26] text-[#3A3D48] rounded-xl mb-4">
                                <Inbox className="w-6 h-6"/>
                            </div>
                            <h3 className="text-sm font-bold text-[#FAFAF8] mb-1">No stays found</h3>
                            <p className="text-xs text-[#8A8FA8] mb-5 max-w-xs">No properties matched your filters. Try
                                clearing some selections.</p>
                            {hasActive && (
                                <button onClick={handleClearAll}
                                        className="px-4 py-2 bg-[#C8FB4C] text-[#0F1117] font-bold rounded-xl text-xs hover:opacity-90 transition-opacity cursor-pointer">
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        /* Grid */
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {listingsData.content.map(p => <PropertyCard key={p.id} property={p}/>)}
                            </div>

                            {/* Pagination */}
                            {listingsData.totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-[#1A1D26] pt-6 mt-8">
                                    <button
                                        onClick={() => handlePageChange(filters.page - 1)}
                                        disabled={listingsData.first}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                            listingsData.first
                                                ? 'bg-[#1A1D26] text-[#3A3D48] border-[#1A1D26] cursor-not-allowed'
                                                : 'bg-[#1A1D26] text-[#FAFAF8] border-[#2A2D38] hover:border-[#C8FB4C] hover:text-[#C8FB4C] cursor-pointer'
                                        }`}
                                    >
                                        <ChevronLeft className="w-4 h-4"/> Prev
                                    </button>

                                    <span className="text-xs font-bold text-[#3A3D48]">
                    Page {filters.page + 1} of {listingsData.totalPages}
                  </span>

                                    <button
                                        onClick={() => handlePageChange(filters.page + 1)}
                                        disabled={listingsData.last}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                            listingsData.last
                                                ? 'bg-[#1A1D26] text-[#3A3D48] border-[#1A1D26] cursor-not-allowed'
                                                : 'bg-[#1A1D26] text-[#FAFAF8] border-[#2A2D38] hover:border-[#C8FB4C] hover:text-[#C8FB4C] cursor-pointer'
                                        }`}
                                    >
                                        Next <ChevronRight className="w-4 h-4"/>
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PropertyListingPage;