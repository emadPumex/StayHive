import React from 'react';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Home, Car, Utensils, Sparkles, Building2, ShieldAlert,
    ArrowRight, ShieldCheck, UserCheck, CalendarCheck2, MapPin, Star,
} from 'lucide-react';

const ecosystemServices = [
    {
        title: 'Property Booking',
        description: 'Verified apartments, cabins, villas — with superhost standards and secure checkout.',
        icon: Home,
        status: 'active',
        ctaText: 'Explore properties',
        link: '/properties',
        iconBg: 'rgba(200,251,76,0.12)',
        iconColor: '#C8FB4C',
    },
    {
        title: 'Taxi & Rides',
        description: 'Hail local professional drivers on demand. Real-time tracking, flat rates.',
        icon: Car,
        status: 'upcoming',
        iconBg: 'rgba(129,140,248,0.12)',
        iconColor: '#818CF8',
    },
    {
        title: 'Private Chefs',
        description: 'Book vetted culinary professionals for gourmet in-home dining experiences.',
        icon: Utensils,
        status: 'upcoming',
        iconBg: 'rgba(251,191,36,0.12)',
        iconColor: '#FBBF24',
    },
    {
        title: 'Local Experiences',
        description: 'Guided hikes, history walks, private workshops curated by native experts.',
        icon: Sparkles,
        status: 'upcoming',
        iconBg: 'rgba(167,139,250,0.12)',
        iconColor: '#A78BFA',
    },
    {
        title: 'City Services',
        description: 'Transit passes, municipal guides, and local safety regulations at your fingertips.',
        icon: Building2,
        status: 'upcoming',
        iconBg: 'rgba(52,211,153,0.12)',
        iconColor: '#34D399',
    },
    {
        title: 'Emergency SOS',
        description: '24/7 English-speaking emergency dispatch, embassy contacts, and medical services.',
        icon: ShieldAlert,
        status: 'sos',
        iconBg: 'rgba(248,113,113,0.12)',
        iconColor: '#F87171',
    },
];

