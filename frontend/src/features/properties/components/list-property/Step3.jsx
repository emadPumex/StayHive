import {CheckCircle2, AlertCircle} from 'lucide-react';
import {AMENITY_LIST, T} from '../constants.js';

const Step3 = ({data, set}) => {
    const toggle = (amenityDef) => {
        const cur = data.propertyAmenities || [];
        const exists = cur.find(a => a.id === amenityDef.id);
        
        if (exists) {
            set('propertyAmenities', cur.filter(a => a.id !== amenityDef.id));
        } else {
            set('propertyAmenities', [...cur, { id: amenityDef.id, name: amenityDef.label, category: amenityDef.category }]);
        }
    };
    
    const count = (data.propertyAmenities || []).length;

    // Group amenities by category
    const grouped = AMENITY_LIST.reduce((acc, amenity) => {
        const cat = amenity.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(amenity);
        return acc;
    }, {});

    return (
        <div className="animate-fadeUp">
            <div className="mb-8">
                <h2 style={{color: T.text}} className="text-2xl font-bold tracking-tight">What do you offer?</h2>
                <p style={{color: T.muted}} className="text-sm mt-1">Select all amenities available to guests.</p>
            </div>

            {count > 0 && (
                <div style={{color: T.lime}} className="mb-4 flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true"/>
                    <span aria-live="polite">{count} amenit{count === 1 ? 'y' : 'ies'} selected</span>
                </div>
            )}

            <div className="flex flex-col gap-8">
                {Object.entries(grouped).map(([categoryName, amenities]) => (
                    <div key={categoryName}>
                        <h3 style={{color: T.text}} className="text-sm font-semibold mb-3">{categoryName}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label={`${categoryName} amenities`}>
                            {amenities.map((def) => {
                                const on = (data.propertyAmenities || []).some(a => a.id === def.id);
                                const Icon = def.icon;
                                return (
                                    <button
                                        key={def.id}
                                        type="button"
                                        onClick={() => toggle(def)}
                                        aria-pressed={on}
                                        style={{
                                            background: on ? T.limePale : T.bg700,
                                            borderColor: on ? T.lime : T.border,
                                        }}
                                        className="flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left
                            transition-all duration-150 focus-visible:outline-none focus-visible:ring-2"
                                    >
                                        <div style={{background: on ? T.limePale : T.bg600}}
                                             className="w-9 h-9 rounded-xl flex items-center justify-center">
                                            <Icon className="w-4.5 h-4.5" style={{color: on ? T.lime : T.muted}}
                                                  aria-hidden="true"/>
                                        </div>
                                        <span style={{color: on ? T.lime : T.text}}
                                              className="text-xs font-semibold leading-tight">{def.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {count === 0 && (
                <p style={{color: T.amber, background: `${T.amber}14`, border: `1px solid ${T.amber}33`}}
                   className="mt-5 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true"/>
                    No amenities selected — listings with amenities get more views.
                </p>
            )}
        </div>
    );
};

export default Step3;
