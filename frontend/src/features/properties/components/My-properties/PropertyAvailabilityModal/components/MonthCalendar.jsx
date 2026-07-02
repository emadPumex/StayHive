import React from 'react';
import {getDaysInMonth, formatDateStr, getMonthName} from '../utils';

const MonthCalendar = ({year, month, todayStr, findBlockingRule, onDateClick}) => {
    const days = getDaysInMonth(year, month);

    return (
        <div className="flex-1 min-w-[280px]">
            <h4 className="text-sm font-bold text-[#FAFAF8] mb-4 flex items-center justify-between px-1">
                <span>{getMonthName(month)} {year}</span>
            </h4>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#8A8FA8] mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(wd => <div key={wd} className="py-1">{wd}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="aspect-square"/>;

                    const dateStr = formatDateStr(day);
                    const isPast = dateStr < todayStr;
                    const isToday = dateStr === todayStr;
                    const blockingHit = !isPast ? findBlockingRule(dateStr, day) : null;
                    const blockingRule = blockingHit?.rule || null;
                    const isInheritedBlock = blockingHit?.source === 'PROPERTY_INHERITED';
                    const isQuickBlock = !isInheritedBlock && blockingRule && blockingRule.blockType === 'SPECIFIC_DATES' && blockingRule.startDate === blockingRule.endDate;
                    const isLockedBlock = blockingRule && !isQuickBlock && !isInheritedBlock;

                    let btnClass = "relative aspect-square w-full rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all duration-200 select-none ";
                    let cellStyle = {};

                    if (isPast) {
                        btnClass += "text-[#3A3D48] bg-[#12141A]/20 cursor-not-allowed opacity-40";
                    } else if (isInheritedBlock) {
                        btnClass += "bg-orange-600/50 text-white cursor-not-allowed group";
                    } else if (isLockedBlock) {
                        btnClass += "bg-indigo-600/60 text-white cursor-not-allowed group";
                    } else if (isQuickBlock) {
                        btnClass += "cursor-pointer border border-[#F5C842] text-[#F5C842] hover:border-rose-400 hover:text-rose-300 hover:bg-rose-400/10 active:scale-95";
                        cellStyle = {background: 'repeating-linear-gradient(45deg, rgba(245,200,66,0.05), rgba(245,200,66,0.05) 3px, rgba(245,200,66,0.15) 3px, rgba(245,200,66,0.15) 6px)'};
                    } else {
                        btnClass += "cursor-pointer bg-[#1A1D26] text-[#FAFAF8] border border-[#2A2D38] hover:border-[#C8FB4C] hover:scale-105 active:scale-95";
                        if (isToday) btnClass += " ring-1 ring-[#C8FB4C] ring-offset-2 ring-offset-[#0F1117]";
                    }

                    return (
                        <button
                            key={dateStr}
                            type="button"
                            disabled={isPast || isLockedBlock || isInheritedBlock}
                            onClick={() => onDateClick(dateStr, isPast, blockingHit)}
                            className={btnClass}
                            style={cellStyle}
                            title={
                                isPast ? 'Past date' :
                                    isInheritedBlock ? `Blocked property-wide: ${blockingRule.reason} — manage from Whole Property tab` :
                                        isLockedBlock ? `Blocked by rule: ${blockingRule.reason} — manage in rule list below` :
                                            isQuickBlock ? 'Click to unblock (make available)' :
                                                'Click to block this date'
                            }
                        >
                            <span>{day.getDate()}</span>
                            {(isLockedBlock || isInheritedBlock) && (
                                <div
                                    className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 z-[70] pointer-events-none">
                                    <div
                                        className={`bg-[#0F1117] text-[#FAFAF8] border text-[10px] py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap ${isInheritedBlock ? 'border-orange-500/50' : 'border-indigo-500/50'}`}>
                                        {isInheritedBlock ? `Property-wide: ${blockingRule.reason}` : blockingRule.reason}
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

export default MonthCalendar;