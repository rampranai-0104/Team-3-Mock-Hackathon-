import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import publicService from '../../services/publicService';

export default function ArtFormsSection() {
  const [artForms, setArtForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await publicService.getArtForms();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setArtForms(list.slice(0, 4));
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load traditions right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

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
                Master Lineages of Indian Sacred Art
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
              <span>Explore Entire Archive</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {loading && (
          <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Loading living traditions…
          </p>
        )}

        {!loading && error && (
          <p className="font-body-sm" style={{ color: 'var(--color-error, #b3261e)' }}>
            {error}
          </p>
        )}

        {!loading && !error && artForms.length === 0 && (
          <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            No published traditions yet — check back soon.
          </p>
        )}

        {/* Cards Grid */}
        {!loading && !error && artForms.length > 0 && (
          <div className="grid-4-traditions">
            {artForms.map((form) => {
              const region = form.regions?.[0] || 'India';
              const category = form.techniques?.[0] || 'Traditional Craft';
              const image = form.image?.url || form.media?.[0]?.url || '';

              return (
                <div
                  key={form._id}
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
                    {image && (
                      <img alt={form.name} src={image} loading="lazy" />
                    )}

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
                        {region}
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
                        {category}
                      </span>

                      <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', margin: '4px 0' }}>
                        {form.name}
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
                        {form.description || 'A living heritage craft sustained by generations of hereditary custodians.'}
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
                        {form.regions?.length || 1} Region{(form.regions?.length || 1) > 1 ? 's' : ''}
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
