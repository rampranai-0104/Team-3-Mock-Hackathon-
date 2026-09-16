import React, { useState, useEffect, useCallback } from 'react';
import AnalyticsVisualizations from '../../components/admin/AnalyticsVisualizations';
import adminService from '../../services/adminService';
import { BarChart3, Users, Calendar, ShoppingBag, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * AdminAnalyticsPage - Analytics Module
 * Wired to real backend analytics endpoints (backend/src/services/analyticsService.js):
 * - Macro tab reuses <AnalyticsVisualizations /> (overview + artists + art forms + engagement + revenue)
 * - Artists tab uses getArtistAnalytics() -> { totalArtists, statusBreakdown, topEarners }
 * - Events tab uses getEngagementAnalytics() -> { totalFollows, requestsByStatus, eventsByType }
 * - Revenue tab uses getRevenueAnalytics() -> { totalRevenue, pendingRevenue, breakdown }
 */
export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('macro'); // 'macro' | 'artists' | 'events' | 'revenue'
  const [artistData, setArtistData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const fetchTabData = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'artists' && !artistData) {
        const res = await adminService.getArtistAnalytics();
        setArtistData(res?.data || res);
      } else if (tab === 'events' && !engagementData) {
        const res = await adminService.getEngagementAnalytics();
        setEngagementData(res?.data || res);
      } else if (tab === 'revenue' && !revenueData) {
        const res = await adminService.getRevenueAnalytics();
        setRevenueData(res?.data || res);
      }
    } catch (err) {
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistData, engagementData, revenueData]);

  useEffect(() => {
    if (activeTab !== 'macro') {
      fetchTabData(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleRefresh = () => {
    setArtistData(null);
    setEngagementData(null);
    setRevenueData(null);
    if (activeTab !== 'macro') fetchTabData(activeTab);
    showNotice('Analytics refreshed.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Analytics & Platform Impact
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Live platform metrics sourced directly from the database
          </p>
        </div>

        <button
          type="button"
          className="btn-surface"
          onClick={handleRefresh}
          style={{ padding: '8px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {notice && (
        <div style={{ padding: '12px 16px', borderRadius: '0.75rem', backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '0.75rem', backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Tab Selector */}
      <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '9999px', padding: '4px', gap: '4px', overflowX: 'auto' }}>
        <TabButton active={activeTab === 'macro'} onClick={() => setActiveTab('macro')} icon={<BarChart3 size={16} />} label="Platform Overview" />
        <TabButton active={activeTab === 'artists'} onClick={() => setActiveTab('artists')} icon={<Users size={16} />} label="Artist Growth" />
        <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={16} />} label="Engagement" />
        <TabButton active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')} icon={<ShoppingBag size={16} />} label="Revenue" />
      </div>

      {activeTab === 'macro' && <AnalyticsVisualizations />}

      {activeTab === 'artists' && (
        loading ? <LoadingRow /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={cardStyle}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Total Artists</span>
              <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
                {artistData?.totalArtists ?? '—'}
              </h3>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(artistData?.statusBreakdown || {}).map(([status, count]) => (
                  <StatBar key={status} label={status} value={count} total={artistData?.totalArtists || 1} />
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Top Earning Artists (from confirmed/completed bookings)</span>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(artistData?.topEarners || []).length === 0 ? (
                  <span style={{ color: 'var(--color-outline)', fontSize: '13px' }}>No booking earnings recorded yet.</span>
                ) : (
                  artistData.topEarners.map((a) => (
                    <div key={a.artistId} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{a.displayName}</span>
                      <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 700 }}>{a.totalEarned?.toLocaleString?.() ?? a.totalEarned}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )
      )}

      {activeTab === 'events' && (
        loading ? <LoadingRow /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={cardStyle}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Follows</span>
              <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
                {engagementData?.totalFollows ?? '—'} Total Follows
              </h3>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Requests by Status</span>
                {Object.entries(engagementData?.requestsByStatus || {}).map(([status, count]) => (
                  <div key={status} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>{status}</span>
                    <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 700 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Events by Type</span>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(engagementData?.eventsByType || {}).map(([type, count]) => (
                  <div key={type} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>{type}</span>
                    <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 700 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {activeTab === 'revenue' && (
        loading ? <LoadingRow /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={cardStyle}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Confirmed Revenue</span>
              <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
                {revenueData?.totalRevenue?.toLocaleString?.() ?? revenueData?.totalRevenue ?? '—'}
              </h3>
              <div style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '4px' }}>
                Pending: {revenueData?.pendingRevenue?.toLocaleString?.() ?? revenueData?.pendingRevenue ?? '—'}
              </div>
            </div>

            <div style={cardStyle}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Bookings vs. Products</span>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px' }}>Booking Revenue (Paid)</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>{revenueData?.breakdown?.bookings?.paid?.toLocaleString?.() ?? 0}</span>
                </div>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px' }}>Booking Revenue (Pending)</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-tertiary)' }}>{revenueData?.breakdown?.bookings?.pending?.toLocaleString?.() ?? 0}</span>
                </div>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px' }}>Product Revenue (Paid)</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-secondary)' }}>{revenueData?.breakdown?.products?.paid?.toLocaleString?.() ?? 0}</span>
                </div>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px' }}>Product Revenue (Pending)</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-tertiary)' }}>{revenueData?.breakdown?.products?.pending?.toLocaleString?.() ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'var(--color-surface-container-lowest)',
  padding: '1.75rem',
  borderRadius: '1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

function LoadingRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', padding: '2rem' }}>
      <Loader2 size={18} className="animate-spin" /> Loading analytics...
    </div>
  );
}

function StatBar({ label, value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-on-surface)', textTransform: 'capitalize' }}>{label}</span>
        <span style={{ color: 'var(--color-outline)' }}>{value} ({pct}%)</span>
      </div>
      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '9999px' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '9999px' }} />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px', borderRadius: '9999px', border: 'none', fontSize: '13px',
        fontWeight: active ? 700 : 500,
        backgroundColor: active ? 'var(--color-primary)' : 'transparent',
        color: active ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'all 0.2s',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
