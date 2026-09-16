import React, { useState } from 'react';
import { QrCode, ZoomIn, CheckCircle2 } from 'lucide-react';
import { ADMIN_MARKETPLACE_AUDIT } from '../../data/adminMockData';
import ArtworkImage from '../common/ArtworkImage';

export default function MarketplaceAudit() {
  const [items] = useState(ADMIN_MARKETPLACE_AUDIT);
  const [activeAlert, setActiveAlert] = useState(null);

  const handleAction = (id, title, actionName) => {
    setActiveAlert(`Action "${actionName}" completed for "${title}". Provenance metadata updated.`);
    setTimeout(() => setActiveAlert(null), 3500);
  };

  const handleBatchNfc = () => {
    alert('Generating batch of 50 cryptographically signed NFC tags for dispatch to regional guild workshops.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Artwork Quality Review &amp; Seal Dispatch
          </h2>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Reviewing physical authenticity, fair pricing indices, and non-exploitative consignment criteria.
          </p>
        </div>

        <button
          type="button"
          className="btn-surface"
          onClick={handleBatchNfc}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <QrCode size={18} />
          <span>Batch NFC Tag Generator</span>
        </button>
      </div>

      {activeAlert && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          {activeAlert}
        </div>
      )}

      {/* Bento Cards from admin.html */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {items.map((art) => (
          <div
            key={art.id}
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ position: 'relative', height: '220px', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <ArtworkImage src={art.image} alt={art.title} style={{ width: '100%', height: '100%' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(251, 249, 243, 0.95)',
                    backdropFilter: 'blur(8px)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--color-on-surface)',
                  }}
                >
                  {art.badge}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                  {art.artForm}
                </span>
                <span className="font-title-md" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  {art.price}
                </span>
              </div>

              <h4 className="font-headline-sm" style={{ fontSize: '18px', color: 'var(--color-on-surface)' }}>
                {art.title}
              </h4>

              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.4' }}>
                Artisan: <strong>{art.artist}</strong> • {art.specs}
              </p>

              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--color-surface-container-low)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: '11px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-tertiary)' }}>Fair Trade Compliance:</span>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>{art.compliance}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-tertiary)' }}>Physical NFC Tag ID:</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--color-on-surface)' }}>{art.nfcTag}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleAction(art.id, art.title, art.primaryAction)}
                style={{ flex: 1, padding: '10px', fontSize: '13px' }}
              >
                {art.primaryAction}
              </button>

              <button
                type="button"
                onClick={() => alert(`Inspection zoom preview for "${art.title}" by ${art.artist}. Authentic natural pigment layers confirmed.`)}
                style={{
                  padding: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-container-high)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Inspect Pigments"
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
