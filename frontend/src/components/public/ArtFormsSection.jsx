import React from 'react';
import { FEATURED_ART_FORMS } from '../../data/publicMockData';
import { ArrowRight } from 'lucide-react';

export default function ArtFormsSection() {
  return (
    <section
      id="traditions"
      style={{
        width: '100%',
        paddingTop: '4rem',
        paddingBottom: '4rem',
      }}
    >
      <div className="public-container">
        {/* Section Header with Curatorial Overline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '24px', height: '1px', backgroundColor: 'var(--color-primary)' }} />
            <span className="font-label-caps" style={{ color: 'var(--color-primary)' }}>
              Tradition Monograph Index
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <h2 className="font-headline-lg" style={{ color: 'var(--color-on-surface)' }}>
                Four Master Lineages of Indian Sacred Art
              </h2>
              <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>
                Each idiom represents thousands of years of ecological harmony, visual cosmologies, and oral folklore handed down through unbroken familial chains.
              </p>
            </div>

            <a
              href="#traditions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>Explore Entire Archive (34 Traditions)</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid-4-traditions">
          {FEATURED_ART_FORMS.map((form) => (
            <div
              key={form.id}
              className="tradition-card"
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                borderRadius: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              {/* Image with 4/3 Aspect Ratio Controlled Media Container */}
              <div
                className="tradition-card-media"
                style={{
                  backgroundColor: 'var(--color-surface-container)',
                }}
              >
                <img
                  alt={form.title}
                  src={form.image}
                  loading="lazy"
                />

                {/* Region Tag Top-Left */}
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      color: 'var(--color-on-surface)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {form.region}
                  </span>
                </div>

                {/* GI Tag Bottom-Right */}
                <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                  <span className="badge-gi">
                    {form.giTag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <span
                    className="font-label-caps"
                    style={{
                      fontSize: '10px',
                      color: 'var(--color-outline)',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    {form.category}
                  </span>

                  <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', margin: '4px 0' }}>
                    {form.title}
                  </h3>

                  <p
                    className="font-body-sm"
                    style={{
                      color: 'var(--color-on-surface-variant)',
                      marginTop: '8px',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {form.description}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: '1rem',
                    marginTop: '1.25rem',
                    borderTop: '1px solid rgba(138, 114, 106, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
                    {form.custodians}
                  </span>

                  <a
                    href="#traditions"
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-primary)',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    View Tradition →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
