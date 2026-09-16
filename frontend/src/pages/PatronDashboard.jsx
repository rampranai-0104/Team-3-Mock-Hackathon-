import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';
import ExploreArtForms from '../components/public/ExploreArtForms';
import ExploreArtists from '../components/public/ExploreArtists';
import UpcomingEvents from '../components/public/UpcomingEvents';
import MyActivity from '../components/public/MyActivity';
import Marketplace from '../components/public/Marketplace';
import {
  publicUser,
  masterArtists,
  upcomingWorkshops,
  initialCartItems,
  followedArtists,
  bookingsList,
  myArtworkOrders
} from '../data/mockData';
import '../styles/public.css';
import '../styles/portal.css';

export default function PatronDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [followedArtistIds, setFollowedArtistIds] = useState(
    followedArtists.map((a) => a.id)
  );
  const [bookings, setBookings] = useState(bookingsList);
  const [orders] = useState(myArtworkOrders);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toggle follow artist
  const handleToggleFollow = (artistId) => {
    setFollowedArtistIds((prev) =>
      prev.includes(artistId)
        ? prev.filter((id) => id !== artistId)
        : [...prev, artistId]
    );
  };

  // Workshop booking handler
  const handleBookWorkshop = (bookingData) => {
    const newBooking = {
      id: `bk_${Date.now()}`,
      workshopTitle: bookingData.workshopTitle || bookingData.title || 'Sacred Folk Immersion',
      artisan: bookingData.artisan || bookingData.instructor || 'Living Master Artisan',
      tradition: bookingData.tradition || 'Traditional Indian Folk Art',
      dateWindow: bookingData.dateWindow || bookingData.date || 'Upcoming Weekend Session',
      location: bookingData.location || 'Heritage Village Studio',
      seats: bookingData.seats || 1,
      status: 'Confirmed Pass',
      passCode: `TVR-PASS-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          artist: product.artist,
          price: product.priceNumber || (typeof product.price === 'number' ? product.price : 14500),
          image: product.image,
          quantity: 1,
          escrowDirectPercent: product.escrowDirectPercent || '85%'
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const currentFollowedArtists = masterArtists.filter((a) =>
    followedArtistIds.includes(a.id)
  );

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="portal-shell">
      {/* Top Header */}
      <Header
        activePortal="public"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-gutter-mobile lg:px-margin py-space-md">
        {/* PATRON RECOGNITION & SANCTUARY BANNER from civilian.html */}
        <section className="relative rounded-2xl bg-surface-container-low p-space-lg lg:p-space-xl shadow-sm mb-space-lg overflow-hidden border border-outline-variant/30">
          <div className="absolute top-0 right-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-center">
            <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 200 200">
              <circle cx="100" cy="100" fill="none" r="80" stroke="currentColor" strokeDasharray="4 6" strokeWidth="2" />
              <circle cx="100" cy="100" fill="none" r="55" stroke="currentColor" strokeWidth="1.5" />
              <path d="M100 20 L100 180 M20 100 L180 100 M43 43 L157 157 M43 157 L157 43" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
            <div className="max-w-2xl">
              <div className="flex items-center gap-space-xs mb-space-xs flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                  </span>
                  {publicUser.patronTier}
                </span>
                <span className="font-label-caps text-xs text-outline font-semibold">
                  • MEMBER ID {publicUser.memberId}
                </span>
              </div>
              <h1 className="font-headline-lg text-3xl lg:text-4xl text-on-surface font-bold mb-space-xs">
                Namaste, {publicUser.name}
              </h1>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Welcome to your Cultural Sanctuary. Your mindful stewardship continues to safeguard endangered oral archives and directly sustain generational tribal guilds across Central &amp; Eastern India.
              </p>
            </div>

            {/* Direct Impact Metrics Capsule */}
            <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container shadow-sm self-start lg:self-auto border border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-[24px]">palette</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-2xl text-on-surface font-bold leading-none">
                    {publicUser.metrics.traditionsPreserved}
                  </span>
                  <span className="font-label-md text-xs text-on-surface-variant mt-0.5">
                    Traditions Explored
                  </span>
                </div>
              </div>
              <div className="w-px h-10 bg-outline-variant/40" />
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-2xl text-on-surface font-bold leading-none">
                    {followedArtistIds.length}
                  </span>
                  <span className="font-label-md text-xs text-on-surface-variant mt-0.5">
                    Master Artisans Followed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Milestone Micro-track */}
          <div className="mt-space-md pt-space-sm border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>Direct Artisan Escrow Royalties: <strong className="text-on-surface font-semibold">{publicUser.metrics.royaltiesDisbursed}</strong> Disbursed</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-primary">
              <span>Provenance Audit Ledger: {publicUser.metrics.escrowAuditId}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/30 shadow-sm">
          {activeTab === 0 && (
            <ExploreArtForms onNavigateToWorkshops={() => setActiveTab(2)} />
          )}
          {activeTab === 1 && (
            <ExploreArtists
              artists={masterArtists}
              followedArtistIds={followedArtistIds}
              onToggleFollow={handleToggleFollow}
            />
          )}
          {activeTab === 2 && (
            <UpcomingEvents
              workshops={upcomingWorkshops}
              onBookWorkshop={handleBookWorkshop}
            />
          )}
          {activeTab === 3 && (
            <MyActivity
              followedArtists={currentFollowedArtists}
              onUnfollowArtist={handleToggleFollow}
              bookings={bookings}
              orders={orders}
            />
          )}
          {activeTab === 4 && (
            <Marketplace onAddToCart={handleAddToCart} />
          )}
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
