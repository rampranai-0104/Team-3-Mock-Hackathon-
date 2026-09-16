import React from 'react';
import { ADMIN_ANALYTICS_DATA } from '../../data/adminMockData';

export default function AnalyticsVisualizations() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Grid: 24-Month Growth Curve & Regional Donut */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Chart 1: 24-Month Cumulative Direct Artisan Honorarium Growth (Area/Line) */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gridColumn: 'span 2',
          }}
        >
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingBottom: '1.5rem' }}>
              <div>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                  Macro Economic Trajectory
                </span>
                <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
                  Cumulative Direct Artisan Honorarium Growth (24 Mo.)
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
                  Marketplace Sales
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} />
                  Institutional Residencies
                </span>
              </div>
            </div>

            {/* Inline SVG Chart from admin.html */}
            <div style={{ width: '100%', height: '260px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
              <svg
                viewBox="0 0 700 220"
                preserveAspectRatio="none"
                fill="none"
                style={{ width: '100%', height: '100%' }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hairlines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="#eae8e2" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="90" x2="700" y2="90" stroke="#eae8e2" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="140" x2="700" y2="140" stroke="#eae8e2" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" y1="190" x2="700" y2="190" stroke="#eae8e2" strokeDasharray="4 4" strokeWidth="1" />

                {/* Fill Area Under Curve */}
                <path
                  d="M0 200 L40 185 L90 178 L150 160 L210 155 L270 142 L330 130 L390 115 L450 90 L520 70 L580 50 L640 32 L700 18 L700 210 L0 210 Z"
                  fill="rgba(255, 219, 207, 0.45)"
                />

                {/* Growth Line 1 (Marketplace) */}
                <path
                  d="M0 200 Q40 185, 90 178 T210 155 T330 130 T450 90 T580 50 T700 18"
                  stroke="#9f3c16"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Growth Line 2 (Residencies) */}
                <path
                  d="M0 208 Q60 198, 120 190 T240 175 T360 150 T480 120 T600 88 T700 58"
                  stroke="#516255"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  strokeLinecap="round"
                />

                {/* Active Checkpoint Dots */}
                <circle cx="210" cy="155" r="4" fill="#9f3c16" />
                <circle cx="450" cy="90" r="4" fill="#9f3c16" />
                <circle cx="700" cy="18" r="5" fill="#9f3c16" />
              </svg>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              fontFamily: 'monospace',
              fontSize: '10px',
              color: 'var(--color-outline)',
              textTransform: 'uppercase',
            }}
          >
            <span>Month 01 (Inception)</span>
            <span>Month 06</span>
            <span>Month 12 (GI Integration)</span>
            <span>Month 18 (Corporate Guilds)</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>Month 24 (Current ₹6.82 Cr)</span>
          </div>
        </div>

        {/* Chart 2: Regional Folk Dispersion Donut Chart */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
              Geographical Dispersion
            </span>
            <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
              Artisan Guild Registry
            </h3>
          </div>

          {/* SVG Donut Chart from admin.html */}
          <div
            style={{
              position: 'relative',
              width: '190px',
              height: '190px',
              margin: '1.25rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
            >
              {/* Background Ring */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eae8e2" strokeWidth="12" />

              {/* Gond: 36% */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#9f3c16"
                strokeWidth="12"
                strokeDasharray="90.5 251.3"
                strokeDashoffset="0"
              />

              {/* Warli: 28% */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#516255"
                strokeWidth="12"
                strokeDasharray="70.4 251.3"
                strokeDashoffset="-90.5"
              />

              {/* Pichwai: 20% */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#635b4f"
                strokeWidth="12"
                strokeDasharray="50.3 251.3"
                strokeDashoffset="-160.9"
              />

              {/* Pattachitra & Bhil: 16% */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#bf542c"
                strokeWidth="12"
                strokeDasharray="40.2 251.3"
                strokeDashoffset="-211.2"
              />
            </svg>

            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <span className="font-display-hero" style={{ fontSize: '28px', lineHeight: '32px', color: 'var(--color-on-surface)' }}>
                1,482
              </span>
              <span className="font-label-caps" style={{ fontSize: '9px', color: 'var(--color-outline)' }}>
                Custodians
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            {ADMIN_ANALYTICS_DATA.regionalDispersion.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--color-on-surface)' }}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Workshop Attendance & Masterclass Hours by Tradition */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
              Student &amp; Corporate Cohorts
            </span>
            <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
              Workshop Attendance &amp; Masterclass Hours by Tradition
            </h3>
          </div>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-surface-container-high)',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            148,900 Total Enrolled Learners
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '4px' }}>
          {ADMIN_ANALYTICS_DATA.workshopAttendance.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{item.tradition}</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--color-tertiary)' }}>{item.stats}</span>
              </div>
              <div
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-surface-container-low)',
                  height: '12px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    backgroundColor: item.color,
                    height: '100%',
                    borderRadius: '9999px',
                    width: item.width,
                    transition: 'width 1s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
