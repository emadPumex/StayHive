import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { name: 'Stays',        path: '/properties', active: true },
  { name: 'Rides',        path: '#',           active: false, badge: 'Soon',     badgeType: 'soon' },
  { name: 'Chefs',        path: '#',           active: false, badge: 'Soon',     badgeType: 'soon' },
  { name: 'Experiences',  path: '#',           active: false, badge: 'Soon',     badgeType: 'soon' },
  { name: 'City',         path: '#',           active: false, badge: 'Soon',     badgeType: 'soon' },
  { name: 'SOS',          path: '#',           active: false, badge: 'Priority', badgeType: 'sos'  },
];

const Badge = ({ label, type }) => (
    <span
        className={`text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded-full ${
            type === 'sos'
                ? 'bg-red-950 text-red-400'
                : 'bg-[#1A2A0A] text-[#A8D44A]'
        }`}
    >
    {label}
  </span>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleSoon = (item) => {
    toast.info(`${item.name} coming soon`, {
      description: 'Part of the StayHive ecosystem — currently in development.',
      duration: 4000,
    });
  };

  return (
      <nav className="sticky top-0 z-50 bg-[#0F1117] border-b border-[#1A1D26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-[30px] h-[30px] bg-[#C8FB4C] rounded-lg flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#0F1117]" />
              </div>
              <span className="text-base font-bold text-[#FAFAF8] tracking-tight">
              Stay<span className="text-[#C8FB4C]">Hive</span>
            </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 px-6">
              {navItems.map((item) => {
                const isCurrent = location.pathname === item.path;
                if (item.active) {
                  return (
                      <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                              isCurrent
                                  ? 'text-[#FAFAF8] bg-[#1A1D26]'
                                  : 'text-[#8A8FA8] hover:text-[#FAFAF8]'
                          }`}
                      >
                        {item.name}
                      </Link>
                  );
                }
                return (
                    <button
                        key={item.name}
                        onClick={() => handleSoon(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors"
                    >
                      {item.name}
                      {item.badge && <Badge label={item.badge} type={item.badgeType} />}
                    </button>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <div className="w-px h-8 bg-[#2A2D38]" />
              <button className="px-4 py-2 bg-[#C8FB4C] text-[#0F1117] text-[13px] font-bold rounded-lg hover:opacity-90 transition-opacity">
                Sign in
              </button>
            </div>

            {/* Mobile toggle */}
            <button
                className="lg:hidden p-2 text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
            <div className="lg:hidden border-t border-[#1A1D26] bg-[#0F1117] px-4 pb-5 pt-2">
              <div className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const isCurrent = location.pathname === item.path;
                  if (item.active) {
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isCurrent
                                    ? 'text-[#FAFAF8] bg-[#1A1D26]'
                                    : 'text-[#8A8FA8] hover:text-[#FAFAF8]'
                            }`}
                        >
                          {item.name}
                        </Link>
                    );
                  }
                  return (
                      <button
                          key={item.name}
                          onClick={() => { setIsOpen(false); handleSoon(item); }}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#8A8FA8] hover:text-[#FAFAF8] transition-colors w-full text-left"
                      >
                        {item.name}
                        {item.badge && <Badge label={item.badge} type={item.badgeType} />}
                      </button>
                  );
                })}
              </div>
              <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full py-2.5 bg-[#C8FB4C] text-[#0F1117] text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign in
              </button>
            </div>
        )}
      </nav>
  );
};

export default Navbar;