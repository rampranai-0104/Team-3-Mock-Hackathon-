import React, { useState } from 'react';
import PublicHeader from '../components/public/PublicHeader';
import HeroSection from '../components/public/HeroSection';
import ImpactSection from '../components/public/ImpactSection';
import ArtFormsSection from '../components/public/ArtFormsSection';
import MasterArtistSection from '../components/public/MasterArtistSection';
import RegionalExplorer from '../components/public/RegionalExplorer';
import WorkshopsSection from '../components/public/WorkshopsSection';
import MarketplaceSection from '../components/public/MarketplaceSection';
import PublicFooter from '../components/public/PublicFooter';
import { CheckCircle } from 'lucide-react';
import '../styles/public.css';

export default function LandingPage() {
  const [toastMessage, setToastMessage] = useState(null);
  const [cartCount, setCartCount] = useState(3);

  const handleAddToCart = (item) => {
    setCartCount((prev) => prev + 1);
    setToastMessage(item.title || 'Original Artwork');
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleReserveWorkshop = (workshop) => {
    setToastMessage(`Workshop Reserved: ${workshop.title}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
      {/* Fixed Sticky Header */}
      <PublicHeader cartCount={cartCount} />

      {/* Main Landing Sections */}
      <main className="landing-main bg-surface flex-1">
        <HeroSection />
        <ImpactSection />
        <ArtFormsSection />
        <MasterArtistSection />
        <RegionalExplorer />
        <WorkshopsSection onReserve={handleReserveWorkshop} />
        <MarketplaceSection onAddToCart={handleAddToCart} />
      </main>

      {/* Footer */}
      <PublicFooter />

      {/* Floating Cart Toast Notification */}
      <div
        className={`toast-floating ${toastMessage ? 'show' : ''}`}
        role="status"
        aria-live="polite"
      >
        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
        <div className="flex flex-col">
          <span className="font-label-md font-bold text-surface">
            {toastMessage || 'Artwork Reserved'}
          </span>
          <span className="font-body-sm text-surface/80">
            Added to your acquisition portfolio
          </span>
        </div>
      </div>
    </div>
  );
}
