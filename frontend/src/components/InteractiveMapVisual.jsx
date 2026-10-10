import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Star, ShieldCheck, Clock, Utensils, Home, Pill, ShoppingBag, Sparkles } from 'lucide-react';

export function InteractiveMapVisual({ onSelectListing }) {
  const [activePin, setActivePin] = useState('pg');

  const pins = [
    {
      id: 'pg',
      title: 'Campus View PG',
      type: 'PG & Rooms',
      category: 'Stay',
      rating: '4.5',
      distance: '700m away',
      price: '₹6,500/mo',
      top: '32%',
      left: '26%',
      badge: '2 beds left',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: Home,
      accentColor: '#D2FC00',
      listingId: 1
    },
    {
      id: 'mess',
      title: 'Maa’s Kitchen Mess',
      type: 'Monthly Tiffin',
      category: 'Food',
      rating: '4.7',
      distance: '450m away',
      price: '₹2,500/mo',
      top: '64%',
      left: '68%',
      badge: 'Pure Veg',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: Utensils,
      accentColor: '#F59E0B',
      listingId: 2
    },
    {
      id: 'pharmacy',
      title: 'Apollo Pharmacy',
      type: '24/7 Meds',
      category: 'Health',
      rating: '4.8',
      distance: '250m away',
      price: 'Walk-in',
      top: '72%',
      left: '24%',
      badge: '24x7 Open',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: Pill,
      accentColor: '#3B82F6',
      listingId: 4
    },
    {
      id: 'grocery',
      title: 'Daily Needs Mart',
      type: 'Snacks & Xerox',
      category: 'Essentials',
      rating: '4.6',
      distance: '350m away',
      price: 'Walk-in',
      top: '24%',
      left: '74%',
      badge: 'Student Discounts',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: ShoppingBag,
      accentColor: '#A855F7',
      listingId: 4
    }
  ];

  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto h-[440px] sm:h-[480px] lg:h-[520px]">
      {/* Decorative Glow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#D2FC00]/20 via-transparent to-amber-200/20 rounded-3xl blur-2xl transform -rotate-1 pointer-events-none"></div>

      {/* Main Map Slate */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full h-full rounded-3xl bg-[#FFFFFF] border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col"
      >
        {/* Top Radar Bar */}
        <div className="px-4 py-3 bg-stone-900 text-white flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D2FC00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D2FC00]"></span>
            </span>
            <span className="text-xs font-mono font-semibold tracking-wide text-stone-200">
              RADAR ACTIVE · INDORE SECTOR 09
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 bg-stone-800/80 px-2.5 py-1 rounded-full">
            <Navigation className="w-3 h-3 text-[#D2FC00]" />
            <span>Target: IET-DAVV</span>
          </div>
        </div>

        {/* Map Vector Grid Canvas */}
        <div className="relative flex-1 bg-[#F9F7F2] overflow-hidden">
          {/* Street Road Patterns */}
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M -50 140 Q 200 180 550 120" stroke="#DDD7C8" strokeWidth="24" fill="none" strokeLinecap="round" />
            <path d="M 180 -50 Q 220 280 260 550" stroke="#DDD7C8" strokeWidth="20" fill="none" strokeLinecap="round" />
            <path d="M 320 200 L 550 450" stroke="#DDD7C8" strokeWidth="16" fill="none" />
            <path d="M -20 360 Q 220 300 520 400" stroke="#DDD7C8" strokeWidth="18" fill="none" />
            
            {/* Dashed Road Lanes */}
            <path d="M -50 140 Q 200 180 550 120" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 6" fill="none" />
            <path d="M 180 -50 Q 220 280 260 550" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 6" fill="none" />

            {/* Walking radius circles */}
            <circle cx="50%" cy="50%" r="130" stroke="#D2FC00" strokeWidth="1.5" strokeDasharray="4 4" fill="rgba(210, 252, 0, 0.04)" />
            <circle cx="50%" cy="50%" r="220" stroke="#121417" strokeWidth="1" strokeOpacity="0.08" fill="none" />
          </svg>

          {/* Central Target Pin: Destination College */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-full bg-[#121417] text-[#D2FC00] flex items-center justify-center shadow-xl ring-4 ring-white">
                <span className="font-extrabold text-xs tracking-tighter font-display">IET</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-[#D2FC00]/60 absolute -bottom-1 left-1/2 -translate-x-1/2 blur-sm"></div>
            </motion.div>
            <div className="mt-1 px-3 py-1 rounded-full bg-[#121417] text-white text-[11px] font-bold shadow-md whitespace-nowrap flex items-center gap-1 border border-stone-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D2FC00]"></span>
              <span>IET-DAVV Campus</span>
            </div>
          </div>

          {/* Interactive Map Pins */}
          {pins.map((pin) => {
            const Icon = pin.icon;
            const isActive = activePin === pin.id;

            return (
              <div
                key={pin.id}
                style={{ top: pin.top, left: pin.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                onClick={() => setActivePin(pin.id)}
              >
                {/* Pin Circle */}
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                    isActive 
                      ? 'bg-[#121417] text-[#D2FC00] ring-4 ring-[#D2FC00]/60 shadow-xl' 
                      : 'bg-white text-stone-800 hover:scale-105 border border-stone-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Micro Label */}
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'top-11 opacity-100 pointer-events-auto' 
                      : 'top-10 opacity-80 group-hover:opacity-100 group-hover:top-11'
                  }`}
                >
                  <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-md border border-black/[0.08] flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-stone-900">{pin.title}</span>
                    <span className="text-[10px] font-semibold text-stone-500">· {pin.distance}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Active Highlight Card Preview inside Map Bottom */}
          <div className="absolute bottom-3 left-3 right-3 z-30">
            <AnimatePresence mode="wait">
              {pins.filter(p => p.id === activePin).map(pin => (
                <motion.div 
                  key={pin.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-black/[0.08] shadow-lg flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 flex-shrink-0">
                      <pin.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{pin.title}</h4>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${pin.badgeColor}`}>
                          {pin.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-0.5">
                        <span className="font-semibold text-black">{pin.price}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">📍 {pin.distance}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                          {pin.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectListing && onSelectListing(pin.listingId)}
                    className="px-3 py-1.5 rounded-xl bg-[#121417] text-white hover:bg-black text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
                  >
                    View Details
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Map Bottom Status Bar */}
        <div className="px-4 py-2 bg-stone-50 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <span>Radius: &lt; 800m walkable</span>
          <span className="text-stone-700 font-semibold">12 trusted spots verified</span>
        </div>
      </motion.div>

      {/* Floating Card 1: Verified Resident Quote */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="hidden sm:flex absolute -top-5 -left-6 z-30 bg-white rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-black/[0.06] items-center gap-3 max-w-[230px]"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-stone-900 leading-tight">Verified by IETians</p>
          <p className="text-[10px] text-stone-500">0 broker spam · 100% real tea</p>
        </div>
      </motion.div>

      {/* Floating Card 2: Live Badge */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="hidden sm:flex absolute -bottom-4 -right-4 z-30 bg-[#121417] text-white rounded-2xl p-3 shadow-xl border border-stone-800 items-center gap-2.5"
      >
        <div className="w-7 h-7 rounded-xl bg-[#D2FC00] text-black flex items-center justify-center font-black text-xs">
          ⚡
        </div>
        <div>
          <div className="text-[11px] font-bold text-white flex items-center gap-1">
            <span>Instant Availability</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="text-[10px] text-stone-400">Direct owner & mess contacts</div>
        </div>
      </motion.div>
    </div>
  );
}
