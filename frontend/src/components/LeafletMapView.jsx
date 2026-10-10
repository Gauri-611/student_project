import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, Navigation, Compass, Crosshair, 
  Utensils, Home, Pill, ShoppingBag, Star, 
  ExternalLink, Phone, CheckCircle, AlertCircle, Sparkles
} from 'lucide-react';

// Fix for default Leaflet marker icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom HTML Pin Generator for Gen-Z Aesthetic
const createCustomPin = (category, isSelected = false) => {
  let bgColor = '#121417';
  let emoji = '📍';
  let borderColor = '#D2FC00';

  if (category === 'food') {
    bgColor = '#EA580C'; // Warm Orange
    emoji = '🍜';
    borderColor = '#FED7AA';
  } else if (category === 'stays') {
    bgColor = '#166534'; // Forest / Emerald
    emoji = '🏠';
    borderColor = '#D2FC00';
  } else if (category === 'essentials') {
    bgColor = '#0284C7'; // Blue
    emoji = '💊';
    borderColor = '#BAE6FD';
  }

  const pulseRing = isSelected ? `box-shadow: 0 0 0 8px rgba(210, 252, 0, 0.4);` : '';

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: ${bgColor};
        border: 3px solid ${borderColor};
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        cursor: pointer;
        transition: transform 0.2s ease;
        ${pulseRing}
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22]
  });
};

