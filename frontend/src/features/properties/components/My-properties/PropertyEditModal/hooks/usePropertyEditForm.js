import {useState, useEffect} from 'react';
import {WINDOW_RULES} from '../constants';
import {
    generateLocalId, matchAmenityIds, amenityIdsToPayload, emptyRoom,
    AMENITY_CATALOG, ROOM_AMENITY_CATALOG,
} from '../utils';

const ERROR_TAB_MAP = {name: 'details', city: 'details', rooms: 'rooms', cancellation: 'cancellation'};

export const usePropertyEditForm = (property, isOpen, onSave, onClose) => {
    const [activeTab, setActiveTab] = useState('details');
    const [name, setName] = useState('');
    const [summary, setSummary] = useState('');
    const [propertyType, setPropertyType] = useState('APARTMENT');
    const [city, setCity] = useState('');
    const [cancellationPolicy, setCancellationPolicy] = useState({
        type: 'FLEXIBLE',
        name: '',
        description: '',
        windows: []
    });
    const [propertyAmenityIds, setPropertyAmenityIds] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (property && isOpen) {
            setActiveTab('details');
            setName(property.name || '');
            setSummary(property.summary || '');
            setPropertyType(property.propertyType || 'APARTMENT');
            setCity(property.address?.city || '');

            const cp = property.cancellationPolicy || {};
            setCancellationPolicy({
                type: cp.type || 'FLEXIBLE',
                name: cp.name || '',
                description: cp.description || '',
                windows: (cp.windows || []).map(w => ({...w, _localId: generateLocalId()})),
            });

            setPropertyAmenityIds(matchAmenityIds(property.propertyAmenities, AMENITY_CATALOG));

            const loadedRooms = (property.roomCategories || []).map(r => ({
                id: r.id,
                name: r.name || '',
                roomType: r.roomType || 'PRIVATE_ROOM',
                bedroomCount: r.bedroomCount ?? 1,
                basePrice: r.basePrice ?? 0,
                totalInventory: r.totalInventory ?? 1,
                accommodates: r.accommodates ?? 1,
                bedCount: r.bedCount ?? 1,
                bathrooms: r.bathrooms ?? 1,
                amenityIds: matchAmenityIds(r.roomAmenities, ROOM_AMENITY_CATALOG),
                images: r.images,
                roomBlockRules: r.roomBlockRules || [],
            }));
            setRooms(loadedRooms.length > 0 ? loadedRooms : [emptyRoom()]);
            setExpandedRoomId(loadedRooms[0]?.id || null);

            setErrors({});
            setIsSaving(false);
        }
    }, [property, isOpen]);

    const hasEntirePlace = rooms.some(r => r.roomType === 'ENTIRE_PLACE');
    const standaloneViolation = hasEntirePlace && rooms.length > 1;

    const updateRoom = (id, updated) =>
        setRooms(prev => prev.map(r => (r.id === id ? updated : r)));

    const removeRoom = (id) =>
        setRooms(prev => prev.filter(r => r.id !== id));

    const togglePropertyAmenity = (id) => {
        setPropertyAmenityIds(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = 'Property name is required.';
        if (!city.trim()) e.city = 'City is required.';
        if (rooms.length === 0) e.rooms = 'At least one room category is required.';
        if (rooms.some(r => !r.name.trim())) e.rooms = 'Every room category needs a name.';
        if (rooms.some(r => !r.basePrice || r.basePrice <= 0)) e.rooms = 'Every room category needs a price above $0.';
        if (standaloneViolation) e.rooms = 'Entire Place must be the only room category — fix conflicts above.';
        if (!cancellationPolicy.name.trim()) e.cancellation = 'Cancellation policy needs a name.';
        if (cancellationPolicy.windows.some(w => w.refundPercentage < 0 || w.refundPercentage > 100)) {
            e.cancellation = 'Refund percentage must be between 0 and 100.';
        }
        const rules = WINDOW_RULES[cancellationPolicy.type];
        if (rules?.editable && cancellationPolicy.windows.some(w =>
            w.daysBeforeCheckIn < rules.min || (rules.max != null && w.daysBeforeCheckIn > rules.max)
        )) {
            e.cancellation = rules.note;
        }
        return e;
    };

    const errorTabs = [...new Set(Object.keys(errors).map(k => ERROR_TAB_MAP[k]).filter(Boolean))];

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            const firstTab = ERROR_TAB_MAP[Object.keys(errs)[0]];
            if (firstTab) setActiveTab(firstTab);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(property.id, {
                ...property,
                name,
                summary,
                propertyType,
                address: {...property.address, city},
                propertyAmenities: amenityIdsToPayload(propertyAmenityIds, AMENITY_CATALOG),
                cancellationPolicy: {
                    type: cancellationPolicy.type,
                    name: cancellationPolicy.name,
                    description: cancellationPolicy.description,
                    windows: cancellationPolicy.windows.map(w => ({
                        daysBeforeCheckIn: Number(w.daysBeforeCheckIn),
                        refundPercentage: Number(w.refundPercentage),
                    })),
                },
                roomCategories: rooms.map(r => ({
                    id: r.id,
                    name: r.name,
                    roomType: r.roomType,
                    bedroomCount: r.bedroomCount,
                    basePrice: Number(r.basePrice),
                    totalInventory: r.totalInventory,
                    accommodates: r.accommodates,
                    bedCount: r.bedCount,
                    bathrooms: r.bathrooms,
                    roomAmenities: amenityIdsToPayload(r.amenityIds, ROOM_AMENITY_CATALOG),
                    images: r.images,
                    roomBlockRules: r.roomBlockRules,
                })),
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return {
        activeTab, setActiveTab,
        name, setName,
        summary, setSummary,
        city, setCity,
        cancellationPolicy, setCancellationPolicy,
        propertyAmenityIds, togglePropertyAmenity,
        rooms, updateRoom, removeRoom,
        expandedRoomId, setExpandedRoomId,
        errors, errorTabs,
        isSaving,
        hasEntirePlace, standaloneViolation,
        handleSubmit,
    };
};