import React from 'react';
import { X, Star, MapPin, Phone, MessageCircle, ShieldCheck, Check, Clock, Utensils, Wifi, Wind, Info } from 'lucide-react';

export function ListingModal({ listing, onClose, onContact }) {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Close Button */}
        <div className="relative h-56 sm:h-64 bg-stone-900 overflow-hidden flex-shrink-0">
          <img 
            src={listing.images[0]} 
            alt={listing.name} 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Close Icon */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Tag & Rating Overlay */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-[#D2FC00] text-black text-xs font-black uppercase tracking-wider">
                  {listing.type}
                </span>
                {listing.verified && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Verified Resident
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">{listing.name}</h3>
              <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#D2FC00]" />
                <span>{listing.locationText}</span>
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md flex-shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-extrabold text-stone-900">{listing.rating}</span>
              <span className="text-[11px] text-stone-500">({listing.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Quick Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400">Monthly Rent</span>
              <p className="text-base font-extrabold text-stone-900 mt-0.5">
                {listing.price === 0 ? 'Walk-in' : `₹${listing.price.toLocaleString('en-IN')}`}
                <span className="text-xs font-normal text-stone-500">{listing.priceUnit}</span>
              </p>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400">Distance</span>
              <p className="text-base font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
                <span>{listing.distance}</span>
              </p>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400">Room Sharing</span>
              <p className="text-xs font-bold text-stone-900 mt-1 truncate">
                {listing.sharingType || 'Standard'}
              </p>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400">Availability</span>
              <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{listing.statusText}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">
              About This Property
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5 font-mono">
              Included Amenities & Perks
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {listing.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resident Local Tea Quote */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl">☕</span>
            <div>
              <p className="text-xs font-bold text-amber-900">Senior Student Note</p>
              <p className="text-xs text-amber-800 mt-0.5">
                "Owner stays on ground floor, very helpful with deliveries and medical needs. Wi-Fi router is on the 2nd floor, speed is solid for coding and online lectures."
              </p>
            </div>
          </div>

          {/* Safety advice */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Info className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <span>Never pay a booking token before physical inspection. NearU guarantees 0% broker fee.</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onContact(listing);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#121417] hover:bg-black text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-transform"
          >
            <Phone className="w-3.5 h-3.5 text-[#D2FC00]" />
            <span>Contact Landlord / Manager</span>
          </button>
        </div>

      </div>
    </div>
  );
}
