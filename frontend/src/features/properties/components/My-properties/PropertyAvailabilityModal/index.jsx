import React from 'react';
import {X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle} from 'lucide-react';
import {getMonthName} from './utils';
import {usePropertyAvailability} from './hooks/usePropertyAvailability';
import TargetSelector from './components/TargetSelector';
import CalendarLegend from './components/CalendarLegend';
import MonthCalendar from './components/MonthCalendar';
import RuleListPanel from './components/RuleListPanel';

const PropertyAvailabilityModal = ({isOpen, onClose, property, onSave}) => {
    const av = usePropertyAvailability(property, isOpen, onSave, onClose);

    if (!isOpen || !property) return null;

    const {
        TODAY_STR,
        currentYear, currentMonth, nextMonthIdx, nextYearVal, nextMonths, prevMonths,
        rooms, isMultiUnit,
        target, setTarget,
        propertyRules,
        currentRules,
        findBlockingRule, handleDateClick,
        handleClearAllBlocks, handleReset, handleDeleteRule,
        showAddRule, setShowAddRule,
        ruleForm, setRuleForm, resetRuleForm, handleAddRule, toggleWeekday,
        handleSave,
        addedCount, removedCount, summaryStatement,
    } = av;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <style>{`
                .pav-scroll { scrollbar-width: thin; scrollbar-color: #2A2D38 transparent; }
                .pav-scroll::-webkit-scrollbar { width: 6px; }
                .pav-scroll::-webkit-scrollbar-track { background: transparent; }
                .pav-scroll::-webkit-scrollbar-thumb { background-color: #2A2D38; border-radius: 999px; }
                .pav-scroll::-webkit-scrollbar-thumb:hover { background-color: #C8FB4C; }
            `}</style>
            <div
                className="w-full max-w-5xl bg-[#0F1117] border border-[#1A1D26] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] min-h-0 transform scale-100 transition-all duration-300 animate-modal-zoom"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="p-6 border-b border-[#1A1D26] flex items-center justify-between bg-[#131722]/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl bg-[#1A2A0A] flex items-center justify-center border border-[#C8FB4C]/20">
                            <CalendarIcon className="w-5 h-5 text-[#C8FB4C]"/>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#FAFAF8] tracking-tight">{property.name}</h3>
                            <p className="text-xs text-[#8A8FA8]">Manage property availability schedule</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                            className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] rounded-xl transition-all duration-200">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                {isMultiUnit && (
                    <TargetSelector rooms={rooms} target={target} onSelect={setTarget}/>
                )}

                {/* Calendar View Body — flex-1 + min-h-0 is what actually lets this scroll instead
                    of pushing the card taller than the viewport (the old bug: flex-grow alone
                    doesn't shrink in a column flex context, so content spilled past the card). */}
                <div className="pav-scroll p-6 overflow-y-auto flex-1 min-h-0 bg-[#0F1117]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <button onClick={prevMonths}
                                    className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] rounded-xl transition-all duration-200">
                                <ChevronLeft className="w-4 h-4"/>
                            </button>
                            <span className="text-sm font-semibold text-[#FAFAF8] px-2 min-w-[120px] text-center">
                                {getMonthName(currentMonth)} - {getMonthName(nextMonthIdx)}
                            </span>
                            <button onClick={nextMonths}
                                    className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] border border-[#2A2D38] rounded-xl transition-all duration-200">
                                <ChevronRight className="w-4 h-4"/>
                            </button>
                        </div>

                        <CalendarLegend isRoomTarget={target.type === 'ROOM'}/>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <MonthCalendar year={currentYear} month={currentMonth} todayStr={TODAY_STR}
                                       findBlockingRule={findBlockingRule} onDateClick={handleDateClick}/>
                        <MonthCalendar year={nextYearVal} month={nextMonthIdx} todayStr={TODAY_STR}
                                       findBlockingRule={findBlockingRule} onDateClick={handleDateClick}/>
                    </div>

                    <RuleListPanel
                        target={target}
                        propertyRules={propertyRules}
                        currentRules={currentRules}
                        showAddRule={showAddRule}
                        setShowAddRule={setShowAddRule}
                        ruleForm={ruleForm}
                        setRuleForm={setRuleForm}
                        resetRuleForm={resetRuleForm}
                        onToggleWeekday={toggleWeekday}
                        onAddRule={handleAddRule}
                        onDeleteRule={handleDeleteRule}
                    />
                </div>

                {/* Footer Action Row */}
                <div className="p-4 border-t border-[#1A1D26] bg-[#131722]/50 flex flex-col gap-3 shrink-0">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#8A8FA8] shrink-0 mt-0.5"/>
                        <p className="text-xs text-[#8A8FA8] font-medium leading-relaxed">{summaryStatement}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={handleClearAllBlocks} disabled={currentRules.length === 0}
                                    className="px-3 py-2 text-[10px] font-bold text-rose-400 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                                    title="Remove all rules for this target">
                                Clear All Rules
                            </button>
                            <button type="button" onClick={handleReset}
                                    disabled={addedCount === 0 && removedCount === 0}
                                    className="px-3 py-2 text-[10px] font-bold text-[#8A8FA8] border border-[#2A2D38] bg-[#1A1D26] hover:bg-[#2A2D38] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                                    title="Revert unsaved changes for this target">
                                Reset
                            </button>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <button type="button" onClick={onClose}
                                    className="px-4 py-2.5 text-xs font-bold text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSave}
                                    className="px-6 py-2.5 bg-[#C8FB4C] hover:bg-[#b5e243] active:scale-95 text-[#0F1117] text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(200,251,76,0.15)] transition-all duration-200">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyAvailabilityModal;