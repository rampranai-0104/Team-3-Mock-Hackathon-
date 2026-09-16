import React, { useState, useEffect } from 'react';
import {
  Settings,
  CheckCircle2,
  Save,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import artisanService from '../services/artisanService';

export default function ArtisanSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityNotes, setAvailabilityNotes] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      setLoading(true);
      setError(null);
      try {
        const res = await artisanService.getProfile();
        const data = res?.data;
        if (mounted && data) {
          setIsAvailable(data.availability?.isAvailable ?? true);
          setAvailabilityNotes(data.availability?.notes || '');
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load settings.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadSettings();
    return () => { mounted = false; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await artisanService.updateProfile({
        availability: { isAvailable, notes: availabilityNotes },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(`Could not save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '10px', color: 'var(--color-on-surface-variant)' }}>
        <Loader2 size={20} className="spin" />
        <span>Loading your settings…</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '800px' }}>
      <div>
        <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
          Studio Settings
        </h1>
        <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          Control whether you appear as available for new commissions and workshop invites.
        </p>
      </div>

      {saveSuccess && (
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
          Your studio settings have been saved.
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-error-container, #fdecea)',
            color: 'var(--color-on-error-container, #611a15)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-primary)' }}><Settings size={20} /></span>
            <h2 className="font-title-lg">Studio Availability</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Accepting new commissions &amp; workshop invites</div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                  Turn this off if your studio is fully booked and you don't want new requests right now.
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-secondary)' }}
              />
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Availability Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Booked through end of month, resuming commissions in November."
                value={availabilityNotes}
                onChange={(e) => setAvailabilityNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface-container-low)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving…' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
