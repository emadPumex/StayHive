import React from 'react';
import {Trash2, ChevronDown, ChevronUp, Hash, AlertTriangle, BedDouble, Bath, Users, DollarSign} from 'lucide-react';
import {ROOM_TYPES} from '../../../constants';
import {ROOM_AMENITY_CATALOG} from '../utils';
import {FieldLabel, TextInput, SelectInput, CounterField} from './FormFields';
import AmenityPicker from './AmenityPicker';

const RoomCard = ({room, isExpanded, onToggleExpand, onChange, onRemove, canRemove, standaloneConflict}) => {
    const set = (field) => (val) => onChange({...room, [field]: val});

    const toggleRoomAmenity = (id) => {
        onChange({
            ...room,
            amenityIds: room.amenityIds.includes(id)
                ? room.amenityIds.filter(a => a !== id)
                : [...room.amenityIds, id],
        });
    };

    return (
        <div className="bg-[#13161F] border border-[#2A2D38] rounded-2xl overflow-hidden">
            <button
                type="button"
                onClick={onToggleExpand}
                className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
            >
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-[#FAFAF8] truncate">
                        {room.name || 'Untitled Room Category'}
                    </span>
                    <span
                        className="text-[10px] font-bold text-[#8A8FA8] px-1.5 py-0.5 bg-[#1A1D26] rounded-md shrink-0">
                        {room.roomType.replace('_', ' ')}
                    </span>
                    {room.basePrice > 0 && (
                        <span className="text-[10px] font-bold text-[#C8FB4C] shrink-0">${room.basePrice}/night</span>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {canRemove && (
                        <span
                            role="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Remove this room category"
                        >
                            <Trash2 className="w-3.5 h-3.5"/>
                        </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#8A8FA8]"/> :
                        <ChevronDown className="w-4 h-4 text-[#8A8FA8]"/>}
                </div>
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-[#1A1D26] pt-4">
                    {standaloneConflict && (
                        <div
                            className="flex items-start gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5"/>
                            <p className="text-[11px] text-rose-300 font-medium leading-relaxed">
                                "Entire Place" must be the only room category on a property — remove other rooms first,
                                or change this room's type.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <FieldLabel>Room Category Name</FieldLabel>
                        <TextInput value={room.name} onChange={e => set('name')(e.target.value)}
                                   placeholder="e.g. Deluxe King Suite"/>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Room Type</FieldLabel>
                            <SelectInput value={room.roomType} onChange={e => set('roomType')(e.target.value)}>
                                {ROOM_TYPES.map(t => (
                                    <option key={t.value} value={t.value} className="bg-[#0F1117]">
                                        {t.value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Price / Night (USD)</FieldLabel>
                            <div className="relative">
                                <DollarSign
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8FA8] pointer-events-none"/>
                                <input
                                    type="number"
                                    min={1}
                                    value={room.basePrice}
                                    onChange={e => set('basePrice')(Number(e.target.value))}
                                    className="w-full pl-9 pr-4 py-2.5 bg-[#0F1117] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-bold transition-colors duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <CounterField label="Inventory" icon={Hash} value={room.totalInventory}
                                      onChange={set('totalInventory')} min={1}/>
                        <CounterField label="Guests" icon={Users} value={room.accommodates}
                                      onChange={set('accommodates')} min={1}/>
                        <CounterField label="Bedrooms" icon={BedDouble} value={room.bedroomCount}
                                      onChange={set('bedroomCount')} min={0}/>
                        <CounterField label="Beds" icon={BedDouble} value={room.bedCount} onChange={set('bedCount')}
                                      min={1}/>
                        <CounterField label="Bathrooms" icon={Bath} value={room.bathrooms} onChange={set('bathrooms')}
                                      min={1}/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <FieldLabel>Room Amenities</FieldLabel>
                        <AmenityPicker selectedIds={room.amenityIds} onToggle={toggleRoomAmenity}
                                       catalog={ROOM_AMENITY_CATALOG}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomCard;