import React, { useState, useEffect } from 'react';
import { MapPin, Sparkles, Navigation, ArrowRight, CheckCircle2, ShieldCheck, Clock, Check } from 'lucide-react';
import { POPULAR_DESTINATIONS, MOCK_LISTINGS } from '../data/mockData';

export function SmartDiscoverySection({ selectedDestination, setSelectedDestination, onViewDetails }) {
  const [currentInput, setCurrentInput] = useState('IET-DAVV');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [scanStep, setScanStep] = useState(3);

  const presets = [
    { label: 'IET-DAVV', id: 'iet-davv', tag: 'Khandwa Road' },
    { label: 'Bhawarkua', id: 'bhawarkua', tag: 'Coaching Hub' },
    { label: 'Vijay Nagar', id: 'vijay-nagar', tag: 'Scheme 54/78' },
    { label: 'Rau', id: 'rau', tag: 'IIM / Medicaps' },
  ];

  const handleSelectPreset = (preset) => {
    setCurrentInput(preset.label);
    setSelectedDestination(preset.id);
    triggerScanAnimation();
  };

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setScanProgress(20);
    setScanStep(1);

    setTimeout(() => {
      setScanProgress(60);
      setScanStep(2);
    }, 600);

    setTimeout(() => {
      setScanProgress(100);
      setScanStep(3);
      setIsScanning(false);
    }, 1200);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#121417] text-white relative overflow-hidden">
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#D2FC00]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-800 text-[#D2FC00] text-xs font-bold uppercase tracking-wider mb-4 border border-stone-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hyperlocal Geofencing Engine</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.1] mb-4">
            Tell us where you're going. <br />
            <span className="text-[#D2FC00]">We'll handle the rest.</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-400 font-medium max-w-xl mx-auto">
            Zero guessing. Enter your Indore college or coaching institute, and our engine automatically calculates walking times, verifies food quality, and maps essential hubs.
          </p>
        </div>

        {/* Large Interactive Destination Input Box */}
        <div className="max-w-3xl mx-auto bg-stone-900/90 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl backdrop-blur-xl">
          
          <div className="mb-4 flex items-center justify-between text-xs text-stone-400 font-mono">
            <span className="flex items-center gap-1.5 text-stone-300">
              <span className="w-2 h-2 rounded-full bg-[#D2FC00] animate-ping"></span>
              <span>GEO-PIN TARGET</span>
            </span>
            <span>Accurate to 15 meters</span>
          </div>

          {/* Big Input */}
          <div className="relative flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full flex items-center bg-stone-800 rounded-2xl border border-stone-700 px-4 py-3.5">
              <span className="text-xl mr-2">📍</span>
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Enter college or Indore landmark..."
                className="w-full bg-transparent text-lg sm:text-xl font-bold font-display text-white placeholder:text-stone-500 focus:outline-none"
              />
            </div>

            <button
              onClick={triggerScanAnimation}
              disabled={isScanning}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#D2FC00] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#bce400] transition-transform hover:scale-105 cursor-pointer shadow-lg flex-shrink-0 disabled:opacity-70"
            >
              <span>{isScanning ? 'Scanning Vicinity...' : 'Explore Vicinity'}</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-stone-800/80">
            <span className="text-xs text-stone-500 font-medium">Try student hubs:</span>
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentInput === p.label
                    ? 'bg-stone-100 text-black'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[10px] opacity-60 font-mono">({p.tag})</span>
              </button>
            ))}
          </div>

          {/* Scanning Status State */}
          <div className="mt-6 pt-5 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[#D2FC00] font-bold">
                {isScanning ? 'Finding stays, food & essentials near you…' : `Vicinity mapped for: ${currentInput}`}
              </span>
              <span className="text-stone-400">{scanProgress}% completed</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
              <div 
                className="h-full bg-[#D2FC00] transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>

            {/* Micro scan step indicators */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <Check className={`w-3.5 h-3.5 ${scanStep >= 1 ? 'text-[#D2FC00]' : 'text-stone-600'}`} />
                <span>Geofencing &lt; 1.5km perimeter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className={`w-3.5 h-3.5 ${scanStep >= 2 ? 'text-[#D2FC00]' : 'text-stone-600'}`} />
                <span>Live resident verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className={`w-3.5 h-3.5 ${scanStep >= 3 ? 'text-[#D2FC00]' : 'text-stone-600'}`} />
                <span>Owner contacts verified</span>
              </div>
            </div>
          </div>

        </div>

        {/* Animated Nearby Results Preview */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-400 font-mono">
              DISCOVERED WITHIN 15 MIN WALK OF {currentInput.toUpperCase()}
            </h4>
            <span className="text-xs text-[#D2FC00] font-bold">● Live Availability Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MOCK_LISTINGS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onViewDetails(item)}
                className="bg-stone-900 rounded-2xl p-5 border border-stone-800 hover:border-[#D2FC00]/60 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {item.distance}
                    </span>
                  </div>

                  <h5 className="text-lg font-bold font-display text-white group-hover:text-[#D2FC00] transition-colors mb-1">
                    {item.name}
                  </h5>

                  <p className="text-xs text-stone-400 line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-200">
                    ₹{item.price.toLocaleString('en-IN')}{item.priceUnit}
                  </span>
                  <span className="text-[11px] font-bold text-[#D2FC00] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
