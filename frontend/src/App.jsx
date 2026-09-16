import React, { useState } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import ExploreArtForms from './components/public/ExploreArtForms';
import ExploreArtists from './components/public/ExploreArtists';
import UpcomingEvents from './components/public/UpcomingEvents';
import MyActivity from './components/public/MyActivity';
import { 
  publicUser, 
  artForms, 
  masterArtists, 
  upcomingWorkshops, 
  institutionData,
  marketplaceProducts,
  myArtworkOrders
} from './data/mockData';

export default function App() {
  const [activePortal, setActivePortal] = useState('public'); // 'public' | 'institution'
  const [publicTab, setPublicTab] = useState(0);
  const [institutionTab, setInstitutionTab] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Followed Artists state
  const [followedArtistIds, setFollowedArtistIds] = useState(
    masterArtists.filter(a => a.isFollowing).map(a => a.id)
  );

  // Bookings list state
  const [bookingsList, setBookingsList] = useState(
    upcomingWorkshops.filter(w => w.confirmed)
  );

  // Cart state
  const [cartItems, setCartItems] = useState([
    {
      id: marketplaceProducts[0].id,
      title: marketplaceProducts[0].title,
      artist: marketplaceProducts[0].artist,
      tradition: marketplaceProducts[0].tradition,
      price: marketplaceProducts[0].price,
      quantity: 1,
      image: marketplaceProducts[0].image
    }
  ]);

  const activeTab = activePortal === 'public' ? publicTab : institutionTab;
  const setActiveTab = activePortal === 'public' ? setPublicTab : setInstitutionTab;

  const handleToggleFollow = (artistId) => {
    setFollowedArtistIds(prev => 
      prev.includes(artistId) 
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
  };

  const handleBookWorkshop = (booked) => {
    setBookingsList(prev => [booked, ...prev]);
  };

  const handleUpdateQuantity = (id, newQty) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const followedArtists = masterArtists.filter(a => followedArtistIds.includes(a.id));

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Navigation Header with Portal Switcher */}
      <Header
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin">
          {/* PORTAL BANNER & STEWARDSHIP STATS */}
          {activePortal === 'public' ? (
            /* PUBLIC / CIVILIAN BANNER */
            <section className="relative rounded-2xl bg-surface-container-low p-space-lg lg:p-space-xl shadow-sm mb-space-lg overflow-hidden border border-outline-variant/30">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-space-xs mb-space-xs flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      {publicUser.patronTier}
                    </span>
                    <span className="font-label-caps text-xs text-outline font-semibold">
                      • MEMBER ID {publicUser.memberId}
                    </span>
                  </div>

                  <h1 className="font-headline-lg text-3xl lg:text-4xl text-on-surface font-bold tracking-tight mb-2">
                    Namaste, {publicUser.name}
                  </h1>

                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Welcome to your Cultural Sanctuary. Your mindful stewardship continues to safeguard endangered oral archives and directly sustain generational tribal guilds across Central & Eastern India.
                  </p>
                </div>

                {/* Direct Impact Metrics Capsule */}
                <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 self-start lg:self-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined text-[24px]">palette</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-2xl text-on-surface font-bold leading-none">
                        {publicUser.metrics.traditionsPreserved}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium mt-1">
                        Folk Traditions Preserved
                      </span>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-outline-variant/50"></div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-2xl text-on-surface font-bold leading-none">
                        {followedArtistIds.length}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium mt-1">
                        Master Artisans Followed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provenance Audit Ledger Ribbon */}
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span>Verified 100% Direct-to-Artisan Royalties: <strong className="text-on-surface font-bold">{publicUser.metrics.royaltiesDisbursed}</strong> disbursed via smart escrow ledger</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-primary">
                  <span>Provenance Audit Ledger: {publicUser.metrics.escrowAuditId}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </section>
          ) : (
            /* SCHOOL / CORPORATE BANNER */
            <section className="relative rounded-2xl bg-surface-container-high p-space-lg lg:p-space-xl shadow-sm mb-space-lg overflow-hidden border border-outline-variant/30">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
                {/* Profile Entity Selector */}
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm border border-outline-variant/30 flex-shrink-0">
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>assured_workload</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-label-caps text-xs text-outline uppercase tracking-wider font-semibold">
                        {institutionData.accountType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[11px] font-bold">
                        {institutionData.tier}
                      </span>
                    </div>
                    <h2 className="font-headline-sm text-2xl text-on-surface font-bold mt-0.5">
                      {institutionData.orgName}
                    </h2>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                      Culture CSR Partner: <span className="font-medium text-on-surface">{institutionData.partnerName}</span>
                    </p>
                  </div>
                </div>

                {/* ESG / Cultural CSR Credits Counter */}
                <div className="w-full lg:w-auto grid grid-cols-3 gap-space-sm bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/30">
                  <div className="px-3 py-1 border-r border-outline-variant/30">
                    <span className="font-label-caps text-[10px] text-outline uppercase font-semibold block">Cohort Reach</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-headline-sm text-xl font-bold text-on-surface">{institutionData.metrics.cohortReach}</span>
                      <span className="text-[11px] text-on-surface-variant">{institutionData.metrics.cohortUnit}</span>
                    </div>
                    <span className="text-[10px] text-secondary font-semibold">{institutionData.metrics.cohortGrowth}</span>
                  </div>

                  <div className="px-3 py-1 border-r border-outline-variant/30">
                    <span className="font-label-caps text-[10px] text-outline uppercase font-semibold block">Cultural CSR</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-headline-sm text-xl font-bold text-primary">{institutionData.metrics.csrDirected}</span>
                    </div>
                    <span className="text-[10px] text-primary-container font-semibold">{institutionData.metrics.taxAuditTag}</span>
                  </div>

                  <div className="px-3 py-1">
                    <span className="font-label-caps text-[10px] text-outline uppercase font-semibold block">Livelihoods</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-headline-sm text-xl font-bold text-on-surface">{institutionData.metrics.livelihoods.split(' ')[0]}</span>
                    </div>
                    <span className="text-[10px] text-secondary font-semibold">{institutionData.metrics.tribesCount}</span>
                  </div>
                </div>
              </div>

              {/* Disbursal Progress bar */}
              <div className="mt-5 pt-4 border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-semibold text-on-surface">Q3 CSR Cultural Disbursal Target</span>
                    <span className="text-primary font-bold">{institutionData.metrics.csrPercentage}% Complete</span>
                  </div>
                  <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${institutionData.metrics.csrPercentage}%` }}></div>
                  </div>
                </div>
                <div className="flex md:justify-end gap-3 text-xs text-outline">
                  <span>Audited 12A/80G Disbursed: <strong className="text-on-surface">{institutionData.metrics.csrDirected}</strong></span>
                  <span>•</span>
                  <span>Target: <strong className="text-on-surface">{institutionData.metrics.csrTarget}</strong></span>
                </div>
              </div>
            </section>
          )}

          {/* ACTIVE TAB CONTENT DISPLAY */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/30 shadow-sm">
            {activePortal === 'public' ? (
              publicTab === 0 ? (
                /* SECTION 1: EXPLORE ART FORMS */
                <ExploreArtForms onNavigateToWorkshops={() => setPublicTab(2)} />
              ) : publicTab === 1 ? (
                /* SECTION 2: EXPLORE ARTISTS */
                <ExploreArtists 
                  artists={masterArtists} 
                  followedArtistIds={followedArtistIds} 
                  onToggleFollow={handleToggleFollow} 
                />
              ) : publicTab === 2 ? (
                /* SECTION 3: UPCOMING EVENTS (Workshops & Personal Learning) */
                <UpcomingEvents 
                  workshops={upcomingWorkshops}
                  onBookWorkshop={handleBookWorkshop}
                />
              ) : publicTab === 3 ? (
                /* SECTION 4: MY ACTIVITY (Followed, Bookings, Orders with NFC) */
                <MyActivity
                  followedArtists={followedArtists}
                  onUnfollowArtist={handleToggleFollow}
                  bookings={bookingsList}
                  orders={myArtworkOrders}
                />
              ) : (
                /* SECTION 5: MARKETPLACE (Coming in Step 4) */
                <div className="py-8 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-primary-fixed text-primary mb-2">
                    <span className="material-symbols-outlined text-[32px]">storefront</span>
                  </div>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
                    5. Living Marketplace / Products
                  </h3>
                  <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">
                    Authentic handmade tribal artworks, direct-to-artisan royalty pledge breakdown, and integrated cart drawer checkout will be connected in Step 4!
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button 
                      onClick={() => setPublicTab(2)}
                      className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface"
                    >
                      ← Back to 3. Upcoming Events
                    </button>
                    <button 
                      onClick={() => setPublicTab(3)}
                      className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-xs"
                    >
                      View 4. My Activity →
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* SCHOOL / CORPORATE DASHBOARD (Step 5 & Step 6) */
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                    {institutionTab === 0 ? "1. Explore Art Forms (Educational & Corporate Guides)" :
                     institutionTab === 1 ? "2. Book Workshops (4-Step Bespoke Wizard)" :
                     institutionTab === 2 ? "3. Requests (Institutional Inquiry Tracker)" :
                     institutionTab === 3 ? "4. Upcoming Events (Active Campus Sessions)" :
                     "5. Product Buying (Bulk Gifting & Desk Souvenirs)"}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                    Scheduled for Steps 5 & 6
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {institutionData.experiences.map(exp => (
                    <div key={exp.id} className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-label-caps text-primary uppercase font-bold">{exp.tag}</span>
                        <h4 className="font-headline-sm text-lg font-bold text-on-surface mt-1">{exp.title}</h4>
                        <p className="text-body-sm text-on-surface-variant mt-2 line-clamp-3">{exp.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                        <span className="text-outline">{exp.grade}</span>
                        <span className="text-primary font-semibold">{exp.tradition} Tradition</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Slide-out Cart Drawer */}
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
