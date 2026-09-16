import React from 'react';
import { Smartphone, BookOpen, MapPin, Palette } from 'lucide-react';

export default function FooterToolbar() {
  return (
    <footer
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1rem',
        borderRadius: '1rem',
        backgroundColor: 'var(--color-surface-container)',
        color: 'var(--color-on-surface-variant)',
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        marginTop: '2rem',
      }}
    >
      {/* SMS Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Smartphone size={18} color="var(--color-secondary)" />
        <span style={{ fontWeight: 500 }}>
          SMS Text Alerts Active for Bank Crediting (+91 94220 •••••)
        </span>
      </div>

      {/* Guild Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <a
          href="#charter"
          onClick={(e) => {
            e.preventDefault();
            alert('Opening Tvarita Artisan Rights Charter (Fair Trade, 100% Retained Earnings Guarantee, GI Legal Protection).');
          }}
          style={{
            color: 'var(--color-on-surface-variant)',
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <BookOpen size={14} />
          Artisan Rights Charter
        </a>

        <a
          href="#map"
          onClick={(e) => {
            e.preventDefault();
            alert('Viewing Local Dahanu Warli Guild Center & Community Kiln Map.');
          }}
          style={{
            color: 'var(--color-on-surface-variant)',
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <MapPin size={14} />
          Local Dahanu Guild Center Map
        </a>

        <a
          href="#materials"
          onClick={(e) => {
            e.preventDefault();
            alert('Requesting Natural Rice Flour, Red Ochre Geru, and Bamboo Stylus shipment from Guild Trust.');
          }}
          style={{
            color: 'var(--color-on-surface-variant)',
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Palette size={14} />
          Request New Painting Materials
        </a>
      </div>
    </footer>
  );
}
