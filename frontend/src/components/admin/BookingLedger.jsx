import React, { useState } from 'react';
import { Lock, Clock, CheckCircle2 } from 'lucide-react';
import { ADMIN_BOOKING_LEDGER } from '../../data/adminMockData';

export default function BookingLedger() {
  const [engagements, setEngagements] = useState(ADMIN_BOOKING_LEDGER.engagements);

  const handleReleasePayout = (id, institution, amount) => {
    setEngagements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Disbursed', action: 'Disbursed' } : item))
    );
    alert(`Escrow payout of ${amount} released to the designated artisan collective account for ${institution}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* 3 Top Summary Metrics from admin.html */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
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
            }}
          >
            <Lock size={20} />
          </div>
          <div>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Escrow Held</span>
            <div className="font-title-lg" style={{ color: 'var(--color-on-surface)', marginTop: '2px' }}>
              {ADMIN_BOOKING_LEDGER.escrowHeld}
            </div>
          </div>
        </div>

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
              backgroundColor: 'var(--color-primary-fixed)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Awaiting Completion</span>
            <div className="font-title-lg" style={{ color: 'var(--color-on-surface)', marginTop: '2px' }}>
              {ADMIN_BOOKING_LEDGER.pendingWorkshops}
            </div>
          </div>
        </div>

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
              backgroundColor: 'var(--color-surface-container-high)',
              color: 'var(--color-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Honorariums Disbursed (MTD)</span>
            <div className="font-title-lg" style={{ color: 'var(--color-on-surface)', marginTop: '2px' }}>
              {ADMIN_BOOKING_LEDGER.disbursedMtd}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table from admin.html */}
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
            Institutional Engagements &amp; Escrow Pipeline
          </h3>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Smart Contract Escrow Escort
          </span>
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
                <th style={{ padding: '1rem 1.5rem' }}>Entity / Institution</th>
                <th style={{ padding: '1rem 1.5rem' }}>Curated Residency</th>
                <th style={{ padding: '1rem 1.5rem' }}>Assigned Artisan Guild</th>
                <th style={{ padding: '1rem 1.5rem' }}>Total Value / Escrow</th>
                <th style={{ padding: '1rem 1.5rem' }}>Honorarium Split</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Escrow Action</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px', color: 'var(--color-on-surface)' }}>
              {engagements.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderTop: idx > 0 ? '1px solid var(--color-surface-container)' : 'none',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div className="font-title-md" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {item.institution}
                    </div>
                    <div className="font-label-caps" style={{ color: 'var(--color-outline)', fontSize: '10px' }}>
                      {item.location}
                    </div>
                  </td>

                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ fontWeight: 500 }}>{item.program}</span>
                    <div style={{ color: 'var(--color-tertiary)', fontSize: '12px' }}>{item.cohort}</div>
                  </td>

                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{item.artisan}</div>
                    <div style={{ color: 'var(--color-secondary)', fontSize: '11px', fontWeight: 600 }}>
                      {item.guild}
                    </div>
                  </td>

                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div className="font-title-md" style={{ fontSize: '15px', fontWeight: 600 }}>
                      {item.escrow}
                    </div>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                        fontSize: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {item.escrowBadge}
                    </span>
                  </td>

                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ fontWeight: 500 }}>{item.split}</span>
                    <div style={{ color: 'var(--color-outline)', fontSize: '11px' }}>{item.communityFund}</div>
                  </td>

                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    {item.action === 'Release Payout' ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleReleasePayout(item.id, item.institution, item.split)}
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        Release Payout
                      </button>
                    ) : item.action === 'Disbursed' ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--color-secondary)',
                          fontWeight: 700,
                          fontSize: '12px',
                        }}
                      >
                        <CheckCircle2 size={14} /> Disbursed
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--color-surface-container-high)',
                          color: 'var(--color-on-surface-variant)',
                          fontSize: '12px',
                        }}
                      >
                        Pending Milestone
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
