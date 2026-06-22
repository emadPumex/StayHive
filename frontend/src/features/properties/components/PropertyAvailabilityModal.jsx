import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { T } from './list-property/constants';

const PropertyAvailabilityModal = ({ isOpen, onClose, property, onSave }) => {
    // Current local time date: 2026-06-22
    const TODAY_STR = '2026-06-22';
    
    // Calendar month tracking (start at June 2026)
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed, 5 = June
    
    const [blockedDates, setBlockedDates] = useState([]);
    const [originalBlockedDates, setOriginalBlockedDates] = useState([]);

    useEffect(() => {
        if (property) {
            setBlockedDates(property.blockedDates || []);
            setOriginalBlockedDates(property.blockedDates || []);
        }
    }, [property, isOpen]);

    if (!isOpen || !property) return null;

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        const startDay = date.getDay(); // 0 = Sun, 1 = Mon
        
        // Pad days before start of month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }
        
        const numDays = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= numDays; d++) {
            days.push(new Date(year, month, d));
        }
        return days;
    };

    const formatDateStr = (date) => {
        if (!date) return '';
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const handleDateClick = (dateStr, isBooked, isPast) => {
        if (isPast || isBooked) return; // Unclickable states

        if (blockedDates.includes(dateStr)) {
            setBlockedDates(blockedDates.filter(d => d !== dateStr));
        } else {
            setBlockedDates([...blockedDates, dateStr]);
        }
    };

    const handleSave = () => {
        onSave(property.id, blockedDates);
        onClose();
    };

    const nextMonths = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevMonths = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const getMonthName = (monthIdx) => {
        return new Date(2026, monthIdx, 1).toLocaleString('default', { month: 'long' });
    };

    // Calculate secondary month for dual view
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYearVal = currentMonth === 11 ? currentYear + 1 : currentYear;

    const renderMonthCalendar = (year, month) => {
        const days = getDaysInMonth(year, month);
        const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        return (
            <div className="flex-1 min-w-[280px]">
                <h4 className="text-sm font-bold text-[#FAFAF8] mb-4 flex items-center justify-between px-1">
                    <span>{getMonthName(month)} {year}</span>
                </h4>
                
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#8A8FA8] mb-2">
                    {weekdays.map(wd => (
                        <div key={wd} className="py-1">{wd}</div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                        if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;

                        const dateStr = formatDateStr(day);
                        const isPast = dateStr < TODAY_STR;
                        const isBooked = property.bookedDates?.includes(dateStr);
                        const isBlocked = blockedDates.includes(dateStr);
                        const isToday = dateStr === TODAY_STR;

                        let btnClass = "relative aspect-square w-full rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all duration-200 cursor-pointer select-none ";
                        let cellStyle = {};

                        if (isPast) {
                            btnClass += "text-[#3A3D48] bg-[#12141A]/20 cursor-not-allowed opacity-40";
                        } else if (isBooked) {
                            btnClass += "bg-indigo-600/90 text-white shadow-[0_0_12px_rgba(79,70,229,0.3)] cursor-not-allowed group";
                        } else if (isBlocked) {
                            btnClass += "border border-[#F5C842] text-[#F5C842] hover:bg-[#F5C842]/10";
                            cellStyle = {
                                background: 'repeating-linear-gradient(45deg, rgba(245,200,66,0.05), rgba(245,200,66,0.05) 3px, rgba(245,200,66,0.15) 3px, rgba(245,200,66,0.15) 6px)'
                            };
                        } else {
                            // Available
                            btnClass += "bg-[#1A1D26] text-[#FAFAF8] border border-[#2A2D38] hover:border-[#C8FB4C] hover:scale-105 active:scale-95";
                            if (isToday) {
                                btnClass += " ring-1 ring-[#C8FB4C] ring-offset-2 ring-offset-[#0F1117]";
                            }
                        }

                        return (
                            <button
                                key={dateStr}
                                type="button"
                                disabled={isPast || isBooked}
                                onClick={() => handleDateClick(dateStr, isBooked, isPast)}
                                className={btnClass}
                                style={cellStyle}
                            >
                                <span>{day.getDate()}</span>
                                
                                {isBooked && (
                                    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
                                        <div className="bg-[#0F1117] text-[#FAFAF8] border border-indigo-500/50 text-[10px] py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap">
                                            Guest Stay
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Calculate changes summary statement
    const addedCount = blockedDates.filter(d => !originalBlockedDates.includes(d)).length;
    const removedCount = originalBlockedDates.filter(d => !blockedDates.includes(d)).length;
    
    let summaryStatement = "Select available dates to block them for guests, or click blocked dates to unblock them.";
    if (addedCount > 0 && removedCount > 0) {
        summaryStatement = `Modifying: blocking ${addedCount} new ${addedCount === 1 ? 'date' : 'dates'}, unblocking ${removedCount} ${removedCount === 1 ? 'date' : 'dates'}.`;
    } else if (addedCount > 0) {
        summaryStatement = `Modifying: blocking ${addedCount} new ${addedCount === 1 ? 'date' : 'dates'} for host occupancy.`;
    } else if (removedCount > 0) {
        summaryStatement = `Modifying: releasing ${removedCount} host-blocked ${removedCount === 1 ? 'date' : 'dates'} to public.`;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            {/* Modal Box */}
            <div 
                className="w-full max-w-4xl bg-[#0F1117] border border-[#1A1D26] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-none transform scale-100 transition-all duration-300 animate-modal-zoom"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-[#1A1D26] flex items-center justify-between bg-[#131722]/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A2A0A] flex items-center justify-center border border-[#C8FB4C]/20">
                            <CalendarIcon className="w-5 h-5 text-[#C8FB4C]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#FAFAF8] tracking-tight">{property.name}</h3>
                            <p className="text-xs text-[#8A8FA8]">Manage property availability schedule</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] rounded-xl transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar View Body */}
                <div className="p-6 overflow-y-auto flex-grow bg-[#0F1117]">
                    
                    {/* Navigation and legend */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        {/* Month navigation */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={prevMonths}
                                className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] rounded-xl transition-all duration-200"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-semibold text-[#FAFAF8] px-2 min-w-[120px] text-center">
                                {getMonthName(currentMonth)} - {getMonthName(nextMonthIdx)}
                            </span>
                            <button 
                                onClick={nextMonths}
                                className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] rounded-xl transition-all duration-200"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3.5 h-3.5 rounded bg-[#1A1D26] border border-[#2A2D38]" />
                                <span className="text-[#8A8FA8]">Available</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                                <div className="w-3.5 h-3.5 rounded bg-indigo-600/90" />
                                <span>Guest Stay</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-[#F5C842]">
                                <div 
                                    className="w-3.5 h-3.5 rounded border border-[#F5C842]" 
                                    style={{ background: 'repeating-linear-gradient(45deg, rgba(245,200,66,0.05), rgba(245,200,66,0.05) 2px, rgba(245,200,66,0.15) 2px, rgba(245,200,66,0.15) 4px)' }}
                                />
                                <span>Blocked by Host</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-40">
                                <div className="w-3.5 h-3.5 rounded bg-[#12141A]/40" />
                                <span className="text-[#8A8FA8]">Past/Unavailable</span>
                            </div>
                        </div>
                    </div>

                    {/* Dual Month Layout (degrades gracefully to block stack on small screens) */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {renderMonthCalendar(currentYear, currentMonth)}
                        {renderMonthCalendar(nextYearVal, nextMonthIdx)}
                    </div>
                </div>

                {/* Footer Action Row */}
                <div className="p-6 border-t border-[#1A1D26] bg-[#131722]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-2 max-w-xl">
                        <AlertCircle className="w-4 h-4 text-[#8A8FA8] shrink-0 mt-0.5" />
                        <p className="text-xs text-[#8A8FA8] font-medium leading-relaxed">
                            {summaryStatement}
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-end gap-4 shrink-0">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-xs font-bold text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-[#C8FB4C] hover:bg-[#b5e243] active:scale-95 text-[#0F1117] text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(200,251,76,0.15)] transition-all duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyAvailabilityModal;
