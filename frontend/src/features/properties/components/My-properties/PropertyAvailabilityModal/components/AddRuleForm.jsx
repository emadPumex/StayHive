import React from 'react';
import {WEEKDAY_ENUM, WEEKDAY_SHORT} from '../constants';

const AddRuleForm = ({ruleForm, setRuleForm, onToggleWeekday, onCancel, onSubmit}) => (
    <div className="mt-4 bg-[#131722] border border-[#2A2D38] rounded-xl p-4 space-y-3">
        <input
            type="text"
            placeholder="Reason (e.g. Annual Maintenance)"
            value={ruleForm.reason}
            onChange={e => setRuleForm(prev => ({...prev, reason: e.target.value}))}
            className="w-full px-3 py-2 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8]"
        />

        <select
            value={ruleForm.blockType}
            onChange={e => setRuleForm(prev => ({...prev, blockType: e.target.value}))}
            className="w-full px-3 py-2 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8]"
        >
            <option value="SPECIFIC_DATES">Specific Dates (range)</option>
            <option value="SPECIFIC_MONTHS">Specific Months (range)</option>
            <option value="RECURRING_WEEKLY">Recurring Weekly</option>
            <option value="RECURRING_MONTHLY">Recurring Monthly</option>
        </select>

        {(ruleForm.blockType === 'SPECIFIC_DATES' || ruleForm.blockType === 'SPECIFIC_MONTHS') && (
            <div className="flex gap-2">
                <input type="date" value={ruleForm.startDate}
                       onChange={e => setRuleForm(prev => ({...prev, startDate: e.target.value}))}
                       className="flex-1 px-3 py-2 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8]"/>
                <input type="date" value={ruleForm.endDate}
                       onChange={e => setRuleForm(prev => ({...prev, endDate: e.target.value}))}
                       className="flex-1 px-3 py-2 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8]"/>
            </div>
        )}

        {ruleForm.blockType === 'RECURRING_WEEKLY' && (
            <div className="flex flex-wrap gap-1.5">
                {WEEKDAY_ENUM.map((day, i) => (
                    <button
                        key={day}
                        type="button"
                        onClick={() => onToggleWeekday(day)}
                        className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-200 ${
                            ruleForm.daysOfWeek.includes(day)
                                ? 'bg-[#1A2A0A] border-[#C8FB4C] text-[#C8FB4C]'
                                : 'bg-[#1A1D26] border-[#2A2D38] text-[#8A8FA8]'
                        }`}
                    >
                        {WEEKDAY_SHORT[i]}
                    </button>
                ))}
            </div>
        )}

        {ruleForm.blockType === 'RECURRING_MONTHLY' && (
            <>
                <select
                    value={ruleForm.monthlyRule}
                    onChange={e => setRuleForm(prev => ({...prev, monthlyRule: e.target.value}))}
                    className="w-full px-3 py-2 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8]"
                >
                    <option value="START_OF_MONTH">Start of Month</option>
                    <option value="END_OF_MONTH">End of Month</option>
                    <option value="FIRST_WEEKEND">First Weekend</option>
                    <option value="CUSTOM_DAY_RANGE">Custom Day Range</option>
                </select>
                {ruleForm.monthlyRule === 'CUSTOM_DAY_RANGE' && (
                    <div className="flex gap-2">
                        <input type="date" value={ruleForm.startDate}
                               onChange={e => setRuleForm(prev => ({...prev, startDate: e.target.value}))}
                               className="flex-1 px-3 py-2 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8]"/>
                        <input type="date" value={ruleForm.endDate}
                               onChange={e => setRuleForm(prev => ({...prev, endDate: e.target.value}))}
                               className="flex-1 px-3 py-2 bg-[#1A1D26] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8]"/>
                    </div>
                )}
            </>
        )}

        <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onCancel}
                    className="px-3 py-2 text-[10px] font-bold text-[#8A8FA8] hover:text-[#FAFAF8]">
                Cancel
            </button>
            <button type="button" onClick={onSubmit}
                    className="px-4 py-2 bg-[#C8FB4C] hover:bg-[#b5e243] text-[#0F1117] text-[10px] font-bold rounded-lg transition-all duration-200">
                Add Rule
            </button>
        </div>
    </div>
);

export default AddRuleForm;