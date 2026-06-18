import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Search, Heart, User } from 'lucide-react';

const MobileBottomNav = () => {
  const activeClass = "flex flex-col items-center justify-center w-full text-blue-600 font-bold transition-all shrink-0 py-2";
  const inactiveClass = "flex flex-col items-center justify-center w-full text-gray-400 hover:text-gray-600 transition-colors shrink-0 py-2";

  const handleSoon = (name) => {
    alert(`The "${name}" module is part of the future StayHive Ecosystem release. Currently, only Stays explore and listings are active.`);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-150 shadow-2xl flex items-center justify-around z-50 px-2 pb-safe-bottom">
      
      {/* Explore (Home) */}
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? activeClass : inactiveClass}
      >
        <Compass className="h-5 w-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Explore</span>
      </NavLink>

      {/* Search Stays */}
      <NavLink 
        to="/properties" 
        className={({ isActive }) => isActive ? activeClass : inactiveClass}
      >
        <Search className="h-5 w-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Search Stays</span>
      </NavLink>

      {/* Saved Properties */}
      <button 
        onClick={() => handleSoon('Favorites')}
        className={inactiveClass}
      >
        <Heart className="h-5 w-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Saved</span>
      </button>

      {/* Profile/Menu */}
      <NavLink 
        to="/login" 
        className={({ isActive }) => isActive ? activeClass : inactiveClass}
      >
        <User className="h-5 w-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Profile</span>
      </NavLink>

    </div>
  );
};

export default MobileBottomNav;
