import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import publicService from '../services/publicService';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';
import ExploreArtForms from '../components/public/ExploreArtForms';
import ExploreArtists from '../components/public/ExploreArtists';
import UpcomingEvents from '../components/public/UpcomingEvents';
import MyActivity from '../components/public/MyActivity';
import Marketplace from '../components/public/Marketplace';
import { formatINR, formatDate, formatTime } from '../utils/formatters';
import '../styles/public.css';
import '../styles/portal.css';

function mapArtist(raw) {
  const region = [raw.location?.city, raw.location?.state].filter(Boolean).join(', ') || 'India';
  return {
    id: raw._id,
    name: raw.displayName,
    tradition: raw.artFormIds?.[0]?.name || 'Traditional Art',
    region,
    experience: `${raw.experience || 0} Years Mastery`,
    clan: raw.languages?.length ? raw.languages.join(', ') : 'Guild Member',
    avatar: raw.profileImage || '',
    bio: raw.bio || 'A hereditary custodian preserving ancestral techniques for the next generation.',
    status: raw.availability?.isAvailable === false ? 'Currently Unavailable' : 'Available for Commissions',
  };
}

function mapEvent(raw) {
  const location = raw.location?.venue || raw.location?.city || (raw.location?.isOnline ? 'Online Session' : 'Venue TBA');
  return {
    id: raw._id,
    title: raw.title,
    tradition: raw.artFormIds?.[0]?.name || 'Traditional Art',
    instructor: raw.artistIds?.[0]?.displayName || 'Master Artisan',
    instructorRole: 'Lead Practitioner',
    location,
    date: formatDate(raw.date),
    time: raw.time || formatTime(raw.date),
    passId: `EVT-${String(raw._id).slice(-4).toUpperCase()}`,
    price: formatINR(raw.price),
    confirmed: false,
    description: raw.description || '',
    image: raw.image?.url || raw.media?.[0]?.url || '',
    availableSeats: raw.availableSeats,
  };
}

