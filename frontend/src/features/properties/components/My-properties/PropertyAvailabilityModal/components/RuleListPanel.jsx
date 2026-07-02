import React from 'react';
import {Plus, Trash2} from 'lucide-react';
import {describeRule} from '../utils';
import AddRuleForm from './AddRuleForm';

const RuleListPanel = ({
                           target, propertyRules, currentRules,
                           showAddRule, setShowAddRule,
                           ruleForm, setRuleForm, resetRuleForm, onToggleWeekday, onAddRule,
                           onDeleteRule,
                       }) => (
    <div className="mt-8 pt-6 border-t border-[#1A1D26]">
        <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-[#FAFAF8]">Active Block Rules</h4>
            <button
                type="button"
                onClick={() => setShowAddRule(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-[#C8FB4C] border border-[#C8FB4C]/30 bg-[#1A2A0A] hover:bg-[#1A2A0A]/70 rounded-lg transition-all duration-200"
            >
                <Plus className="w-3.5 h-3.5"/> Add Rule
            </button>
        </div>

        {target.type === 'ROOM' && propertyRules.length > 0 && (
            <div className="space-y-2 mb-4">
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Inherited from Whole
                    Property (read-only here)</p>
                {propertyRules.map(rule => (
                    <div key={rule.id}
                         className="flex items-center justify-between bg-orange-950/20 border border-orange-500/20 rounded-xl px-4 py-2.5">
                        <div>
                            <p className="text-xs font-bold text-[#FAFAF8]">{rule.reason}</p>
                            <p className="text-[10px] text-[#8A8FA8] mt-0.5">{rule.blockType.replace(/_/g, ' ')} — {describeRule(rule)}</p>
                        </div>
                        <span
                            className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Property-wide</span>
                    </div>
                ))}
            </div>
        )}

        {currentRules.length === 0 && !showAddRule && (
            <p className="text-xs text-[#8A8FA8]">No {target.type === 'ROOM' ? 'room-specific' : ''} block rules for
                this target.</p>
        )}

        <div className="space-y-2">
            {currentRules.map(rule => (
                <div key={rule.id}
                     className="flex items-center justify-between bg-[#1A1D26] border border-[#2A2D38] rounded-xl px-4 py-2.5">
                    <div>
                        <p className="text-xs font-bold text-[#FAFAF8]">{rule.reason}</p>
                        <p className="text-[10px] text-[#8A8FA8] mt-0.5">{rule.blockType.replace(/_/g, ' ')} — {describeRule(rule)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onDeleteRule(rule.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
                        title="Delete this rule"
                    >
                        <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                </div>
            ))}
        </div>

        {showAddRule && (
            <AddRuleForm
                ruleForm={ruleForm}
                setRuleForm={setRuleForm}
                onToggleWeekday={onToggleWeekday}
                onCancel={() => {
                    setShowAddRule(false);
                    resetRuleForm();
                }}
                onSubmit={onAddRule}
            />
        )}
    </div>
);

export default RuleListPanel;