const features = [
    {
        num: '01',
        icon: ShieldCheck,
        title: 'Verified properties',
        desc: 'Every listing undergoes photo and description validation. What you see is what you get.',
        color: '#C8FB4C',
    },
    {
        num: '02',
        icon: UserCheck,
        title: 'Trusted hosts',
        desc: 'Professional owners with high superhost response rates and stellar guest ratings.',
        color: '#818CF8',
    },
    {
        num: '03',
        icon: CalendarCheck2,
        title: 'Easy booking',
        desc: 'Instant booking, flexible cancellation, and same-day schedule changes — no friction.',
        color: '#34D399',
    },
];

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const status = searchParams.get('status');
        const error = searchParams.get('error');
        if (status === 'confirmed') {
            alert('🎉 Success! Your property listing has been confirmed.');
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
        <div style={{ background: '#0A0C12', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

            {/* ── AMBIENT BACKGROUND ORBS ── */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                <div className="orb-1" style={{
                    position: 'absolute', top: '-10%', left: '-5%',
                    width: '520px', height: '520px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(200,251,76,0.09) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />
                <div className="orb-2" style={{
                    position: 'absolute', top: '30%', right: '-8%',
                    width: '600px', height: '600px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-5%', left: '30%',
                    width: '480px', height: '480px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }} />
                {/* Subtle grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* ── HERO ── */}
                <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 24px' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr',
                        minHeight: '460px', borderRadius: '24px', overflow: 'hidden',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }} className="animate-fade-up">

                        {/* Left */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 48px' }}>
                            <p className="animate-fade-up anim-delay-100" style={{
                                fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em',
                                textTransform: 'uppercase', color: '#3A3D58', marginBottom: '24px',
                            }}>
                                Travel & City Experience Ecosystem
                            </p>
                            <h1
                                className="animate-fade-up anim-delay-200"
                                style={{
                                    fontSize: '3rem', fontWeight: 900, lineHeight: 1.08,
                                    color: '#FAFAF8', marginBottom: '16px',
                                    fontFamily: "'Playfair Display', serif",
                                }}
                            >
                                Find where you{' '}
                                <em className="shimmer-text not-italic">belong</em>
                                {' '}— and everything beyond it.
                            </h1>
                            <p className="animate-fade-up anim-delay-300" style={{
                                fontSize: '15px', color: '#6B7280', lineHeight: 1.7,
                                maxWidth: '340px', marginBottom: '36px',
                            }}>
                                StayHive connects you to verified stays, private chefs, rides, and
                                city essentials — all from one platform.
                            </p>
                            <div className="animate-fade-up anim-delay-400" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <Link
                                    to="/properties"
                                    className="animate-pulse-glow"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '12px 24px',
                                        background: '#C8FB4C', color: '#0A0C12',
                                        fontSize: '14px', fontWeight: 700,
                                        borderRadius: '12px', textDecoration: 'none',
                                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    Explore properties <ArrowRight size={16} />
                                </Link>
                                <a
                                    href="#ecosystem"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center',
                                        padding: '12px 24px',
                                        fontSize: '14px', fontWeight: 500, color: '#6B7280',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px', textDecoration: 'none',
                                        background: 'rgba(255,255,255,0.03)',
                                        backdropFilter: 'blur(8px)',
                                        transition: 'all 0.25s ease',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#FAFAF8'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#6B7280'; }}
                                >
                                    See ecosystem
                                </a>
                            </div>
                        </div>

                        {/* Right — floating glass property card */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.02)', padding: '32px',
                        }}>
                            <div className="animate-float-card" style={{ width: '260px' }}>
                                {/* Card */}
                                <div style={{
                                    background: 'rgba(255,255,255,0.07)',
                                    backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
                                    border: '1px solid rgba(255,255,255,0.13)',
                                    borderRadius: '20px', overflow: 'hidden',
                                    boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                                }}>
                                    {/* Image placeholder with shimmer */}
                                    <div style={{
                                        width: '100%', height: '148px',
                                        background: 'linear-gradient(135deg, rgba(200,251,76,0.08) 0%, rgba(129,140,248,0.08) 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative', overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
                                            backgroundSize: '200% 100%',
                                            animation: 'shimmerSweep 2.5s linear infinite',
                                        }} />
                                        <Home size={36} style={{ color: 'rgba(200,251,76,0.4)', position: 'relative', zIndex: 1 }} />
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6B7280', marginBottom: '6px' }}>
                                            <MapPin size={12} style={{ color: '#C8FB4C' }} /> Santorini, Greece
                                        </p>
                                        <p style={{
                                            color: '#FAFAF8', fontWeight: 700, fontSize: '14px',
                                            marginBottom: '12px', lineHeight: 1.3,
                                            fontFamily: "'Playfair Display', serif",
                                        }}>
                                            Cliffside Villa with Caldera View
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <p style={{ color: '#6B7280', fontSize: '12px' }}>
                                                <span style={{ color: '#C8FB4C', fontSize: '20px', fontWeight: 700 }}>$340</span> /night
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Star size={11} style={{ color: '#FBBF24', fill: '#FBBF24' }} />
                                                <span style={{ fontSize: '11px', color: '#FAFAF8', fontWeight: 600 }}>4.98</span>
                                            </div>
                                        </div>
                                        <div style={{
                                            marginTop: '10px', padding: '4px 10px',
                                            background: 'rgba(200,251,76,0.1)',
                                            border: '1px solid rgba(200,251,76,0.2)',
                                            borderRadius: '999px', display: 'inline-block',
                                            fontSize: '10px', fontWeight: 700, color: '#C8FB4C',
                                        }}>
                                            ✦ Superhost
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── STATS BAR ── */}
                <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                        borderRadius: '20px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                        {[
                            { num: '10k+', label: 'Properties', color: '#C8FB4C' },
                            { num: '500+', label: 'Cities', color: '#818CF8' },
                            { num: '1M+', label: 'Guests served', color: '#34D399' },
                        ].map(({ num, label, color }, i) => (
                            <div
                                key={label}
                                className={`glass-stat animate-fade-up anim-delay-${(i + 2) * 100}`}
                                style={{
                                    padding: '32px 16px', textAlign: 'center',
                                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                }}
                            >
                                <p style={{
                                    fontSize: '2.8rem', fontWeight: 900, lineHeight: 1,
                                    color, fontFamily: "'Playfair Display', serif",
                                    marginBottom: '6px',
                                }}>
                                    {num}
                                </p>
                                <p style={{
                                    fontSize: '11px', fontWeight: 700,
                                    letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3A3D58',
                                }}>
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── ECOSYSTEM ── */}
                <section id="ecosystem" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 64px' }}>
                    <p className="animate-fade-up" style={{
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: '#3A3D58', marginBottom: '6px',
                    }}>Services</p>
                    <h2
                        className="animate-fade-up anim-delay-100"
                        style={{
                            fontSize: '2rem', fontWeight: 700, color: '#FAFAF8',
                            marginBottom: '36px', fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        One Hive,{' '}
                        <span style={{ color: '#C8FB4C' }}>every experience.</span>
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {ecosystemServices.map((svc, i) => {
                            const Icon = svc.icon;
                            const isActive = svc.status === 'active';
                            const isSos = svc.status === 'sos';
                            const delays = ['100','150','200','250','300','350'];

                            return (
                                <div
                                    key={svc.title}
                                    className={`${isActive ? 'glass-card-active' : 'glass-card'} animate-fade-up anim-delay-${delays[i]}`}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '18px', padding: '22px' }}
                                >
                                    {/* Top row */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: svc.iconBg,
                                            border: `1px solid ${svc.iconColor}22`,
                                            boxShadow: `0 0 16px ${svc.iconColor}18`,
                                        }}>
                                            <Icon size={20} style={{ color: svc.iconColor }} />
                                        </div>
                                        {isActive && (
                                            <span style={{
                                                fontSize: '10px', fontWeight: 700, padding: '3px 10px',
                                                borderRadius: '999px',
                                                background: 'rgba(200,251,76,0.1)',
                                                border: '1px solid rgba(200,251,76,0.3)',
                                                color: '#C8FB4C',
                                            }}>
                                                ● Live
                                            </span>
                                        )}
                                        {isSos && (
                                            <span style={{
                                                fontSize: '10px', fontWeight: 700, padding: '3px 10px',
                                                borderRadius: '999px',
                                                background: 'rgba(248,113,113,0.1)',
                                                border: '1px solid rgba(248,113,113,0.3)',
                                                color: '#F87171',
                                            }}>
                                                SOS Preview
                                            </span>
                                        )}
                                        {svc.status === 'upcoming' && (
                                            <span style={{
                                                fontSize: '10px', fontWeight: 700, padding: '3px 10px',
                                                borderRadius: '999px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                color: '#3A3D58',
                                            }}>
                                                Upcoming
                                            </span>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#FAFAF8', marginBottom: '6px' }}>
                                            {svc.title}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.65 }}>
                                            {svc.description}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    {isActive ? (
                                        <Link
                                            to={svc.link}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                fontSize: '12px', fontWeight: 700, color: '#C8FB4C',
                                                textDecoration: 'none',
                                                transition: 'gap 0.2s ease, opacity 0.2s ease',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.gap = '10px'; e.currentTarget.style.opacity = '0.8'; }}
                                            onMouseLeave={e => { e.currentTarget.style.gap = '5px'; e.currentTarget.style.opacity = '1'; }}
                                        >
                                            {svc.ctaText} <ArrowRight size={13} />
                                        </Link>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#2A2D38' }}>Coming soon</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ── WHY STAYHIVE ── */}
                <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
                    <p className="animate-fade-up" style={{
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: '#3A3D58', marginBottom: '6px',
                    }}>Why StayHive</p>
                    <h2
                        className="animate-fade-up anim-delay-100"
                        style={{
                            fontSize: '2rem', fontWeight: 700, color: '#FAFAF8',
                            marginBottom: '36px', fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        Stays you can <span style={{ color: '#C8FB4C' }}>trust.</span>
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {features.map(({ num, icon: Icon, title, desc, color }, i) => {
                            const delays = ['200', '350', '500'];
                            return (
                                <div
                                    key={num}
                                    className={`glass-feature animate-fade-up anim-delay-${delays[i]}`}
                                    style={{ borderRadius: '18px', padding: '28px' }}
                                >
                                    {/* Big number watermark */}
                                    <p style={{
                                        fontSize: '4rem', fontWeight: 900, lineHeight: 1,
                                        marginBottom: '20px', userSelect: 'none',
                                        fontFamily: "'Playfair Display', serif",
                                        background: `linear-gradient(135deg, ${color}22 0%, transparent 100%)`,
                                        WebkitBackgroundClip: 'text', backgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        filter: 'brightness(1.5)',
                                    }}>
                                        {num}
                                    </p>
                                    {/* Icon */}
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: `${color}14`,
                                        border: `1px solid ${color}25`,
                                        marginBottom: '14px',
                                        boxShadow: `0 0 18px ${color}18`,
                                    }}>
                                        <Icon size={20} style={{ color }} />
                                    </div>
                                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#FAFAF8', marginBottom: '8px' }}>{title}</p>
                                    <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.65 }}>{desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default HomePage;