// Order status label — the Order model only tracks a single `status` enum
// (created/paid/processing/shipped/delivered/cancelled/refunded); there is no
// multi-stage provenance/NFC tracking in the backend, so we surface the real
// status as-is rather than fabricating a tracking timeline.
function orderStatusLabel(status) {
  const labels = {
    created: 'Order Placed',
    paid: 'Payment Confirmed',
    processing: 'Being Prepared',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return labels[status] || status || 'Order Placed';
}

function mapOrder(raw) {
  return {
    id: raw._id,
    orderNumber: raw.orderNumber,
    items: (raw.items || []).map((item) => ({
      title: item.title || item.name || 'Handcrafted Artwork',
      quantity: item.quantity,
      price: item.price,
      image: item.image || '',
    })),
    subtotal: formatINR(raw.subtotal),
    shipping: formatINR(raw.shipping),
    amount: formatINR(raw.total),
    status: orderStatusLabel(raw.status),
    orderDate: formatDate(raw.createdAt),
    image: raw.items?.[0]?.image || '',
  };
}

export default function PatronDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Artists (Explore Artists tab + My Activity followed list)
  const [artists, setArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [artistsError, setArtistsError] = useState(null);
  const [followedArtistIds, setFollowedArtistIds] = useState([]);

  // Events / Workshops
  const [workshops, setWorkshops] = useState([]);
  const [workshopsLoading, setWorkshopsLoading] = useState(true);
  const [workshopsError, setWorkshopsError] = useState(null);

  // Bookings & Orders (My Activity tab)
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // Cart
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Load artists
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setArtistsLoading(true);
        setArtistsError(null);
        const res = await publicService.getArtists();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setArtists(list.map(mapArtist));
      } catch (err) {
        if (mounted) setArtistsError(err.message || 'Unable to load master artisans right now.');
      } finally {
        if (mounted) setArtistsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load followed artist ids
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await publicService.getFollowedArtists();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setFollowedArtistIds(list.map((a) => a._id));
      } catch (err) {
        console.info('Unable to load followed artists:', err.message);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load upcoming events/workshops
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setWorkshopsLoading(true);
        setWorkshopsError(null);
        const res = await publicService.getEvents();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setWorkshops(list.map(mapEvent));
      } catch (err) {
        if (mounted) setWorkshopsError(err.message || 'Unable to load upcoming workshops right now.');
      } finally {
        if (mounted) setWorkshopsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load bookings & orders from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      setActivityLoading(true);
      try {
        const res = await publicService.getMyBookings();
        const liveBookings = Array.isArray(res?.data) ? res.data : [];
        if (mounted) {
          setBookings(liveBookings.map((b) => ({
            id: b._id,
            passId: b.bookingCode,
            title: b.eventId?.title || 'Guild Workshop',
            date: formatDate(b.eventId?.date),
            time: b.eventId?.time || formatTime(b.eventId?.date),
            location: b.eventId?.location?.venue || b.eventId?.location?.city || 'Venue TBA',
            status: b.status,
            seats: b.quantity,
            amount: formatINR(b.amount),
          })));
        }
      } catch (err) {
        console.info('Using empty bookings list:', err.message);
      }

      try {
        const res = await publicService.getMyOrders();
        const liveOrders = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setOrders(liveOrders.map(mapOrder));
      } catch (err) {
        console.info('Using empty orders list:', err.message);
      } finally {
        if (mounted) setActivityLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleToggleFollow = async (artistId) => {
    const isCurrentlyFollowed = followedArtistIds.includes(artistId);
    setFollowedArtistIds((prev) =>
      isCurrentlyFollowed
        ? prev.filter((id) => id !== artistId)
        : [...prev, artistId]
    );

    try {
      if (isCurrentlyFollowed) {
        await publicService.unfollowArtist(artistId);
      } else {
        await publicService.followArtist(artistId);
      }
    } catch (err) {
      // Revert optimistic update on failure
      setFollowedArtistIds((prev) =>
        isCurrentlyFollowed
          ? [...prev, artistId]
          : prev.filter((id) => id !== artistId)
      );
      console.warn('Follow toggle failed:', err.message);
    }
  };

  // Workshop booking handler — books the real Event via POST /bookings
  const handleBookWorkshop = async (bookingData) => {
    const quantity = bookingData.ticketCount || bookingData.seats || 1;

    try {
      const res = await publicService.bookWorkshop({
        eventId: bookingData.id,
        quantity,
        notes: bookingData.notes || '',
      });
      const booking = res?.data;
      setBookings((prev) => [{
        id: booking?._id || `bk_${Date.now()}`,
        passId: booking?.bookingCode || bookingData.passId,
        title: bookingData.workshopTitle || bookingData.title,
        date: bookingData.date || bookingData.dateWindow || '',
        time: bookingData.time || '',
        location: bookingData.location || 'Venue TBA',
        status: booking?.status || 'confirmed',
        seats: booking?.quantity || quantity,
        amount: formatINR(booking?.amount),
      }, ...prev]);
    } catch (err) {
      console.warn('Backend booking sync notice:', err.message);
    }
  };

  // Cart operations (local UI state — only checkout hits the API)
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
          tradition: product.tradition,
          price: product.priceNumber ?? (typeof product.price === 'number' ? product.price : 0),
          image: product.image,
          quantity: 1,
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

  // Checkout — the one cart action that hits the real API
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await publicService.createOrder({
        items: cartItems.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {},
      });
      if (res?.data) setOrders((prev) => [mapOrder(res.data), ...prev]);
      setCartItems([]);
      setIsCartOpen(false);
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const currentFollowedArtists = artists.filter((a) =>
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
          <div className="absolute -top-10 -right-10 w-56 h-56 opacity-5 pointer-events-none hidden md:flex items-center justify-center">
            <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 200 200">
              <circle cx="100" cy="100" fill="none" r="80" stroke="currentColor" strokeDasharray="4 6" strokeWidth="2" />
              <circle cx="100" cy="100" fill="none" r="55" stroke="currentColor" strokeWidth="1.5" />
              <path d="M100 20 L100 180 M20 100 L180 100 M43 43 L157 157 M43 157 L157 43" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
            <div className="max-w-2xl">
              <h1 className="font-headline-lg text-3xl lg:text-4xl text-on-surface font-bold mb-space-xs">
                Namaste, {user?.name || 'Patron'}
              </h1>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Welcome to your Cultural Sanctuary. Explore living art traditions, follow master artisans, and book workshops directly.
              </p>
            </div>

            {/* Account Activity Capsule — real counts only, no fabricated tier/royalty figures */}
            <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container shadow-sm self-start lg:self-auto border border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-2xl text-on-surface font-bold leading-none">
                    {bookings.length}
                  </span>
                  <span className="font-label-md text-xs text-on-surface-variant mt-0.5">
                    Confirmed Bookings
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
        </section>

        {/* Tab Content Display */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/30 shadow-sm">
          {activeTab === 0 && (
            <ExploreArtForms onNavigateToWorkshops={() => setActiveTab(2)} />
          )}
          {activeTab === 1 && (
            artistsLoading ? (
              <p className="text-body-sm text-on-surface-variant py-12 text-center">Loading master artisans…</p>
            ) : artistsError ? (
              <p className="text-body-sm text-error py-12 text-center">{artistsError}</p>
            ) : (
              <ExploreArtists
                artists={artists}
                followedArtistIds={followedArtistIds}
                onToggleFollow={handleToggleFollow}
              />
            )
          )}
          {activeTab === 2 && (
            workshopsLoading ? (
              <p className="text-body-sm text-on-surface-variant py-12 text-center">Loading upcoming workshops…</p>
            ) : workshopsError ? (
              <p className="text-body-sm text-error py-12 text-center">{workshopsError}</p>
            ) : (
              <UpcomingEvents
                workshops={workshops}
                onBookWorkshop={handleBookWorkshop}
              />
            )
          )}
          {activeTab === 3 && (
            activityLoading ? (
              <p className="text-body-sm text-on-surface-variant py-12 text-center">Loading your activity…</p>
            ) : (
              <MyActivity
                followedArtists={currentFollowedArtists}
                onUnfollowArtist={handleToggleFollow}
                bookings={bookings}
                orders={orders}
              />
            )
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
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
        checkoutError={checkoutError}
      />

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
