import { useEffect, useState, useMemo } from 'react';
import { getListingById } from '../../../api/propertyApi';

export const usePropertyDetails = (id) => {
    const [propertyPayload, setPropertyPayload] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const { property = {}, reviews = [] } = propertyPayload || {};
    const rooms = property.roomCategories || [];
    const isMultiUnit = useMemo(() => {
        return rooms.length > 0 && property.propertyType !== 'ENTIRE_PLACE';
    }, [rooms, property.propertyType]);

    const averageRating = property.averageRating ?? 0.0;
    const reviewCount = property.reviewCount ?? 0;
    const hasReviews = reviewCount > 0 && averageRating > 0;
    const formattedRating = useMemo(() => averageRating.toFixed(1), [averageRating]);
    const percentageRating = useMemo(() => Math.round(averageRating * 20), [averageRating]);

    const gridImages = useMemo(() => {
        const mainImage = property.images?.coverImageUrl
            || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
        const otherImages = property.images?.imageUrls || [];
        return [mainImage, ...otherImages.filter(url => url !== mainImage)].slice(0, 5);
    }, [property.images]);

    return {
        property, reviews, rooms, isMultiUnit,
        averageRating, reviewCount, hasReviews, formattedRating, percentageRating,
        gridImages, isLoading, error,
    };
};