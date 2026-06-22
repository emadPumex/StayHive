import {useState} from 'react';
import {Loader2, Navigation, AlertCircle, CheckCircle2, ChevronRight} from 'lucide-react';
import {COUNTRIES, T} from './constants';
import {Label, Input, Select, FieldError} from './FormControls';

const Step4 = ({data, set, errors}) => {
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState('');

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setGeoError('Geolocation not supported by your browser.');
            return;
        }
        setGeoLoading(true);
        setGeoError('');

        // It will only work if your app is running on http://localhost or a secure https:// domain.
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                set('latitude', pos.coords.latitude.toFixed(6));
                set('longitude', pos.coords.longitude.toFixed(6));
                setGeoLoading(false);
            },
            (error) => {
                console.error("Geolocation Error:", error.message);
                setGeoError('Unable to detect location. Please check browser permissions or enter manually.');
                setGeoLoading(false);
            },
            // Optional: Add high accuracy flag to force GPS over IP-based location
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
        );
    };

    return (
        <div className="animate-fadeUp">
            <div className="mb-8">
                <h2 style={{color: T.text}} className="text-2xl font-bold tracking-tight">Where is it located?</h2>
                <p style={{color: T.muted}} className="text-sm mt-1">Accurate location helps guests find your place.</p>
            </div>

            {/* Updated grid layout to neatly fit 3 items on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                    <Label required htmlFor="country-select">Country</Label>
                    <div className="relative">
                        <Select id="country-select" value={data.country}
                                onChange={(e) => set('country', e.target.value)}>
                            <option value="">Select country…</option>
                            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </Select>
                        <ChevronRight style={{color: T.muted}}
                                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 pointer-events-none"
                                      aria-hidden="true"/>
                    </div>
                    {errors?.country && <FieldError>{errors.country}</FieldError>}
                </div>

                <div>
                    {/* CHANGED: Added 'required' prop and FieldError component */}
                    <Label required htmlFor="state-input">State / Region</Label>
                    <Input id="state-input" placeholder="e.g. Maharashtra" value={data.state || ''}
                           onChange={(e) => set('state', e.target.value)}/>
                    {errors?.state && <FieldError>{errors.state}</FieldError>}
                </div>

                <div>
                    <Label required htmlFor="city-input">City</Label>
                    <Input id="city-input" placeholder="e.g. Mumbai" value={data.city || ''}
                           onChange={(e) => set('city', e.target.value)}/>
                    {errors?.city && <FieldError>{errors.city}</FieldError>}
                </div>
            </div>

            <div style={{background: T.bg700, border: `1px solid ${T.border}`}} className="rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p style={{color: T.text}} className="text-sm font-semibold">Map coordinates</p>
                        <p style={{color: T.muted}} className="text-xs mt-0.5">Latitude &amp; Longitude for the map
                            pin</p>
                    </div>
                    <button
                        type="button"
                        onClick={useMyLocation}
                        disabled={geoLoading}
                        style={{background: T.limePale, border: `1px solid ${T.lime}55`, color: T.lime}}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl
              hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {geoLoading
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin"
                                         aria-hidden="true"/><span>Detecting…</span></>
                            : <><Navigation className="w-3.5 h-3.5" aria-hidden="true"/><span>Use my location</span></>}
                    </button>
                </div>

                {geoError && (
                    <div role="alert"
                         style={{color: T.danger, background: `${T.danger}14`, border: `1px solid ${T.danger}33`}}
                         className="flex items-center gap-2 text-xs rounded-xl px-3 py-2 mb-3">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true"/>
                        {geoError}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor="lat-input">Latitude</Label>
                        <Input id="lat-input" placeholder="28.6139" value={data.latitude || ''}
                               onChange={(e) => set('latitude', e.target.value)}/>
                    </div>
                    <div>
                        <Label htmlFor="lng-input">Longitude</Label>
                        <Input id="lng-input" placeholder="77.2090" value={data.longitude || ''}
                               onChange={(e) => set('longitude', e.target.value)}/>
                    </div>
                </div>

                {data.latitude && data.longitude && (
                    <div style={{color: T.success}} className="mt-3 flex items-center gap-2 text-xs font-semibold"
                         role="status">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true"/>
                        Pinned at {parseFloat(data.latitude).toFixed(4)}, {parseFloat(data.longitude).toFixed(4)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step4;