import React from 'react';
import { ArrowRight, PlusCircle, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export function FinalCta({ onExploreIndore, onListPlace }) {
  return (
    <section className="py-20 sm:py-28 bg-[#121417] text-white relative overflow-hidden">
      {/* Decorative gradient sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D2FC00]/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 text-center relative z-10">
        
        {/* Gen-Z badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-[#D2FC00] text-xs font-bold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>No WhatsApp Groups Required</span>
        </div>

        {/* Large Bold Headline */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.05] mb-6">
          Your city. <br />
          Your people. <br />
          <span className="relative inline-block text-[#D2FC00]">
            Your shortcut.
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-stone-300 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
          Everything you need to feel at home, before you even know the city.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreIndore}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#D2FC00] text-black font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-[#bce400] transition-all hover:scale-105 cursor-pointer shadow-xl"
          >
            <span>Explore Indore</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={onListPlace}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-700 hover:border-stone-500"
          >
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <span>List your place</span>
          </button>
        </div>

        {/* Trust Badges footer */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-[#D2FC00]">✓</span>
            <span>Zero Brokerage Forever</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#D2FC00]">✓</span>
            <span>Real Student-Verified Tea</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#D2FC00]">✓</span>
            <span>Direct Landlord WhatsApp</span>
          </div>
        </div>

      </div>
    </section>
  );
}
