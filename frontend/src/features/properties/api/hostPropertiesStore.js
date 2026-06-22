// Host Properties Store with Local Storage persistence for high-fidelity UI management

const STORAGE_KEY = 'stayhive_host_properties';

const INITIAL_PROPERTIES = [
    {
        id: 'host-prop-1',
        name: 'Sleek Concrete Minimalist Loft',
        propertyType: 'APARTMENT',
        roomType: 'ENTIRE_PLACE',
        price: 240,
        accommodates: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'TV', 'Coffee maker'],
        cancellationPolicy: 'FLEXIBLE',
        host: {
            hostName: 'Emad',
            profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        },
        address: {
            market: 'Berlin',
            city: 'Berlin',
            state: 'Berlin',
            country: 'Germany'
        },
        images: {
            coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            imageUrls: [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
            ]
        },
        isActive: true,
        blockedDates: ['2026-06-25', '2026-06-26'],
        // Solid Indigo / Blue Guest Stay track selection (for testing calendar dates)
        bookedDates: ['2026-06-15', '2026-06-16', '2026-06-17', '2026-06-18', '2026-07-08', '2026-07-09', '2026-07-10']
    },
    {
        id: 'host-prop-2',
        name: 'Eco-Glass Villa on Coastal Cliffs',
        propertyType: 'VILLA',
        roomType: 'ENTIRE_PLACE',
        price: 520,
        accommodates: 6,
        bedrooms: 3,
        bathrooms: 2.5,
        amenities: ['Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Hot tub', 'Gym'],
        cancellationPolicy: 'STRICT',
        host: {
            hostName: 'Emad',
            profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        },
        address: {
            market: 'Santorini',
            city: 'Santorini',
            state: 'Cyclades',
            country: 'Greece'
        },
        images: {
            coverImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            imageUrls: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
            ]
        },
        isActive: true,
        blockedDates: ['2026-06-29', '2026-06-30', '2026-07-01'],
        bookedDates: ['2026-06-22', '2026-06-23', '2026-06-24', '2026-07-15', '2026-07-16']
    },
    {
        id: 'host-prop-3',
        name: 'Zen Sanctuary & Maple Gardens',
        propertyType: 'HOUSE',
        roomType: 'PRIVATE_ROOM',
        price: 180,
        accommodates: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['Wifi', 'Breakfast', 'Fireplace', 'Free parking', 'Pets allowed'],
        cancellationPolicy: 'MODERATE',
        host: {
            hostName: 'Emad',
            profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        },
        address: {
            market: 'Kyoto',
            city: 'Kyoto',
            state: 'Kyoto',
            country: 'Japan'
        },
        images: {
            coverImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            imageUrls: [
                'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=80'
            ]
        },
        isActive: false, // Inactive state
        blockedDates: [],
        bookedDates: []
    }
];

export const getHostProperties = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
        return INITIAL_PROPERTIES;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Error parsing host properties', e);
        return INITIAL_PROPERTIES;
    }
};

export const saveHostProperties = (properties) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
};

export const togglePropertyActive = (id) => {
    const props = getHostProperties();
    const updated = props.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    saveHostProperties(updated);
    return updated;
};

export const updatePropertyDetails = (id, fields) => {
    const props = getHostProperties();
    const updated = props.map(p => p.id === id ? { 
        ...p, 
        name: fields.name || p.name,
        price: Number(fields.price) || p.price,
        propertyType: fields.propertyType || p.propertyType,
        roomType: fields.roomType || p.roomType,
        address: {
            ...p.address,
            city: fields.city || p.address.city,
            country: fields.country || p.address.country
        }
    } : p);
    saveHostProperties(updated);
    return updated;
};

export const updatePropertyBlockedDates = (id, blockedDates) => {
    const props = getHostProperties();
    const updated = props.map(p => p.id === id ? { ...p, blockedDates } : p);
    saveHostProperties(updated);
    return updated;
};

export const addHostProperty = (newProperty) => {
    const props = getHostProperties();
    const propertyWithId = {
        ...newProperty,
        id: newProperty.id || `host-prop-${Date.now()}`,
        blockedDates: newProperty.blockedDates || [],
        bookedDates: newProperty.bookedDates || [],
        isActive: newProperty.isActive !== undefined ? newProperty.isActive : true
    };
    const updated = [propertyWithId, ...props];
    saveHostProperties(updated);
    return updated;
};