// User Location Pin
const createUserLocationPin = () => {
  return L.divIcon({
    className: 'user-leaflet-pin',
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: #3B82F6;
          opacity: 0.4;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          inset: 3px;
          border-radius: 9999px;
          background: #2563EB;
          border: 3px solid #FFFFFF;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export function LeafletMapView({ 
  listings = [], 
  selectedCategory = 'all', 
  onSelectCategory,
  onViewDetails,
  onContact,
  userLocation,
  onUserLocationFound
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [locatingUser, setLocatingUser] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Default center: Indore, Madhya Pradesh (IET-DAVV area)
  const defaultCenter = [22.6845, 75.8792];

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 14,
      scrollWheelZoom: false
    });

    // Clean, crisp OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Layer group for listing markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Markers based on filtered listings
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Filter listings based on active category
    const activeListings = listings.filter(item => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'stays' && item.category === 'stays') return true;
      if (selectedCategory === 'food' && item.category === 'food') return true;
      if (selectedCategory === 'essentials' && item.category === 'essentials') return true;
      return false;
    });

    const latLngs = [];

    activeListings.forEach(place => {
      if (!place.latitude || !place.longitude) return;

      const marker = L.marker([place.latitude, place.longitude], {
        icon: createCustomPin(place.category, selectedPlace?.id === place.id)
      });

      // Bind custom popup content
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: #121417; color: #D2FC00;">
              ${place.category.toUpperCase()}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #D97706;">
              ⭐ ${place.rating || '4.5'}
            </span>
          </div>
          <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #111827;">${place.name}</h4>
          <p style="margin: 2px 0 6px 0; font-size: 11px; color: #6B7280;">${place.address || place.area}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E5E7EB; padding-top: 6px;">
            <span style="font-size: 13px; font-weight: 800; color: #111827;">
              ${place.price === 0 ? 'Free' : `₹${place.price.toLocaleString('en-IN')}`}
              <small style="font-size: 10px; font-weight: 500; color: #6B7280;">${place.price_period ? `/${place.price_period}` : ''}</small>
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #059669;">
              📍 ${place.distance_text || place.distance || 'Near DAVV'}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedPlace(place);
      });

      markersLayerRef.current.addLayer(marker);
      latLngs.push([place.latitude, place.longitude]);
    });

    // If we have markers and user hasn't zoomed in manually, fit bounds nicely
    if (latLngs.length > 0 && !userLocation) {
      mapInstanceRef.current.fitBounds(latLngs, { padding: [50, 50], maxZoom: 15 });
    }
  }, [listings, selectedCategory, selectedPlace]);

  // 3. Handle User GPS Location
  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({ type: 'error', message: 'Geolocation is not supported by your browser' });
      return;
    }

    setLocatingUser(true);
    setLocationStatus({ type: 'loading', message: 'Detecting your GPS location...' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocatingUser(false);
        setLocationStatus({ 
          type: 'success', 
          message: `Location locked: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
        });

        const coords = { lat: latitude, lng: longitude };
        if (onUserLocationFound) onUserLocationFound(coords);

        if (mapInstanceRef.current) {
          // Add or update user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userMarker = L.marker([latitude, longitude], {
              icon: createUserLocationPin(),
              zIndexOffset: 1000
            }).addTo(mapInstanceRef.current);
            userMarker.bindPopup("<b>You are here</b><br>Searching places near your current position.");
            userMarkerRef.current = userMarker;
          }

          mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });
        }
      },
      (err) => {
        setLocatingUser(false);
        let msg = 'Unable to access your location. Showing Indore student hubs.';
        if (err.code === 1) msg = 'Location access denied. Click allow in browser address bar.';
        setLocationStatus({ type: 'error', message: msg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-stone-900 bg-white shadow-xl flex flex-col">
      {/* Top Map Control Bar */}
      <div className="p-4 bg-[#121417] text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-10">
        
        {/* Category Filter Tabs: Food, Hostel/Stays, Essentials, All */}
        <div className="flex items-center gap-1.5 bg-stone-800 p-1 rounded-2xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Places', icon: Compass },
            { id: 'stays', label: '🏠 Hostels & PGs', icon: Home },
            { id: 'food', label: '🍜 Food & Mess', icon: Utensils },
            { id: 'essentials', label: '💊 Essentials', icon: Pill },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected 
                    ? 'bg-[#D2FC00] text-black shadow-md scale-102 font-extrabold' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* GPS Current Location Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={requestCurrentLocation}
            disabled={locatingUser}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-105 cursor-pointer disabled:opacity-60"
          >
            <Crosshair className={`w-4 h-4 text-emerald-600 ${locatingUser ? 'animate-spin' : ''}`} />
            <span>{locatingUser ? 'Detecting GPS...' : '📍 Use Current Location'}</span>
          </button>
        </div>
      </div>

      {/* Geolocation Feedback Alert */}
      {locationStatus && (
        <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
          locationStatus.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' 
            : locationStatus.type === 'error' 
              ? 'bg-amber-50 text-amber-900 border-b border-amber-200' 
              : 'bg-blue-50 text-blue-900 border-b border-blue-200'
        }`}>
          <div className="flex items-center gap-1.5">
            {locationStatus.type === 'success' ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>{locationStatus.message}</span>
          </div>
          <button 
            onClick={() => setLocationStatus(null)}
            className="text-[10px] text-stone-500 hover:text-black underline cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[420px] sm:h-[480px] lg:h-[520px] z-0 bg-stone-100"
      ></div>

      {/* Interactive Bottom Drawer: Selected Place Preview */}
      {selectedPlace && (
        <div className="p-4 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${
              selectedPlace.category === 'food' ? 'bg-orange-100' : selectedPlace.category === 'stays' ? 'bg-emerald-100' : 'bg-blue-100'
            }`}>
              {selectedPlace.category === 'food' ? '🍜' : selectedPlace.category === 'stays' ? '🏠' : '💊'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-extrabold text-stone-900">{selectedPlace.name}</h4>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#121417] text-[#D2FC00]">
                  {selectedPlace.subcategory || selectedPlace.category}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{selectedPlace.address || selectedPlace.area}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="text-right mr-2 hidden sm:block">
              <span className="text-xs font-extrabold text-stone-900 block">
                {selectedPlace.price === 0 ? 'Free' : `₹${selectedPlace.price.toLocaleString('en-IN')}`}
                <small className="text-stone-400 font-normal">{selectedPlace.price_period ? `/${selectedPlace.price_period}` : ''}</small>
              </span>
              <span className="text-[11px] font-bold text-emerald-700">
                📍 {selectedPlace.distance_text || selectedPlace.distance || 'Nearby'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onViewDetails(selectedPlace)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold cursor-pointer"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={() => onContact(selectedPlace)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#121417] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#D2FC00]" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 font-medium">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold text-stone-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Hostels/PGs
          </span>
          <span className="flex items-center gap-1 font-bold text-stone-700">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> Food & Mess
          </span>
          <span className="flex items-center gap-1 font-bold text-stone-700">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Essentials
          </span>
        </div>
        <span className="text-stone-400">OpenStreetMap © 2026 NearU Indore</span>
      </div>
    </div>
  );
}
