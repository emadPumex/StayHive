import {Plus, Trash2, ChevronRight} from 'lucide-react';
import {CANCELLATION_POLICIES, T} from './constants';
import {Section, Select, Label, Input, FieldError} from './FormControls';

const Step2 = ({data, set, errors}) => {
    const handleTypeChange = (e) => {
        const type = e.target.value;
        const policyDef = CANCELLATION_POLICIES.find(p => p.value === type);
        
        let initialWindows = [];
        if (type === 'MODERATE') {
            initialWindows = [{ daysBeforeCheckIn: 5, refundPercentage: 100 }];
        } else if (type === 'STRICT') {
            initialWindows = [{ daysBeforeCheckIn: 14, refundPercentage: 100 }];
        }
        
        set('cancellationPolicy', {
            type,
            name: policyDef ? policyDef.label + ' Cancellation Policy' : '',
            description: policyDef ? policyDef.desc : '',
            windows: initialWindows
        });
    };

    const addWindow = () => {
        const current = data.cancellationPolicy.windows || [];
        set('cancellationPolicy', {
            ...data.cancellationPolicy,
            windows: [...current, { daysBeforeCheckIn: 7, refundPercentage: 50 }]
        });
    };

    const updateWindow = (index, field, value) => {
        const current = [...(data.cancellationPolicy.windows || [])];
        current[index][field] = Number(value);
        set('cancellationPolicy', {
            ...data.cancellationPolicy,
            windows: current
        });
    };

    const removeWindow = (index) => {
        const current = [...(data.cancellationPolicy.windows || [])];
        current.splice(index, 1);
        set('cancellationPolicy', {
            ...data.cancellationPolicy,
            windows: current
        });
    };

    const type = data.cancellationPolicy?.type;
    const showWindows = type === 'MODERATE' || type === 'STRICT';

    return (
        <div className="animate-fadeUp">
            <div className="mb-8">
                <h2 style={{color: T.text}} className="text-2xl font-bold tracking-tight">Cancellation Policy</h2>
                <p style={{color: T.muted}} className="text-sm mt-1">Set the rules for when guests cancel their booking.</p>
            </div>

            <Section title="Policy Type" desc="Select the baseline policy format.">
                <div>
                    <Label required htmlFor="cancellation-policy">Policy</Label>
                    <div className="relative">
                        <Select
                            id="cancellation-policy"
                            value={type || ''}
                            onChange={handleTypeChange}
                        >
                            <option value="">Select a policy…</option>
                            {CANCELLATION_POLICIES.map((p) => (
                                <option key={p.value} value={p.value}>{p.label} — {p.desc}</option>
                            ))}
                        </Select>
                    </div>
                    {errors?.cancellationPolicy && <FieldError>{errors.cancellationPolicy}</FieldError>}
                </div>
            </Section>

            {showWindows && (
                <Section title="Cancellation Windows" desc="Define refund percentages based on days before check-in.">
                    <div className="space-y-4">
                        {(data.cancellationPolicy.windows || []).map((win, index) => (
                            <div key={index} style={{background: T.bg700, border: `1px solid ${T.border}`}} className="p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex-1 w-full">
                                    <Label htmlFor={`days-${index}`}>Days Before Check-in</Label>
                                    <Input 
                                        id={`days-${index}`} 
                                        type="number" 
                                        min="1" 
                                        value={win.daysBeforeCheckIn} 
                                        onChange={(e) => updateWindow(index, 'daysBeforeCheckIn', e.target.value)} 
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <Label htmlFor={`refund-${index}`}>Refund Percentage (%)</Label>
                                    <Input 
                                        id={`refund-${index}`} 
                                        type="number" 
                                        min="0" 
                                        max="100" 
                                        value={win.refundPercentage} 
                                        onChange={(e) => updateWindow(index, 'refundPercentage', e.target.value)} 
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeWindow(index)} 
                                    className="mt-6 p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                                    aria-label="Remove window"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        <button 
                            type="button" 
                            onClick={addWindow} 
                            style={{borderColor: T.lime, color: T.lime}}
                            className="w-full py-3 mt-2 border-2 border-dashed rounded-xl flex justify-center items-center gap-2 hover:bg-lime-400/10 transition-colors text-sm font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Window
                        </button>
                    </div>
                </Section>
            )}
        </div>
    );
};

export default Step2;
