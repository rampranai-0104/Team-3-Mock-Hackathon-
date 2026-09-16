import React, { useState } from 'react';
import {
  Brush,
  ChevronRight,
  Upload,
  CheckCircle2,
  CircleDot,
  Church,
} from 'lucide-react';
import { ADMIN_TAXONOMY_TREE } from '../../data/adminMockData';

export default function TaxonomyTree() {
  const [selectedCatalogId, setSelectedCatalogId] = useState('cat-1');
  const [lexiconUpdated, setLexiconUpdated] = useState(false);

  const handleUpdateLexicon = () => {
    setLexiconUpdated(true);
    setTimeout(() => setLexiconUpdated(false), 3000);
  };

  const handleUploadWav = () => {
    alert('Audio Ingestion Pipeline ready: Uploading 96kHz/24-bit uncompressed .WAV files to immutable oral history archive.');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        width: '100%',
      }}
    >
      {/* Main Canonical Form Detail Card (Col 1 & 2 on large screens) */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '2rem',
          borderRadius: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          gridColumn: 'span 2',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <span>Taxonomy Identifier: {ADMIN_TAXONOMY_TREE.canonicalId}</span>
              <span>•</span>
              <span>Protected Archaic Corpus</span>
            </div>
            <h3 className="font-headline-md" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
              {ADMIN_TAXONOMY_TREE.name}
            </h3>
          </div>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            Documentation Score: {ADMIN_TAXONOMY_TREE.documentationScore}
          </span>
        </div>

        {/* 3 Detail Blocks from admin.html */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Sacred Pigment Base</span>
            <div className="font-title-md" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
              {ADMIN_TAXONOMY_TREE.pigmentBase.title}
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px', fontSize: '12px' }}>
              {ADMIN_TAXONOMY_TREE.pigmentBase.description}
            </p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Geometric Cosmology</span>
            <div className="font-title-md" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
              {ADMIN_TAXONOMY_TREE.cosmology.title}
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px', fontSize: '12px' }}>
              {ADMIN_TAXONOMY_TREE.cosmology.description}
            </p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Oral Songs Archived</span>
            <div className="font-title-md" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
              {ADMIN_TAXONOMY_TREE.oralChants.title}
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px', fontSize: '12px' }}>
              {ADMIN_TAXONOMY_TREE.oralChants.description}
            </p>
          </div>
        </div>

        {/* Sacred Motif Registry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
            Sacred Motif Registry (Tarpa, Palghat, &amp; Bhavada)
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            {ADMIN_TAXONOMY_TREE.motifs.map((motif) => (
              <div
                key={motif.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--color-surface-container-low)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: motif.id === 'm-1' ? 'var(--color-primary)' : 'var(--color-secondary)',
                    flexShrink: 0,
                  }}
                >
                  {motif.id === 'm-1' ? <CircleDot size={26} /> : <Church size={26} />}
                </div>
                <div>
                  <div className="font-title-md" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    {motif.title}
                  </div>
                  <div className="font-body-sm" style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                    {motif.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer & Update Action */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-surface-container)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-tertiary)', fontSize: '12px' }}>
            <CheckCircle2 size={16} color="var(--color-secondary)" />
            <span>Validated by Anthropological Survey of India &amp; Maharashtra Folk Guild</span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleUpdateLexicon}
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Update Canonical Lexicon
          </button>
        </div>

        {lexiconUpdated && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Canonical lexicon terms updated and propagated to regional curation modules.
          </div>
        )}
      </div>

      {/* Side Taxonomy Navigation Tree */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 className="font-title-lg" style={{ fontSize: '16px' }}>Taxonomy Catalog</h4>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>4 Active Core Guilds</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ADMIN_TAXONOMY_TREE.catalog.map((cat) => {
            const isSelected = selectedCatalogId === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCatalogId(cat.id)}
                style={{
                  padding: '12px',
                  borderRadius: '0.75rem',
                  backgroundColor: isSelected
                    ? 'var(--color-surface-container-high)'
                    : 'var(--color-surface-container-low)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                    <Brush size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                      {cat.name}
                    </div>
                    <div className="font-label-caps" style={{ color: 'var(--color-outline)', fontSize: '9px' }}>
                      {cat.region}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--color-outline)" />
              </div>
            );
          })}
        </div>

        {/* Audio Archive Ingestion Plinth */}
        <div
          style={{
            marginTop: 'auto',
            padding: '12px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-surface-container-low)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Audio Archive Ingestion
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Batch Ingest Oral Tales
            </span>
            <button
              type="button"
              onClick={handleUploadWav}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Upload size={14} />
              <span>Upload .WAV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
