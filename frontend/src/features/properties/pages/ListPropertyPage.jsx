import {useState, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Compass, ArrowLeft, ChevronLeft, ChevronRight, Loader2, Star} from 'lucide-react';

import {T, STEPS} from '../components/constants.js';
import StepBar from '../components/list-property/StepBar';
import Step1 from '../components/list-property/Step1';
import Step2 from '../components/list-property/Step2';
import Step3 from '../components/list-property/Step3';
import Step4 from '../components/list-property/Step4';
import SuccessScreen from '../components/list-property/SuccessScreen';
import {createListing} from '../api/propertyApi';
/* ─────────────────────────────────────────
   Initial state
───────────────────────────────────────── */
const INITIAL = {
    hostName: '', hostAvatarPreview: '', hostAvatarFile: null,
    address: { country: '', state: '', city: '', latitude: '', longitude: '' },
    propertyAmenities: [],
    cancellationPolicy: { type: 'FLEXIBLE', name: 'Flexible Cancellation Policy', description: 'Standard flexible cancellation policy', windows: [] },
    roomCategories: [],
    propertyType: '',
    name: '',
    summary: '',
    propertyImages: [],
};

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
const ListPropertyPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState(INITIAL);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const set = useCallback((key, val) => {
        setData((d) => ({
            ...d,
            [key]: typeof val === 'function' ? val(d[key]) : val  // ← add this
        }));
        setErrors((e) => {
            const n = {...e};
            delete n[key];
            return n;
        });
    }, []);

    const validate = () => {
        const e = {};
        if (step === 1) {
            if (!data.propertyType) e.propertyType = 'Select a property type.';
            if (!data.name.trim()) e.name = 'Listing name is required.';
            if (!data.summary.trim()) e.summary = 'Description is required.';
            if (!data.address.country) e.country = 'Select a country.';
            if (!data.address.city) e.city = 'Enter a city.';
            if (!data.address.state) e.state = 'Enter a state.';
            if (!data.hostName.trim()) e.hostName = 'Host name is required.';
        }
        if (step === 2) {
            if (!data.cancellationPolicy.type) e.cancellationPolicy = 'Select a policy type.';
        }
        if (step === 4) {
            if (!data.roomCategories || data.roomCategories.length === 0) {
                e.roomCategories = 'At least one room category is required.';
            } else {
                data.roomCategories.forEach((room, index) => {
                    if (!room.basePrice || room.basePrice <= 0) e[`roomPrice_${index}`] = 'Valid price required.';
                });
            }
        }
        return e;
    };

    const canNext = () => {
        if (step === 1) return data.propertyType && data.name.trim() && data.summary.trim() && data.address.country && data.address.city && data.address.state && data.hostName.trim();
        if (step === 2) return !!data.cancellationPolicy.type;
        if (step === 3) return true;
        if (step === 4) return data.roomCategories?.length > 0;
        return true;
    };

    const next = () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }
        if (step < 4) {
            setStep((s) => s + 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const back = () => {
        if (step > 1) {
            setStep((s) => s - 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const submit = async () => {
        const e = validate();
        if (Object.keys(e).length || !canNext()) {
            setErrors(e);
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();

            // Build the structured JSON payload matching PropertyDataDTO
            const payload = {
                name: data.name,
                propertyType: data.propertyType,
                summary: data.summary,
                host: {
                    hostName: data.hostName,
                    profileImageUrl: data.hostAvatarUrl || null
                },
                address: data.address,
                propertyAmenities: data.propertyAmenities || [],
                cancellationPolicy: data.cancellationPolicy,
                roomCategories: (data.roomCategories || []).map(({ images, ...rest }) => ({
                    ...rest,
                    images: null
                })),
                propertyBlockRules: []
            };


            formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

            // Append profile binary image file
            if (data.hostAvatarFile) {
                formData.append('profileImageUrl', data.hostAvatarFile);
            }

            // Append listing binary image files
            if (data.propertyImages) {
                data.propertyImages.forEach((imgObj) => {
                    if (imgObj.file) {
                        formData.append('images', imgObj.file);
                    }
                });
            }

            if (data.roomCategories) {
                data.roomCategories.forEach((room, index) => {
                    if (room.images) {
                        room.images.forEach((imgObj) => {
                            if (imgObj.file) {
                                formData.append(`roomImages_${index}`, imgObj.file);
                            }
                        });
                    }
                });
            }

            await createListing(formData);

            setSubmitting(false);
            setSubmitted(true);

        } catch (error) {
            // Will catch clean 401, 400, or 500 responses without blowing up CORS rules
            const backendMessage = error.response?.data?.message || 'Server error or session expired. Please try again later.';
            setErrors((prev) => ({...prev, submit: backendMessage}));
            setSubmitting(false);
        }
    };

    if (submitted) return <SuccessScreen/>;

    const progress = ((step - 1) / (STEPS.length - 1)) * 100;

    return (
        <div style={{background: T.bg900, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif"}}
             className="flex flex-col">

            {/* Header */}
            <header style={{background: T.bg800, borderBottom: `1px solid ${T.border}`}} className="sticky top-0 z-40">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2" aria-label="StayHive — go to homepage">
                        <div style={{background: T.lime}}
                             className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <Compass className="w-4 h-4" style={{color: T.bg900}} aria-hidden="true"/>
                        </div>
                        <span style={{color: T.text}} className="text-base font-bold tracking-tight">
              Stay<span style={{color: T.lime}}>Hive</span>
            </span>
                    </Link>

                    <div className="hidden sm:flex items-center gap-3">
                        <div
                            className="w-36 h-1 rounded-full overflow-hidden"
                            style={{background: T.bg600}}
                            role="progressbar"
                            aria-valuenow={step}
                            aria-valuemin={1}
                            aria-valuemax={STEPS.length}
                            aria-label="Form progress"
                        >
                            <div
                                style={{width: `${progress}%`, background: T.lime}}
                                className="h-full rounded-full transition-all duration-500 ease-out"
                            />
                        </div>
                        <span style={{color: T.muted}} className="text-xs font-medium tabular-nums">
              {step} of {STEPS.length}
            </span>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        style={{color: T.muted}}
                        className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity
              focus-visible:outline-none rounded-lg px-2 py-1"
                        aria-label="Exit listing form"
                    >
                        <ArrowLeft className="w-4 h-4" aria-hidden="true"/> Exit
                    </button>
                </div>
            </header>

            {/* Mobile progress strip */}
            <div className="sm:hidden w-full h-0.5" style={{background: T.bg600}} aria-hidden="true">
                <div style={{width: `${progress}%`, background: T.lime}}
                     className="h-full transition-all duration-500 ease-out"/>
            </div>

            {/* Main */}
            <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 sm:py-12">
                <div className="w-full max-w-2xl">

                    {/* Form card */}
                    <div style={{background: T.bg800, border: `1px solid ${T.border}`}}
                         className="rounded-3xl p-6 sm:p-8 mb-6">
                        <StepBar current={step}/>

                        {step === 1 && <Step1 data={data} set={set} errors={errors}/>}
                        {step === 2 && <Step2 data={data} set={set} errors={errors}/>}
                        {step === 3 && <Step3 data={data} set={set}/>}
                        {step === 4 && <Step4 data={data} set={set} errors={errors}/>}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={back}
                            disabled={step === 1}
                            style={{borderColor: T.border, color: T.muted, background: T.bg800}}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold
                hover:opacity-80 transition-all focus-visible:outline-none focus-visible:ring-2
                disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" aria-hidden="true"/> Back
                        </button>

                        {/* Step dots */}
                        <div className="flex items-center gap-1.5" aria-hidden="true">
                            {STEPS.map((s) => (
                                <span
                                    key={s.id}
                                    style={{
                                        background: step === s.id ? T.lime : step > s.id ? `${T.lime}55` : T.bg600,
                                    }}
                                    className={`rounded-full transition-all duration-300 ${step === s.id ? 'w-5 h-2' : 'w-2 h-2'}`}
                                />
                            ))}
                        </div>

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={next}
                                disabled={!canNext()}
                                style={{background: canNext() ? T.lime : T.bg600, color: canNext() ? T.bg900 : T.muted}}
                                className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl
                  hover:opacity-90 active:scale-[0.98] transition-all
                  focus-visible:outline-none focus-visible:ring-2
                  disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Continue <ChevronRight className="w-4 h-4" aria-hidden="true"/>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={submit}
                                disabled={!canNext() || submitting}
                                style={{background: canNext() ? T.lime : T.bg600, color: canNext() ? T.bg900 : T.muted}}
                                className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl
                  hover:opacity-90 active:scale-[0.98] transition-all
                  focus-visible:outline-none focus-visible:ring-2
                  disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {submitting
                                    ? <><Loader2 className="w-4 h-4 animate-spin"
                                                 aria-hidden="true"/><span>Submitting…</span></>
                                    : <><Star className="w-4 h-4" aria-hidden="true"/><span>Submit listing</span></>}
                            </button>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.3s ease forwards; }
        option { background: ${T.bg700}; color: ${T.text}; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeUp { animation: none; }
          .animate-ping   { animation: none; }
          .animate-spin   { animation: none; }
        }
      `}</style>
        </div>
    );
};

export default ListPropertyPage;