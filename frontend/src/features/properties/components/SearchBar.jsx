import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, X } from 'lucide-react';
import { getLocationsMetadata } from '../api/propertyApi';

const inputCls = "w-full bg-[#1A1D26] border border-[#2A2D38] rounded-xl text-sm text-[#FAFAF8] placeholder-[#3A3D48] focus:outline-none focus:border-[#C8FB4C] transition-colors font-medium appearance-none";

const SearchBar = ({ onSearch, initialSearch = '', initialCountry = '', initialMarket = '' }) => {
  const [search,    setSearch]    = useState(initialSearch);
  const [country,   setCountry]   = useState(initialCountry);
  const [market,    setMarket]    = useState(initialMarket);
  const [locations, setLocations] = useState({ countries: [], marketsByCountry: {} });

  useEffect(() => {
    (async () => {
      try {
        const meta = await getLocationsMetadata();
        setLocations(meta);
      } catch (err) { console.error(err); }
    })();
  }, []);

  const handleCountryChange = (e) => { setCountry(e.target.value); setMarket(''); };
  const handleSubmit = (e) => { e.preventDefault(); onSearch({ search, country, market }); };
  const handleClear  = () => { setSearch(''); setCountry(''); setMarket(''); onSearch({ search: '', country: '', market: '' }); };

  const hasActive = search || country || market;

  return (
      <form onSubmit={handleSubmit} className="bg-[#0F1117] border border-[#1A1D26] rounded-2xl p-4 sm:p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">

          {/* Keyword */}
          <div className="md:col-span-5">
            <label className="block text-[10px] font-bold text-[#8A8FA8] uppercase tracking-wider mb-1.5">
              Search destination / stays
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A3D48] pointer-events-none" />
              <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="e.g. Skyline Loft, Beach Villa..."
                  className={`${inputCls} pl-10 pr-4 py-2.5`}
              />
            </div>
          </div>

          {/* Country */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-[#8A8FA8] uppercase tracking-wider mb-1.5">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A3D48] pointer-events-none" />
              <select value={country} onChange={handleCountryChange} className={`${inputCls} pl-10 pr-4 py-2.5 cursor-pointer`}>
                <option value="">Any country</option>
                {locations.countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* City */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-[#8A8FA8] uppercase tracking-wider mb-1.5">
              City / Market
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A3D48] pointer-events-none" />
              <select
                  value={market}
                  onChange={e => setMarket(e.target.value)}
                  disabled={!country}
                  className={`${inputCls} pl-10 pr-4 py-2.5 ${country ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
              >
                <option value="">Any city</option>
                {country && locations.marketsByCountry[country]?.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="md:col-span-1 flex md:flex-col gap-2">
            <button
                type="submit"
                title="Search"
                className="flex-1 md:flex-none md:w-full h-[42px] bg-[#C8FB4C] hover:opacity-90 text-[#0F1117] rounded-xl flex items-center justify-center transition-opacity cursor-pointer font-bold"
            >
              <Search className="w-4 h-4 hidden md:block" />
              <span className="md:hidden text-sm">Search</span>
            </button>
            {hasActive && (
                <button
                    type="button"
                    onClick={handleClear}
                    title="Clear"
                    className="flex-none w-[42px] h-[42px] border border-[#2A2D38] bg-[#1A1D26] hover:border-[#8A8FA8] text-[#8A8FA8] hover:text-[#FAFAF8] rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
            )}
          </div>

        </div>
      </form>
  );
};

export default SearchBar;