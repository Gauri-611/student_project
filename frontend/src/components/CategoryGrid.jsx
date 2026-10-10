import React from 'react';
import { motion } from 'framer-motion';
import { Home, Utensils, MapPin, Eye, ArrowUpRight } from 'lucide-react';

export function CategoryGrid({ onSelectCategory }) {
  const cards = [
    {
      id: 'stays',
      categoryKey: 'stays',
      badge: '🏠 WHERE TO STAY?',
      headline: 'PGs · Hostels · Rooms',
      desc: 'Double sharing, single rooms, or budget hostels right outside your college gate. Zero brokerage, verified landlords only.',
      pillText: 'From ₹5,500/mo',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: Home,
      cardBg: 'bg-white hover:border-black',
      gradientAccent: 'from-amber-100/40 to-transparent',
      stats: '140+ verified beds near DAVV & Bhawarkua',
      sticker: 'Zero Brokerage 🛡️'
    },
    {
      id: 'food',
      categoryKey: 'food',
      badge: '🍜 WHAT TO EAT?',
      headline: 'Mess · Tiffin · Cafes',
      desc: 'No more tasteless hostel dal. Discover doorstep tiffin services, unlimited thali messes, and late-night study chai spots.',
      pillText: 'Starting ₹2,200/mo',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Utensils,
      cardBg: 'bg-white hover:border-black',
      gradientAccent: 'from-orange-100/40 to-transparent',
      stats: 'Daily menus & trial meals available',
      sticker: 'Ghar Ka Khana 🥘'
    },
    {
      id: 'essentials',
      categoryKey: 'essentials',
      badge: '📍 WHAT’S AROUND?',
      headline: 'Shops · Pharmacy · Essentials',
      desc: '24/7 chemists, Xerox & exam prints, laundromats, and daily mart groceries within a 10-minute walking radius.',
      pillText: 'Walking distance',
      tagColor: 'bg-blue-100 text-blue-900 border-blue-300',
      icon: MapPin,
      cardBg: 'bg-white hover:border-black',
      gradientAccent: 'from-sky-100/40 to-transparent',
      stats: 'Open 24/7 emergency services mapped',
      sticker: 'Walkable Map 🚶'
    },
    {
      id: 'reviews',
      categoryKey: 'all',
      badge: '👀 WHAT’S ACTUALLY GOOD?',
      headline: 'Real reviews · Real people',
      desc: 'The unvarnished truth about water supply, landlord curfews, Wi-Fi speed, and mess hygiene from actual students.',
      pillText: 'Zero sugarcoating',
      tagColor: 'bg-lime-100 text-lime-900 border-lime-400',
      icon: Eye,
      cardBg: 'bg-[#121417] text-white hover:border-[#D2FC00]',
      gradientAccent: 'from-[#D2FC00]/10 to-transparent',
      stats: 'Rated by DAVV, IIM & Medicaps seniors',
      sticker: 'Real Local Tea ☕',
      isDark: true
    }
  ];

  return (
    <section id="explore" className="py-20 sm:py-24 bg-[#FAF8F5] relative border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/80 text-stone-800 text-xs font-bold uppercase tracking-wider mb-3">
              <span>Freshers & Newcomer Protocol</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#121417] leading-tight">
              You just arrived. <br />
              <span className="text-stone-500">We know the drill.</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-stone-600 max-w-md font-medium">
            Everything you need to settle into a new city, in one place. No endless broker phone calls or shady Facebook posts.
          </p>
        </div>

        {/* 4 Visually Distinct Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => onSelectCategory(card.categoryKey)}
                className={`group relative rounded-3xl p-7 transition-colors duration-300 border flex flex-col justify-between cursor-pointer overflow-hidden ${
                  card.isDark 
                    ? 'bg-[#121417] text-white border-stone-800 hover:border-[#D2FC00] shadow-xl' 
                    : 'bg-white text-stone-900 border-stone-200/80 hover:border-stone-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* Subtle card gradient highlight */}
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${card.gradientAccent} rounded-bl-full pointer-events-none transition-transform duration-300 group-hover:scale-125`}></div>

                {/* Top Badge & Corner Icon */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                      card.isDark ? 'bg-stone-800/90 text-[#D2FC00] border-stone-700' : 'bg-stone-100 text-stone-800 border-stone-200'
                    }`}>
                      {card.badge}
                    </span>

                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 ${
                      card.isDark ? 'bg-[#D2FC00] text-black' : 'bg-stone-100 text-stone-900 group-hover:bg-[#121417] group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className={`text-xl sm:text-2xl font-bold font-display tracking-tight mb-3 ${
                    card.isDark ? 'text-white' : 'text-stone-900'
                  }`}>
                    {card.headline}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                    card.isDark ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {card.desc}
                  </p>
                </div>

                {/* Bottom Metadata & Arrow Action */}
                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                  <div>
                    <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      card.isDark ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {card.pillText}
                    </span>
                    <p className={`text-[10px] mt-1 truncate ${card.isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {card.stats}
                    </p>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    card.isDark 
                      ? 'bg-stone-800 group-hover:bg-[#D2FC00] text-white group-hover:text-black' 
                      : 'bg-stone-100 group-hover:bg-black group-hover:text-[#D2FC00] text-stone-700'
                  }`}>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Playful Sticker Badge on hover */}
                <div className="absolute top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none transform -rotate-6">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D2FC00] text-black shadow-sm">
                    {card.sticker}
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
