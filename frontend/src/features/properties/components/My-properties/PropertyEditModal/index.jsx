import React from 'react';
import {X, Sliders, Check} from 'lucide-react';
import TabRail from './components/TabRail';
import RoomCard from './components/RoomCard';
import CancellationPolicyEditor from './components/CancellationPolicyEditor';
import AmenityPicker from './components/AmenityPicker';
import {FieldLabel, FieldError, TextInput, SectionHeader} from './components/FormFields';
import {usePropertyEditForm} from './hooks/usePropertyEditForm';

const PropertyEditModal = ({isOpen, onClose, property, onSave}) => {
    const form = usePropertyEditForm(property, isOpen, onSave, onClose);

    if (!isOpen || !property) return null;

    const {
        activeTab, setActiveTab,
        name, setName,
        summary, setSummary,
        city, setCity,
        cancellationPolicy, setCancellationPolicy,
        propertyAmenityIds, togglePropertyAmenity,
        rooms, updateRoom, removeRoom,
        expandedRoomId, setExpandedRoomId,
        errors, errorTabs,
        isSaving,
        standaloneViolation,
        handleSubmit,
    } = form;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <style>{`
                .pem-scroll { scrollbar-width: thin; scrollbar-color: #2A2D38 transparent; }
                .pem-scroll::-webkit-scrollbar { width: 6px; }
                .pem-scroll::-webkit-scrollbar-track { background: transparent; }
                .pem-scroll::-webkit-scrollbar-thumb { background-color: #2A2D38; border-radius: 999px; }
                .pem-scroll::-webkit-scrollbar-thumb:hover { background-color: #C8FB4C; }
            `}</style>
            <div
                className="w-full max-w-3xl bg-[#0F1117] border border-[#1A1D26] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]"
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="px-6 py-5 border-b border-[#1A1D26] flex items-center justify-between bg-[#0F1117] shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="w-9 h-9 rounded-xl bg-[#1A2A0A] flex items-center justify-center border border-[#C8FB4C]/20 shrink-0">
                            <Sliders className="w-4 h-4 text-[#C8FB4C]"/>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#FAFAF8] leading-tight">Edit Listing</h3>
                            <p className="text-[11px] text-[#8A8FA8] mt-0.5 font-medium truncate">
                                {property.name}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-[#8A8FA8] hover:text-[#FAFAF8] bg-[#1A1D26] hover:bg-[#2A2D38] rounded-xl transition-all duration-200 cursor-pointer shrink-0"
                    >
                        <X className="w-4 h-4"/>
                    </button>
                </div>

                {/* Body: rail + panel, only the panel scrolls */}
                <div className="flex flex-col md:flex-row flex-1 min-h-0">
                    <TabRail active={activeTab} onSelect={setActiveTab} errorTabs={errorTabs}/>

                    <div className="pem-scroll flex-1 min-w-0 overflow-y-auto">
                        <div className="p-6 space-y-5">

                            {activeTab === 'details' && (
                                <>
                                    <SectionHeader>Listing Details</SectionHeader>

                                    <div className="flex flex-col gap-1.5">
                                        <FieldLabel>Property Title</FieldLabel>
                                        <TextInput value={name} onChange={e => setName(e.target.value)}
                                                   placeholder="e.g. Minimalist Concrete Loft"/>
                                        <FieldError msg={errors.name}/>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <FieldLabel>Description</FieldLabel>
                                        <textarea
                                            value={summary}
                                            onChange={e => setSummary(e.target.value)}
                                            placeholder="Describe what makes this place special..."
                                            rows={3}
                                            className="px-4 py-2.5 bg-[#13161F] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-medium transition-colors duration-200 resize-none w-full"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <FieldLabel>City</FieldLabel>
                                        <TextInput value={city} onChange={e => setCity(e.target.value)}
                                                   placeholder="e.g. Kyoto"/>
                                        <FieldError msg={errors.city}/>
                                    </div>

                                    <p className="text-[10px] text-[#8A8FA8] font-medium pt-2">
                                        Country cannot be changed — create a new listing to relist elsewhere.
                                    </p>
                                </>
                            )}

                            {activeTab === 'rooms' && (
                                <>
                                    <SectionHeader>Room Categories</SectionHeader>

                                    <div className="space-y-2">
                                        {rooms.map(room => (
                                            <RoomCard
                                                key={room.id}
                                                room={room}
                                                isExpanded={expandedRoomId === room.id}
                                                onToggleExpand={() => setExpandedRoomId(prev => (prev === room.id ? null : room.id))}
                                                onChange={(updated) => updateRoom(room.id, updated)}
                                                onRemove={() => removeRoom(room.id)}
                                                canRemove={rooms.length > 1}
                                                standaloneConflict={standaloneViolation && room.roomType === 'ENTIRE_PLACE'}
                                            />
                                        ))}
                                    </div>
                                    <FieldError msg={errors.rooms}/>
                                </>
                            )}

                            {activeTab === 'cancellation' && (
                                <>
                                    <SectionHeader>Cancellation Policy</SectionHeader>
                                    <CancellationPolicyEditor policy={cancellationPolicy}
                                                              onChange={setCancellationPolicy}/>
                                    <FieldError msg={errors.cancellation}/>
                                </>
                            )}

                            {activeTab === 'amenities' && (
                                <>
                                    <SectionHeader>Property Amenities</SectionHeader>
                                    <AmenityPicker selectedIds={propertyAmenityIds} onToggle={togglePropertyAmenity}/>
                                </>
                            )}

                        </div>
                    </div>
                </div>

                <div
                    className="px-6 py-4 border-t border-[#1A1D26] bg-[#0F1117] flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-5 py-2 bg-[#C8FB4C] hover:bg-[#b5e243] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1117] text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(200,251,76,0.12)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                    >
                        {isSaving ? (
                            <span
                                className="w-4 h-4 border-2 border-[#0F1117]/30 border-t-[#0F1117] rounded-full animate-spin"/>
                        ) : (
                            <Check className="w-3.5 h-3.5"/>
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyEditModal;