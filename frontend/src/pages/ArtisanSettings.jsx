import React, { useState } from 'react';
import {
  Settings,
  Smartphone,
  Mic,
  Landmark,
  Eye,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { EARNINGS_DATA, ARTIST_PROFILE } from '../data/artisanMockData';

export default function ArtisanSettings() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [voiceAssistantSpeed, setVoiceAssistantSpeed] = useState('Normal');
  const [defaultLang, setDefaultLang] = useState('मराठी (Marathi)');
  const [highContrast, setHighContrast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '800px' }}>
      <div>
        <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
          Studio Settings &amp; Preferences
        </h1>
        <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          Configure SMS notifications, dialect settings, and fictional banking preferences.
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
          Your studio settings have been saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 1. Language & Dialect */}
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
            <h2 className="font-title-lg">Studio Language / भाषा प्राधान्य</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Primary Operating Language
              </label>
              <select
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface-container-low)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                }}
              >
                <option>मराठी (Marathi)</option>
                <option>वारली बोली (Warli Tribal Dialect)</option>
                <option>हिन्दी (Hindi)</option>
                <option>English</option>
                <option>ଓଡ଼ିଆ (Odia)</option>
                <option>मैथिली (Maithili)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. SMS & Feature Phone Notifications */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-secondary)' }}><Smartphone size={20} /></span>
            <h2 className="font-title-lg">SMS Alerts &amp; Feature Phone Integration</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Instant SMS Alerts on Bank Disbursal</div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                  Sends text message whenever a buyer payment clears to your account.
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-secondary)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-surface-container)', paddingTop: '10px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Linked Device</div>
                <div style={{ fontSize: '12px', color: 'var(--color-outline)' }}>
                  Jio Bharat 4G Feature Phone ({ARTIST_PROFILE.phone})
                </div>
              </div>
              <span className="badge-secondary">Verified</span>
            </div>
          </div>
        </div>

        {/* 3. Voice Assistant Settings */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-primary)' }}><Mic size={20} /></span>
            <h2 className="font-title-lg">Hands-Free Voice Assistant / बोलून सांगा</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Voice Playback &amp; Readout Speed
              </label>
              <select
                value={voiceAssistantSpeed}
                onChange={(e) => setVoiceAssistantSpeed(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface-container-low)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                }}
              >
                <option>Normal (साधारण गती)</option>
                <option>Slow &amp; Clear (हळू आणि स्पष्ट)</option>
                <option>Fast (जलद)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Bank Account Preferences (Fictional / Masked Details) */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-secondary)' }}><Landmark size={20} /></span>
            <h2 className="font-title-lg">Bank Account &amp; Disbursals (Fictional / Masked)</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-outline)' }}>Primary Bank:</span>
              <span style={{ fontWeight: 600 }}>{EARNINGS_DATA.bankName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-outline)' }}>Branch:</span>
              <span style={{ fontWeight: 600 }}>{EARNINGS_DATA.branchCode}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-outline)' }}>IFSC Code:</span>
              <span style={{ fontWeight: 600 }}>{EARNINGS_DATA.ifscMasked}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-outline)' }}>Account Number:</span>
              <span style={{ fontWeight: 600 }}>{EARNINGS_DATA.accountMasked}</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-secondary)' }}>
              ✓ Direct settlement with 0% platform commission guaranteed by Tribal Welfare Ministry Trust.
            </div>
          </div>
        </div>

        {/* 5. Accessibility Controls */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-outline)' }}><Eye size={20} /></span>
            <h2 className="font-title-lg">Accessibility &amp; Vision</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Enhanced Contrast &amp; Tactile Borders</div>
              <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                Makes all cards and borders darker for low-vision environments.
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary">
            <Save size={18} />
            <span>Save Settings / बदल सेव्ह करा</span>
          </button>
        </div>
      </form>
    </div>
  );
}
