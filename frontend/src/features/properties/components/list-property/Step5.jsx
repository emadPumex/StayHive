import {useRef, useState, useCallback} from 'react';
import {Upload, Image as ImageIcon, X, AlertCircle, CheckCircle2} from 'lucide-react';
import {T} from './constants';
import {readAsDataURL} from './utils';

const Step5 = ({data, set}) => {
    const fileRef = useRef();
    const [dragOver, setDragOver] = useState(false);

    const addFiles = useCallback(async (files) => {
        const imgs = data.propertyImages || [];
        const remaining = 6 - imgs.length;
        if (remaining <= 0) return;
        const toProcess = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, remaining);
        const previews = await Promise.all(
            toProcess.map(async (f) => ({file: f, preview: await readAsDataURL(f), name: f.name}))
        );
        set('propertyImages', [...imgs, ...previews]);
    }, [data.propertyImages, set]);

    const remove = (idx) => {
        const imgs = [...(data.propertyImages || [])];
        imgs.splice(idx, 1);
        set('propertyImages', imgs);
    };

    const count = (data.propertyImages || []).length;
    const canAdd = count < 6;

    return (
        <div className="animate-fadeUp">
            <div className="mb-8">
                <h2 style={{color: T.text}} className="text-2xl font-bold tracking-tight">Show off your space</h2>
                <p style={{color: T.muted}} className="text-sm mt-1">
                    Upload <strong style={{color: T.text}}>3–6 photos</strong>. First photo becomes the cover.
                </p>
            </div>

            {canAdd && (
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload photos — drag and drop or click to browse"
                    onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        addFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileRef.current?.click()}
                    style={{
                        borderColor: dragOver ? T.lime : T.border,
                        background: dragOver ? T.limePale : T.bg700,
                    }}
                    className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer mb-6
            transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
                >
                    <div style={{background: dragOver ? T.limePale : T.bg600, border: `1px solid ${T.border}`}}
                         className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors">
                        <Upload className="w-6 h-6" style={{color: dragOver ? T.lime : T.muted}} aria-hidden="true"/>
                    </div>
                    <div className="text-center">
                        <p style={{color: T.text}} className="text-sm font-semibold">
                            {dragOver ? 'Drop to upload' : 'Drag & drop or click to browse'}
                        </p>
                        <p style={{color: T.muted}} className="text-xs mt-0.5">{count}/6 photos
                            — {6 - count} slot{6 - count !== 1 ? 's' : ''} remaining · JPG, PNG, WebP · max 10 MB</p>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" multiple hidden aria-hidden="true"
                           onChange={(e) => addFiles(e.target.files)}/>
                </div>
            )}

            {count > 0 && (
                <div className="grid grid-cols-3 gap-3" role="list" aria-label="Uploaded photos">
                    {(data.propertyImages || []).map((img, i) => (
                        <div key={i} role="listitem"
                             className={`relative group rounded-2xl overflow-hidden ${i === 0 ? 'col-span-3 sm:col-span-2 row-span-2' : ''}`}
                             style={{aspectRatio: i === 0 ? '16/9' : '4/3', background: T.bg600}}
                        >
                            <img src={img.preview} alt={`Uploaded photo ${i + 1}${i === 0 ? ' (cover)' : ''}`}
                                 className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200
                flex items-center justify-center">
                                <button type="button" onClick={() => remove(i)} aria-label={`Remove photo ${i + 1}`}
                                        style={{background: T.bg800}}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full
                    shadow-md flex items-center justify-center">
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
                    {canAdd && Array.from({length: 6 - count}, (_, i) => (
                        <div key={`empty-${i}`}
                             onClick={() => fileRef.current?.click()}
                             role="button" tabIndex={0} aria-label="Add another photo"
                             onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                             style={{borderColor: T.border, background: T.bg700}}
                             className="aspect-[4/3] rounded-2xl border-2 border-dashed
                flex items-center justify-center cursor-pointer hover:border-lime-400
                transition-colors focus-visible:outline-none"
                        >
                            <ImageIcon className="w-5 h-5" style={{color: T.border}} aria-hidden="true"/>
                        </div>
                    ))}
                </div>
            )}

            <div role="status" aria-live="polite" className="mt-4">
                {count > 0 && count < 3 && (
                    <p style={{color: T.amber, background: `${T.amber}14`, border: `1px solid ${T.amber}33`}}
                       className="text-xs font-medium flex items-center gap-1.5 rounded-xl px-3 py-2">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true"/>
                        Add {3 - count} more photo{3 - count > 1 ? 's' : ''} to continue.
                    </p>
                )}
                {count >= 3 && (
                    <p style={{color: T.success}} className="text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true"/>
                        {count} photo{count > 1 ? 's' : ''} added — looking great!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Step5;
