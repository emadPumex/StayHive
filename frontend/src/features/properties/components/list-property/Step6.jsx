import {useRef, useState} from 'react';
import {Camera, Upload, X, ShieldCheck} from 'lucide-react';
import {T} from './constants';
import {readAsDataURL} from './utils';
import {Label, Input} from './FormControls';

const Step6 = ({data, set}) => {
    const avatarRef = useRef();
    const [dragOver, setDragOver] = useState(false);

    const pickAvatar = async (files) => {
        const f = files[0];
        if (!f || !f.type.startsWith('image/')) return;

        // 1. Save the raw file object for the FormData upload
        set('hostAvatarFile', f);

        // 2. Read the preview URL for UI display
        const preview = await readAsDataURL(f);
        set('hostAvatarPreview', preview);
    };

    const removeAvatar = () => {
        // Clear both file and preview fields when removing
        set('hostAvatarFile', null);
        set('hostAvatarPreview', '');
    };

    return (
        <div className="animate-fadeUp">
            <div className="mb-8">
                <h2 style={{color: T.text}} className="text-2xl font-bold tracking-tight">Your host profile</h2>
                <p style={{color: T.muted}} className="text-sm mt-1">Guests book with people they can see and trust.</p>
            </div>

            <div style={{background: T.bg700, border: `1px solid ${T.border}`}}
                 className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-5 rounded-2xl">
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload profile photo"
                    onKeyDown={(e) => e.key === 'Enter' && avatarRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        pickAvatar(e.dataTransfer.files);
                    }}
                    onClick={() => avatarRef.current?.click()}
                    style={{
                        borderColor: dragOver ? T.lime : T.border,
                        boxShadow: dragOver ? `0 0 0 3px ${T.limePale}` : 'none'
                    }}
                    className="relative w-24 h-24 rounded-full flex-shrink-0 cursor-pointer border-4
            overflow-hidden focus-visible:outline-none transition-all"
                >
                    {data.hostAvatarPreview ? (
                        <img src={data.hostAvatarPreview} alt="Your host profile"
                             className="w-full h-full object-cover"/>
                    ) : (
                        <div style={{background: T.bg600}}
                             className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <Camera className="w-7 h-7" style={{color: T.muted}} aria-hidden="true"/>
                            <span style={{color: T.muted}}
                                  className="text-[9px] font-semibold uppercase tracking-wide">Photo</span>
                        </div>
                    )}
                    <div
                        className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white opacity-0 hover:opacity-100 transition-opacity"
                                aria-hidden="true"/>
                    </div>
                    <input ref={avatarRef} type="file" accept="image/*" hidden aria-hidden="true"
                           onChange={(e) => pickAvatar(e.target.files)}/>
                </div>

                <div className="flex-1">
                    <p style={{color: T.text}} className="text-sm font-semibold">Profile photo</p>
                    <p style={{color: T.muted}} className="text-xs leading-relaxed mt-1 mb-3">
                        A clear face photo builds trust. Listings with host photos get significantly more bookings.
                    </p>
                    {data.hostAvatarPreview ? (
                        <button type="button" onClick={removeAvatar}
                                style={{color: T.danger}}
                                className="text-xs flex items-center gap-1 font-medium transition-colors hover:opacity-70">
                            <X className="w-3 h-3" aria-hidden="true"/> Remove photo
                        </button>
                    ) : (
                        <button type="button" onClick={() => avatarRef.current?.click()}
                                style={{color: T.lime}}
                                className="text-xs flex items-center gap-1 font-semibold transition-colors hover:opacity-70">
                            <Upload className="w-3 h-3" aria-hidden="true"/> Upload photo
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                    <Label required htmlFor="host-name">Your name (shown to guests)</Label>
                    <Input id="host-name" placeholder="e.g. Arjun M."
                           value={data.hostName || ''}
                           onChange={(e) => set('hostName', e.target.value)}/>
                </div>
            </div>

            <div style={{background: `${T.success}12`, border: `1px solid ${T.success}33`}}
                 className="p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: T.success}} aria-hidden="true"/>
                <div>
                    <p style={{color: T.text}} className="text-sm font-semibold">Almost there!</p>
                    <p style={{color: T.muted}} className="text-xs leading-relaxed mt-0.5">
                        Your listing will be reviewed within 24 hours. Once approved, it'll appear in search results.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step6;