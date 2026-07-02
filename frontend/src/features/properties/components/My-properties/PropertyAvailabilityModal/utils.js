import {WEEKDAY_ENUM} from './constants';

export const generateId = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `blk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const ruleAppliesToDate = (rule, date, dateStr) => {
    switch (rule.blockType) {
        case 'SPECIFIC_DATES':
        case 'SPECIFIC_MONTHS':
            return !!rule.startDate && !!rule.endDate && dateStr >= rule.startDate && dateStr <= rule.endDate;
        case 'RECURRING_WEEKLY':
            return !!rule.daysOfWeek?.includes(WEEKDAY_ENUM[date.getDay()]);
        case 'RECURRING_MONTHLY': {
            const day = date.getDate();
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            const dow = date.getDay();
            switch (rule.monthlyRule) {
                case 'START_OF_MONTH':
                    return day <= 3;
                case 'END_OF_MONTH':
                    return day > lastDay - 3;
                case 'FIRST_WEEKEND':
                    return day <= 7 && (dow === 0 || dow === 6);
                case 'CUSTOM_DAY_RANGE':
                    return !!rule.startDate && !!rule.endDate && dateStr >= rule.startDate && dateStr <= rule.endDate;
                default:
                    return false;
            }
        }
        default:
            return false;
    }
};

export const describeRule = (rule) => {
    switch (rule.blockType) {
        case 'SPECIFIC_DATES':
            return rule.startDate === rule.endDate ? rule.startDate : `${rule.startDate} → ${rule.endDate}`;
        case 'SPECIFIC_MONTHS':
            return `${rule.startDate} → ${rule.endDate}`;
        case 'RECURRING_WEEKLY':
            return `Every ${(rule.daysOfWeek || []).map(d => d.slice(0, 3)).join(', ')}`;
        case 'RECURRING_MONTHLY':
            return `Monthly — ${rule.monthlyRule?.replace(/_/g, ' ')}`;
        default:
            return 'Unknown rule';
    }
};

export const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    const startDay = date.getDay();
    for (let i = 0; i < startDay; i++) days.push(null);
    const numDays = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= numDays; d++) days.push(new Date(year, month, d));
    return days;
};

export const formatDateStr = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

// NOTE: fixed year 2026 here is cosmetic only (month-name lookup), doesn't affect
// actual calendar year state — kept as-is from original implementation.
export const getMonthName = (monthIdx) => new Date(2026, monthIdx, 1).toLocaleString('default', {month: 'long'});