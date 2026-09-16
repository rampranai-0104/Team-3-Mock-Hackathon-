import React, { useState } from 'react';
import { Menu, Search, Bell, X } from 'lucide-react';
import { ARTIST_PROFILE } from '../../data/artisanMockData';

export default function ArtisanHeader({ onOpenSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mockAlerts = [
    { id: 1, text: 'New institutional inquiry from NGMA Delhi', time: '10m ago' },
    { id: 2, text: 'Bank payout cleared: ₹85,000 to A/C •••• 9999', time: '2h ago' },
    { id: 3, text: 'Priya Nair placed a bespoke commission inquiry', time: '5h ago' },
  ];

  return (
    <header className="artisan-header">
      {/* Left: Mobile Hamburger & Authenticated Console Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onOpenSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: 'var(--color-on-surface)',
          }}
          aria-label="Open Navigation Menu"
        >
          <Menu size={24} />
        </button>

        {/* Authenticated Console Badge from artist.html */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-secondary)',
            }}
          />
          AUTHENTICATED CONSOLE
        </span>
      </div>

      {/* Right: Search, Notifications & Artist Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        {/* Search button */}
        <button
          type="button"
          onClick={() => setShowSearchModal(!showSearchModal)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            color: 'var(--color-on-surface-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Search Dashboard"
        >
          <Search size={20} />
        </button>

        {showSearchModal && (
          <div
            style={{
              position: 'absolute',
              top: '52px',
              right: '80px',
              width: '280px',
              backgroundColor: 'var(--color-surface-container-lowest)',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 24px rgba(44, 42, 41, 0.12)',
              border: '1px solid var(--color-surface-container-high)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 60,
            }}
          >
            <Search size={16} color="var(--color-outline)" />
            <input
              type="text"
              placeholder="Search requests, events, paintings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '12px',
                fontFamily: 'var(--font-sans)',
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowSearchModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} color="var(--color-outline)" />
            </button>
          </div>
        )}

        {/* Notifications button with alert dot */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              color: 'var(--color-on-surface-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            title="Notifications"
          >
            <Bell size={20} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
              }}
            />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                width: '300px',
                backgroundColor: 'var(--color-surface-container-lowest)',
                borderRadius: '1rem',
                boxShadow: '0 8px 24px rgba(44, 42, 41, 0.12)',
                border: '1px solid var(--color-surface-container-high)',
                padding: '1rem',
                zIndex: 60,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="font-title-md" style={{ fontSize: '14px' }}>Notifications</span>
                <span className="badge-secondary" style={{ fontSize: '9px' }}>3 Unread</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      padding: '8px',
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--color-surface-container-low)',
                      fontSize: '12px',
                    }}
                  >
                    <p style={{ fontWeight: 500, color: 'var(--color-on-surface)' }}>{alert.text}</p>
                    <span style={{ fontSize: '10px', color: 'var(--color-outline)' }}>{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Artist Profile mini widget */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingLeft: '12px',
            borderLeft: '1px solid var(--color-outline-variant)',
          }}
        >
          <div style={{ textAlign: 'right', display: 'none' }} className="sm-block">
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-on-surface)',
                lineHeight: 1.2,
              }}
            >
              {ARTIST_PROFILE.name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                color: 'var(--color-outline)',
                letterSpacing: '0.04em',
              }}
            >
              {ARTIST_PROFILE.title}
            </div>
          </div>
          <img
            src={ARTIST_PROFILE.avatar}
            alt="Artist Avatar"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-surface-container-highest)',
            }}
          />
        </div>
      </div>
    </header>
  );
}
