// Step1.jsx
import {useRef, useState, useCallback, useEffect} from 'react';
import {ChevronRight, Loader2, Navigation, AlertCircle, CheckCircle2, Upload, Image as ImageIcon, X, Camera, ShieldCheck} from 'lucide-react';
import {PROPERTY_TYPES, COUNTRIES, T} from '../constants.js';
import {createLocalPreview, revokeLocalPreview} from './utils';
import {
    Label,
    Input,
    Textarea,
    Select,
    SelectCard,
    Section,
    FieldError
} from './FormControls';

const Step1 = ({data, set, errors}) => {
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState('');
    const [lightbox, setLightbox] = useState(null);

    const fileRef = useRef();
    const avatarRef = useRef();
    const [dragOverImages, setDragOverImages] = useState(false);
    const [dragOverAvatar, setDragOverAvatar] = useState(false);

    // REMOVED: The unmount cleanup block that was destroying the blob image references in memory

    const updateAddress = (field, value) => {
        set('address', { ...data.address, [field]: value });
    };

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setGeoError('Geolocation not supported by your browser.');
            return;
        }
        setGeoLoading(true);
        setGeoError('');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                set('address', {
                    ...data.address,
                    latitude: pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6),
                });
                setGeoLoading(false);
            },
            (error) => {
                setGeoError('Unable to detect location.');
                setGeoLoading(false);
            },
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
        );
    };

    const addFiles = useCallback((files) => {
        const toProcess = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (!toProcess.length) return;
        set('propertyImages', (prev) => {
            const current = prev || [];
            const remaining = 6 - current.length;
            if (remaining <= 0) return current;
            // Deduplicate: skip files already present (match by name + size + lastModified)
            const existingKeys = new Set(current.map(img => `${img.name}|${img.file?.size}|${img.file?.lastModified}`));
            const newFiles = toProcess.filter(f => !existingKeys.has(`${f.name}|${f.size}|${f.lastModified}`));
            if (!newFiles.length) return current;
            const previews = newFiles.map(f => ({ file: f, preview: createLocalPreview(f), name: f.name }));
            return [...current, ...previews.slice(0, remaining)];
        });
    }, [set]);

    const removeImage = (idx) => {
        const imgs = [...(data.propertyImages || [])];
        if (imgs[idx]) {
            revokeLocalPreview(imgs[idx].preview); // Safely clear memory only on explicit click tracking actions
            imgs.splice(idx, 1);
        }
        set('propertyImages', imgs);
    };

    const pickAvatar = (files) => {
        const f = files[0];
        if (!f || !f.type.startsWith('image/')) return;
        if (data.hostAvatarPreview) revokeLocalPreview(data.hostAvatarPreview);
        set('hostAvatarFile', f);
        set('hostAvatarPreview', createLocalPreview(f));
    };

    const count = (data.propertyImages || []).length;
    const canAdd = count < 6;

    return (
        <div className="animate-fadeUp flex flex-col gap-10">
            {/* Core Info */}
            <Section title="What kind of place?" desc="Choose the type that best describes your space.">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PROPERTY_TYPES.map((pt) => (
                        <SelectCard
                            key={pt.value}
                            selected={data.propertyType === pt.value}
                            onClick={() => set('propertyType', pt.value)}
                            icon={pt.icon}
                            label={pt.value}
                            desc={pt.desc}
                        />
                    ))}
                </div>
                {errors?.propertyType && <FieldError>{errors.propertyType}</FieldError>}

                <div className="grid grid-cols-1 gap-5 mt-6">
                    <div>
                        <Label required htmlFor="listing-name">Listing name</Label>
                        <Input
                            id="listing-name"
                            placeholder="e.g. Cliffside Villa with Ocean View"
                            value={data.name || ''}
                            onChange={(e) => set('name', e.target.value)}
                            maxLength={80}
                        />
                        <div className="flex justify-between mt-1.5">
                            {errors?.name ? <FieldError>{errors.name}</FieldError> : <span/>}
                            <span style={{color: T.muted}} className="text-xs">{(data.name || '').length}/80</span>
                        </div>
                    </div>
                    <div>
                        <Label required htmlFor="listing-summary">Description</Label>
                        <Textarea
                            id="listing-summary"
                            rows={4}
                            placeholder="What makes your place special? Describe the vibe, highlights, and nearby attractions…"
                            value={data.summary || ''}
                            onChange={(e) => set('summary', e.target.value)}
                            maxLength={500}
                        />
                        <div className="flex justify-between mt-1.5">
                            {errors?.summary ? <FieldError>{errors.summary}</FieldError> : <span/>}
                            <span style={{color: T.muted}} className="text-xs">{(data.summary || '').length}/500</span>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Location */}
            <Section title="Where is it located?" desc="Accurate location helps guests find your place.">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                        <Label required htmlFor="country-select">Country</Label>
                        <Select id="country-select" value={data.address?.country || ''}
                                onChange={(e) => updateAddress('country', e.target.value)}>
                            <option value="">Select country…</option>
                            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </Select>
                        {errors?.country && <FieldError>{errors.country}</FieldError>}
                    </div>
                    <div>
                        <Label required htmlFor="state-input">State / Region</Label>
                        <Input id="state-input" placeholder="e.g. Maharashtra" value={data.address?.state || ''}
                               onChange={(e) => updateAddress('state', e.target.value)}/>
                        {errors?.state && <FieldError>{errors.state}</FieldError>}
                    </div>
                    <div>
                        <Label required htmlFor="city-input">City</Label>
                        <Input id="city-input" placeholder="e.g. Mumbai" value={data.address?.city || ''}
                               onChange={(e) => updateAddress('city', e.target.value)}/>
                        {errors?.city && <FieldError>{errors.city}</FieldError>}
                    </div>
                </div>

                <div style={{background: T.bg700, border: `1px solid ${T.border}`}} className="rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <p style={{color: T.text}} className="text-sm font-semibold">Map coordinates</p>
                        <button
                            type="button" onClick={useMyLocation} disabled={geoLoading}
                            style={{background: T.limePale, border: `1px solid ${T.lime}55`, color: T.lime}}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl hover:opacity-80 transition-all disabled:opacity-50"
                        >
                            {geoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Navigation className="w-3.5 h-3.5"/>}
                            Use my location
                        </button>
                    </div>
                    {geoError && <p style={{color: T.danger}} className="text-xs mb-3">{geoError}</p>}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="lat-input">Latitude</Label>
                            <Input id="lat-input" placeholder="28.6139" value={data.address?.latitude || ''}
                                   onChange={(e) => updateAddress('latitude', e.target.value)}/>
                        </div>
                        <div>
                            <Label htmlFor="lng-input">Longitude</Label>
                            <Input id="lng-input" placeholder="77.2090" value={data.address?.longitude || ''}
                                   onChange={(e) => updateAddress('longitude', e.target.value)}/>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Photos */}
            <Section title="Show off your space" desc="Upload 3–6 photos. First photo becomes the cover.">
                {canAdd && (
                    <div
                        role="button" tabIndex={0}
                        onDragOver={(e) => { e.preventDefault(); setDragOverImages(true); }}
                        onDragLeave={() => setDragOverImages(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOverImages(false); addFiles(e.dataTransfer.files); }}
                        onClick={() => fileRef.current?.click()}
                        style={{ borderColor: dragOverImages ? T.lime : T.border, background: dragOverImages ? T.limePale : T.bg700 }}
                        className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer mb-6 transition-all"
                    >
                        <div style={{background: dragOverImages ? T.limePale : T.bg600, border: `1px solid ${T.border}`}}
                             className="w-14 h-14 rounded-2xl flex items-center justify-center">
                            <Upload className="w-6 h-6" style={{color: dragOverImages ? T.lime : T.muted}}/>
                        </div>
                        <p style={{color: T.text}} className="text-sm font-semibold">
                            {dragOverImages ? 'Drop to upload' : 'Drag & drop or click to browse'}
                        </p>
                        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}/>
                    </div>
                )}
                {count > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        {(data.propertyImages || []).map((img, i) => (
                            <div key={i}
                                 className={`relative group rounded-2xl overflow-hidden ${i === 0 ? 'col-span-3 sm:col-span-2 row-span-2' : ''}`}
                                 style={{aspectRatio: i === 0 ? '16/9' : '4/3', background: T.bg600}}>
                                <img
                                    src={img.preview}
                                    alt={img.name || "Property preview image"}
                                    className="w-full h-full object-cover cursor-zoom-in"
                                    onClick={() => setLightbox(img.preview)}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                            style={{background: T.bg800}}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full shadow-md flex items-center justify-center">
                                        <X className="w-4 h-4" style={{color: T.text}}/>
                                    </button>
                                </div>
                                {i === 0 && (
                                    <span style={{background: `${T.bg900}CC`, color: T.lime}}
                                          className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                        Cover photo
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {errors?.propertyImages && <FieldError>{errors.propertyImages}</FieldError>}
            </Section>

            {/* Host */}
            <Section title="Your host profile" desc="Guests book with people they can see and trust.">
                <div style={{background: T.bg700, border: `1px solid ${T.border}`}}
                     className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-5 rounded-2xl">
                    <div
                        role="button" tabIndex={0}
                        onDragOver={(e) => { e.preventDefault(); setDragOverAvatar(true); }}
                        onDragLeave={() => setDragOverAvatar(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOverAvatar(false); pickAvatar(e.dataTransfer.files); }}
                        onClick={() => avatarRef.current?.click()}
                        style={{ borderColor: dragOverAvatar ? T.lime : T.border, boxShadow: dragOverAvatar ? `0 0 0 3px ${T.limePale}` : 'none' }}
                        className="relative w-24 h-24 rounded-full flex-shrink-0 cursor-pointer border-4 overflow-hidden transition-all"
                    >
                        {data.hostAvatarPreview ? (
                            <img src={data.hostAvatarPreview} alt="Host avatar preview" className="w-full h-full object-cover"/>
                        ) : (
                            <div style={{background: T.bg600}} className="w-full h-full flex flex-col items-center justify-center gap-1">
                                <Camera className="w-7 h-7" style={{color: T.muted}}/>
                            </div>
                        )}
                        <input ref={avatarRef} type="file" accept="image/*" hidden onChange={(e) => pickAvatar(e.target.files)}/>
                    </div>
                    <div className="flex-1">
                        <p style={{color: T.text}} className="text-sm font-semibold">Profile photo</p>
                        {data.hostAvatarPreview ? (
                            <button type="button" onClick={() => {
                                revokeLocalPreview(data.hostAvatarPreview);
                                set('hostAvatarFile', null);
                                set('hostAvatarPreview', '');
                            }} style={{color: T.danger}} className="text-xs flex items-center gap-1 mt-2">
                                <X className="w-3 h-3"/> Remove photo
                            </button>
                        ) : (
                            <button type="button" onClick={() => avatarRef.current?.click()}
                                    style={{color: T.lime}} className="text-xs flex items-center gap-1 mt-2">
                                <Upload className="w-3 h-3"/> Upload photo
                            </button>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <Label required htmlFor="host-name">Your name</Label>
                        <Input id="host-name" placeholder="e.g. Arjun M." value={data.hostName || ''}
                               onChange={(e) => set('hostName', e.target.value)}/>
                        {errors?.hostName && <FieldError>{errors.hostName}</FieldError>}
                    </div>
                </div>
            </Section>

            {/* Lightbox */}
            {lightbox && (
                <div
                    onClick={() => setLightbox(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)'}}
                >
                    <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center"
                        style={{background: T.bg700}}
                    >
                        <X className="w-5 h-5" style={{color: T.text}}/>
                    </button>
                    <img
                        src={lightbox}
                        alt="Zoomed gallery item asset"
                        onClick={e => e.stopPropagation()}
                        className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
};

export default Step1;