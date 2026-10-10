import React, { useState } from 'react';
import { X, Star, Send, ShieldCheck, Check } from 'lucide-react';
import { api } from '../services/api';

export function AddReviewModal({ isOpen, onClose, onReviewSubmitted, targetListingId = 1 }) {
  const [place, setPlace] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('DAVV 2nd Year');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        rating,
        comment: text.trim(),
        author_name: author.trim() || 'Verified Student',
        visit_verified: true
      };

      const res = await api.addReview(targetListingId || 1, payload);

      const newRev = {
        id: res.data?.id || Date.now(),
        rating,
        text,
        author: author || 'Indore Student',
        role,
        verifiedResident: true,
        place: place || 'Campus View PG',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        badge: 'Verified Resident',
        upvotes: 1,
        relativeTime: 'Just now'
      };

      if (onReviewSubmitted) onReviewSubmitted(newRev);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold font-display text-stone-900">Tea Spilled Successfully! ☕</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your verified review helps newcomers avoid bad landlords and discover great food. Thanks for keeping Indore honest!
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer hover:bg-black"
            >
              Back to NearU
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="px-2 py-0.5 rounded-md bg-[#D2FC00] text-black text-[10px] font-black uppercase tracking-wider">
                Unfiltered Student Voice
              </span>
              <h3 className="text-2xl font-extrabold font-display text-stone-900 mt-2">
                Spill the Tea ☕
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Tell newcomers the real truth about your PG, hostel, or mess in Indore.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                  Place Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus View PG / Maa's Kitchen"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanmay"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Rating
                  </label>
                  <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold ml-1 text-stone-700">{rating}.0</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                  The Tea (Reviews, food quality, Wi-Fi, landlord vibe)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Food is genuinely good, owner doesn't interfere, but geyser takes 15 mins to heat up..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#121417] hover:bg-black text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                <span>{loading ? 'Submitting to Database...' : 'Post Real Review'}</span>
                <Send className="w-3.5 h-3.5 text-[#D2FC00]" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
