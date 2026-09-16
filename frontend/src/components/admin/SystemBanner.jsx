import React, { useState } from 'react';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { ADMIN_SYSTEM_STATUS } from '../../data/adminMockData';

export default function SystemBanner() {
  const [issuingBatch, setIssuingBatch] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);

  const handleIssueBatch = () => {
    setIssuingBatch(true);
    setTimeout(() => {
      setIssuingBatch(false);
      setBatchSuccess(true);
      setTimeout(() => setBatchSuccess(false), 3500);
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface-container-low)',
        padding: '2.5rem',
        borderRadius: '1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '850px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {ADMIN_SYSTEM_STATUS.nodeName}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--color-tertiary)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
              }}
              className="pulse-mic"
            />
            {ADMIN_SYSTEM_STATUS.network}
          </span>
        </div>

        <h1
          className="font-headline-lg"
          style={{
            color: 'var(--color-on-surface)',
            marginTop: '4px',
            fontSize: '36px',
            lineHeight: '44px',
          }}
        >
          Tvarita Platform Operations &amp; Cultural Trust Foundation
        </h1>

        <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>
          Decentralized sovereign heritage registry preserving authentic tribal art lineages, managing collective royalties, validating institutional commissions, and safeguarding folk intellectual property under India’s Geographical Indications Registry standards.
        </p>
      </div>

      {/* Live Status & Quick Action Plinth */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '12px 18px',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-fixed)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
              Trust Audited
            </span>
            <span className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
              {ADMIN_SYSTEM_STATUS.auditTier}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleIssueBatch}
          disabled={issuingBatch}
          style={{
            padding: '12px 24px',
            borderRadius: '9999px',
            boxShadow: '0 2px 6px rgba(159, 60, 22, 0.25)',
          }}
        >
          <Award size={18} />
          <span>{issuingBatch ? 'Issuing Batch Cryptographic Seals...' : 'Issue Batch Certificates'}</span>
        </button>
      </div>

      {batchSuccess && (
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
            position: 'relative',
            zIndex: 10,
          }}
        >
          <CheckCircle2 size={18} />
          Batch certificates issued and cryptographically attested for 14 verified artworks!
        </div>
      )}

      {/* Soft Decorative Motif Shadow from admin.html */}
      <div
        style={{
          position: 'absolute',
          right: '-4rem',
          bottom: '-4rem',
          width: '16rem',
          height: '16rem',
          backgroundColor: 'rgba(159, 60, 22, 0.05)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
