import apiClient from '../../../core/api/apiClient';

//Extract lists of countries & cities for location dropdowns dynamic mapping
export const getLocationsMetadata = async () => {
    try {
        const response = await apiClient.get("/properties/locations");
        return response.data; // This returns your { countries, marketsByCountry } object
    } catch (error) {
        console.error("Error fetching location metadata from backend:", error);
        // Return an empty fallback structure so the UI doesn't crash on network failure
        return {countries: [], citiesByCountry: {}};
    }
};

//  * Fetch properties from Spring Boot backend.
//  * Automatically falls back to filtered mock data if the API connection fails.
//  */
export const getListings = async (filters = {}) => {
    try {
        const params = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) return;
            if (Array.isArray(value) && value.length === 0) return;
            if (key === 'isSuperhost' && value === false) return;

            if (key === 'amenities') {
                params.amenities = value.join(',');
                return;
            }
            // Rename 'limit' → 'size' to match Spring Boot's @RequestParam name
            if (key === 'limit') {
                params.size = value;
                return;
            }
            params[key] = value;
        });

        const response = await apiClient.get('/properties', {params});
        console.log('RAW API RESPONSE:', response.data);
        return {
            content: response.data.content,
            totalPages: response.data.page.totalPages,
            totalElements: response.data.page.totalElements,
            first: response.data.page.number === 0,
            last: response.data.page.number === response.data.page.totalPages - 1
        };
    } catch (error) {
        return console.warn('Backend offline, falling back to mock.', error.message);

    }
};

/**
 * Fetch details of a single property.
 */
export const getListingById = async (id) => {
    try {
        const response = await apiClient.get(`/properties/${id}`);
        return response.data; // Handles the 200 OK structure cleanly
    } catch (error) {
        console.error(`API Error for listing ID ${id}:`, error);

        // Fallback checks for the specific 404 error you set up in Spring Boot
        if (error.response && error.response.status === 404) {
            throw new Error('This property listing does not exist.');
        }

        // Generic error fallback if the server is down entirely
        throw new Error('Unable to load listing details at this time. Please try again later.');
    }
};


export const createListing = async (formData) => {
    try {
        // Axios automatically handles the multipart/form-data boundary headers
        // when it detects a FormData instance as the body payload.
        const response = await apiClient.post('/properties', formData);
        return response.data;
    } catch (error) {
        console.error("API Error during property creation:", error);
        // Throw the error back up so the component can handle UI notifications
        throw error;
    }
};

/**
 * Submit a review for a property. Requires the user to be authenticated.
 * @param {string} propertyId
 * @param {{ rating: number, comment: string }} reviewData
 */
export const submitReview = async (propertyId, reviewData) => {
    const response = await apiClient.post(`/properties/${propertyId}/reviews`, reviewData);
    return response.data;
};

/**
 * Update an existing review. Caller must be the review author.
 * @param {string} propertyId
 * @param {string} reviewId
 * @param {{ rating: number, comment: string }} reviewData
 */
export const updateReview = async (propertyId, reviewId, reviewData) => {
    const response = await apiClient.put(`/properties/${propertyId}/reviews/${reviewId}`, reviewData);
    return response.data;
};

/**
 * Delete a review. Caller must be the review author.
 * @param {string} propertyId
 * @param {string} reviewId
 */
export const deleteReview = async (propertyId, reviewId) => {
    await apiClient.delete(`/properties/${propertyId}/reviews/${reviewId}`);
};