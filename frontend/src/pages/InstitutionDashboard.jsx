import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import institutionService from '../services/institutionService';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';
import InstExploreArtForms from '../components/institution/InstExploreArtForms';
import BookWorkshopsWizard from '../components/institution/BookWorkshopsWizard';
import RequestsTracker from '../components/institution/RequestsTracker';
import InstUpcomingEvents from '../components/institution/InstUpcomingEvents';
import ProductBuying from '../components/institution/ProductBuying';
import { formatINR, formatDate } from '../utils/formatters';
import '../styles/public.css';
import '../styles/portal.css';

const REQUEST_STATUS_LABELS = {
  pending: 'In Tribal Council Review',
  accepted: 'Approved & Scheduled',
  completed: 'Delivered & Audited',
  rejected: 'Rejected by Council',
  cancelled: 'Cancelled by Requester',
};

function mapRequest(raw) {
  return {
    id: raw._id,
    requestNumber: `#${String(raw._id).slice(-6).toUpperCase()}`,
    title: raw.title || `${raw.groupSize || 'Institutional'} Participant ${raw.eventType || 'Workshop'} Request`,
    tradition: raw.artFormId?.name || raw.eventType || 'Living Tradition',
    archetype: raw.eventType ? `${raw.eventType.charAt(0).toUpperCase()}${raw.eventType.slice(1)}` : 'Workshop',
    cohortCount: raw.groupSize || 0,
    format: raw.location?.isOnline ? 'Virtual Hybrid' : (raw.location?.venue || raw.location?.city || 'On-Campus'),
    budgetTotal: formatINR(raw.budget || 0),
    status: REQUEST_STATUS_LABELS[raw.status] || raw.status || 'Submitted',
    submissionDate: formatDate(raw.createdAt),
    message: raw.message || '',
  };
}

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedWizardForm, setSelectedWizardForm] = useState('Warli');
  const [requestsList, setRequestsList] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Real institution profile — no fabricated CSR/ESG figures.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await institutionService.getProfile();
        if (mounted) setProfile(res?.data || null);
      } catch (err) {
        console.info('No institution profile on file yet:', err.message);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const loadRequests = async () => {
    setRequestsLoading(true);
    setRequestsError(null);
    try {
      const res = await institutionService.getRequests();
      const liveRequests = Array.isArray(res?.data) ? res.data : [];
      setRequestsList(liveRequests.map(mapRequest));
    } catch (err) {
      setRequestsError(err.message || 'Unable to load institutional requests right now.');
      setRequestsList([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Real API is the primary source for requests — no mock fallback.
  useEffect(() => {
    loadRequests();
  }, []);

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

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      await institutionService.createOrder({
        items: cartItems.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {},
      });
      setCartItems([]);
      setIsCartOpen(false);
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
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
                  {profile?.verificationStatus && (
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[10px] font-bold capitalize">
                      {profile.verificationStatus}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-space-xs mt-1">
                  <h1 className="font-headline-sm text-2xl lg:text-3xl text-on-surface font-bold">
                    {profile?.organizationName || user?.name || 'Institution'}
                  </h1>
                </div>
                {profile?.address?.city && (
                  <p className="font-body-sm text-on-surface-variant mt-0.5">
                    {profile.address.city}{profile.address.state ? `, ${profile.address.state}` : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Real request-derived counters — no fabricated CSR/ESG figures */}
            <div className="w-full lg:w-auto grid grid-cols-2 gap-space-sm bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="px-space-md py-1 border-r border-outline-variant/30">
                <span className="font-label-caps text-[10px] text-outline uppercase font-semibold block">Submitted Requests</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-sm text-2xl text-on-surface font-bold tracking-tight">{requestsList.length}</span>
                </div>
              </div>

              <div className="px-space-md py-1">
                <span className="font-label-caps text-[10px] text-outline uppercase font-semibold block">Account Type</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-sm text-lg text-on-surface font-bold tracking-tight capitalize">{profile?.type || '—'}</span>
                </div>
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
              onInquirySubmitted={async (newInquiry) => {
                setRequestsList((prev) => [newInquiry, ...prev]);
                setActiveTab(2);
                try {
                  const budgetNumber = parseInt(String(newInquiry.budgetTotal || '').replace(/[^0-9]/g, ''), 10) || 0;
                  const res = await institutionService.createRequest({
                    title: newInquiry.title,
                    eventType: newInquiry.archetype,
                    groupSize: newInquiry.cohortCount,
                    budget: budgetNumber,
                    location: { venue: newInquiry.format },
                    message: `${newInquiry.tradition} ${newInquiry.archetype} for ${newInquiry.cohortCount} participants. Delivery format: ${newInquiry.format}.`,
                  });
                  // Reconcile the optimistic row with the persisted request once created
                  if (res?.data) {
                    setRequestsList((prev) => [mapRequest(res.data), ...prev.filter((r) => r.id !== newInquiry.id)]);
                  }
                } catch (err) {
                  console.warn('Backend request sync notice:', err.message);
                }
              }}
            />
          )}
          {activeTab === 2 && (
            requestsLoading ? (
              <p className="text-body-sm text-on-surface-variant py-12 text-center">Loading institutional requests…</p>
            ) : requestsError ? (
              <p className="text-body-sm text-error py-12 text-center">{requestsError}</p>
            ) : (
              <RequestsTracker requests={requestsList} />
            )
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
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
        checkoutError={checkoutError}
      />

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
