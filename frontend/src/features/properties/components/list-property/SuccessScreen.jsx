import { Mail, ArrowRight } from 'lucide-react';
import { T } from '../constants.js';
import { useNavigate } from 'react-router-dom';

const SuccessScreen = () => {
    const navigate = useNavigate();

    return (
        <div style={{ background: T.bg900, minHeight: '100vh' }} className="flex items-center justify-center px-4">
            <div className="text-center max-w-sm flex flex-col items-center">

                {/* Animated Mail Icon Container */}
                <div className="relative inline-flex mb-6">
                    <span
                        style={{ background: T.lime }}
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        aria-hidden="true"
                    />
                    <div
                        style={{ background: T.limePale, border: `2px solid ${T.lime}` }}
                        className="w-20 h-20 rounded-full flex items-center justify-center relative"
                    >
                        {/* Swapped CheckCircle2 for Mail to reflect the required action */}
                        <Mail className="w-9 h-9" style={{ color: T.lime }} aria-hidden="true" />
                    </div>
                </div>

                {/* Updated Copy */}
                <h2 style={{ color: T.text }} className="text-3xl font-bold mb-3 tracking-tight">
                    Check your email!
                </h2>
                <p style={{ color: T.muted }} className="text-sm leading-relaxed mb-8">
                    We've sent a verification link to your email address. Please open the message and click
                    <strong style={{ color: T.text }}> "Confirm Listing"</strong> to launch your property on StayHive.
                </p>

                {/* Manual Navigation CTA */}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        border: `1px solid ${T.muted}30`,
                        color: T.text,
                        background: 'transparent'
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
                >
                    Return to Homepage
                    <ArrowRight className="w-4 h-4 opacity-70" />
                </button>

            </div>
        </div>
    );
};

export default SuccessScreen;