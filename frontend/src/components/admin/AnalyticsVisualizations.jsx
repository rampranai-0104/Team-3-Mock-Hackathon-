import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import adminService from '../../services/adminService';

const PALETTE = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-tertiary)', 'var(--color-primary-container)', 'var(--color-secondary-container)'];

function Card({ children, span }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        gridColumn: span ? `span ${span}` : undefined,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ label, title }) {
  return (
    <div>
      <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>{label}</span>
      <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>{title}</h3>
    </div>
  );
}

function DistributionRow({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-on-surface)', textTransform: 'capitalize' }}>{label}</span>
        <span style={{ fontFamily: 'monospace', color: 'var(--color-tertiary)' }}>{count} ({pct}%)</span>
      </div>
      <div style={{ width: '100%', backgroundColor: 'var(--color-surface-container-low)', height: '10px', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: color, height: '100%', borderRadius: '9999px', width: `${pct}%`, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function AnalyticsVisualizations() {
  const [overview, setOverview] = useState(null);
  const [artistAnalytics, setArtistAnalytics] = useState(null);
  const [artFormAnalytics, setArtFormAnalytics] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      const [ovRes, artRes, afRes, engRes, revRes] = await Promise.allSettled([
        adminService.getAnalyticsOverview(),
        adminService.getArtistAnalytics(),
        adminService.getArtFormAnalytics(),
        adminService.getEngagementAnalytics(),
        adminService.getRevenueAnalytics(),
      ]);
      if (!mounted) return;

      if (ovRes.status === 'fulfilled') setOverview(ovRes.value?.data || ovRes.value);
      if (artRes.status === 'fulfilled') setArtistAnalytics(artRes.value?.data || artRes.value);
      if (afRes.status === 'fulfilled') setArtFormAnalytics(afRes.value?.data || afRes.value);
      if (engRes.status === 'fulfilled') setEngagement(engRes.value?.data || engRes.value);
      if (revRes.status === 'fulfilled') setRevenue(revRes.value?.data || revRes.value);

      const failures = [ovRes, artRes, afRes, engRes, revRes].filter((r) => r.status === 'rejected');
      if (failures.length > 0) {
        setError('Some analytics data could not be loaded.');
      }
      setLoading(false);
    }
    fetchAll();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', padding: '3rem', justifyContent: 'center' }}>
        <Loader2 size={20} className="animate-spin" />
        Loading platform analytics...
      </div>
    );
  }

  const usersByRole = overview?.usersByRole || {};
  const totalUsers = Object.values(usersByRole).reduce((a, b) => a + b, 0);

  const artistsByStatus = overview?.artistsByStatus || {};
  const totalArtistsOverview = Object.values(artistsByStatus).reduce((a, b) => a + b, 0);

  const financials = overview?.financials || { bookingRevenue: 0, productRevenue: 0, totalRevenue: 0 };

  const artForms = artFormAnalytics?.artForms || [];
  const maxArtistCount = Math.max(1, ...artForms.map((f) => f.artistCount || 0));

  const topEarners = artistAnalytics?.topEarners || [];

  const requestsByStatus = engagement?.requestsByStatus || {};
  const totalRequests = Object.values(requestsByStatus).reduce((a, b) => a + b, 0);

  const eventsByType = engagement?.eventsByType || {};
  const totalEventsByType = Object.values(eventsByType).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-primary-container)',
            color: 'var(--color-on-primary-container)',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      {/* Row 1: Users by Role & Revenue Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <CardHeader label="Platform Composition" title="Users by Role" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.keys(usersByRole).length === 0 ? (
              <span style={{ color: 'var(--color-outline)', fontSize: '13px' }}>No user data available.</span>
            ) : (
              Object.entries(usersByRole).map(([role, count], idx) => (
                <DistributionRow key={role} label={role} count={count} total={totalUsers} color={PALETTE[idx % PALETTE.length]} />
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader label="Artist Verification" title="Artists by Status" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.keys(artistsByStatus).length === 0 ? (
              <span style={{ color: 'var(--color-outline)', fontSize: '13px' }}>No artist data available.</span>
            ) : (
              Object.entries(artistsByStatus).map(([status, count], idx) => (
                <DistributionRow key={status} label={status} count={count} total={totalArtistsOverview} color={PALETTE[idx % PALETTE.length]} />
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Row 2: Financials & Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <CardHeader label="Confirmed / Paid Revenue" title="Financial Overview" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <StatRow label="Booking Revenue" value={financials.bookingRevenue} />
            <StatRow label="Product Revenue" value={financials.productRevenue} />
            <StatRow label="Total Revenue" value={financials.totalRevenue} emphasize />
          </div>
        </Card>

        <Card>
          <CardHeader label="Paid vs. Pending" title="Revenue Breakdown" />
          {revenue ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <StatRow label="Total Revenue (Paid)" value={revenue.totalRevenue} emphasize />
              <StatRow label="Pending Revenue" value={revenue.pendingRevenue} />
              <StatRow label="Bookings — Paid" value={revenue.breakdown?.bookings?.paid} />
              <StatRow label="Bookings — Pending" value={revenue.breakdown?.bookings?.pending} />
              <StatRow label="Products — Paid" value={revenue.breakdown?.products?.paid} />
              <StatRow label="Products — Pending" value={revenue.breakdown?.products?.pending} />
            </div>
          ) : (
            <span style={{ color: 'var(--color-outline)', fontSize: '13px' }}>Revenue data unavailable.</span>
          )}
        </Card>
      </div>

      {/* Row 3: Art Form Distribution */}
      <Card>
        <CardHeader label="Cultural Taxonomy" title="Art Form Distribution (Artists & Products)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '4px' }}>
          {artForms.length === 0 ? (
            <span style={{ color: 'var(--color-outline)', fontSize: '13px' }}>No art form data available.</span>
          ) : (
            artForms.map((af, idx) => (
              <div key={af.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{af.name}</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--color-tertiary)' }}>
                    {af.artistCount} artists • {af.productCount} products
                  </span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'var(--color-surface-container-low)', height: '12px', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      backgroundColor: PALETTE[idx % PALETTE.length],
                      height: '100%',
                      borderRadius: '9999px',
                      width: `${Math.round(((af.artistCount || 0) / maxArtistCount) * 100)}%`,
                      transition: 'width 1s ease',
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Row 4: Top Earning Artists & Engagement */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <CardHeader label="Booking Performance" title="Top Earning Artists" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topEarners.length === 0 ? (
              <span style={{ color: 'var(--color-outline)', fontSize: '13px' }}>No booking earnings recorded yet.</span>
            ) : (
              topEarners.map((artist) => (
                <div key={artist.artistId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-on-surface)' }}>{artist.displayName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-outline)' }}>{artist.bookingsCount} bookings</div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{artist.totalEarned?.toLocaleString?.() ?? artist.totalEarned}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader label="Community Activity" title="Engagement Snapshot" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <StatRow label="Total Follows" value={engagement?.totalFollows} emphasize />
            {Object.keys(requestsByStatus).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Requests by Status</span>
                {Object.entries(requestsByStatus).map(([status, count], idx) => (
                  <DistributionRow key={status} label={status} count={count} total={totalRequests} color={PALETTE[idx % PALETTE.length]} />
                ))}
              </div>
            )}
            {Object.keys(eventsByType).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Events by Type</span>
                {Object.entries(eventsByType).map(([type, count], idx) => (
                  <DistributionRow key={type} label={type} count={count} total={totalEventsByType} color={PALETTE[idx % PALETTE.length]} />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatRow({ label, value, emphasize }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)' }}>
      <span style={{ fontSize: '13px', fontWeight: emphasize ? 700 : 500, color: 'var(--color-on-surface)' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: emphasize ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}>
        {value !== undefined && value !== null ? value.toLocaleString?.() ?? value : '—'}
      </span>
    </div>
  );
}
