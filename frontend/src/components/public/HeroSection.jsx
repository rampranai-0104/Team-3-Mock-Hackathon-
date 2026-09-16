import React from 'react';
import { HERO_DATA } from '../../data/publicMockData';
import { ArrowUpRight, BookOpen, Brush, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '2.5rem',
        paddingBottom: '3.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          right: '-6rem',
          top: 0,
          width: '24rem',
          height: '24rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(159, 60, 22, 0.05)',
          filter: 'blur(48px)',
          pointerEvents: 'none',
        }}
      />

      <div className="public-container">
        {/* Editorial Top Lead-in */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(138, 114, 106, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
              }}
            />
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
              Autonomous Sanctuary &amp; Living Archive
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13px',
              color: 'var(--color-on-surface-variant)',
            }}
          >
            <span>{HERO_DATA.volEdition}</span>
            <span style={{ color: 'var(--color-outline)' }}>/</span>
            <span>Verified Tribal Lineage</span>
          </div>
        </div>

        {/* Main Asymmetric Composition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Monumental Editorial Statement */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-surface-container-high)',
                  color: 'var(--color-on-surface-variant)',
                  fontSize: '12px',
                  fontWeight: 600,
                  width: 'fit-content',
                }}
              >
                <ShieldCheck size={16} color="var(--color-primary)" />
                <span>{HERO_DATA.categoryBadge}</span>
              </div>

              <h1 className="font-display-hero" style={{ color: 'var(--color-on-surface)' }}>
                {HERO_DATA.headlineLead}{' '}
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-primary)' }}>
                  {HERO_DATA.headlineAccent}
                </span>{' '}
                {HERO_DATA.headlineEnd}
              </h1>

              <p
                className="font-body-lg"
                style={{
                  color: 'var(--color-on-surface-variant)',
                  maxWidth: '560px',
                  lineHeight: 1.6,
                }}
              >
                {HERO_DATA.subheading}
              </p>
            </div>

            {/* Dual Action CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
              <a href="#traditions" className="btn-editorial-dark">
                <span>Explore Living Traditions</span>
                <ArrowUpRight size={18} />
              </a>

              <a href="#workshops" className="btn-editorial-surface">
                <BookOpen size={18} color="var(--color-primary)" />
                <span>Book Immersion Workshop</span>
              </a>
            </div>

            {/* Asymmetrical Terracotta Accent Box */}
            <div className="hero-manifesto-plinth">
              <div style={{ maxWidth: '440px', zIndex: 2 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary-fixed)',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Ritual Geometry Manifesto
                </span>
                <p
                  className="font-headline-sm"
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: '#ffffff',
                  }}
                >
                  {HERO_DATA.manifesto.quote}
                </p>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-primary-fixed)',
                    display: 'block',
                    marginTop: '8px',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {HERO_DATA.manifesto.author}
                </span>
              </div>

              {/* Decorative folk sun SVG from landingpage.html */}
              <svg
                style={{
                  width: '96px',
                  height: '96px',
                  color: 'rgba(255, 255, 255, 0.2)',
                  flexShrink: 0,
                }}
                fill="currentColor"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" fill="none" r="20" stroke="currentColor" strokeDasharray="3 3" strokeWidth="4" />
                <circle cx="50" cy="50" r="10" />
                <path
                  d="M50 10 L50 22 M50 78 L50 90 M10 50 L22 50 M78 50 L90 50 M22 22 L30 30 M70 70 L78 78 M78 22 L70 30 M22 78 L30 70"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          {/* Right Column: Dignified Offset Master Artist Portrait Plinth */}
          <div className="lg:col-span-5 relative">
            <div className="hero-portrait-matte">
              <div className="hero-portrait-window">
                <img
                  alt="Authentic portrait of Warli tribal folk master artist from Maharashtra India"
                  src={HERO_DATA.portrait.image}
                  loading="lazy"
                />

                {/* Floating Provenance Stamp Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(251, 249, 243, 0.92)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} />
                  <span className="font-label-caps" style={{ fontSize: '10px', color: 'var(--color-on-surface)' }}>
                    {HERO_DATA.portrait.badge}
                  </span>
                </div>

                {/* Bottom Floating Metadata Label Card */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(251, 249, 243, 0.92)',
                    backdropFilter: 'blur(16px)',
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span className="font-label-caps" style={{ fontSize: '10px', color: 'var(--color-outline)', display: 'block' }}>
                      {HERO_DATA.portrait.location}
                    </span>
                    <h3 className="font-headline-sm" style={{ fontSize: '17px', margin: '2px 0', color: 'var(--color-on-surface)' }}>
                      {HERO_DATA.portrait.title}
                    </h3>
                    <p className="font-body-sm" style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', margin: 0 }}>
                      {HERO_DATA.portrait.medium}
                    </p>
                  </div>

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
                      flexShrink: 0,
                    }}
                  >
                    <Brush size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
