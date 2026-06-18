import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, ShieldCheck, CalendarCheck2, UserCheck, ArrowRight,
  Lock, Shield, Key, Sparkles, Sun, Moon, ArrowLeft, Loader2,
  CheckCircle2, Globe, Heart, Star
} from 'lucide-react';
import { toast } from 'sonner';
import authBg from '../../../assets/luxury_stay_auth_bg.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [glassTheme, setGlassTheme] = useState('dark'); // 'dark' (Obsidian) or 'light' (Alabaster)
  const [animateIn, setAnimateIn] = useState(false);
  const BACKEND_URL = 'http://localhost:8081';


  useEffect(() => {
    // Trigger entrance animations after mount
    const timer = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSocialLogin = (provider) => {
    if (loadingProvider) return;

    if (provider === 'Google') {
      setLoadingProvider('Google');
      toast.loading('Redirecting to Google...', { id: 'auth-toast' });
      window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
      return;
    }

    toast.info(`${provider} login coming soon`, { duration: 3000 });
  };

  const toggleTheme = () => {
    setGlassTheme(prev => prev === 'dark' ? 'light' : 'dark');
    toast.info(`Switched to ${glassTheme === 'dark' ? 'Light Alabaster' : 'Dark Obsidian'} Glass Theme`, {
      duration: 2000
    });
  };

  const handleLinkClick = (name) => {
    toast.info(`${name} Page coming soon`, {
      description: 'This is a demo authentication screen.',
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen flex text-sans antialiased overflow-hidden select-none bg-[#0B0C10]">
      
      {/* ─── LEFT PANEL: LUXURY BRANDING & STYLED STAYS (DESKTOP ONLY) ─── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12">
        {/* Background Image with Ken Burns / zoom effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105"
          style={{ 
            backgroundImage: `url(${authBg})`,
          }}
        />
        
        {/* Sleek Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050608]/90 via-[#0B0C10]/45 to-transparent z-10" />
        
        {/* Top Header - Back Button */}
        <div className="relative z-20 flex items-center">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-[#C8FB4C] transition-colors duration-300 py-2"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-300" />
            Back to Explore
          </Link>
        </div>

        {/* Floating Mini Villa Card to showcase design sophistication */}
        <div 
          className={`relative z-20 self-end mr-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl max-w-xs shadow-2xl transition-all duration-1000 delay-500 transform ${
            animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8FB4C] bg-[#C8FB4C]/10 px-2 py-0.5 rounded-md">
              Featured Stay
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.98</span>
            </div>
          </div>
          <h4 className="text-white font-bold text-sm mb-1 font-serif">Villa Celestia, Amalfi Coast</h4>
          <p className="text-white/60 text-xs flex items-center gap-1 mb-2">
            <Globe className="w-3 h-3 text-[#C8FB4C]" /> Positano, Italy
          </p>
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <p className="text-xs text-white/50">From <span className="text-white font-bold text-sm">$480</span>/night</p>
            <span className="text-[10px] text-white/85 bg-white/10 px-2 py-1 rounded-full border border-white/15">Verified Stay</span>
          </div>
        </div>

        {/* Bottom Hero Text */}
        <div className="relative z-20 max-w-lg">
          <div 
            className={`transition-all duration-700 delay-100 transform ${
              animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-[#C8FB4C] mb-6">
              <Sparkles className="w-3 h-3" />
              Curated Luxury Travel Ecosystem
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] mb-4 font-serif">
              Find Your Perfect Stay
            </h1>
            
            <p className="text-white/75 text-base leading-relaxed mb-8 font-light">
              Book unique homes, luxury apartments, private chefs, and travel experiences curated around the world.
            </p>
          </div>

          {/* Luxury Feature List */}
          <div 
            className={`grid grid-cols-3 gap-6 pt-6 border-t border-white/10 transition-all duration-700 delay-200 transform ${
              animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <div className="w-5 h-5 rounded-full bg-[#C8FB4C]/20 flex items-center justify-center border border-[#C8FB4C]/30">
                  <ShieldCheck className="w-3 h-3 text-[#C8FB4C]" />
                </div>
                <span>Verified</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-light">100% inspected properties.</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <div className="w-5 h-5 rounded-full bg-[#C8FB4C]/20 flex items-center justify-center border border-[#C8FB4C]/30">
                  <CalendarCheck2 className="w-3 h-3 text-[#C8FB4C]" />
                </div>
                <span>Instant</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-light">Book on the spot instantly.</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <div className="w-5 h-5 rounded-full bg-[#C8FB4C]/20 flex items-center justify-center border border-[#C8FB4C]/30">
                  <UserCheck className="w-3 h-3 text-[#C8FB4C]" />
                </div>
                <span>Secure</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-light">Insured &amp; safe checkouts.</p>
            </div>
          </div>
        </div>
      </div>


      {/* ─── RIGHT PANEL: GLASSMORPHISM AUTH CARD ─── */}
      <div className="w-full lg:w-[45%] relative flex items-center justify-center p-6 md:p-12 min-h-screen">
        
        {/* Floating blurred ambient glow shapes in background for depth */}
        <div className="absolute top-[20%] right-[15%] w-72 h-72 rounded-full bg-[#C8FB4C]/10 blur-[100px] pointer-events-none animate-pulse duration-5000" />
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse duration-7000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-500/10 blur-[110px] pointer-events-none" />

        {/* Mobile Background Image (Only visible on small/medium screens to give context) */}
        <div 
          className="lg:hidden absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ 
            backgroundImage: `url(${authBg})`,
          }}
        />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/90 to-[#0B0C10]/60 pointer-events-none" />

        {/* Header Controls: Theme Toggle & Mobile Back Link */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
          <Link 
            to="/" 
            className="lg:hidden flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A8FA8] hidden sm:inline">
              Glass Theme
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-[#8A8FA8] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C8FB4C]/50"
              title="Toggle light/dark glassmorphism effect"
              aria-label="Toggle theme"
            >
              {glassTheme === 'dark' ? <Sun className="w-4 h-4 text-[#C8FB4C]" /> : <Moon className="w-4 h-4 text-purple-400" />}
            </button>
          </div>
        </div>

        {/* Authenticating Glassmorphism Card */}
        <div 
          className={`w-full max-w-[460px] rounded-[24px] p-8 md:p-10 border backdrop-blur-[20px] transition-all duration-700 ease-out transform z-20 ${
            glassTheme === 'dark' 
              ? 'bg-[#151720]/65 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_rgba(200,251,76,0.02)] text-white' 
              : 'bg-white/80 border-black/[0.06] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1),0_0_40px_rgba(200,251,76,0.03)] text-gray-900'
          } ${
            animateIn ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-[32px] h-[32px] bg-[#C8FB4C] rounded-lg flex items-center justify-center shadow-lg shadow-[#C8FB4C]/25">
              <Compass className="w-4.5 h-4.5 text-[#0F1117]" />
            </div>
            <span className={`text-lg font-bold tracking-tight ${glassTheme === 'dark' ? 'text-[#FAFAF8]' : 'text-gray-900'}`}>
              Stay<span className="text-[#C8FB4C]">Hive</span>
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold tracking-tight mb-2 ${
              glassTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome Back
            </h2>
            <p className={`text-xs md:text-sm leading-relaxed ${
              glassTheme === 'dark' ? 'text-[#8A8FA8]' : 'text-gray-500'
            }`}>
              Book unique stays and authentic city experiences worldwide in just a click.
            </p>
          </div>

          {/* Social Logins Buttons Stack */}
          <div className="space-y-3 mb-6">
            
            {/* Google Login Button */}
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={loadingProvider !== null}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSocialLogin('Google'); }}
              aria-label="Continue with Google"
              className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-between transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-[#C8FB4C]/50 relative group ${
                glassTheme === 'dark' 
                  ? 'bg-white/5 border-white/[0.08] hover:bg-white/10 hover:border-white/20 text-white' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-900'
              } ${loadingProvider ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
            >
              <div className="flex items-center gap-3">
                {/* Custom Google Vector Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </div>
              {loadingProvider === 'Google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#C8FB4C]" />
              ) : (
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              )}
            </button>

            {/* GitHub Login Button */}
            <button
              onClick={() => handleSocialLogin('GitHub')}
              disabled={loadingProvider !== null}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSocialLogin('GitHub'); }}
              aria-label="Continue with GitHub"
              className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-between transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-[#C8FB4C]/50 relative group ${
                glassTheme === 'dark' 
                  ? 'bg-white/5 border-white/[0.08] hover:bg-white/10 hover:border-white/20 text-white' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-900'
              } ${loadingProvider ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
            >
              <div className="flex items-center gap-3">
                {/* SVG Github Icon */}
                <svg className={`w-5 h-5 shrink-0 ${glassTheme === 'dark' ? 'fill-white' : 'fill-gray-900'}`} viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>Continue with GitHub</span>
              </div>
              {loadingProvider === 'GitHub' ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#C8FB4C]" />
              ) : (
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              )}
            </button>

            {/* Facebook Login Button */}
            <button
              onClick={() => handleSocialLogin('Facebook')}
              disabled={loadingProvider !== null}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSocialLogin('Facebook'); }}
              aria-label="Continue with Facebook"
              className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-between transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-[#C8FB4C]/50 relative group ${
                glassTheme === 'dark' 
                  ? 'bg-white/5 border-white/[0.08] hover:bg-white/10 hover:border-white/20 text-white' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-900'
              } ${loadingProvider ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
            >
              <div className="flex items-center gap-3">
                {/* Custom Facebook SVG Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </div>
              {loadingProvider === 'Facebook' ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#C8FB4C]" />
              ) : (
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              )}
            </button>

          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className={`h-px flex-grow ${glassTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
            <span className={`text-[10px] uppercase font-bold tracking-widest ${
              glassTheme === 'dark' ? 'text-[#8A8FA8]' : 'text-gray-400'
            }`}>
              Quick &amp; Secure Login
            </span>
            <div className={`h-px flex-grow ${glassTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-2 text-center mb-8">
            <div className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              glassTheme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            }`}>
              <Lock className="w-4 h-4 text-[#C8FB4C] mb-1.5" />
              <span className={`text-[9px] font-semibold tracking-tight leading-tight ${
                glassTheme === 'dark' ? 'text-white/80' : 'text-gray-700'
              }`}>
                Secure Auth
              </span>
            </div>
            
            <div className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              glassTheme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            }`}>
              <Shield className="w-4 h-4 text-[#C8FB4C] mb-1.5" />
              <span className={`text-[9px] font-semibold tracking-tight leading-tight ${
                glassTheme === 'dark' ? 'text-white/80' : 'text-gray-700'
              }`}>
                Privacy Protected
              </span>
            </div>

            <div className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
              glassTheme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            }`}>
              <Key className="w-4 h-4 text-[#C8FB4C] mb-1.5" />
              <span className={`text-[9px] font-semibold tracking-tight leading-tight ${
                glassTheme === 'dark' ? 'text-white/80' : 'text-gray-700'
              }`}>
                No Passwords
              </span>
            </div>
          </div>

          {/* Terms and Privacy Policy Links */}
          <p className={`text-center text-[11px] leading-relaxed ${
            glassTheme === 'dark' ? 'text-white/40' : 'text-gray-400'
          }`}>
            By signing in, you agree to our{' '}
            <button 
              onClick={() => handleLinkClick('Terms of Service')}
              className="font-medium underline hover:text-[#C8FB4C] transition-colors focus:outline-none"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button 
              onClick={() => handleLinkClick('Privacy Policy')}
              className="font-medium underline hover:text-[#C8FB4C] transition-colors focus:outline-none"
            >
              Privacy Policy
            </button>.
          </p>

        </div>
      </div>
      
    </div>
  );
};

export default LoginPage;
