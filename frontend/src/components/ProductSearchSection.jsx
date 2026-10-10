import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Star, CheckCircle, MapPin, Wifi, Wind, 
  UtensilsCrossed, Users, Phone, ExternalLink, RotateCcw, 
  ChevronDown, Layers, Navigation, Check, Map as MapIcon, ListFilter, RefreshCw
} from 'lucide-react';
import { LeafletMapView } from './LeafletMapView';
import { api } from '../services/api';
import { MOCK_LISTINGS, POPULAR_DESTINATIONS } from '../data/mockData';

export function ProductSearchSection({ 
  selectedDestination, 
  setSelectedDestination, 
  onViewDetails, 
  onContact,
  userLocation,
  onUserLocationFound
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [onlyFoodIncluded, setOnlyFoodIncluded] = useState(false);
  const [onlyAc, setOnlyAc] = useState(false);
  const [onlyWifi, setOnlyWifi] = useState(false);
  const [hoveredListingId, setHoveredListingId] = useState(null);
  const [searchFilterText, setSearchFilterText] = useState('');
  
  // View mode: 'split' or 'map_full'
  const [viewMode, setViewMode] = useState('split');

  // Backend listings state
  const [rawListings, setRawListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Destination info
  const currentDestObj = POPULAR_DESTINATIONS.find(d => d.id === selectedDestination) || POPULAR_DESTINATIONS[0];

  // Fetch listings from backend API
  const loadListings = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const params = {};
      if (userLocation && userLocation.lat && userLocation.lng) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
      }
      const res = await api.getListings(params);
      if (res.data && res.data.length > 0) {
        setRawListings(res.data);
      } else {
        setRawListings(MOCK_LISTINGS);
      }
    } catch (err) {
      console.warn("Falling back to local cache:", err);
      setApiError("Connected to offline cache");
      setRawListings(MOCK_LISTINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [userLocation]);

  // Client-side filtering across live listings
  const filteredListings = useMemo(() => {
    const listToFilter = rawListings.length > 0 ? rawListings : MOCK_LISTINGS;

    return listToFilter.filter(item => {
      // 1. Category filter
      if (activeCategory !== 'all') {
        if (item.category !== activeCategory) return false;
      }

      // 2. Text search
      if (searchFilterText.trim()) {
        const query = searchFilterText.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        const matchesArea = (item.area || '').toLowerCase().includes(query);
        const matchesAddress = (item.address || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesArea && !matchesAddress) return false;
      }

      // 3. Budget
      if (budgetFilter === 'under3k' && (item.price > 3000 || item.price === 0)) return false;
      if (budgetFilter === '3to7k' && (item.price < 3000 || item.price > 7000)) return false;
      if (budgetFilter === 'above7k' && item.price < 7000) return false;

      // 4. Distance
      if (distanceFilter === '500m') {
        const distM = item.distance_km ? item.distance_km * 1000 : (item.distanceMeters || 9999);
        if (distM > 500) return false;
      }
      if (distanceFilter === '1km') {
        const distM = item.distance_km ? item.distance_km * 1000 : (item.distanceMeters || 9999);
        if (distM > 1000) return false;
      }

      // 5. Rating
      if (ratingFilter === '4.5' && (item.rating || 0) < 4.5) return false;

      // 6. Amenities
      const amenitiesStr = Array.isArray(item.amenities) ? item.amenities.join(' ').toLowerCase() : '';
      if (onlyFoodIncluded && !amenitiesStr.includes('food') && !amenitiesStr.includes('thali') && !amenitiesStr.includes('mess')) return false;
      if (onlyAc && !amenitiesStr.includes('ac')) return false;
      if (onlyWifi && !amenitiesStr.includes('wi-fi') && !amenitiesStr.includes('wifi')) return false;

      return true;
    });
  }, [
    rawListings, activeCategory, budgetFilter, distanceFilter, 
    ratingFilter, onlyFoodIncluded, onlyAc, onlyWifi, searchFilterText
  ]);

  const resetAllFilters = () => {
    setActiveCategory('all');
    setBudgetFilter('all');
    setDistanceFilter('all');
    setRatingFilter('all');
    setOnlyFoodIncluded(false);
    setOnlyAc(false);
    setOnlyWifi(false);
    setSearchFilterText('');
  };

  const activeFiltersCount = [
    budgetFilter !== 'all',
    distanceFilter !== 'all',
    ratingFilter !== 'all',
    onlyFoodIncluded,
    onlyAc,
    onlyWifi,
    searchFilterText.length > 0
  ].filter(Boolean).length;

  return (
    <section id="stays" className="py-20 sm:py-24 bg-[#FAF8F5] relative border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-[#D2FC00] text-xs font-bold uppercase tracking-wider mb-3">
              <span>Live Database Inventory</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-[#121417]">
              Stop hunting. <br />
              <span className="relative inline-block">
                <span>Start living.</span>
                <span className="absolute left-0 bottom-1 w-full h-3 bg-[#D2FC00]/60 -z-0 rounded-sm"></span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-sm text-stone-600 max-w-sm font-medium">
              Verified hostels, mess tiffins, and essentials in Indore. Interactive Leaflet map with GPS accuracy.
            </p>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-stone-200 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'split' ? 'bg-[#121417] text-white shadow-sm' : 'text-stone-700 hover:text-black'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map_full')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'map_full' ? 'bg-[#121417] text-white shadow-sm' : 'text-stone-700 hover:text-black'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Interactive Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Location Title & Destination Switcher */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#121417] text-[#D2FC00] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-stone-900 flex items-center gap-2">
                  <span>📍 Around {currentDestObj.name}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {filteredListings.length} spots available
                  </span>
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {currentDestObj.subtitle} · Indore, Madhya Pradesh
                </p>
              </div>
            </div>

            {/* Switch Destination Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-stone-400 whitespace-nowrap mr-1">Switch Hub:</span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDestination === dest.id
                      ? 'bg-[#121417] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="pt-4 flex flex-col gap-4">
            
            {/* Category Tabs: All, Hostels/Stays, Food & Mess, Essentials */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl overflow-x-auto">
                {[
                  { id: 'all', label: 'All Nearby' },
                  { id: 'stays', label: '🏠 Hostels & PGs' },
                  { id: 'food', label: '🍜 Mess & Cafes' },
                  { id: 'essentials', label: '📍 Essentials' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#121417] text-[#D2FC00] shadow-sm font-extrabold'
                        : 'text-stone-600 hover:text-black hover:bg-stone-200/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Quick Search Input */}
              <div className="relative sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, area, dish..."
                  value={searchFilterText}
                  onChange={(e) => setSearchFilterText(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-100 rounded-xl text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* Dropdown Filters & Amenity Toggles */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              
              {/* Budget Filter */}
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 font-semibold text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Budget: Any</option>
                <option value="under3k">Under ₹3,000</option>
                <option value="3to7k">₹3,000 - ₹7,000</option>
                <option value="above7k">Above ₹7,000</option>
              </select>

              {/* Distance Filter */}
              <select
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 font-semibold text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Distance: Any</option>
                <option value="500m">Walkable &lt; 500m</option>
                <option value="1km">Within 1 km</option>
              </select>

              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 font-semibold text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Rating: Any</option>
                <option value="4.5">⭐ 4.5+ Rated</option>
              </select>

              {/* Toggle: Food Included */}
              <button
                type="button"
                onClick={() => setOnlyFoodIncluded(!onlyFoodIncluded)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                  onlyFoodIncluded
                    ? 'bg-[#121417] text-[#D2FC00] border-black'
                    : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Food included</span>
              </button>

              {/* Toggle: AC */}
              <button
                type="button"
                onClick={() => setOnlyAc(!onlyAc)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                  onlyAc
                    ? 'bg-[#121417] text-[#D2FC00] border-black'
                    : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>AC</span>
              </button>

              {/* Toggle: Wi-Fi */}
              <button
                type="button"
                onClick={() => setOnlyWifi(!onlyWifi)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                  onlyWifi
                    ? 'bg-[#121417] text-[#D2FC00] border-black'
                    : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>Wi-Fi</span>
              </button>

              {/* Reset button if any filter active */}
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ------------------- FULL LEAFLET MAP VIEW ------------------- */}
        {viewMode === 'map_full' ? (
          <div className="mb-12 animate-in fade-in duration-300">
            <LeafletMapView 
              listings={filteredListings}
              selectedCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              onViewDetails={onViewDetails}
              onContact={onContact}
              userLocation={userLocation}
              onUserLocationFound={onUserLocationFound}
            />
          </div>
        ) : (
          /* ------------------- SPLIT VIEW: LISTINGS + INTERACTIVE MAP ------------------- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Listings Column */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center">
                    <RefreshCw className="w-8 h-8 mx-auto text-stone-400 animate-spin mb-3" />
                    <h4 className="text-base font-bold text-stone-900">Loading verified Indore inventory...</h4>
                  </div>
                ) : filteredListings.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-3xl p-10 border border-stone-200 text-center"
                  >
                    <p className="text-3xl mb-2">🔍</p>
                    <h4 className="text-lg font-bold text-stone-900">No places match this exact filter</h4>
                    <p className="text-xs text-stone-500 mt-1 mb-4">Try relaxing your distance or budget filters.</p>
                    <button
                      onClick={resetAllFilters}
                      className="px-4 py-2 rounded-xl bg-[#121417] text-white text-xs font-bold cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                ) : (
                  filteredListings.map((listing) => {
                    const photos = Array.isArray(listing.photos) ? listing.photos : listing.images || [];
                    const photoUrl = photos[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
                    const amenities = Array.isArray(listing.amenities) ? listing.amenities : [];
                    const distanceStr = listing.distance_text || listing.distance || 'Near DAVV';

                    return (
                      <motion.div
                        key={listing.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        onMouseEnter={() => setHoveredListingId(listing.id)}
                        onMouseLeave={() => setHoveredListingId(null)}
                        className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 flex flex-col sm:flex-row gap-5 hover:shadow-xl ${
                          hoveredListingId === listing.id
                            ? 'border-black ring-2 ring-black/5 shadow-lg'
                            : 'border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                        }`}
                      >
                        {/* Thumbnail Image */}
                        <div className="relative w-full sm:w-48 h-44 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                          <img 
                            src={photoUrl} 
                            alt={listing.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2.5 py-1 rounded-md bg-[#121417]/85 backdrop-blur-md text-[#D2FC00] text-[10px] font-extrabold uppercase tracking-wider">
                              {listing.subcategory || listing.type || listing.category}
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 left-2.5">
                            <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>
                                {listing.available_units !== null && listing.available_units !== undefined
                                  ? (listing.available_units === 0 ? 'Full / 0 left' : `${listing.available_units} beds left`)
                                  : (listing.statusText || 'Available')}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Info Body */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            {/* Name & Star Rating */}
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-bold font-display text-stone-900">{listing.name}</h3>
                                  {(listing.is_verified || listing.verified) && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                      <Check className="w-3 h-3 stroke-[3]" /> Verified
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-500 mt-0.5">{listing.address || listing.locationText}</p>
                              </div>

                              {/* Rating Pill */}
                              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 border border-stone-200">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-bold text-stone-900">{listing.rating || '4.5'}</span>
                                <span className="text-[10px] text-stone-400">({listing.review_count || listing.reviewsCount || 1})</span>
                              </div>
                            </div>

                            {/* Distance & Price */}
                            <div className="flex items-center gap-3 my-2 text-xs">
                              <span className="font-extrabold text-base text-stone-900">
                                {listing.price === 0 ? 'Free / Walk-in' : `₹${listing.price.toLocaleString('en-IN')}`}
                                <span className="text-xs font-normal text-stone-500 ml-0.5">
                                  /{listing.price_period || listing.priceUnit?.replace('/', '') || 'month'}
                                </span>
                              </span>
                              <span className="text-stone-300">|</span>
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{distanceStr}</span>
                              </span>
                            </div>

                            {/* Amenities pills */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {amenities.slice(0, 3).map((amenity, i) => (
                                <span key={i} className="text-[11px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                                  {amenity}
                                </span>
                              ))}
                              {amenities.length > 3 && (
                                <span className="text-[10px] font-bold text-stone-400 self-center">
                                  +{amenities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: View Details & Contact */}
                          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                            <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="font-medium">Direct connection</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onViewDetails(listing)}
                                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => onContact(listing)}
                                className="px-4 py-2 rounded-xl bg-[#121417] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
                              >
                                <Phone className="w-3 h-3 text-[#D2FC00]" />
                                <span>Contact</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Sticky Leaflet Map Column */}
            <div className="lg:col-span-5 sticky top-24">
              <LeafletMapView 
                listings={filteredListings}
                selectedCategory={activeCategory}
                onSelectCategory={(cat) => setActiveCategory(cat)}
                onViewDetails={onViewDetails}
                onContact={onContact}
                userLocation={userLocation}
                onUserLocationFound={onUserLocationFound}
              />
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
