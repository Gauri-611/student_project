import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export function ListPlaceModal({ isOpen, onClose, onListingCreated }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    categoryType: 'pg', // 'pg', 'room', 'mess', 'shop'
    destination: 'iet-davv',
    rent: '',
    phone: '',
    address: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Map form category to backend category
    let category = 'stays';
    let subcategory = 'pg';
    if (formData.categoryType === 'mess') {
      category = 'food';
      subcategory = 'mess';
    } else if (formData.categoryType === 'shop') {
      category = 'essentials';
      subcategory = 'pharmacy';
    } else if (formData.categoryType === 'room') {
      category = 'stays';
      subcategory = 'room';
    }

    const areaName = formData.destination === 'iet-davv' 
      ? 'Khandwa Road' 
      : formData.destination === 'bhawarkua' 
        ? 'Bhawarkua' 
        : formData.destination === 'vijay-nagar' 
          ? 'Vijay Nagar' 
          : 'Rau';

    const payload = {
      name: formData.name.trim(),
      category: category,
      subcategory: subcategory,
      address: formData.address.trim() || `Near ${areaName}, Indore`,
      area: areaName,
      city: 'Indore',
      price: parseFloat(formData.rent) || 0,
      price_period: category === 'stays' ? 'month' : category === 'food' ? 'month' : 'walk-in',
      phone: formData.phone.trim(),
      whatsapp: formData.phone.trim().replace(/\D/g, ''),
      description: formData.description.trim() || `Verified ${subcategory} located in ${areaName}, Indore.`,
      available_units: category === 'stays' ? 2 : 10,
      amenities: category === 'stays' 
        ? ["Wi-Fi", "RO Water", "CCTV", "Power Backup"] 
        : category === 'food' 
          ? ["Pure Veg", "Tiffin Delivery", "Unlimited Thali"] 
          : ["Open Daily", "Home Delivery"],
      photos: [
        category === 'stays'
          ? "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
          : category === 'food'
            ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80"
      ]
    };

    try {
      const res = await api.createListing(payload);
      setSubmitted(true);
      if (onListingCreated) onListingCreated(res.data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-bold font-display text-stone-900">
              Listing Submitted for Verification!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              Saved directly to NearU Indore database. Our student verification team will inspect your property details within 24 hours.
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer hover:bg-black"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="px-2.5 py-1 rounded-md bg-[#D2FC00] text-black text-[11px] font-extrabold uppercase tracking-wider">
                For Owners & Local Businesses
              </span>
              <h3 className="text-2xl font-extrabold font-display text-stone-900 mt-2">
                List Your Place on NearU
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Reach thousands of genuine DAVV, SGSITS & Medicaps students moving to Indore.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                  Property or Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Boys PG / Maa Sharda Mess"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Category
                  </label>
                  <select
                    value={formData.categoryType}
                    onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none"
                  >
                    <option value="pg">🏠 PG / Hostel</option>
                    <option value="room">🚪 Private Room / Flat</option>
                    <option value="mess">🍜 Mess / Tiffin Service</option>
                    <option value="shop">💊 Essentials / Chemist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Nearest Hub
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none"
                  >
                    <option value="iet-davv">IET-DAVV</option>
                    <option value="bhawarkua">Bhawarkua</option>
                    <option value="vijay-nagar">Vijay Nagar</option>
                    <option value="rau">Rau</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Rent / Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 6000"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                  Exact Address or Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Behind Gate 2, Near Canteen, Khandwa Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-100 flex items-start gap-2 text-stone-600 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Zero brokerage commitment: You will deal directly with students without paying any middleman fees.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#121417] hover:bg-black text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <span>{loading ? 'Submitting to Database...' : 'Submit for Free Verification'}</span>
                <ArrowRight className="w-4 h-4 text-[#D2FC00]" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
