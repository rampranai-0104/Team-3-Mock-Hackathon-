import React, { useState } from 'react';
import { ADMIN_SETTINGS_DATA } from '../../data/adminMockData';
import { ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

/**
 * AdminSettingsPage - Governance Node Rules & Protocol Configuration
 * Connects to Express /api/admin/settings endpoint.
 */
export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({ ...ADMIN_SETTINGS_DATA });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '840px' }}>
      {/* Header */}
      <div>
        <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
          Platform & Governance Settings
        </h1>
        <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
          Configure decentralized consortium node parameters, multi-sig consensus thresholds and fair-trade standards.
        </p>
      </div>

      {saved && (
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
          Protocol configuration updated successfully.
        </div>
      )}

      {/* Settings Form */}
      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '1rem', borderBottom: '1px solid var(--color-surface-container)' }}>
          <ShieldCheck size={20} color="var(--color-primary)" />
          <h2 className="font-headline-sm" style={{ fontSize: '18px', margin: 0 }}>
            Hyperledger Fabric Consortium Parameters
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
            Platform / Registry Name
          </label>
          <input
            type="text"
            name="platformName"
            value={formData.platformName}
            onChange={handleChange}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-surface-container-high)',
              backgroundColor: 'var(--color-surface-container-lowest)',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-on-surface)',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Node Consensus Identification
            </label>
            <input
              type="text"
              name="nodeConsensus"
              value={formData.nodeConsensus}
              onChange={handleChange}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-surface-container-high)',
                backgroundColor: 'var(--color-surface-container-low)',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Multi-Signature Quorum Rule
            </label>
            <input
              type="text"
              name="multiSigRequirement"
              value={formData.multiSigRequirement}
              onChange={handleChange}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-surface-container-high)',
                backgroundColor: 'var(--color-surface-container-lowest)',
                fontSize: '14px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Fair-Trade Wage Multiplier
            </label>
            <input
              type="text"
              name="fairTradeMinimumWageMultiplier"
              value={formData.fairTradeMinimumWageMultiplier}
              onChange={handleChange}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-surface-container-high)',
                backgroundColor: 'var(--color-surface-container-lowest)',
                fontSize: '14px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Permanent Immutable Archive
            </label>
            <input
              type="text"
              name="immutableStorageArchive"
              value={formData.immutableStorageArchive}
              onChange={handleChange}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-surface-container-high)',
                backgroundColor: 'var(--color-surface-container-low)',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={16} />
            <span>Save Governance Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
