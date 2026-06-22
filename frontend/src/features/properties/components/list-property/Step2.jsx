import {Users, BedDouble, Bath} from 'lucide-react';
import {T} from './constants';
import {Counter} from './FormControls';

const Step2 = ({data, set}) => (
    <div className="animate-fadeUp">
        <div className="mb-8">
            <h2 style={{color: T.text}} className="text-2xl font-bold tracking-tight">Rooms &amp; capacity</h2>
            <p style={{color: T.muted}} className="text-sm mt-1">Help guests understand your space.</p>
        </div>

        <div style={{background: T.bg700, border: `1px solid ${T.border}`}} className="rounded-2xl px-5 py-2 mb-6">
            <Counter id="guests-label" label="Guests" sub="Maximum at once" value={data.accommodates}
                     onChange={(v) => set('accommodates', v)} min={1} max={30}/>
            <Counter id="bedrooms-label" label="Bedrooms" value={data.bedrooms} onChange={(v) => set('bedrooms', v)}
                     min={0} max={20}/>
            <Counter id="bathrooms-label" label="Bathrooms" value={data.bathrooms} onChange={(v) => set('bathrooms', v)}
                     min={1} max={20}/>
        </div>

        <div className="flex flex-wrap gap-2">
            {[
                {icon: Users, val: `${data.accommodates} guests`},
                {icon: BedDouble, val: `${data.bedrooms} bedrooms`},
                {icon: Bath, val: `${data.bathrooms} bathrooms`},
            ].map(({icon: Icon, val}) => (
                <div key={val}
                     style={{background: T.limePale, border: `1px solid ${T.lime}33`, color: T.lime}}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true"/>
                    <span className="text-xs font-semibold">{val}</span>
                </div>
            ))}
        </div>
    </div>
);

export default Step2;
