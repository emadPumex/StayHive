import React from 'react';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Home, Car, Utensils, Sparkles, Building2, ShieldAlert,
    ArrowRight, ShieldCheck, UserCheck, CalendarCheck2, MapPin,
} from 'lucide-react';

/* ─── Uses Outfit (already in index.html) for display headings ─── */

const ecosystemServices = [
    {
        title: 'Property Booking',
        description: 'Verified apartments, cabins, villas — with superhost standards and secure checkout.',
        icon: Home,
        status: 'active',
        ctaText: 'Explore properties',
        link: '/properties',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-700',
    },
    {
        title: 'Taxi & Rides',
        description: 'Hail local professional drivers on demand. Real-time tracking, flat rates.',
        icon: Car,
        status: 'upcoming',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-700',
    },
    {
        title: 'Private Chefs',
        description: 'Book vetted culinary professionals for gourmet in-home dining experiences.',
        icon: Utensils,
        status: 'upcoming',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-700',
    },
    {
        title: 'Local Experiences',
        description: 'Guided hikes, history walks, private workshops curated by native experts.',
        icon: Sparkles,
        status: 'upcoming',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-700',
    },
    {
        title: 'City Services',
        description: 'Transit passes, municipal guides, and local safety regulations at your fingertips.',
        icon: Building2,
        status: 'upcoming',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-700',
    },
    {
        title: 'Emergency SOS',
        description: '24/7 English-speaking emergency dispatch, embassy contacts, and medical services.',
        icon: ShieldAlert,
        status: 'sos',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
    },
];

const features = [
    {
        num: '01',
        icon: ShieldCheck,
        title: 'Verified properties',
        desc: 'Every listing undergoes photo and description validation. What you see is what you get.',
    },
    {
        num: '02',
        icon: UserCheck,
        title: 'Trusted hosts',
        desc: 'Professional owners with high superhost response rates and stellar guest ratings.',
    },
    {
        num: '03',
        icon: CalendarCheck2,
        title: 'Easy booking',
        desc: 'Instant booking, flexible cancellation, and same-day schedule changes — no friction.',
    },
];

const HomePage = () => {
    // FIXED: Hook invocation safely placed within block braces
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const status = searchParams.get('status');
        const error = searchParams.get('error');

        if (status === 'confirmed') {
            alert('🎉 Success! Your property listing has been confirmed.');
            // FIXED: Clean up the URL state using React Router instead of direct window manipulation
            setSearchParams({});
        } else if (status === 'cancelled') {
            alert('❌ Your property listing has been cancelled.');
            setSearchParams({});
        } else if (error === 'invalid_token') {
            alert('❌ Invalid token');
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">

            {/* ── HERO ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px] bg-[#0F1117] rounded-2xl overflow-hidden">

                    {/* Left */}
                    <div className="flex flex-col justify-center px-10 py-14">
                        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8A8FA8] mb-6">
                            Travel &amp; City Experience Ecosystem
                        </p>
                        <h1
                            className="text-5xl font-black leading-[1.1] text-[#FAFAF8] mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Find where you{' '}
                            <em className="not-italic text-[#C8FB4C]">belong</em>
                            {' '}— and everything beyond it.
                        </h1>
                        <p className="text-[15px] text-[#8A8FA8] leading-relaxed max-w-sm mb-8">
                            StayHive connects you to verified stays, private chefs, rides, and
                            city essentials — all from one platform.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/properties"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8FB4C] text-[#0F1117] text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Explore properties <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="#ecosystem"
                                className="inline-flex items-center px-6 py-3 text-sm font-medium text-[#8A8FA8] border border-[#2A2D38] rounded-lg hover:border-[#8A8FA8] hover:text-[#FAFAF8] transition-colors"
                            >
                                See ecosystem
                            </a>
                        </div>
                    </div>

                    {/* Right — floating property card */}
                    <div className="hidden lg:flex items-center justify-center bg-[#151720] px-8">
                        <div
                            className="w-[260px] bg-[#1A1D26] border border-[#2A2D38] rounded-2xl overflow-hidden"
                            style={{ transform: 'rotate(-2deg)' }}
                        >
                            {/* Placeholder image area */}
                            <div className="w-full h-36 bg-[#2A2D38] flex items-center justify-center">
                                <Home className="w-10 h-10 text-[#3A3D48]" />
                            </div>
                            <div className="p-4">
                                <p className="flex items-center gap-1 text-[11px] text-[#8A8FA8] mb-1">
                                    <MapPin className="w-3 h-3" /> Santorini, Greece
                                </p>
                                <p
                                    className="text-[#FAFAF8] font-bold text-base mb-3 leading-snug"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Cliffside Villa with Caldera View
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-[#8A8FA8] text-xs">
                                        <span className="text-[#C8FB4C] text-lg font-semibold">$340</span> /night
                                    </p>
                                    <span
                                        className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#1F3B0C] text-[#C8FB4C]">
                                        Superhost
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div
                    className="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-xl overflow-hidden bg-white">
                    {[
                        { num: '10k+', label: 'Properties' },
                        { num: '500+', label: 'Cities' },
                        { num: '1M+', label: 'Guests served' },
                    ].map(({ num, label }) => (
                        <div key={label} className="py-6 text-center">
                            <p
                                className="text-4xl font-black text-gray-900 leading-none"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {num}
                            </p>
                            <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mt-1">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ECOSYSTEM ── */}
            <section id="ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-1">Services</p>
                <h2
                    className="text-3xl font-bold text-gray-900 mb-8"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    One Hive, every experience.
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ecosystemServices.map((svc) => {
                        const Icon = svc.icon;
                        const isActive = svc.status === 'active';
                        const isSos = svc.status === 'sos';

                        return (
                            <div
                                key={svc.title}
                                className={`flex flex-col gap-3 bg-white rounded-xl p-5 border transition-colors ${
                                    isActive ? 'border-green-400' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {/* Top row */}
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${svc.iconBg} ${svc.iconColor}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {isActive && (
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                                            Live
                                        </span>
                                    )}
                                    {isSos && (
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                                            SOS Preview
                                        </span>
                                    )}
                                    {svc.status === 'upcoming' && (
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                            Upcoming
                                        </span>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900 mb-1">{svc.title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{svc.description}</p>
                                </div>

                                {/* CTA */}
                                {isActive ? (
                                    <Link
                                        to={svc.link}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
                                    >
                                        {svc.ctaText} <ArrowRight className="w-3 h-3" />
                                    </Link>
                                ) : (
                                    <span className="text-xs text-gray-400">Coming soon</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-1">Why StayHive</p>
                <h2
                    className="text-3xl font-bold text-gray-900 mb-8"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Stays you can trust.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map(({ num, icon: Icon, title, desc }) => (
                        <div key={num} className="bg-white border border-gray-200 rounded-xl p-6">
                            <p
                                className="text-5xl font-black text-gray-100 leading-none mb-4 select-none"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {num}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 mb-2">{title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default HomePage;