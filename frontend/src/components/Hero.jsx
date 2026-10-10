import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { InteractiveMapVisual } from './InteractiveMapVisual';

export function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedDestination, 
  setSelectedDestination, 
  onPerformSearch,
  onSelectListing
}) {
  const [localInput, setLocalInput] = useState(searchQuery || '');

  const quickPills = [
    { label: 'IET-DAVV', id: 'iet-davv' },
    { label: 'Vijay Nagar', id: 'vijay-nagar' },
    { label: 'Rau', id: 'rau' },
    { label: 'Bhawarkua', id: 'bhawarkua' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localInput.trim()) {
      setSearchQuery(localInput.trim());
      onPerformSearch(localInput.trim());
    } else {
      onPerformSearch('IET-DAVV');
    }
  };

  const handlePillClick = (dest) => {
    setLocalInput(dest.label);
    setSearchQuery(dest.label);
    setSelectedDestination(dest.id);
    onPerformSearch(dest.label);
  };

  return (
    <section className="relative pt-6 pb-16 sm:pt-10 sm:pb-24 lg:pt-14 lg:pb-28 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#D2FC00]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Gen-Z Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold tracking-wide mb-6 shadow-sm border border-stone-800">
              <span className="w-2 h-2 rounded-full bg-[#D2FC00]"></span>
              <span>Indore’s #1 Gen-Z City Companion</span>
              <span className="text-stone-400">·</span>
              <span className="text-[#D2FC00] font-bold">100% Student Verified</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold font-display text-[#121417] tracking-tight leading-[1.08] mb-6">
              New city? <br />
              <span className="relative inline-block mt-1">
                <span className="relative z-10">Say less.</span>
                <span className="absolute left-0 bottom-2 w-full h-4 bg-[#D2FC00] -z-0 rounded-sm -rotate-1"></span>
              </span>{' '}
              <span className="inline-block transform hover:rotate-12 transition-transform duration-200 cursor-default">
                😎
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl mb-8">
              Find trusted PGs, hostels, food & everyday essentials around your destination — without asking 47 people on WhatsApp.
            </p>

            {/* Large Destination Search Bar */}
            <div className="w-full max-w-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-800" />
                <span>📍 Where are you headed?</span>
              </div>

              <form 
                onSubmit={handleSearchSubmit}
                className="relative flex items-center bg-white p-2 rounded-2xl sm:rounded-full border-2 border-stone-900 shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-200"
              >
                <div className="pl-3 sm:pl-4 pr-2 text-stone-400">
                  <Search className="w-5 h-5 text-stone-700" />
                </div>
                
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Search college, area or destination..."
                  className="flex-1 bg-transparent py-3 px-1 text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 placeholder:font-normal focus:outline-none"
                />

                <button
                  type="submit"
                  className="mt-0 px-5 sm:px-6 py-3 rounded-xl sm:rounded-full bg-[#121417] text-white hover:bg-black font-bold text-sm sm:text-base flex items-center gap-2 transition-all duration-200 group flex-shrink-0 cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  <span>Find nearby</span>
                  <ArrowRight className="w-4 h-4 text-[#D2FC00] group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Popular Destinations Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-stone-500 mr-1">Popular in Indore:</span>
                {quickPills.map((pill) => {
                  const isSelected = selectedDestination === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => handlePillClick(pill)}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#121417] text-[#D2FC00] shadow-sm'
                          : 'bg-stone-200/70 hover:bg-stone-300 text-stone-800'
                      }`}
                    >
                      <span>{pill.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Micro-Proof stats */}
            <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Broker Commission</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Indore Local Student Reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Direct WhatsApp Connect</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: Stylized Map Interface */}
          <div className="lg:col-span-5 w-full">
            <InteractiveMapVisual onSelectListing={onSelectListing} />
          </div>

        </div>
      </div>
    </section>
  );
}
