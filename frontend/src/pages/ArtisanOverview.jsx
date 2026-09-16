import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import artisanService from '../services/artisanService';
import {
  IndianRupee,
  Truck,
  GraduationCap,
  Users,
  PlusCircle,
  Inbox,
  Calendar,
  Wallet,
  CheckCircle2,
  Clock,
  TrendingUp,
  Radio,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import ArtworkImage from '../components/common/ArtworkImage';

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export default function ArtisanOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadArtistData() {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, requestsRes, eventsRes, productsRes, earningsRes, followersRes] =
          await Promise.allSettled([
            artisanService.getProfile(),
            artisanService.getRequests(),
            artisanService.getEvents(),
            artisanService.getProducts(),
            artisanService.getEarnings(),
            artisanService.getFollowers({ limit: 1 }),
          ]);

        if (!mounted) return;

        if (profileRes.status === 'fulfilled') setProfile(profileRes.value?.data || null);
        if (requestsRes.status === 'fulfilled') setRequests(requestsRes.value?.data || []);
        if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value?.data || []);
        if (productsRes.status === 'fulfilled') setProducts(productsRes.value?.data || []);
        if (earningsRes.status === 'fulfilled') setEarnings(earningsRes.value?.data || null);
        if (followersRes.status === 'fulfilled') {
          setFollowerCount(followersRes.value?.data?.followerCount ?? 0);
        }

        // If literally everything failed, surface an error banner.
        const allFailed = [profileRes, requestsRes, eventsRes, productsRes, earningsRes, followersRes]
          .every((r) => r.status === 'rejected');
        if (allFailed) {
          setError('Could not load your studio dashboard. Please check your connection and try again.');
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load studio dashboard.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadArtistData();
    return () => { mounted = false; };
  }, []);

  const now = useMemo(() => new Date(), []);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === 'pending'),
    [requests]
  );

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => e.status !== 'cancelled' && new Date(e.dateTime) >= now)
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
    [events, now]
  );

  const activeProducts = useMemo(
    () => products.filter((p) => p.status !== 'archived'),
    [products]
  );

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const checks = [
      Boolean(profile.displayName),
      Boolean(profile.bio && profile.bio.trim()),
      Boolean(profile.location?.city),
      Array.isArray(profile.languages) && profile.languages.length > 0,
      Number(profile.experience) > 0,
      Array.isArray(profile.media) && profile.media.length > 0,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [profile]);

  const displayName = profile?.displayName || user?.name || 'Artisan';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '10px', color: 'var(--color-on-surface-variant)' }}>
        <Loader2 size={20} className="spin" />
        <span>Loading your studio dashboard…</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-error-container, #fdecea)',
            color: 'var(--color-on-error-container, #611a15)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Welcome Hero Banner with Profile Completion */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '1.75rem',
          boxShadow: '0 4px 12px rgba(44, 42, 41, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-headline-md" style={{ color: 'var(--color-on-surface)' }}>
                Namaste, {displayName} 👋
              </span>
            </div>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
              Welcome to your digital studio. You have <strong>{pendingRequests.length} pending requests</strong> and <strong>{upcomingEvents.length} scheduled workshops</strong> coming up.
            </p>
          </div>

          {/* Profile Completion Meter */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '1rem',
              backgroundColor: 'var(--color-surface-container-low)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minWidth: '220px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                Profile Completion
              </span>
              <span className="font-label-md" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
                {profileCompletion}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-surface-container-highest)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${profileCompletion}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-secondary)',
                  borderRadius: '9999px',
                }}
              />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>
              {profile?.verificationStatus === 'approved' ? 'Verified Artisan Profile' : 'Verification Pending'}
            </span>
          </div>
        </div>

        {/* Quick-Action Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-surface-container)',
          }}
        >
          <span className="font-label-caps" style={{ color: 'var(--color-outline)', marginRight: '4px' }}>
            Quick Actions:
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/dashboard/artisan/products?tab=add')}
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            <PlusCircle size={16} />
            <span>Add Product</span>
          </button>
          <button
            type="button"
            className="btn-surface"
            onClick={() => navigate('/dashboard/artisan/requests')}
          >
            <Inbox size={16} />
            <span>View Requests ({pendingRequests.length})</span>
          </button>
          <button
            type="button"
            className="btn-surface"
            onClick={() => navigate('/dashboard/artisan/events')}
          >
            <Calendar size={16} />
            <span>View Events ({upcomingEvents.length})</span>
          </button>
          <button
            type="button"
            className="btn-surface"
            onClick={() => navigate('/dashboard/artisan/earnings')}
          >
            <Wallet size={16} />
            <span>View Earnings ({formatINR(earnings?.totalEarnings)})</span>
          </button>
        </div>
      </div>

      {/* VITAL METRICS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          width: '100%',
        }}
      >
        {/* Card 1: Direct Earnings */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--color-surface-container-lowest)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                Total Earnings
              </span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IndianRupee size={22} />
              </div>
            </div>
            <div className="font-display-hero" style={{ color: 'var(--color-on-surface)' }}>
              {formatINR(earnings?.totalEarnings)}
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <CheckCircle2 size={16} /> {formatINR(earnings?.pendingEarnings)} pending
            </p>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/dashboard/artisan/earnings')}
              style={{ width: '100%' }}
            >
              <Wallet size={16} />
              <span>View Earnings Ledger</span>
            </button>
          </div>
        </div>

        {/* Card 2: Products in Catalog */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--color-surface-container-lowest)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                Products in Catalog
              </span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-fixed)',
                  color: 'var(--color-on-primary-fixed-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={22} />
              </div>
            </div>
            <div className="font-display-hero" style={{ color: 'var(--color-on-surface)' }}>
              {activeProducts.length} <span className="font-title-md" style={{ fontWeight: 400, color: 'var(--color-on-surface-variant)' }}>Listings</span>
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <Clock size={16} /> {products.length - activeProducts.length} archived
            </p>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn-surface"
              onClick={() => navigate('/dashboard/artisan/products?tab=manage')}
              style={{ width: '100%' }}
            >
              Manage Catalog
            </button>
          </div>
        </div>

        {/* Card 3: Upcoming Events */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--color-surface-container-lowest)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                Upcoming Events
              </span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-tertiary-fixed)',
                  color: 'var(--color-on-tertiary-fixed-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GraduationCap size={22} />
              </div>
            </div>
            <div className="font-display-hero" style={{ color: 'var(--color-on-surface)' }}>
              {upcomingEvents.length} <span className="font-title-md" style={{ fontWeight: 400, color: 'var(--color-on-surface-variant)' }}>Scheduled</span>
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
              {upcomingEvents[0]?.title || 'No upcoming events yet'}
            </p>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn-surface"
              onClick={() => navigate('/dashboard/artisan/events')}
              style={{ width: '100%' }}
            >
              View Calendar
            </button>
          </div>
        </div>

        {/* Card 4: Followers */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--color-surface-container-lowest)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                Collectors &amp; Followers
              </span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-secondary-fixed)',
                  color: 'var(--color-on-secondary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={22} />
              </div>
            </div>
            <div className="font-display-hero" style={{ color: 'var(--color-on-surface)' }}>
              {followerCount.toLocaleString()}
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <TrendingUp size={16} /> Growing patron network
            </p>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn-surface"
              onClick={() => navigate('/dashboard/artisan/followers')}
              style={{ width: '100%' }}
            >
              <Radio size={16} />
              <span>View Followers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Activity Feeds: Recent Requests & Upcoming Events */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Recent Requests Preview */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="font-headline-sm" style={{ fontSize: '18px' }}>Recent Requests</h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard/artisan/requests')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {requests.length === 0 ? (
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                No requests yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {requests.slice(0, 2).map((req) => (
                  <div
                    key={req._id}
                    style={{
                      padding: '12px',
                      borderRadius: '0.75rem',
                      backgroundColor: 'var(--color-surface-container-low)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                          {req.requesterId?.name || 'Unknown Requester'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                          {req.title || req.eventType} • <span style={{ fontWeight: 700 }}>{formatINR(req.budget)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="badge-secondary" style={{ fontSize: '10px', textTransform: 'capitalize' }}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-surface"
            onClick={() => navigate('/dashboard/artisan/requests')}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Review All Requests
          </button>
        </div>

        {/* Upcoming Events Preview */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="font-headline-sm" style={{ fontSize: '18px' }}>Upcoming Workshops &amp; Events</h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard/artisan/events')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Calendar <ArrowRight size={14} />
              </button>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                No upcoming events scheduled.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingEvents.slice(0, 2).map((evt) => (
                  <div
                    key={evt._id}
                    style={{
                      padding: '12px',
                      borderRadius: '0.75rem',
                      backgroundColor: 'var(--color-surface-container-low)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                        {evt.title}
                      </span>
                      <span className="badge-primary" style={{ fontSize: '10px', textTransform: 'capitalize' }}>
                        {evt.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                      {new Date(evt.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {evt.location?.city || 'Location TBD'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-surface"
            onClick={() => navigate('/dashboard/artisan/events')}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Open Studio Calendar
          </button>
        </div>
      </div>

      {/* Recent Products in Stock */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="font-headline-sm">Recent Studio Catalog</h2>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Your latest listed artworks ready for collectors.
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/dashboard/artisan/products?tab=add')}
          >
            <PlusCircle size={16} />
            <span>Add New Painting</span>
          </button>
        </div>

        {activeProducts.length === 0 ? (
          <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            You haven't listed any products yet.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {activeProducts.slice(0, 3).map((prod) => (
              <div
                key={prod._id}
                style={{
                  borderRadius: '1rem',
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: '180px' }}>
                  <ArtworkImage src={prod.images?.[0]?.url || prod.media?.[0]?.url} alt={prod.title} style={{ width: '100%', height: '100%' }} />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(251, 249, 243, 0.92)',
                      backdropFilter: 'blur(4px)',
                      fontSize: '10px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-on-surface)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    {prod.stock > 0 ? 'IN STOCK' : 'SOLD OUT'}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-secondary)',
                      color: 'var(--color-on-secondary)',
                      fontSize: '13px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {formatINR(prod.price)}
                  </span>
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span className="font-label-caps" style={{ color: 'var(--color-outline)', fontSize: '10px' }}>
                    {prod.category}
                  </span>
                  <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                    {prod.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> {prod.moderationStatus === 'approved' ? 'Approved' : prod.moderationStatus}
                    </span>
                    <button
                      type="button"
                      className="btn-surface"
                      onClick={() => navigate('/dashboard/artisan/products?tab=manage')}
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
