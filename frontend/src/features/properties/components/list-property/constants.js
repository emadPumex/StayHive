import {
    Home, BedDouble, Sparkles, MapPin, Camera, User,
    Building2, Waves, Castle, TreePine, Wifi, Tv, Car,
    Wind, Utensils, WashingMachine, Dumbbell, Coffee,
    ShieldCheck, Flame, PawPrint, Bike,
    Laptop, Bath, Lock
} from 'lucide-react';

export const T = {
    bg900: '#111214',
    bg800: '#18191D',
    bg700: '#1F2127',
    bg600: '#26282F',
    border: '#2E3039',
    lime: '#B8F63D',
    limeDk: '#9DD432',
    limePale: 'rgba(184,246,61,0.1)',
    text: '#F0EEE9',
    muted: '#8B8D96',
    danger: '#F26464',
    success: '#52D98A',
    amber: '#F5C842',
};

export const STEPS = [
    {id: 1, label: 'Core Info', icon: Home},
    {id: 2, label: 'Policies', icon: ShieldCheck},
    {id: 3, label: 'Amenities', icon: Sparkles},
    {id: 4, label: 'Rooms', icon: BedDouble},
];

export const PROPERTY_TYPES = [
    {value: 'APARTMENT', icon: Building2, desc: 'Flat in a building'},
    {value: 'HOUSE', icon: Home, desc: 'Standalone home'},
    {value: 'VILLA', icon: Castle, desc: 'Luxurious estate'},
    {value: 'CABIN', icon: TreePine, desc: 'Cozy woodland retreat'},
    {value: 'COTTAGE', icon: Home, desc: 'Charming cottage'},
    {value: 'HOTEL', icon: Building2, desc: 'Hotel or inn'},
    {value: 'RESORT', icon: Waves, desc: 'Resort property'},
];

export const ROOM_TYPES = [
    {value: 'ENTIRE_PLACE', desc: 'Guests have the whole place'},
    {value: 'PRIVATE_ROOM', desc: 'Private room, shared spaces'},
    {value: 'SHARED_ROOM', desc: 'Shared space with others'},
];

export const CANCELLATION_POLICIES = [
    {value: 'FLEXIBLE', label: 'Flexible', desc: 'Full refund up to 1 day before'},
    {value: 'MODERATE', label: 'Moderate', desc: 'Full refund up to 5 days before'},
    {value: 'STRICT', label: 'Strict', desc: 'Full refund up to 14 days before'},
    {value: 'SUPER_STRICT', label: 'Super Strict', desc: 'Non-refundable after booking'},
];

export const AMENITY_LIST = [
    {id: 'Wifi', icon: Wifi, label: 'WiFi', category: 'General'},
    {id: 'TV', icon: Tv, label: 'Smart TV', category: 'Entertainment'},
    {id: 'Free parking', icon: Car, label: 'Free parking', category: 'General'},
    {id: 'Air conditioning', icon: Wind, label: 'Air conditioning', category: 'General'},
    {id: 'Kitchen', icon: Utensils, label: 'Kitchen', category: 'Essentials'},
    {id: 'Washing machine', icon: WashingMachine, label: 'Washer/Dryer', category: 'Essentials'},
    {id: 'Gym', icon: Dumbbell, label: 'Gym access', category: 'Health & Wellness'},
    {id: 'Coffee maker', icon: Coffee, label: 'Coffee maker', category: 'Essentials'},
    {id: 'Pool', icon: Waves, label: 'Pool', category: 'Health & Wellness'},
    {id: 'Fire extinguisher', icon: ShieldCheck, label: 'Fire safety', category: 'Safety'},
    {id: 'Fireplace', icon: Flame, label: 'Fireplace', category: 'Comfort'},
    {id: 'Pets allowed', icon: PawPrint, label: 'Pets allowed', category: 'General'},
    {id: 'Bicycle', icon: Bike, label: 'Bicycle', category: 'Health & Wellness'},
    {id: 'BBQ grill', icon: Utensils, label: 'BBQ grill', category: 'Outdoors'},
    {id: 'Hot tub', icon: Waves, label: 'Hot tub', category: 'Health & Wellness'},
    {id: 'Breakfast', icon: Coffee, label: 'Breakfast', category: 'Essentials'},
];

export const ROOM_AMENITY_LIST = [
    {id: 'room_wifi', icon: Wifi, label: 'Room WiFi', category: 'Connectivity'},
    {id: 'room_tv', icon: Tv, label: 'Smart TV', category: 'Entertainment'},
    {id: 'room_ac', icon: Wind, label: 'Air Conditioning', category: 'Comfort'},
    {id: 'room_coffee', icon: Coffee, label: 'Coffee Maker', category: 'Essentials'},
    {id: 'room_minibar', icon: Utensils, label: 'Minibar / Fridge', category: 'Essentials'},
    {id: 'room_bathtub', icon: Bath, label: 'Bathtub', category: 'Bathroom'},
    {id: 'room_safe', icon: Lock, label: 'Room Safe', category: 'Safety'},
    {id: 'room_workspace', icon: Laptop, label: 'Dedicated Desk', category: 'Connectivity'},
];

export const COUNTRIES = [
    'India', 'United States', 'United Kingdom', 'Australia', 'Canada',
    'Germany', 'France', 'Spain', 'Italy', 'Japan', 'UAE', 'Singapore',
    'Thailand', 'Greece', 'Portugal', 'Netherlands', 'Sweden', 'Brazil',
];





// Maps multi-room properties to valid backend RoomSkuType Enums
export const MULTI_ROOM_SKU_TYPES = [
    { value: 'STANDARD_ROOM', label: 'Standard Room' },
    { value: 'DELUXE_ROOM', label: 'Deluxe Room' },
    { value: 'EXECUTIVE_SUITE', label: 'Executive Suite' },
    { value: 'PRESIDENTIAL_SUITE', label: 'Presidential Suite' },
    { value: 'FAMILY_ROOM', label: 'Family Room' },
    { value: 'STUDIO_APARTMENT', label: 'Studio Apartment' },
    { value: 'PENTHOUSE', label: 'Penthouse' },
    { value: 'DORM_BED', label: 'Dorm Bed (Shared)' }
];
