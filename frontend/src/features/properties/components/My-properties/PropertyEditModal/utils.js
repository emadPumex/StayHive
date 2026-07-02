import {AMENITY_LIST, ROOM_AMENITY_LIST} from '../../constants';

export const AMENITY_CATALOG = AMENITY_LIST || [];
export const ROOM_AMENITY_CATALOG = ROOM_AMENITY_LIST || [];

export const toSlug = (str) =>
    (str || 'room').toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '') || 'room';

export const generateRoomId = (name) =>
    `${toSlug(name)}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const generateLocalId = () => `local_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// Match by id first (schema field), fall back to name for legacy docs still keyed by "_id"
export const matchAmenityIds = (backendAmenities = [], catalog = AMENITY_CATALOG) => {
    const ids = [];
    backendAmenities.forEach(a => {
        const hit = catalog.find(c =>
            c.id === a.id || c.id === a._id || c.label?.toLowerCase() === a.name?.toLowerCase()
        );
        if (hit) ids.push(hit.id);
    });
    return ids;
};

export const amenityIdsToPayload = (ids = [], catalog = AMENITY_CATALOG) =>
    catalog.filter(c => ids.includes(c.id)).map(c => ({
        id: c.id,
        name: c.label,
        category: c.category,
    }));

export const emptyRoom = () => ({
    id: generateRoomId('new_room'),
    name: '',
    roomType: 'PRIVATE_ROOM',
    bedroomCount: 1,
    basePrice: 0,
    totalInventory: 1,
    accommodates: 1,
    bedCount: 1,
    bathrooms: 1,
    amenityIds: [],
    images: null,
    roomBlockRules: [],
});