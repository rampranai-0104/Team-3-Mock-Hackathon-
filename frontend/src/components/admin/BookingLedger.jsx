import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle2, RefreshCw, Loader2, XCircle } from 'lucide-react';
import adminService from '../../services/adminService';

const STATUS_LABEL = {
  pending: 'Pending',
  pending_payment: 'Pending Payment',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
  refunded: 'Refunded',
};

const STATUS_COLOR = {
  pending: { bg: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' },
  pending_payment: { bg: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' },
  confirmed: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  completed: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  cancelled: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
  no_show: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
  refunded: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
};

export default function BookingLedger() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getBookings();
      const data = res?.data || res;
      setBookings(Array.isArray(data?.bookings) ? data.bookings : []);
    } catch (err) {
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (id, status) => {
    setActionId(id);
    try {
      const res = await adminService.updateBooking(id, status);
      const updated = res?.data || res;
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, ...updated } : b)));
    } catch (err) {
      setError(err.message || 'Failed to update booking.');
    } finally {
      setActionId(null);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending' || b.status === 'pending_payment').length;
  const confirmedTotal = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const completedTotal = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Summary Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        <SummaryTile icon={<Clock size={20} />} label="Awaiting Confirmation/Payment" value={pendingCount} />
        <SummaryTile icon={<CheckCircle2 size={20} />} label="Confirmed Booking Value" value={confirmedTotal.toLocaleString()} />
        <SummaryTile icon={<CheckCircle2 size={20} />} label="Completed Booking Value" value={completedTotal.toLocaleString()} />
      </div>

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

      {/* Main Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-headline-sm" style={{ fontSize: '18px' }}>
            Bookings Ledger
          </h3>
          <button
            type="button"
            className="btn-surface"
            onClick={fetchBookings}
            style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                color: 'var(--color-on-surface-variant)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <tr>
                <th style={{ padding: '1rem 1.5rem' }}>Booking</th>
                <th style={{ padding: '1rem 1.5rem' }}>Customer</th>
                <th style={{ padding: '1rem 1.5rem' }}>Event</th>
                <th style={{ padding: '1rem 1.5rem' }}>Artist</th>
                <th style={{ padding: '1rem 1.5rem' }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Status / Action</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px', color: 'var(--color-on-surface)' }}>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-outline)' }}>
                    <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-outline)' }}>
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((item, idx) => {
                  const statusStyle = STATUS_COLOR[item.status] || STATUS_COLOR.pending;
                  const isBusy = actionId === item._id;
                  return (
                    <tr
                      key={item._id}
                      style={{
                        borderTop: idx > 0 ? '1px solid var(--color-surface-container)' : 'none',
                      }}
                    >
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="font-title-md" style={{ fontSize: '14px', fontWeight: 600 }}>
                          {item.bookingCode}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 500 }}>{item.userId?.name || '—'}</div>
                        <div style={{ color: 'var(--color-outline)', fontSize: '11px' }}>{item.userId?.email}</div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 500 }}>{item.eventId?.title || '—'}</div>
                        <div style={{ color: 'var(--color-tertiary)', fontSize: '12px' }}>
                          {item.eventId?.dateTime ? new Date(item.eventId.dateTime).toLocaleDateString() : ''}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        {item.artistId?.displayName || '—'}
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="font-title-md" style={{ fontSize: '15px', fontWeight: 600 }}>
                          {item.amount?.toLocaleString?.() ?? item.amount}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                          <span
                            style={{
                              padding: '2px 10px',
                              borderRadius: '9999px',
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.color,
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'capitalize',
                            }}
                          >
                            {STATUS_LABEL[item.status] || item.status}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {(item.status === 'pending' || item.status === 'pending_payment') && (
                              <button
                                type="button"
                                className="btn-secondary"
                                disabled={isBusy}
                                onClick={() => handleStatusChange(item._id, 'confirmed')}
                                style={{ padding: '4px 10px', fontSize: '11px' }}
                              >
                                Confirm
                              </button>
                            )}
                            {item.status === 'confirmed' && (
                              <button
                                type="button"
                                className="btn-secondary"
                                disabled={isBusy}
                                onClick={() => handleStatusChange(item._id, 'completed')}
                                style={{ padding: '4px 10px', fontSize: '11px' }}
                              >
                                Complete
                              </button>
                            )}
                            {!['cancelled', 'refunded', 'completed'].includes(item.status) && (
                              <button
                                type="button"
                                className="btn-surface"
                                disabled={isBusy}
                                onClick={() => handleStatusChange(item._id, 'cancelled')}
                                style={{ padding: '4px 10px', fontSize: '11px' }}
                              >
                                <XCircle size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ icon, label, value }) {
  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: 'var(--color-surface-container-lowest)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-secondary-container)',
          color: 'var(--color-on-secondary-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>{label}</span>
        <div className="font-title-lg" style={{ color: 'var(--color-on-surface)', marginTop: '2px' }}>
          {value}
        </div>
      </div>
    </div>
  );
}
