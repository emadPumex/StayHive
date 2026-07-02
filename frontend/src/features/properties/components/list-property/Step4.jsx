// Step4.jsx
import {Plus, Trash2, Upload, X} from 'lucide-react';
import {T, MULTI_ROOM_SKU_TYPES, ROOM_AMENITY_LIST} from '../constants.js';
import {Section, Select, Label, Input, FieldError, Textarea, Counter} from './FormControls';
import {useEffect, useRef, useState} from 'react';
import {createLocalPreview, revokeLocalPreview} from './utils';

const ENTIRE_PLACE_TYPES = ['VILLA', 'HOUSE', 'CABIN', 'APARTMENT', 'COTTAGE'];




const Step4 = ({data, set, errors}) => {
    const currentPropertyType = data.propertyType || 'APARTMENT';
    const isEntirePlace = ENTIRE_PLACE_TYPES.includes(currentPropertyType);

    // Dom tracking refs array optimized to anchor active multi-room file streams safely
    const fileInputRefs = useRef([]);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        if (isEntirePlace) {
            // Enforce unified single item array allocation reflecting RoomCategory Schema rules
            if (!data.roomCategories || data.roomCategories.length === 0 || data.roomCategories.length > 1 || data.roomCategories[0].name !== 'Entire Space') {
                set('roomCategories', [{
                    id: 'STANDARD_ROOM',        // Immutable RoomSkuType Enum assignment
                    name: 'Entire Space',
                    roomType: 'ENTIRE_PLACE',    // Immutable RoomType Enum assignment
                    bedroomCount: data.bedroomCount || 1,
                    basePrice: data.price || data.basePrice || 100.0,
                    totalInventory: 1,           // Standalone structural logic enforces exactly 1 physical unit
                    accommodates: data.accommodates || 2,
                    bedCount: data.bedCount || 1,
                    bathrooms: data.bathrooms || 1,
                    roomAmenities: data.roomAmenities || [],
                    images: null,                // Deferred to Step 1 property-level gallery collection
                    roomBlockRules: []
                }]);
            }
        } else {
            // Standard multi-inventory initialization matrix (Hotels, Hostels)
            if (!data.roomCategories || data.roomCategories.length === 0) {
                const isHostel = currentPropertyType === 'HOSTEL';
                set('roomCategories', [{
                    id: isHostel ? 'DORM_BED' : 'STANDARD_ROOM',
                    name: isHostel ? 'Standard Shared Dorm' : 'Standard Room',
                    roomType: isHostel ? 'SHARED_ROOM' : 'PRIVATE_ROOM',
                    bedroomCount: 1,
                    basePrice: 100.0,
                    totalInventory: 10,
                    accommodates: isHostel ? 1 : 2,
                    bedCount: 1,
                    bathrooms: 1,
                    roomAmenities: [],
                    images: [],
                    roomBlockRules: []
                }]);
            }
        }
    }, [isEntirePlace, currentPropertyType]);

    const updateRoom = (index, field, value) => {
        const current = [...(data.roomCategories || [])];
        if (!current[index]) return;

        current[index] = { ...current[index], [field]: value };

        // Auto-synchronize complementary Enums for multi-room changes smoothly
        if (field === 'id') {
            if (value === 'DORM_BED') {
                current[index].roomType = 'SHARED_ROOM';
                current[index].accommodates = 1;
            } else if (current[index].roomType === 'SHARED_ROOM') {
                current[index].roomType = 'PRIVATE_ROOM';
            }

            // Force bedroomCount to 1 for standard single-room category classes
            if (!['EXECUTIVE_SUITE', 'PRESIDENTIAL_SUITE', 'FAMILY_ROOM', 'PENTHOUSE'].includes(value)) {
                current[index].bedroomCount = 1;
            }
        }

        set('roomCategories', current);
    };

    const addRoom = () => {
        const current = data.roomCategories || [];
        const isHostel = currentPropertyType === 'HOSTEL';
        set('roomCategories', [...current, {
            id: isHostel ? 'DORM_BED' : 'STANDARD_ROOM',
            name: isHostel ? 'New Dorm Category' : 'New Room Category',
            roomType: isHostel ? 'SHARED_ROOM' : 'PRIVATE_ROOM',
            bedroomCount: 1,
            basePrice: 100.0,
            totalInventory: 5,
            accommodates: isHostel ? 1 : 2,
            bedCount: 1,
            bathrooms: 1,
            roomAmenities: [],
            images: [],
            roomBlockRules: []
        }]);
    };

    const removeRoom = (index) => {
        const current = [...(data.roomCategories || [])];
        if (!current[index]) return;
        (current[index].images || []).forEach(img => revokeLocalPreview(img.preview));
        current.splice(index, 1);
        set('roomCategories', current);
    };

    const addRoomFiles = (index, files) => {
        const currentRooms = [...(data.roomCategories || [])];
        if (!currentRooms[index]) return;

        const room = { ...currentRooms[index] };
        const imgs = Array.isArray(room.images) ? room.images : [];
        const remaining = 6 - imgs.length;
        if (remaining <= 0) return;

        // Deduplicate: skip files already present in this room (match by name + size + lastModified)
        const existingKeys = new Set(imgs.map(img => `${img.name}|${img.file?.size}|${img.file?.lastModified}`));
        const toProcess = Array.from(files)
            .filter(f => f.type.startsWith('image/'))
            .filter(f => !existingKeys.has(`${f.name}|${f.size}|${f.lastModified}`))
            .slice(0, remaining);

        if (!toProcess.length) return;
        const previews = toProcess.map(f => ({ file: f, preview: createLocalPreview(f), name: f.name }));

        room.images = [...imgs, ...previews];
        currentRooms[index] = room;
        set('roomCategories', currentRooms);
    };

    const removeRoomImage = (roomIndex, imgIndex) => {
        const currentRooms = [...(data.roomCategories || [])];
        if (!currentRooms[roomIndex]) return;

        const room = { ...currentRooms[roomIndex] };
        const imgs = [...(room.images || [])];

        if (imgs[imgIndex]) {
            revokeLocalPreview(imgs[imgIndex].preview);
            imgs.splice(imgIndex, 1);
        }

        room.images = imgs;
        currentRooms[roomIndex] = room;
        set('roomCategories', currentRooms);
    };

    const toggleRoomAmenity = (roomIndex, amenityDef) => {
        const currentRooms = [...(data.roomCategories || [])];
        if (!currentRooms[roomIndex]) return;

        const room = { ...currentRooms[roomIndex] };
        const curAmenities = room.roomAmenities || [];
        const exists = curAmenities.find(a => a.id === amenityDef.id);

        let nextAmenities;
        if (exists) {
            nextAmenities = curAmenities.filter(a => a.id !== amenityDef.id);
        } else {
            nextAmenities = [...curAmenities, { id: amenityDef.id, name: amenityDef.label, category: amenityDef.category }];
        }

        room.roomAmenities = nextAmenities;
        currentRooms[roomIndex] = room;
        set('roomCategories', currentRooms);
    };

    // Helper dynamically generating intuitive UX placeholders per property type
    const getFriendlyPlaceholder = (roomSku) => {
        if (currentPropertyType === 'HOSTEL' || roomSku === 'DORM_BED') return 'e.g., 6-Bed Mixed Deluxe Dorm';
        if (roomSku === 'EXECUTIVE_SUITE' || roomSku === 'PRESIDENTIAL_SUITE') return 'e.g., Executive King Suite with Balcony';
        return 'e.g., Deluxe Double Room with Ocean View';
    };

    return (
        <div className="animate-fadeUp">
            <div className="mb-8">
                <h2 style={{color: T.text}} className="text-2xl font-bold tracking-tight">Rooms & capacity</h2>
                <p style={{color: T.muted}} className="text-sm mt-1">
                    {isEntirePlace
                        ? 'Verify capacities and space metrics for your single-unit standalone property.'
                        : 'Add and manage distinct layout configurations distributed across your property.'}
                </p>
            </div>

            {errors?.roomCategories && (
                <div style={{color: T.danger, background: `${T.danger}14`, border: `1px solid ${T.danger}33`}}
                     className="mb-6 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                    {errors.roomCategories}
                </div>
            )}

            <div className="space-y-6">
                {(data.roomCategories || []).map((room, index) => {
                    const currentImages = Array.isArray(room?.images) ? room.images : [];
                    const count = currentImages.length;
                    const canAdd = count < 6;

                    return (
                        <Section key={index} title={isEntirePlace ? 'Property Configuration Mapping' : `Room Group #${index + 1}`} desc="">
                            <div className="grid grid-cols-1 gap-5">

                                {/* CLASSIFICATION LAYER */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {isEntirePlace ? (
                                        <>
                                            {/* Beautiful informational card instead of a raw disabled form input field */}
                                            <div style={{background: T.bg700, borderColor: T.border}} className="sm:col-span-2 p-4 rounded-xl border flex flex-col gap-1">
                                                <span className="text-xs font-semibold tracking-wider uppercase text-lime-400">Booking Structure</span>
                                                <p style={{color: T.text}} className="text-sm font-medium">
                                                    Rent Type: <span className="text-gray-300 font-normal">Entire Place (Guests book the whole property)</span>
                                                </p>
                                                <p style={{color: T.muted}} className="text-xs mt-0.5">
                                                    Your media and descriptions from Step 1 are automatically applied to this listing space layout.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Standard Editable Select Fields for Multi-Room Assets */}
                                            <div>
                                                <Label required htmlFor={`room-name-${index}`}>Room Type Name</Label>
                                                <Input
                                                    id={`room-name-${index}`}
                                                    placeholder={getFriendlyPlaceholder(room.id)}
                                                    value={room.name || ''}
                                                    onChange={(e) => updateRoom(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label required htmlFor={`room-id-${index}`}>Room Category Class</Label>
                                                <Select
                                                    id={`room-id-${index}`}
                                                    value={room.id || 'STANDARD_ROOM'}
                                                    onChange={(e) => updateRoom(index, 'id', e.target.value)}
                                                >
                                                    {MULTI_ROOM_SKU_TYPES.map(sku => (
                                                        <option key={sku.value} value={sku.value}>{sku.label}</option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </>
                                    )}
                                </div>


                                {/* COUNTERS PANEL MATRIX */}
                                <div style={{background: T.bg700, border: `1px solid ${T.border}`}} className="rounded-2xl px-5 py-2">
                                    <Counter
                                        id={`capacity-${index}`}
                                        label="Max Guests"
                                        sub="Maximum number of people allowed inside this space unit"
                                        value={room.accommodates || 1}
                                        onChange={(v) => updateRoom(index, 'accommodates', v)}
                                        min={1}
                                        max={30}
                                        disabled={room.id === 'DORM_BED'}
                                    />

                                    {/* BEDROOMS COUNTER: Conditional based on property architecture and room SKU rules */}
                                    {(isEntirePlace || ['EXECUTIVE_SUITE', 'PRESIDENTIAL_SUITE', 'FAMILY_ROOM', 'PENTHOUSE'].includes(room.id)) && (
                                        <Counter
                                            id={`bedrooms-${index}`}
                                            label="Bedrooms"
                                            sub={isEntirePlace ? "Total physical private bedroom configurations" : "Number of separate bedrooms inside this suite"}
                                            value={room.bedroomCount || 1}
                                            onChange={(v) => updateRoom(index, 'bedroomCount', v)}
                                            min={1}
                                            max={20}
                                        />
                                    )}

                                    <Counter
                                        id={`beds-${index}`}
                                        label="Total Beds"
                                        sub={isEntirePlace ? 'Total sleeping surfaces available across whole home' : 'Total sleeping surfaces inside individual room unit'}
                                        value={room.bedCount || 1}
                                        onChange={(v) => updateRoom(index, 'bedCount', v)}
                                        min={1}
                                        max={20}
                                    />

                                    <Counter
                                        id={`baths-${index}`}
                                        label="Bathrooms"
                                        value={room.bathrooms || 1}
                                        onChange={(v) => updateRoom(index, 'bathrooms', v)}
                                        min={0}
                                        max={20}
                                    />

                                    {!isEntirePlace && (
                                        <Counter
                                            id={`inventory-${index}`}
                                            label="Number of Identical Rooms"
                                            sub="How many of these exact rooms do you have available in inventory?"
                                            value={room.totalInventory || 1}
                                            onChange={(v) => updateRoom(index, 'totalInventory', v)}
                                            min={1}
                                            max={100}
                                        />
                                    )}
                                </div>

                                {/* BASE RATE CONFIGURATION CONTAINER */}
                                <div>
                                    <Label required htmlFor={`room-price-${index}`}>Base Price per night</Label>
                                    <div className="relative max-w-[200px]">
                                        <span style={{color: T.muted}} className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium">$</span>
                                        <Input
                                            id={`room-price-${index}`}
                                            className="pl-8"
                                            type="number"
                                            min="1"
                                            value={room.basePrice || ''}
                                            onChange={(e) => updateRoom(index, 'basePrice', Number(e.target.value))}
                                        />
                                    </div>
                                    {errors[`roomPrice_${index}`] && <FieldError>{errors[`roomPrice_${index}`]}</FieldError>}
                                </div>

                                {/* ROOM AMENITIES SELECTION MATRIX */}
                                <div className="mt-6 border-t border-gray-700 pt-6">
                                    <Label>Room Amenities</Label>
                                    <p className="text-xs mb-3.5" style={{color: T.muted}}>
                                        Select amenities specific to this individual room or unit layout.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {ROOM_AMENITY_LIST.map((def) => {
                                            const roomAmenities = room.roomAmenities || [];
                                            const on = roomAmenities.some(a => a.id === def.id);
                                            const Icon = def.icon;
                                            return (
                                                <button
                                                    key={def.id}
                                                    type="button"
                                                    onClick={() => toggleRoomAmenity(index, def)}
                                                    aria-pressed={on}
                                                    style={{
                                                        background: on ? T.limePale : T.bg700,
                                                        borderColor: on ? T.lime : T.border,
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left cursor-pointer transition-all duration-150 select-none hover:opacity-90"
                                                >
                                                    <div style={{background: on ? T.limePale : T.bg600}}
                                                         className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                                                        <Icon className="w-3.5 h-3.5" style={{color: on ? T.lime : T.muted}} />
                                                    </div>
                                                    <span style={{color: on ? T.lime : T.text}} className="text-[11px] font-semibold leading-tight">{def.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* MEDIA MANAGER LAYER - Conditionally rendered only for Multi-Room environments */}
                                {!isEntirePlace && (
                                    <div className="mt-6 border-t border-gray-700 pt-6">
                                        <Label>Room Gallery Photos</Label>
                                        <p className="text-xs mb-3" style={{color: T.muted}}>Upload up to 6 interior photos showing off this specific room layout.</p>

                                        {canAdd && (
                                            <div
                                                role="button" tabIndex={0}
                                                onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
                                                onDragLeave={() => setDragOverIndex(null)}
                                                onDrop={(e) => { e.preventDefault(); setDragOverIndex(null); addRoomFiles(index, e.dataTransfer.files); }}
                                                onClick={() => fileInputRefs.current[index]?.click()}
                                                style={{ borderColor: dragOverIndex === index ? T.lime : T.border, background: dragOverIndex === index ? T.limePale : T.bg700 }}
                                                className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer mb-4 transition-all"
                                            >
                                                <Upload className="w-5 h-5" style={{color: dragOverIndex === index ? T.lime : T.muted}}/>
                                                <span style={{color: T.muted}} className="text-xs">{dragOverIndex === index ? 'Drop assets here' : 'Click or drag room interior photos'}</span>

                                                <input
                                                    ref={el => fileInputRefs.current[index] = el}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    hidden
                                                    onChange={(e) => { addRoomFiles(index, e.target.files); e.target.value = ''; }}
                                                />
                                            </div>
                                        )}

                                        {count > 0 && (
                                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                                {currentImages.map((img, i) => (
                                                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square"
                                                         style={{background: T.bg600}}>
                                                        <img
                                                            src={img.preview}
                                                            alt={img.name || "Preview item panel"}
                                                            className="w-full h-full object-cover cursor-zoom-in"
                                                            onClick={() => setLightbox(img.preview)}
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                                            <button type="button"
                                                                    onClick={(e) => { e.stopPropagation(); removeRoomImage(index, i); }}
                                                                    style={{background: T.bg800}}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full shadow-md flex items-center justify-center">
                                                                <X className="w-3 h-3" style={{color: T.text}}/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* CLEAN INTERFACING FOR REMOVING ROOM NODES */}
                                {!isEntirePlace && data.roomCategories.length > 1 && (
                                    <div className="flex justify-end mt-2">
                                        <button
                                            type="button"
                                            onClick={() => removeRoom(index)}
                                            className="text-red-400 text-sm font-semibold flex items-center gap-1 hover:text-red-300"
                                        >
                                            <Trash2 className="w-4 h-4"/> Remove Room Type
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Section>
                    );
                })}

                {/* ADD ROOM CONTROLLER: Excluded for standalone homes */}
                {!isEntirePlace && (
                    <button
                        type="button"
                        onClick={addRoom}
                        style={{borderColor: T.lime, color: T.lime}}
                        className="w-full py-4 border-2 border-dashed rounded-2xl flex justify-center items-center gap-2 hover:bg-lime-400/10 transition-colors text-sm font-semibold"
                    >
                        <Plus className="w-5 h-5"/> Add Another Room Type
                    </button>
                )}
            </div>

            {/* LIGHTBOX SYSTEM */}
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
                        alt="Zoomed Media Layout View"
                        onClick={e => e.stopPropagation()}
                        className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
};

export default Step4;