import React from 'react';
import { IMPACT_STATS } from '../../data/publicMockData';

export default function ImpactSection() {
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
          {IMPACT_STATS.map((stat, idx) => (
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
              <span
                className="font-body-sm"
                style={{
                  color: 'var(--color-outline)',
                  marginTop: '2px',
                }}
              >
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
