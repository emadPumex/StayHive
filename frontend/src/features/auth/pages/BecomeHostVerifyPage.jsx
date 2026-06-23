import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
    Compass, ArrowLeft, Mail, ShieldCheck, Sparkles,
    ChevronRight, RefreshCw, CheckCircle2, Loader2,
} from 'lucide-react';
import apiClient from '../../../core/api/apiClient'; // Ensure this path matches your file structure

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Animated step indicator */
const StepIndicator = ({current}) => (
    <div className="flex items-center gap-0 mb-10">
        {['Email', 'Verify'].map((label, i) => {
            const step = i + 1;
            const done = current > step;
            const active = current === step;
            return (
                <React.Fragment key={label}>
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                                done
                                    ? 'bg-[#C8FB4C] text-[#0F1117]'
                                    : active
                                        ? 'bg-[#C8FB4C]/20 border-2 border-[#C8FB4C] text-[#C8FB4C]'
                                        : 'bg-[#1A1D26] border-2 border-[#2A2D38] text-[#8A8FA8]'
                            }`}
                        >
                            {done ? <CheckCircle2 className="w-4 h-4"/> : step}
                        </div>
                        <span
                            className={`text-[10px] font-semibold tracking-wider uppercase transition-colors duration-300 ${
                                active ? 'text-[#C8FB4C]' : done ? 'text-[#C8FB4C]/60' : 'text-[#8A8FA8]'
                            }`}
                        >
              {label}
            </span>
                    </div>

                    {i < 1 && (
                        <div
                            className={`flex-1 h-px mx-3 mb-5 transition-all duration-700 ${
                                done ? 'bg-[#C8FB4C]' : 'bg-[#2A2D38]'
                            }`}
                        />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

/** Individual OTP digit box */
const OtpBox = ({value, index, inputRef, onChange, onKeyDown, onPaste, focused}) => (
    <input
        ref={inputRef}
        id={`otp-box-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        aria-label={`OTP digit ${index + 1}`}
        className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 bg-[#1A1D26] text-[#FAFAF8] outline-none transition-all duration-200 select-none caret-transparent
      ${value
            ? 'border-[#C8FB4C] shadow-[0_0_12px_rgba(200,251,76,0.2)]'
            : focused
                ? 'border-[#C8FB4C]/60 shadow-[0_0_8px_rgba(200,251,76,0.1)]'
                : 'border-[#2A2D38] hover:border-[#3A3D48]'
        }
    `}
    />
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const BecomeHostVerifyPage = () => {
    const navigate = useNavigate();

    /* — state — */
    const [step, setStep] = useState(1);          // 1 = email, 2 = otp
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [focusedIndex, setFocusedIndex] = useState(null);

    const [emailLoading, setEmailLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [otpError, setOtpError] = useState('');

    const [resendTimer, setResendTimer] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    /* — refs — */
    const otpRefs = useRef([]);
    const timerRef = useRef(null);

    /* — countdown — */
    const startCountdown = useCallback(() => {
        setResendTimer(RESEND_SECONDS);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setResendTimer((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => () => clearInterval(timerRef.current), []);

    /* — email validation — */
    const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    /* — send OTP — */
    const handleSendOtp = async () => {
        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError('');
        setEmailLoading(true);

        try {
            // Connects cleanly to your Spring Boot REST route
            await apiClient.post('/auth/send-otp', {email: email.trim()});
            setStep(2);
            startCountdown();
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch (err) {
            const serverMessage = err.response?.data?.error || err.response?.data?.message;
            setEmailError(serverMessage || 'Failed to dispatch verification code. Please try again.');
        } finally {
            setEmailLoading(false);
        }
    };

    /* — resend OTP — */
    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResendLoading(true);
        setOtp(Array(OTP_LENGTH).fill(''));
        setOtpError('');

        try {
            await apiClient.post('/auth/send-otp', {email: email.trim()});
            startCountdown();
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch (err) {
            const serverMessage = err.response?.data?.error || err.response?.data?.message;
            setOtpError(serverMessage || 'Failed to resend code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    /* — OTP input logic — */
    const handleOtpChange = (e, idx) => {
        const val = e.target.value.replace(/\D/, '');
        if (!val) return;
        const next = [...otp];
        next[idx] = val.slice(-1); // Safety catch for single-digit populating
        setOtp(next);
        setOtpError('');
        if (idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus();
    };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
            const next = [...otp];
            if (next[idx]) {
                next[idx] = '';
                setOtp(next);
            } else if (idx > 0) {
                next[idx - 1] = '';
                setOtp(next);
                otpRefs.current[idx - 1]?.focus();
            }
            e.preventDefault();
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            otpRefs.current[idx - 1]?.focus();
        } else if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) {
            otpRefs.current[idx + 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!paste) return;
        const next = [...otp];
        paste.split('').forEach((ch, i) => {
            next[i] = ch;
        });
        setOtp(next);
        otpRefs.current[Math.min(paste.length, OTP_LENGTH - 1)]?.focus();
    };

    /* — auto-submit helper when 6 digits are fully populated — */
    useEffect(() => {
        const code = otp.join('');
        if (code.length === OTP_LENGTH && step === 2 && !otpLoading) {
            handleVerify();
        }
    }, [otp]);

    /* — verify OTP — */
    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < OTP_LENGTH) {
            setOtpError('Please enter all 6 digits.');
            return;
        }
        setOtpError('');
        setOtpLoading(true);

        try {
            // Spring Boot sets HttpOnly cookie via response header automatically
            await apiClient.post('/auth/verify-otp', {
                email: email.trim(),
                code
            });

            setOtpLoading(false);
            setVerified(true);

            // Delay navigation slightly so user gets a premium success feedback loop
            setTimeout(() => navigate('/list-property'), 1800);
        } catch (err) {
            const serverMessage = err.response?.data?.error || err.response?.data?.message;
            setOtpError(serverMessage || 'Incorrect code or token expired. Please try again.');
            setOtp(Array(OTP_LENGTH).fill(''));
            setTimeout(() => otpRefs.current[0]?.focus(), 50);
        } finally {
            setOtpLoading(false);
        }
    };

    /* ── Success overlay ── */
    if (verified) {
        return (
            <div className="min-h-screen bg-[#0F1117] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="relative inline-flex mb-6">
                        <span className="absolute inset-0 rounded-full bg-[#C8FB4C]/10 animate-ping"/>
                        <div
                            className="w-20 h-20 rounded-full bg-[#1A2A0A] border-2 border-[#C8FB4C] flex items-center justify-center relative">
                            <CheckCircle2 className="w-9 h-9 text-[#C8FB4C]"/>
                        </div>
                    </div>
                    <h2
                        className="text-3xl font-black text-[#FAFAF8] mb-2"
                        style={{fontFamily: "'Playfair Display', serif"}}
                    >
                        You're verified!
                    </h2>
                    <p className="text-[#8A8FA8] text-sm">Setting up your host profile…</p>
                </div>
            </div>
        );
    }

    /* ── Main Layout ── */
    return (
        <div className="min-h-screen bg-[#0F1117] flex flex-col">

            {/* Top bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#1A1D26]">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#C8FB4C] rounded-lg flex items-center justify-center">
                        <Compass className="w-4 h-4 text-[#0F1117]"/>
                    </div>
                    <span className="text-base font-bold text-[#FAFAF8] tracking-tight">
            Stay<span className="text-[#C8FB4C]">Hive</span>
          </span>
                </Link>

                <Link
                    to="/"
                    className="flex items-center gap-1.5 text-[13px] text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    Back to home
                </Link>
            </header>

            {/* Content */}
            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    {/* Card */}
                    <div
                        className="bg-[#0F1117] border border-[#1A1D26] rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.6)]">

                        {/* Icon + badge */}
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-11 h-11 rounded-xl bg-[#1A2A0A] border border-[#C8FB4C]/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-[#C8FB4C]"/>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#8A8FA8]">
                                    Host Programme
                                </p>
                                <p
                                    className="text-lg font-bold text-[#FAFAF8] leading-tight"
                                    style={{fontFamily: "'Playfair Display', serif"}}
                                >
                                    Become a Host
                                </p>
                            </div>
                        </div>

                        {/* Step indicator */}
                        <StepIndicator current={step}/>

                        {/* ── STEP 1 — Email ── */}
                        {step === 1 && (
                            <div
                                key="email-step"
                                style={{
                                    animation: 'fadeSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
                                }}
                            >
                                <h1
                                    className="text-2xl font-black text-[#FAFAF8] mb-1"
                                    style={{fontFamily: "'Playfair Display', serif"}}
                                >
                                    Enter your email
                                </h1>
                                <p className="text-[13px] text-[#8A8FA8] leading-relaxed mb-7">
                                    We'll send a one-time code to verify your identity before you start listing.
                                </p>

                                <div className="mb-5">
                                    <label
                                        htmlFor="host-email"
                                        className="block text-xs font-semibold text-[#8A8FA8] uppercase tracking-widest mb-2"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A3D48]"/>
                                        <input
                                            id="host-email"
                                            type="email"
                                            autoComplete="email"
                                            autoFocus
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setEmailError('');
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                                            placeholder="you@example.com"
                                            className={`w-full pl-10 pr-4 py-3 bg-[#1A1D26] text-[#FAFAF8] text-sm rounded-xl border outline-none transition-all duration-200 placeholder:text-[#3A3D48]
                        ${emailError
                                                ? 'border-red-500/70 focus:border-red-500'
                                                : 'border-[#2A2D38] focus:border-[#C8FB4C] focus:shadow-[0_0_0_3px_rgba(200,251,76,0.08)]'
                                            }
                      `}
                                        />
                                    </div>
                                    {emailError && (
                                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 rounded-full bg-red-400"/>
                                            {emailError}
                                        </p>
                                    )}
                                </div>

                                <button
                                    id="send-otp-btn"
                                    onClick={handleSendOtp}
                                    disabled={emailLoading}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#C8FB4C] text-[#0F1117] font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {emailLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin"/>
                                            Sending code…
                                        </>
                                    ) : (
                                        <>
                                            Send verification code
                                            <ChevronRight className="w-4 h-4"/>
                                        </>
                                    )}
                                </button>

                                <p className="mt-5 text-center text-[11px] text-[#3A3D48]">
                                    Already a host?{' '}
                                    <Link
                                        to="/my-properties"
                                        className="text-[#C8FB4C] hover:underline font-medium"
                                    >
                                        Manage your properties
                                    </Link>
                                </p>
                            </div>
                        )}

                        {/* ── STEP 2 — OTP ── */}
                        {step === 2 && (
                            <div
                                key="otp-step"
                                style={{
                                    animation: 'fadeSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
                                }}
                            >
                                <h1
                                    className="text-2xl font-black text-[#FAFAF8] mb-1"
                                    style={{fontFamily: "'Playfair Display', serif"}}
                                >
                                    Check your inbox
                                </h1>
                                <p className="text-[13px] text-[#8A8FA8] leading-relaxed mb-2">
                                    We sent a 6-digit code to
                                </p>
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1A1D26] border border-[#2A2D38] rounded-lg mb-7">
                                    <Mail className="w-3.5 h-3.5 text-[#C8FB4C]"/>
                                    <span className="text-sm font-semibold text-[#FAFAF8]">{email}</span>
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setOtp(Array(OTP_LENGTH).fill(''));
                                            setOtpError('');
                                        }}
                                        className="text-[10px] text-[#8A8FA8] hover:text-[#C8FB4C] ml-1 transition-colors"
                                        aria-label="Change email"
                                    >
                                        change
                                    </button>
                                </div>

                                {/* OTP boxes */}
                                <div className="flex gap-2 mb-2 justify-between">
                                    {otp.map((digit, i) => (
                                        <OtpBox
                                            key={i}
                                            index={i}
                                            value={digit}
                                            focused={focusedIndex === i}
                                            inputRef={(el) => (otpRefs.current[i] = el)}
                                            onChange={(e) => handleOtpChange(e, i)}
                                            onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                            onPaste={handleOtpPaste}
                                            onFocus={() => setFocusedIndex(i)}
                                            onBlur={() => setFocusedIndex(null)}
                                        />
                                    ))}
                                </div>

                                {/* OTP progress bar */}
                                <div className="flex gap-1 mb-5 mt-3">
                                    {otp.map((d, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                                                d ? 'bg-[#C8FB4C]' : 'bg-[#2A2D38]'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {otpError && (
                                    <div
                                        className="flex items-center gap-2 px-3 py-2 bg-red-950/30 border border-red-500/20 rounded-lg mb-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"/>
                                        <p className="text-xs text-red-400">{otpError}</p>
                                    </div>
                                )}

                                <button
                                    id="verify-otp-btn"
                                    onClick={handleVerify}
                                    disabled={otpLoading || otp.join('').length < OTP_LENGTH}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#C8FB4C] text-[#0F1117] font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                                >
                                    {otpLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin"/>
                                            Verifying…
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-4 h-4"/>
                                            Verify & Continue
                                        </>
                                    )}
                                </button>

                                {/* Resend */}
                                <div className="text-center">
                                    {resendTimer > 0 ? (
                                        <p className="text-xs text-[#8A8FA8]">
                                            Resend code in{' '}
                                            <span className="text-[#C8FB4C] font-semibold tabular-nums">
                        0:{resendTimer.toString().padStart(2, '0')}
                      </span>
                                        </p>
                                    ) : (
                                        <button
                                            id="resend-otp-btn"
                                            onClick={handleResend}
                                            disabled={resendLoading}
                                            className="inline-flex items-center gap-1.5 text-xs text-[#8A8FA8] hover:text-[#C8FB4C] transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw
                                                className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`}/>
                                            {resendLoading ? 'Sending…' : "Didn't receive it? Resend"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-6 mt-8">
                        {[
                            {icon: ShieldCheck, text: 'SSL Secured'},
                            {icon: Mail, text: 'No spam, ever'},
                        ].map(({icon: Icon, text}) => (
                            <div key={text} className="flex items-center gap-1.5 text-[11px] text-[#3A3D48]">
                                <Icon className="w-3.5 h-3.5"/>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Keyframe styles */}
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default BecomeHostVerifyPage;