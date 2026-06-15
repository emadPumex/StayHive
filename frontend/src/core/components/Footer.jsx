import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Globe, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const ecosystem = [
    { label: 'Property Bookings', link: '/properties', active: true },
    { label: 'Ride Booking',          badge: 'Soon' },
    { label: 'Private Chef Services', badge: 'Soon' },
    { label: 'Local Experiences',     badge: 'Soon' },
    { label: 'City Services & SOS',   badge: 'Soon', badgeType: 'sos' },
  ];

  const legal = [
    'About Our Platform',
    'Contact Support',
    'Privacy Policy',
    'Terms of Service',
    'Trust & Safety',
  ];

  return (
      <footer className="bg-[#0F1117] border-t border-[#1A1D26] text-[#8A8FA8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-[30px] h-[30px] bg-[#C8FB4C] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Compass className="w-4 h-4 text-[#0F1117]" />
                </div>
                <span className="text-base font-bold text-[#FAFAF8] tracking-tight">
                Stay<span className="text-[#C8FB4C]">Hive</span>
              </span>
              </Link>
              <p className="text-sm leading-relaxed">
                A comprehensive travel and city experience ecosystem — verified stays, rides, chefs, and essential city services, all in one platform.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#C8FB4C] flex-shrink-0" />
                <span>Secure, verified transactions</span>
              </div>
            </div>

            {/* Ecosystem */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FAFAF8] mb-4">
                Our Ecosystem
              </p>
              <ul className="space-y-2.5 text-sm">
                {ecosystem.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                      {item.active ? (
                          <Link to={item.link} className="text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors">
                            {item.label}
                          </Link>
                      ) : (
                          <>
                            <span className="text-[#3A3D48]">{item.label}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                item.badgeType === 'sos'
                                    ? 'bg-red-950 text-red-400'
                                    : 'bg-[#1A2A0A] text-[#A8D44A]'
                            }`}>
                        {item.badge}
                      </span>
                          </>
                      )}
                    </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FAFAF8] mb-4">
                Support & Legal
              </p>
              <ul className="space-y-2.5 text-sm">
                {legal.map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-[#FAFAF8] transition-colors">{item}</a>
                    </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FAFAF8] mb-4">
                Get in Touch
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C8FB4C] flex-shrink-0 mt-0.5" />
                  <span>100 Innovation Way, Suite 400<br />San Francisco, CA 94103</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C8FB4C] flex-shrink-0" />
                  <span>+1 (800) 555-HIVE</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C8FB4C] flex-shrink-0" />
                  <span>support@stayhive.com</span>
                </li>
                <li className="flex items-center gap-2.5 pt-1">
                  <Globe className="w-4 h-4 text-[#C8FB4C] flex-shrink-0" />
                  <span className="flex gap-2">
                  <span className="hover:text-[#FAFAF8] cursor-pointer transition-colors">English (US)</span>
                  <span>•</span>
                  <span className="hover:text-[#FAFAF8] cursor-pointer transition-colors">USD ($)</span>
                </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-[#1A1D26] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#3A3D48]">
            <p>© {year} StayHive Inc. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms', 'Sitemap'].map((l) => (
                  <a key={l} href="#" className="hover:text-[#8A8FA8] transition-colors">{l}</a>
              ))}
            </div>
          </div>

        </div>
      </footer>
  );
};

export default Footer;