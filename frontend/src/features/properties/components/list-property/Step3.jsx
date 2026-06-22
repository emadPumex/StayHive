import {CheckCircle2, AlertCircle} from 'lucide-react';
import {AMENITY_LIST, T} from './constants';

const Step3 = ({data, set}) => {
    const toggle = (id) => {
        const cur = data.amenities || [];
        set('amenities', cur.includes(id) ? cur.filter((a) => a !== id) : [...cur, id]);
    };
    const count = (data.amenities || []).length;

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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label="Amenities">
                {AMENITY_LIST.map(({id, icon: Icon, label}) => {
                    const on = (data.amenities || []).includes(id);
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => toggle(id)}
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
                                  className="text-xs font-semibold leading-tight">{label}</span>
                        </button>
                    );
                })}
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
