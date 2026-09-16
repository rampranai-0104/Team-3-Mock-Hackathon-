import React, { useEffect, useState } from 'react';
import publicService from '../../services/publicService';

// Real, live counts from the public catalog endpoints — no fabricated
// currency/percentage figures (the backend has no aggregate "amount
// disbursed" or "provenance authenticated" statistic to report).
export default function ImpactSection() {
  const [artFormCount, setArtFormCount] = useState(null);
  const [artistCount, setArtistCount] = useState(null);
  const [eventCount, setEventCount] = useState(null);

  useEffect(() => {
    publicService.getArtForms()
      .then((res) => setArtFormCount(res?.data?.length || 0))
      .catch(() => setArtFormCount(0));
    publicService.getArtists()
      .then((res) => setArtistCount(res?.data?.length || 0))
      .catch(() => setArtistCount(0));
    publicService.getEvents()
      .then((res) => setEventCount(res?.data?.length || 0))
      .catch(() => setEventCount(0));
  }, []);

  if (artFormCount === null || artistCount === null || eventCount === null) return null;

  const impactStats = [
    { value: String(artFormCount), label: 'Living Art Traditions', color: 'var(--color-primary)' },
    { value: String(artistCount), label: 'Verified Master Artisans', color: 'var(--color-on-surface)' },
    { value: String(eventCount), label: 'Upcoming Workshops', color: 'var(--color-secondary)' },
  ];

  return (
    <section
      style={{
        width: '100%',
        backgroundColor: 'var(--color-surface-container-high)',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="public-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {impactStats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
              }}
            >
              <span
                className="font-display-hero"
                style={{
                  fontSize: 'clamp(28px, 4vw, 38px)',
                  fontWeight: 700,
                  color: stat.color,
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </span>
              <span
                className="font-label-caps"
                style={{
                  color: 'var(--color-on-surface-variant)',
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
