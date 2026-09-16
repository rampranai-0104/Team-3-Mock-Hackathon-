import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';
import InstExploreArtForms from '../components/institution/InstExploreArtForms';
import BookWorkshopsWizard from '../components/institution/BookWorkshopsWizard';
import RequestsTracker from '../components/institution/RequestsTracker';
import InstUpcomingEvents from '../components/institution/InstUpcomingEvents';
import ProductBuying from '../components/institution/ProductBuying';
import { institutionData, initialCartItems } from '../data/mockData';
import '../styles/public.css';
import '../styles/portal.css';

export default function InstitutionDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedWizardForm, setSelectedWizardForm] = useState('Warli');
  const [requestsList, setRequestsList] = useState(institutionData.requests);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart operations
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

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="portal-shell">
      {/* Top Header with Portal Navigation */}
      <Header
        activePortal="institution"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-gutter-mobile lg:px-margin py-space-md">
        {/* TOP METRICS & INSTITUTION SELECTOR PLINTH from institution.html */}
        <section className="relative rounded-2xl bg-surface-container-high p-space-lg lg:p-space-xl shadow-sm mb-space-lg overflow-hidden border border-outline-variant/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
            {/* Profile Entity Info */}
            <div className="flex items-center gap-space-md">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0 border border-outline-variant/30">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  assured_workload
                </span>
              </div>
              <div>
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span className="font-label-caps text-xs text-outline uppercase tracking-wider font-semibold">
                    Institutional Stewardship Account
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[10px] font-bold">
                    Tier I Cultural Patron
                  </span>
                </div>
                <div className="flex items-center gap-space-xs mt-1">
                  <h1 className="font-headline-sm text-2xl lg:text-3xl text-on-surface font-bold">
                    The Heritage School &amp; Global Academy
                  </h1>
                </div>
                <p className="font-body-sm text-on-surface-variant mt-0.5">
                  Corporate Culture Partner: <span className="font-semibold text-on-surface">Tata Consultancy Guild (Education Wing)</span>
                </p>
              </div>
            </div>

            {/* ESG / Cultural CSR Credits Counter */}
            <div className="w-full lg:w-auto grid grid-cols-3 gap-space-sm bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="px-space-md py-1 border-r border-outline-variant/30">
                <span className="font-label-caps text-[10px] text-outline uppercase font-semibold block">Cohort Reach</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-sm text-2xl text-on-surface font-bold tracking-tight">2,400</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Students</span>
                </div>
                <span className="font-label-caps text-[10px] text-secondary font-bold">↑ 18% YoY</span>
              </div>

              <div className="px-space-md py-1 border-r border-outline-variant/30">
                <span className="font-label-caps text-[10px] text-outline uppercase font-semibold block">Cultural CSR</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-sm text-2xl text-primary font-bold tracking-tight">₹18.5L</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Directed</span>
                </div>
                <span className="font-label-caps text-[10px] text-primary font-bold">Audited 12A/80G</span>
              </div>

              <div className="px-space-md py-1">
                <span className="font-label-caps text-[10px] text-outline uppercase font-semibold block">Livelihoods</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-sm text-2xl text-on-surface font-bold tracking-tight">32</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Artisans</span>
                </div>
                <span className="font-label-caps text-[10px] text-secondary font-bold">8 Tribes</span>
              </div>
            </div>
          </div>

          {/* CSR Disbursal Target Progress Bar */}
          <div className="mt-space-md pt-space-sm border-t border-outline-variant/20">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-xs text-on-surface font-semibold">Q3 CSR Disbursal Target</span>
                <span className="font-label-caps text-xs text-primary font-bold">92.5% Complete</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '92.5%' }} />
              </div>
              <div className="flex justify-between items-center mt-2 text-outline font-label-caps text-[11px]">
                <span>₹18,50,000 Disbursed to Living Masters</span>
                <span>Annual Commitment Target: ₹20,00,000</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/30 shadow-sm">
          {activeTab === 0 && (
            <InstExploreArtForms
              onSelectForWorkshop={(formName) => {
                setSelectedWizardForm(formName);
                setActiveTab(1);
              }}
            />
          )}
          {activeTab === 1 && (
            <BookWorkshopsWizard
              initialForm={selectedWizardForm}
              onInquirySubmitted={(newInquiry) => {
                setRequestsList((prev) => [newInquiry, ...prev]);
                setActiveTab(2);
              }}
            />
          )}
          {activeTab === 2 && (
            <RequestsTracker
              requests={requestsList}
            />
          )}
          {activeTab === 3 && (
            <InstUpcomingEvents />
          )}
          {activeTab === 4 && (
            <ProductBuying />
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
