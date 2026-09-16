import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import {
  ARTIST_PROFILE,
  OVERVIEW_METRICS,
  INDIVIDUAL_REQUESTS,
  UPCOMING_EVENTS,
  PRODUCTS_CATALOG,
} from '../data/artisanMockData';
import ArtworkImage from '../components/common/ArtworkImage';

export default function ArtisanOverview() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
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
                Namaste, {ARTIST_PROFILE.name.split(' ')[1]} 👋
              </span>
            </div>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
              Welcome to your digital studio. You have <strong>{OVERVIEW_METRICS.requestsCount} pending requests</strong> and <strong>{OVERVIEW_METRICS.upcomingEventsCount} scheduled workshops</strong> this month.
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
                {OVERVIEW_METRICS.profileCompletion}%
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
                  width: `${OVERVIEW_METRICS.profileCompletion}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-secondary)',
                  borderRadius: '9999px',
                }}
              />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>
              GI Tag &amp; Bank Account Linked
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
            <span>View Requests ({OVERVIEW_METRICS.requestsCount})</span>
          </button>
          <button
            type="button"
            className="btn-surface"
            onClick={() => navigate('/dashboard/artisan/events')}
          >
            <Calendar size={16} />
            <span>View Events ({OVERVIEW_METRICS.upcomingEventsCount})</span>
          </button>
          <button
            type="button"
            className="btn-surface"
            onClick={() => navigate('/dashboard/artisan/earnings')}
          >
            <Wallet size={16} />
            <span>View Earnings ({OVERVIEW_METRICS.totalEarnings})</span>
          </button>
        </div>
      </div>

      {/* VITAL METRICS: 4 Large High-Contrast Tactile Cards from artist.html */}
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
                Direct Earnings / जमा रक्कम
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
              {OVERVIEW_METRICS.totalEarnings}
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <CheckCircle2 size={16} /> {OVERVIEW_METRICS.retainedPercent}
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
              <span>बँक खात्यात पाठवा (Withdraw to Bank)</span>
            </button>
          </div>
        </div>

        {/* Card 2: Active Orders */}
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
                Active Orders / पाठवायचे काम
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
              08 <span className="font-title-md" style={{ fontWeight: 400, color: 'var(--color-on-surface-variant)' }}>Paintings</span>
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <Clock size={16} /> {OVERVIEW_METRICS.scheduledCouriers}
            </p>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn-surface"
              onClick={() => navigate('/dashboard/artisan/products?tab=manage')}
              style={{ width: '100%' }}
            >
              View Packing Slips
            </button>
          </div>
        </div>

        {/* Card 3: Workshop Invites */}
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
                Workshop Invites / कार्यशाळा
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
              03 <span className="font-title-md" style={{ fontWeight: 400, color: 'var(--color-on-surface-variant)' }}>Invites</span>
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
              NGMA Delhi &amp; IIT Bombay Art Guild
            </p>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn-surface"
              onClick={() => navigate('/dashboard/artisan/requests?tab=institutions')}
              style={{ width: '100%' }}
            >
              Review 3 Invitations
            </button>
          </div>
        </div>

        {/* Card 4: Collectors & Followers */}
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
                Collectors &amp; Lovers / चाहते
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
              {OVERVIEW_METRICS.followersCount.toLocaleString()}
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <TrendingUp size={16} /> {OVERVIEW_METRICS.recentFollowersAdded}
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
              <span>Send Voice Update</span>
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
              <h2 className="font-headline-sm" style={{ fontSize: '18px' }}>Recent Collector Inquiries</h2>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {INDIVIDUAL_REQUESTS.slice(0, 2).map((req) => (
                <div
                  key={req.id}
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
                    <img
                      src={req.avatar}
                      alt={req.requesterName}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                        {req.requesterName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                        {req.requestType} • <span style={{ fontWeight: 700 }}>{req.proposedAmount}</span>
                      </div>
                    </div>
                  </div>
                  <span className="badge-secondary" style={{ fontSize: '10px' }}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
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
              <h2 className="font-headline-sm" style={{ fontSize: '18px' }}>Upcoming Workshops &amp; Expos</h2>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {UPCOMING_EVENTS.slice(0, 2).map((evt) => (
                <div
                  key={evt.id}
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
                    <span className="badge-primary" style={{ fontSize: '10px' }}>
                      {evt.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                    {evt.date} • {evt.location}
                  </div>
                </div>
              ))}
            </div>
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
            <h2 className="font-headline-sm">Paintings in Studio Catalog</h2>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Natural rice flour and geru earth canvases ready for collectors.
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {PRODUCTS_CATALOG.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
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
                <ArtworkImage src={prod.image} alt={prod.title} style={{ width: '100%', height: '100%' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(251, 249, 243, 0.95)',
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {prod.stockStatus}
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
                  {prod.price}
                </span>
              </div>
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)', fontSize: '10px' }}>
                  {prod.medium} • {prod.dimensions}
                </span>
                <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                  {prod.title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> GI Certified
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
      </div>
    </div>
  );
}
