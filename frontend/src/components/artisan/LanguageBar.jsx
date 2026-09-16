import React, { useState } from 'react';
import { Languages, Mic, Volume2 } from 'lucide-react';

export default function LanguageBar() {
  const [activeLang, setActiveLang] = useState('मराठी (Marathi)');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const languages = [
    'मराठी (Marathi)',
    'English',
    'हिन्दी (Hindi)',
    'ଓଡ଼ିଆ (Odia)',
    'मैथिली (Maithili)',
  ];

  const handleVoiceAssistant = () => {
    setIsSpeaking(true);
    alert("बोलणे सुरू करा... आम्ही ऐकत आहोत. (Listening for Marathi or Hindi voice commands: e.g., 'नवीन चित्र जोडा' or 'माझे पैसे तपासा').");
    setTimeout(() => setIsSpeaking(false), 2500);
  };

  const handleAudioReadout = () => {
    alert("ऑडिओ वाचन सुरू: टीवरिता कलाकार कक्ष. तुमच्याकडे ८ विनंत्या आणि ४ आगामी कार्यक्रम आहेत.");
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1rem',
        borderRadius: '1rem',
        backgroundColor: 'var(--color-surface-container-low)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginBottom: '1.5rem',
      }}
    >
      {/* Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span
          style={{
            padding: '8px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-primary-fixed)',
            color: 'var(--color-on-primary-fixed-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Languages size={22} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Studio Language / भाषा निवडा
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '4px',
              overflowX: 'auto',
              maxWidth: '100%',
              paddingBottom: '2px',
            }}
          >
            {languages.map((lang) => {
              const isSelected = activeLang === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected
                      ? 'var(--color-primary)'
                      : 'var(--color-surface-container-highest)',
                    color: isSelected ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hands-Free Voice Assistant & Audio Readout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={handleVoiceAssistant}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '9999px',
            backgroundColor: isSpeaking
              ? 'var(--color-secondary)'
              : 'var(--color-secondary-container)',
            color: isSpeaking ? 'var(--color-on-secondary)' : 'var(--color-on-secondary-container)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            transition: 'all 0.2s',
          }}
          title="Voice Assistant Active"
        >
          <Mic size={20} className="pulse-mic" />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            बोलून सांगा (Voice Assistant Active)
          </span>
        </button>

        <button
          type="button"
          onClick={handleAudioReadout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-container-high)',
            color: 'var(--color-on-surface)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="Audio Readout / आवाज ऐका"
        >
          <Volume2 size={20} />
        </button>
      </div>
    </div>
  );
}
