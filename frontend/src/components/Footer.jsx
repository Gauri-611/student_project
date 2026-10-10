import React from 'react';
import { ArrowUp, Heart, MapPin, Sparkles, Send } from 'lucide-react';

export function Footer({ onNavigateSection, onOpenListPlace, onOpenAuth }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    { label: 'Explore', action: () => onNavigateSection('explore') },
    { label: 'Stays', action: () => onNavigateSection('stays') },
    { label: 'Food', action: () => onNavigateSection('food') },
    { label: 'Essentials', action: () => onNavigateSection('essentials') },
    { label: 'Reviews', action: () => onNavigateSection('explore') },
    { label: 'For Owners', action: onOpenListPlace },
    { label: 'Contact', action: () => alert('Contact NearU Support: hello@nearu.in / WhatsApp: +91 98260 00000') },
  ];

  return (
    <footer className="bg-[#FAF8F5] border-t border-black/[0.08] pt-16 pb-12 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-stone-200">
          
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#121417] flex items-center justify-center text-white font-extrabold text-base">
                  <span className="font-display">N</span>
                </div>
                <span className="text-2xl font-extrabold font-display tracking-tight text-stone-900">NearU</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D2FC00] text-black uppercase tracking-wider">
                  Indore
                </span>
              </div>

              <p className="text-base font-semibold text-stone-800 mb-2">
                “Helping newcomers find their place.”
              </p>
              <p className="text-xs text-stone-500 max-w-sm leading-relaxed mb-6">
                Designed for students, freshers, and interns moving to Indore. Real locations, verified residents, zero broker drama.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-4 h-4 text-stone-700" />
              <span>Built with love in Indore · India's Cleanest City</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 font-mono">
              Quick Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2.5">
              {footerLinks.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={item.action}
                    className="text-xs font-semibold text-stone-700 hover:text-black hover:underline cursor-pointer transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Newsletter / Telegram Alert */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 font-mono">
              Indore Freshers Drop
            </h4>
            <p className="text-xs text-stone-500 mb-3">
              Get pinged when verified PGs open slots or new mess services launch.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("You're subscribed to NearU Indore alerts!"); }} className="flex gap-2">
              <input
                type="email"
                placeholder="college email or phone"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-stone-900 text-[#D2FC00] hover:bg-black font-bold text-xs cursor-pointer flex-shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} NearU Technologies</span>
            <span>·</span>
            <span>Terms & Safety</span>
            <span>·</span>
            <span>Community Guidelines</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 font-bold text-stone-800 hover:text-black cursor-pointer group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
