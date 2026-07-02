import {Home, DoorOpen, ShieldCheck, Sparkles} from 'lucide-react';
import {CANCELLATION_POLICIES} from '../../constants';

export const WINDOW_RULES = {
    FLEXIBLE: {editable: false, min: 1, max: 1, note: 'Full refund if cancelled at least 1 day before check-in.'},
    MODERATE: {
        editable: true,
        min: 5,
        max: 13,
        note: 'Minimum 5 days before check-in for full refund. Add tiers up to 13 days.'
    },
    STRICT: {
        editable: true,
        min: 14,
        max: null,
        note: 'Minimum 14 days before check-in for full refund. Add tiers beyond that.'
    },
    SUPER_STRICT: {editable: false, min: 0, max: 0, note: 'Non-refundable — no refund windows apply.'},
};

export const WINDOW_DEFAULTS = {
    FLEXIBLE: [],
    MODERATE: [{daysBeforeCheckIn: 5, refundPercentage: 100}],
    STRICT: [{daysBeforeCheckIn: 14, refundPercentage: 100}],
    SUPER_STRICT: [],
};

export const CANCELLATION_PRESETS = CANCELLATION_POLICIES.map(p => ({
    value: p.value,
    label: p.label,
    defaultName: `${p.label} Policy`,
    defaultDesc: p.desc,
    defaultWindows: WINDOW_DEFAULTS[p.value] || [],
}));

export const TABS = [
    {id: 'details', label: 'Details', icon: Home},
    {id: 'rooms', label: 'Rooms', icon: DoorOpen},
    {id: 'cancellation', label: 'Cancellation', icon: ShieldCheck},
    {id: 'amenities', label: 'Amenities', icon: Sparkles},
];