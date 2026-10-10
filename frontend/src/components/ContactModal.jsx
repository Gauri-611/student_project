import React, { useState } from 'react';
import { X, Phone, MessageCircle, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export function ContactModal({ listing, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!listing) return null;

  const phoneNum = listing.phone || "+91 98260 12345";
  const whatsappDigits = listing.whatsapp || "919826012345";
  const prefilledMsg = encodeURIComponent(
    `Hello! I found your listing for "${listing.name}" on NearU Indore. I am looking for accommodation near DAVV. Is this still available?`
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#D2FC00] text-black flex items-center justify-center font-bold text-xl mb-3">
            💬
          </div>
          <h3 className="text-xl font-bold font-display text-stone-900">
            Contact {listing.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Verified direct landlord / manager connection in Indore
          </p>
        </div>

        {/* Contact Numbers Display */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Official Mobile</span>
              <p className="text-base font-bold text-stone-900">{phoneNum}</p>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-200/80 text-[11px] text-stone-500">
            <span>Location: {listing.locationText}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mb-6">
          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${whatsappDigits}?text=${prefilledMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Call Direct */}
          <a
            href={`tel:${phoneNum}`}
            className="w-full py-3 px-4 rounded-xl bg-[#121417] hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Phone className="w-4 h-4 text-[#D2FC00]" />
            <span>Call Directly</span>
          </a>
        </div>

        {/* Student Trust Note */}
        <div className="p-3 rounded-xl bg-stone-100 flex items-start gap-2.5 text-stone-600 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            NearU never charges students commission. Inspect the room and confirm terms directly with the owner.
          </p>
        </div>

      </div>
    </div>
  );
}
