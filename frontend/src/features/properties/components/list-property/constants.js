import {
    Home, BedDouble, Sparkles, MapPin, Camera, User,
    Building2, Waves, Castle, TreePine, Wifi, Tv, Car,
    Wind, Utensils, WashingMachine, Dumbbell, Coffee,
    ShieldCheck, Flame, PawPrint, Bike
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
    {id: 1, label: 'Property', icon: Home},
    {id: 2, label: 'Rooms', icon: BedDouble},
    {id: 3, label: 'Amenities', icon: Sparkles},
    {id: 4, label: 'Location', icon: MapPin},
    {id: 5, label: 'Photos', icon: Camera},
    {id: 6, label: 'Host', icon: User},
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
    {id: 'Wifi', icon: Wifi, label: 'WiFi'},
    {id: 'TV', icon: Tv, label: 'Smart TV'},
    {id: 'Free parking', icon: Car, label: 'Free parking'},
    {id: 'Air conditioning', icon: Wind, label: 'Air conditioning'},
    {id: 'Kitchen', icon: Utensils, label: 'Kitchen'},
    {id: 'Washing machine', icon: WashingMachine, label: 'Washer/Dryer'},
    {id: 'Gym', icon: Dumbbell, label: 'Gym access'},
    {id: 'Coffee maker', icon: Coffee, label: 'Coffee maker'},
    {id: 'Pool', icon: Waves, label: 'Pool'},
    {id: 'Fire extinguisher', icon: ShieldCheck, label: 'Fire safety'},
    {id: 'Fireplace', icon: Flame, label: 'Fireplace'},
    {id: 'Pets allowed', icon: PawPrint, label: 'Pets allowed'},
    {id: 'Bicycle', icon: Bike, label: 'Bicycle'},
    {id: 'BBQ grill', icon: Utensils, label: 'BBQ grill'},
    {id: 'Hot tub', icon: Waves, label: 'Hot tub'},
    {id: 'Breakfast', icon: Coffee, label: 'Breakfast'},
];

export const COUNTRIES = [
    'India', 'United States', 'United Kingdom', 'Australia', 'Canada',
    'Germany', 'France', 'Spain', 'Italy', 'Japan', 'UAE', 'Singapore',
    'Thailand', 'Greece', 'Portugal', 'Netherlands', 'Sweden', 'Brazil',
];
