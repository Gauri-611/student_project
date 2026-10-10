import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, Check, Sparkles } from 'lucide-react';
import { TRUST_REVIEWS } from '../data/mockData';

export function TrustDifferentiator({ onOpenAddReview }) {
  const [reviewsList, setReviewsList] = useState(TRUST_REVIEWS);
  const [upvotedIds, setUpvotedIds] = useState({});

  const handleUpvote = (id) => {
    if (upvotedIds[id]) {
      setUpvotedIds(prev => ({ ...prev, [id]: false }));
      setReviewsList(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes - 1 } : r));
    } else {
      setUpvotedIds(prev => ({ ...prev, [id]: true }));
      setReviewsList(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#F5F2EB] relative overflow-hidden">
      {/* Background tape or subtle watermark */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-300 text-stone-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% Peer Vetted Data</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#121417] leading-[1.1] mb-4">
            Not just listings. <br />
            Real local tea.{' '}
            <span className="inline-block hover:scale-110 transition-transform cursor-pointer">☕</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-600 font-medium max-w-xl mx-auto">
            See what people who actually lived there have to say. No paid landlord endorsements, just unfiltered student reality.
          </p>
        </div>

        {/* 3 Authentic Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {reviewsList.map((review, idx) => {
            const isUpvoted = upvotedIds[review.id];
            return (
              <div
                key={review.id}
                className="relative bg-white rounded-3xl p-7 border border-stone-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Visual "Sticker / Tape" Corner */}
                <div className="absolute -top-3 right-6 bg-[#FAF8F5] border border-stone-200 px-3 py-0.5 rounded-full text-[10px] font-mono text-stone-500 uppercase tracking-widest shadow-xs">
                  {review.relativeTime}
                </div>

                <div>
                  {/* Rating Stars and Score */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-extrabold text-stone-900">{review.rating}</span>
                    </div>

                    <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                      📍 {review.place}
                    </span>
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-lg font-semibold text-stone-800 leading-snug tracking-tight mb-6">
                    “{review.text}”
                  </blockquote>
                </div>

                {/* Author Info + Verified Badge */}
                <div className="pt-5 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={review.avatar} 
                      alt={review.author} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-100" 
                    />
                    <div>
                      <div className="text-sm font-bold text-stone-900 leading-none">
                        {review.author}
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {review.role}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Verified Resident</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Upvote button */}
                  <button
                    onClick={() => handleUpvote(review.id)}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                      isUpvoted
                        ? 'bg-[#121417] text-[#D2FC00] border-black scale-105'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                    title="Helpful review"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{review.upvotes}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Community Banner Callout */}
        <div className="mt-12 max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D2FC00] flex items-center justify-center font-bold text-base flex-shrink-0">
              🗣️
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">Lived in an Indore PG or used a tiffin service?</p>
              <p className="text-xs text-stone-500">Help the next batch of freshers dodge red flags.</p>
            </div>
          </div>
          <button
            onClick={onOpenAddReview}
            className="px-4 py-2 rounded-xl bg-[#121417] hover:bg-black text-white text-xs font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-105"
          >
            Spill the tea →
          </button>
        </div>

      </div>
    </section>
  );
}
