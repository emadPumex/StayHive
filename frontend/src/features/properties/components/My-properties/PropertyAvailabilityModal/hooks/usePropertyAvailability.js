import {useState, useEffect} from 'react';
import {generateId, ruleAppliesToDate} from '../utils';

export const usePropertyAvailability = (property, isOpen, onSave, onClose) => {
    const TODAY_STR = new Date().toISOString().split('T')[0];

    const [currentYear, setCurrentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(5); // June

    const [propertyRules, setPropertyRules] = useState([]);
    const [originalPropertyRules, setOriginalPropertyRules] = useState([]);
    const [roomRulesMap, setRoomRulesMap] = useState({});
    const [originalRoomRulesMap, setOriginalRoomRulesMap] = useState({});

    const [target, setTarget] = useState({type: 'PROPERTY'});
    const [showAddRule, setShowAddRule] = useState(false);
    const [ruleForm, setRuleForm] = useState({
        reason: '', blockType: 'SPECIFIC_DATES', startDate: '', endDate: '',
        daysOfWeek: [], monthlyRule: 'START_OF_MONTH'
    });

    const rooms = property?.roomCategories || [];
    const isMultiUnit = rooms.length > 1;

    useEffect(() => {
        if (property) {
            const pRules = property.propertyBlockRules || [];
            setPropertyRules(pRules);
            setOriginalPropertyRules(pRules);

            const rMap = {};
            (property.roomCategories || []).forEach(r => {
                rMap[r.id] = r.roomBlockRules || [];
            });
            setRoomRulesMap(rMap);
            setOriginalRoomRulesMap(rMap);

            setTarget({type: 'PROPERTY'});
            setShowAddRule(false);
        }
    }, [property, isOpen]);

    const currentRules = target.type === 'PROPERTY' ? propertyRules : (roomRulesMap[target.roomId] || []);
    const originalCurrentRules = target.type === 'PROPERTY' ? originalPropertyRules : (originalRoomRulesMap[target.roomId] || []);

    const updateCurrentRules = (updater) => {
        if (target.type === 'PROPERTY') {
            setPropertyRules(prev => updater(prev));
        } else {
            setRoomRulesMap(prev => ({...prev, [target.roomId]: updater(prev[target.roomId] || [])}));
        }
    };

    const findBlockingRule = (dateStr, date) => {
        // A room is unbookable if either its own rule fires, or the whole property is
        // closed by a property-level rule — property closures must cascade down to every
        // room, since a guest can't book a room inside a shut property.
        const ownHit = currentRules.find(r => ruleAppliesToDate(r, date, dateStr));
        if (ownHit) return {rule: ownHit, source: target.type === 'PROPERTY' ? 'PROPERTY' : 'ROOM'};
        if (target.type === 'ROOM') {
            const inheritedHit = propertyRules.find(r => ruleAppliesToDate(r, date, dateStr));
            if (inheritedHit) return {rule: inheritedHit, source: 'PROPERTY_INHERITED'};
        }
        return null;
    };

    const handleDateClick = (dateStr, isPast, blockingHit) => {
        if (isPast) return;

        // Inherited property-level closures can only be managed from the Whole Property tab.
        if (blockingHit && blockingHit.source === 'PROPERTY_INHERITED') return;

        const blockingRule = blockingHit?.rule;
        const isQuickBlock = blockingRule && blockingRule.blockType === 'SPECIFIC_DATES' && blockingRule.startDate === blockingRule.endDate;

        if (blockingRule && !isQuickBlock) {
            // Locked by a range/recurring rule — must manage from the rule list, not a single click.
            return;
        }

        if (isQuickBlock) {
            updateCurrentRules(prev => prev.filter(r => r.id !== blockingRule.id));
        } else {
            const newRule = {
                id: generateId(),
                reason: 'Host blocked',
                blockType: 'SPECIFIC_DATES',
                startDate: dateStr,
                endDate: dateStr,
                daysOfWeek: null,
                monthlyRule: null
            };
            updateCurrentRules(prev => [...prev, newRule]);
        }
    };

    const handleClearAllBlocks = () => updateCurrentRules(() => []);

    const handleReset = () => {
        if (target.type === 'PROPERTY') setPropertyRules(originalPropertyRules);
        else setRoomRulesMap(prev => ({...prev, [target.roomId]: originalRoomRulesMap[target.roomId] || []}));
    };

    const handleDeleteRule = (ruleId) => updateCurrentRules(prev => prev.filter(r => r.id !== ruleId));

    const resetRuleForm = () => setRuleForm({
        reason: '',
        blockType: 'SPECIFIC_DATES',
        startDate: '',
        endDate: '',
        daysOfWeek: [],
        monthlyRule: 'START_OF_MONTH'
    });

    const handleAddRule = () => {
        if (!ruleForm.reason.trim()) return;

        const needsDateRange = ruleForm.blockType === 'SPECIFIC_DATES' || ruleForm.blockType === 'SPECIFIC_MONTHS' ||
            (ruleForm.blockType === 'RECURRING_MONTHLY' && ruleForm.monthlyRule === 'CUSTOM_DAY_RANGE');

        if (needsDateRange && (!ruleForm.startDate || !ruleForm.endDate)) return;
        if (ruleForm.blockType === 'RECURRING_WEEKLY' && ruleForm.daysOfWeek.length === 0) return;

        const newRule = {
            id: generateId(),
            reason: ruleForm.reason.trim(),
            blockType: ruleForm.blockType,
            startDate: needsDateRange ? ruleForm.startDate : null,
            endDate: needsDateRange ? ruleForm.endDate : null,
            daysOfWeek: ruleForm.blockType === 'RECURRING_WEEKLY' ? ruleForm.daysOfWeek : null,
            monthlyRule: ruleForm.blockType === 'RECURRING_MONTHLY' ? ruleForm.monthlyRule : null
        };

        updateCurrentRules(prev => [...prev, newRule]);
        resetRuleForm();
        setShowAddRule(false);
    };

    const toggleWeekday = (day) => {
        setRuleForm(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...prev.daysOfWeek, day]
        }));
    };

    const handleSave = () => {
        onSave(property.id, {
            propertyBlockRules: propertyRules,
            roomCategories: rooms.map(r => ({
                ...r,
                roomBlockRules: roomRulesMap[r.id] || r.roomBlockRules || []
            }))
        });
        onClose();
    };

    const nextMonths = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else setCurrentMonth(currentMonth + 1);
    };

    const prevMonths = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else setCurrentMonth(currentMonth - 1);
    };

    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYearVal = currentMonth === 11 ? currentYear + 1 : currentYear;

    const addedCount = currentRules.filter(r => !originalCurrentRules.some(o => o.id === r.id)).length;
    const removedCount = originalCurrentRules.filter(o => !currentRules.some(r => r.id === o.id)).length;

    let summaryStatement = "Click available dates to block them, or click a host-blocked date to unblock it. Use rule list below for date ranges or recurring blocks.";
    if (addedCount > 0 && removedCount > 0) {
        summaryStatement = `Modifying: adding ${addedCount} new ${addedCount === 1 ? 'rule' : 'rules'}, removing ${removedCount} ${removedCount === 1 ? 'rule' : 'rules'}.`;
    } else if (addedCount > 0) {
        summaryStatement = `Modifying: adding ${addedCount} new block ${addedCount === 1 ? 'rule' : 'rules'}.`;
    } else if (removedCount > 0) {
        summaryStatement = `Modifying: removing ${removedCount} block ${removedCount === 1 ? 'rule' : 'rules'}.`;
    }

    return {
        TODAY_STR,
        currentYear, currentMonth, nextMonthIdx, nextYearVal, nextMonths, prevMonths,
        rooms, isMultiUnit,
        target, setTarget,
        propertyRules,
        currentRules, originalCurrentRules,
        findBlockingRule, handleDateClick,
        handleClearAllBlocks, handleReset, handleDeleteRule,
        showAddRule, setShowAddRule,
        ruleForm, setRuleForm, resetRuleForm, handleAddRule, toggleWeekday,
        handleSave,
        addedCount, removedCount, summaryStatement,
    };
};