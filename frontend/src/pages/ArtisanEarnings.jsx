import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  PieChart,
  Loader2,
  AlertTriangle,
  IndianRupee,
} from 'lucide-react';
import artisanService from '../services/artisanService';

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export default function ArtisanEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadEarnings() {
      setLoading(true);
      setError(null);
      try {
        const res = await artisanService.getEarnings();
        if (mounted) setEarnings(res?.data || null);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load earnings.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadEarnings();
    return () => { mounted = false; };
  }, []);

  const breakdown = useMemo(() => {
    if (!earnings) return [];
    const bookingsPaid = earnings.breakdown?.bookings?.paid || 0;
    const productsPaid = earnings.breakdown?.products?.paid || 0;
    const total = bookingsPaid + productsPaid;
    if (total === 0) return [];
    return [
      { label: 'Workshops & Bookings', amount: bookingsPaid, percentage: Math.round((bookingsPaid / total) * 100) },
      { label: 'Product Sales', amount: productsPaid, percentage: Math.round((productsPaid / total) * 100) },
    ];
  }, [earnings]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '10px', color: 'var(--color-on-surface-variant)' }}>
        <Loader2 size={20} className="spin" />
        <span>Loading your earnings ledger…</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header */}
      <div>
        <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
          Earnings &amp; Transaction Ledger
        </h1>
        <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          A live view of your confirmed bookings and product sales.
        </p>
      </div>

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

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Total Earnings (Completed)
          </span>
          <div className="font-display-hero" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
            {formatINR(earnings?.completedEarnings ?? earnings?.totalEarnings)}
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Pending Earnings
          </span>
          <div className="font-display-hero" style={{ color: 'var(--color-primary)', marginTop: '4px' }}>
            {formatINR(earnings?.pendingEarnings)}
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Workshop &amp; Booking Earnings
          </span>
          <div className="font-display-hero" style={{ color: 'var(--color-secondary)', marginTop: '4px' }}>
            {formatINR(earnings?.breakdown?.bookings?.paid)}
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Product Sale Earnings
          </span>
          <div className="font-display-hero" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
            {formatINR(earnings?.breakdown?.products?.paid)}
          </div>
        </div>
      </div>

      {/* Transparency Banner */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '1rem',
          backgroundColor: 'rgba(209, 229, 212, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span
          style={{
            padding: '10px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-on-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={24} />
        </span>
        <div>
          <div className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
            Tvarita Ethical Art Protocol
          </div>
          <div className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            All figures above are aggregated live from your confirmed bookings and orders.
          </div>
        </div>
      </div>

      {/* Income Breakdown */}
      {breakdown.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="var(--color-primary)" />
            <h2 className="font-title-lg">Income Source Breakdown</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {breakdown.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{item.label}</span>
                  <span style={{ color: 'var(--color-outline)' }}>
                    {formatINR(item.amount)} ({item.percentage}%)
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--color-surface-container-high)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor: idx === 0 ? 'var(--color-primary)' : 'var(--color-secondary)',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-surface-container)' }}>
          <h2 className="font-title-lg">Recent Transactions</h2>
        </div>

        {(!earnings?.transactions || earnings.transactions.length === 0) ? (
          <div style={{ padding: '1.5rem', color: 'var(--color-on-surface-variant)' }}>
            No transactions recorded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead
                style={{
                  backgroundColor: 'var(--color-surface-container-low)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  color: 'var(--color-outline)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <tr>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Title</th>
                  <th style={{ padding: '1rem' }}>Customer</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '13px', color: 'var(--color-on-surface)' }}>
                {earnings.transactions.map((txn, index) => (
                  <tr
                    key={txn.id || index}
                    style={{ borderTop: index > 0 ? '1px solid var(--color-surface-container)' : 'none' }}
                  >
                    <td style={{ padding: '1rem' }}>
                      {txn.date ? new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                      {txn.type === 'booking' ? 'Workshop Booking' : 'Product Sale'}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                      {txn.title}
                    </td>
                    <td style={{ padding: '1rem' }}>{txn.customerName}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                      <IndianRupee size={12} style={{ marginRight: '2px', verticalAlign: 'middle' }} />
                      {Number(txn.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge-secondary" style={{ fontSize: '10px', textTransform: 'capitalize' }}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
