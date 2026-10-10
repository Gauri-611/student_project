import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { TrustDifferentiator } from './components/TrustDifferentiator';
import { ProductSearchSection } from './components/ProductSearchSection';
import { SmartDiscoverySection } from './components/SmartDiscoverySection';
import { AiAssistantSection } from './components/AiAssistantSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';

// Modals
import { ListingModal } from './components/ListingModal';
import { ContactModal } from './components/ContactModal';
import { ListPlaceModal } from './components/ListPlaceModal';
import { AuthModal } from './components/AuthModal';
import { AddReviewModal } from './components/AddReviewModal';

import { MOCK_LISTINGS, POPULAR_DESTINATIONS } from './data/mockData';
import { api } from './services/api';

export default function App() {
  const [selectedDestination, setSelectedDestination] = useState('iet-davv');
  const [searchQuery, setSearchQuery] = useState('IET-DAVV');
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nearu_user') || 'null');
    } catch {
      return null;
    }
  });

  // Modal states
  const [detailListing, setDetailListing] = useState(null);
  const [contactListing, setContactListing] = useState(null);
  const [isListPlaceOpen, setIsListPlaceOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  // Check health on mount
  useEffect(() => {
    api.checkHealth().then(res => {
      console.log('Backend connected:', res);
    }).catch(err => {
      console.log('Backend offline or running locally:', err);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nearu_token');
    localStorage.removeItem('nearu_user');
    setCurrentUser(null);
  };

  // Search handler
  const handlePerformSearch = (query) => {
    setSearchQuery(query);
    const match = POPULAR_DESTINATIONS.find(d => 
      query.toLowerCase().includes(d.name.toLowerCase()) || 
      d.name.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      setSelectedDestination(match.id);
    }
    const section = document.getElementById('stays');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nav scroll handler
  const handleNavigateSection = (target) => {
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectListingById = (id) => {
    const found = MOCK_LISTINGS.find(item => item.id === id);
    if (found) {
      setDetailListing(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121417] selection:bg-[#D2FC00] selection:text-black">
      {/* 1. Navbar with Auth Status */}
      <Navbar 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode: mode || 'login' })}
        onOpenListPlace={() => setIsListPlaceOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      <main>
        {/* 2. Hero Section */}
        <Hero 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
          onPerformSearch={handlePerformSearch}
          onSelectListing={handleSelectListingById}
        />

        {/* 3. Section 2: "You just arrived. We know the drill." (Category Grid) */}
        <CategoryGrid 
          onSelectCategory={(cat) => {
            handleNavigateSection('stays');
          }}
        />

        {/* 4. Section 3: Trust Differentiator ("Not just listings. Real local tea. ☕") */}
        <TrustDifferentiator 
          onOpenAddReview={() => setIsAddReviewOpen(true)}
        />

        {/* 5. Section 4: Product Preview & Leaflet Map with GPS & Category Filter */}
        <ProductSearchSection 
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
          onViewDetails={(listing) => setDetailListing(listing)}
          onContact={(listing) => setContactListing(listing)}
          userLocation={userLocation}
          onUserLocationFound={(coords) => setUserLocation(coords)}
        />

        {/* 6. Section 5: Smart Discovery ("Tell us where you're going. We'll handle the rest.") */}
        <SmartDiscoverySection 
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
          onViewDetails={(listing) => setDetailListing(listing)}
        />

        {/* 7. Section 6: Future / AI Feature ("Need a local recommendation?") */}
        <AiAssistantSection 
          onExploreListings={() => handleNavigateSection('stays')}
        />

        {/* 8. Final CTA ("Your city. Your people. Your shortcut.") */}
        <FinalCta 
          onExploreIndore={() => handleNavigateSection('stays')}
          onListPlace={() => setIsListPlaceOpen(true)}
        />
      </main>

      {/* 9. Footer */}
      <Footer 
        onNavigateSection={handleNavigateSection}
        onOpenListPlace={() => setIsListPlaceOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode: mode || 'login' })}
      />

      {/* Modals */}
      <ListingModal 
        listing={detailListing}
        onClose={() => setDetailListing(null)}
        onContact={(listing) => setContactListing(listing)}
      />

      <ContactModal 
        listing={contactListing}
        onClose={() => setContactListing(null)}
      />

      <ListPlaceModal 
        isOpen={isListPlaceOpen}
        onClose={() => setIsListPlaceOpen(false)}
        onListingCreated={(newListing) => {
          // Trigger view details of new listing
          setDetailListing(newListing);
        }}
      />

      <AuthModal 
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onAuthSuccess={(user, token) => {
          setCurrentUser(user);
        }}
      />

      <AddReviewModal 
        isOpen={isAddReviewOpen}
        targetListingId={detailListing ? detailListing.id : 1}
        onClose={() => setIsAddReviewOpen(false)}
        onReviewSubmitted={(newRev) => {
          // Feedback
        }}
      />
    </div>
  );
}
