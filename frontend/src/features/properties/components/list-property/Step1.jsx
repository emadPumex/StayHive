import {ChevronRight} from 'lucide-react';
import {PROPERTY_TYPES, ROOM_TYPES, CANCELLATION_POLICIES, T} from './constants';
import {
    Label,
    Input,
    Textarea,
    Select,
    SelectCard,
    Section,
    FieldError
} from './FormControls';

const Step1 = ({data, set, errors}) => (
    <div className="animate-fadeUp">
        <div className="mb-8">
            <h2 style={{color: T.text}} className="text-2xl font-bold tracking-tight">What kind of place?</h2>
            <p style={{color: T.muted}} className="text-sm mt-1">Choose the type that best describes your space.</p>
        </div>

        <Section title="Property type" desc="Select one that fits your listing best.">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label="Property type">
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
        </Section>

        <Section title="Room type" desc="Tell guests what they'll have access to.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Room type">
                {ROOM_TYPES.map((rt) => (
                    <SelectCard
                        key={rt.value}
                        selected={data.roomType === rt.value}
                        onClick={() => set('roomType', rt.value)}
                        label={rt.value}
                        desc={rt.desc}
                    />
                ))}
            </div>
            {errors?.roomType && <FieldError>{errors.roomType}</FieldError>}
        </Section>

        <div className="grid grid-cols-1 gap-5">
            <div>
                <Label required htmlFor="listing-name">Listing name</Label>
                <Input
                    id="listing-name"
                    placeholder="e.g. Cliffside Villa with Ocean View"
                    value={data.name}
                    onChange={(e) => set('name', e.target.value)}
                    maxLength={80}
                    aria-describedby="name-count name-error"
                />
                <div className="flex justify-between mt-1.5">
                    {errors?.name
                        ? <FieldError id="name-error">{errors.name}</FieldError>
                        : <span/>}
                    <span id="name-count" style={{color: T.muted}} className="text-xs">{data.name.length}/80</span>
                </div>
            </div>

            <div>
                <Label required htmlFor="listing-summary">Description</Label>
                <Textarea
                    id="listing-summary"
                    rows={4}
                    placeholder="What makes your place special? Describe the vibe, highlights, and nearby attractions…"
                    value={data.summary}
                    onChange={(e) => set('summary', e.target.value)}
                    maxLength={500}
                    aria-describedby="summary-count"
                />
                <div className="flex justify-end mt-1.5">
                    <span id="summary-count" style={{color: T.muted}}
                          className="text-xs">{data.summary.length}/500</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label required htmlFor="listing-price">Price per night</Label>
                    <div className="relative">
                        <span style={{color: T.muted}}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                              aria-hidden="true">$</span>
                        <Input
                            id="listing-price"
                            className="pl-8"
                            type="number"
                            min="1"
                            placeholder="120"
                            value={data.price || ''}
                            onChange={(e) => set('price', parseFloat(e.target.value) || '')}
                            aria-label="Price per night in USD"
                        />
                    </div>
                    {errors?.price && <FieldError>{errors.price}</FieldError>}
                </div>

                <div>
                    <Label required htmlFor="cancellation-policy">Cancellation policy</Label>
                    <div className="relative">
                        <Select
                            id="cancellation-policy"
                            value={data.cancellationPolicy}
                            onChange={(e) => set('cancellationPolicy', e.target.value)}
                        >
                            <option value="">Select a policy…</option>
                            {CANCELLATION_POLICIES.map((p) => (
                                <option key={p.value} value={p.value}>{p.label} — {p.desc}</option>
                            ))}
                        </Select>
                        <ChevronRight style={{color: T.muted}}
                                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 pointer-events-none"
                                      aria-hidden="true"/>
                    </div>
                    {errors?.cancellationPolicy && <FieldError>{errors.cancellationPolicy}</FieldError>}
                </div>
            </div>
        </div>
    </div>
);

export default Step1;
