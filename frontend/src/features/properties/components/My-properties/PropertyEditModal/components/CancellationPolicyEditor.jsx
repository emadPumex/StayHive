import React from 'react';
import {Plus, Trash2, RotateCcw} from 'lucide-react';
import {WINDOW_RULES, WINDOW_DEFAULTS, CANCELLATION_PRESETS} from '../constants';
import {generateLocalId} from '../utils';
import {FieldLabel, TextInput} from './FormFields';

const CancellationPolicyEditor = ({policy, onChange}) => {
    const rules = WINDOW_RULES[policy.type] || WINDOW_RULES.FLEXIBLE;
    const setField = (field) => (val) => onChange({...policy, [field]: val});

    const applyPresetDefaults = (preset) => {
        onChange({
            ...policy,
            type: preset.value,
            name: preset.defaultName,
            description: preset.defaultDesc,
            windows: preset.defaultWindows.map(w => ({...w, _localId: generateLocalId()})),
        });
    };

    const setPresetType = (preset) => {
        const nextRules = WINDOW_RULES[preset.value];
        // Non-editable types (Flexible/Super Strict) can't carry stale windows from a
        // previous MODERATE/STRICT selection — clear them. Editable types get seeded
        // with their floor tier if switching in with nothing set yet.
        const windows = !nextRules.editable
            ? []
            : (policy.windows.length > 0
                ? policy.windows
                : WINDOW_DEFAULTS[preset.value].map(w => ({...w, _localId: generateLocalId()})));
        onChange({...policy, type: preset.value, windows});
    };

    const clampDays = (val) => {
        const n = Number(val) || 0;
        const floor = Math.max(n, rules.min);
        return rules.max != null ? Math.min(floor, rules.max) : floor;
    };

    const addWindow = () => {
        onChange({
            ...policy,
            windows: [...policy.windows, {
                _localId: generateLocalId(),
                daysBeforeCheckIn: rules.min,
                refundPercentage: 100
            }],
        });
    };

    const updateWindow = (localId, field, val) => {
        const clean = field === 'refundPercentage' ? Math.min(100, Math.max(0, Number(val) || 0)) : (Number(val) || 0);
        onChange({
            ...policy,
            windows: policy.windows.map(w => (w._localId === localId ? {...w, [field]: clean} : w)),
        });
    };

    const blurDays = (localId, val) => {
        onChange({
            ...policy,
            windows: policy.windows.map(w => (w._localId === localId ? {...w, daysBeforeCheckIn: clampDays(val)} : w)),
        });
    };

    const removeWindow = (localId) => {
        onChange({...policy, windows: policy.windows.filter(w => w._localId !== localId)});
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                {CANCELLATION_PRESETS.map(preset => {
                    const isSelected = policy.type === preset.value;
                    return (
                        <button
                            key={preset.value}
                            type="button"
                            onClick={() => setPresetType(preset)}
                            className={`px-3.5 py-2.5 rounded-xl border text-left text-xs font-bold transition-all duration-200 cursor-pointer ${
                                isSelected
                                    ? 'bg-[#1A2A0A] border-[#C8FB4C]/50 text-[#C8FB4C]'
                                    : 'bg-[#13161F] border-[#2A2D38] text-[#8A8FA8] hover:border-[#3A3D48] hover:text-[#FAFAF8]'
                            }`}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <FieldLabel>Policy Name</FieldLabel>
                    <button
                        type="button"
                        onClick={() => {
                            const preset = CANCELLATION_PRESETS.find(p => p.value === policy.type);
                            if (preset) applyPresetDefaults(preset);
                        }}
                        className="flex items-center gap-1 text-[10px] font-bold text-[#8A8FA8] hover:text-[#C8FB4C] transition-colors cursor-pointer"
                        title="Overwrite name, description, and windows with the default template for the selected type"
                    >
                        <RotateCcw className="w-3 h-3"/> Use default text
                    </button>
                </div>
                <TextInput value={policy.name} onChange={e => setField('name')(e.target.value)}
                           placeholder="e.g. Strict 30 Day Policy"/>
            </div>

            <div className="flex flex-col gap-1.5">
                <FieldLabel>Description</FieldLabel>
                <textarea
                    value={policy.description}
                    onChange={e => setField('description')(e.target.value)}
                    rows={2}
                    placeholder="e.g. Non-refundable if cancelled within 30 days."
                    className="px-4 py-2.5 bg-[#13161F] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-medium transition-colors duration-200 resize-none w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <FieldLabel>Refund Windows</FieldLabel>
                    {rules.editable && (
                        <button
                            type="button"
                            onClick={addWindow}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-[#C8FB4C] border border-[#C8FB4C]/30 bg-[#1A2A0A] hover:bg-[#1A2A0A]/70 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                            <Plus className="w-3 h-3"/> Add Tier
                        </button>
                    )}
                </div>

                {!rules.editable && (
                    <p className="text-[11px] text-[#8A8FA8] px-3 py-2 bg-[#13161F] border border-[#2A2D38] rounded-xl">
                        {rules.note}
                    </p>
                )}

                {rules.editable && (
                    <>
                        <p className="text-[10px] text-[#8A8FA8]">{rules.note}</p>
                        {policy.windows.map(w => (
                            <div key={w._localId}
                                 className="flex items-center gap-2 bg-[#13161F] border border-[#2A2D38] rounded-xl px-3 py-2">
                                <div className="flex items-center gap-1.5 flex-1">
                                    <input
                                        type="number"
                                        min={rules.min}
                                        max={rules.max ?? undefined}
                                        value={w.daysBeforeCheckIn}
                                        onChange={e => updateWindow(w._localId, 'daysBeforeCheckIn', e.target.value)}
                                        onBlur={e => blurDays(w._localId, e.target.value)}
                                        className="w-16 px-2 py-1.5 bg-[#0F1117] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8] font-bold text-center"
                                    />
                                    <span className="text-[10px] text-[#8A8FA8] font-medium whitespace-nowrap">days before check-in →</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={w.refundPercentage}
                                        onChange={e => updateWindow(w._localId, 'refundPercentage', e.target.value)}
                                        className="w-16 px-2 py-1.5 bg-[#0F1117] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-lg text-xs text-[#FAFAF8] font-bold text-center"
                                    />
                                    <span className="text-[10px] text-[#8A8FA8] font-medium">% refund</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeWindow(w._localId)}
                                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                                >
                                    <Trash2 className="w-3.5 h-3.5"/>
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default CancellationPolicyEditor;