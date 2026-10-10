import React, { useState } from 'react';
import { Compass, Menu, X, ArrowRight, ShieldCheck, Sparkles, MapPin, User, LogOut, GraduationCap, Briefcase } from 'lucide-react';

export function Navbar({ currentUser, onLogout, onOpenAuth, onOpenListPlace, onNavigateSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Explore', target: 'explore' },
    { name: 'Stays', target: 'stays' },
    { name: 'Food', target: 'food' },
    { name: 'Essentials', target: 'essentials' },
  ];

  const handleLinkClick = (target) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-10 py-3.5 backdrop-blur-md bg-[#FAF8F5]/85 border-b border-black/[0.06] transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 rounded-xl bg-[#121417] flex items-center justify-center text-white font-bold tracking-tight shadow-sm transition-transform duration-200 group-hover:scale-105">
            <span className="font-display text-lg text-white">N</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FC00] absolute -top-1 -right-1 ring-2 ring-[#FAF8F5] animate-pulse"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight font-display text-[#121417]">NearU</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#D2FC00] text-black">
                Indore
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-stone-200/50 p-1 rounded-full border border-black/[0.04]">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleLinkClick(item.target)}
              className="px-4 py-1.5 text-xs lg:text-sm font-semibold text-stone-700 hover:text-black rounded-full hover:bg-white transition-all duration-150 cursor-pointer"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={onOpenListPlace}
            className="px-4 py-1.5 text-xs lg:text-sm font-semibold text-stone-700 hover:text-black rounded-full hover:bg-white transition-all duration-150 flex items-center gap-1 cursor-pointer"
          >
            <span>For Owners</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl shadow-xs">
                {currentUser.user_type === 'working' ? (
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span className="text-xs font-extrabold text-stone-900 truncate max-w-[120px]">
                  {currentUser.name || currentUser.username}
                </span>
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  ({currentUser.user_type || 'Student'})
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Log out"
                className="p-1.5 hover:bg-stone-200 rounded-xl text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-sm font-semibold text-stone-800 hover:text-black transition-colors rounded-full hover:bg-stone-200/60 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-5 py-2.5 text-sm font-bold bg-[#121417] text-white hover:bg-black rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-[#D2FC00] group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200 text-xs font-bold">
              <span>{currentUser.name?.split(' ')[0] || 'User'}</span>
              <button onClick={onLogout} className="text-stone-500 hover:text-rose-600 ml-1">
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('register')}
              className="px-3 py-1.5 text-xs font-bold bg-[#121417] text-white rounded-full flex items-center gap-1"
            >
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D2FC00]" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-stone-200/60 hover:bg-stone-200 text-stone-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-black/[0.06] flex flex-col gap-2 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleLinkClick(item.target)}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-white rounded-xl transition-colors"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenListPlace();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-white rounded-xl transition-colors flex items-center justify-between"
          >
            <span>For Owners & Landlords</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">List Free</span>
          </button>

          {!currentUser && (
            <div className="flex gap-2 pt-2 border-t border-black/[0.04]">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-stone-800 bg-stone-200/70 rounded-xl"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-bold bg-[#121417] text-white rounded-xl flex items-center justify-center gap-1"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D2FC00]" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
