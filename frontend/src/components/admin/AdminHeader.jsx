import React, { useState } from 'react';
import { Menu, Search, Bell, X } from 'lucide-react';
import { ADMIN_NOTIFICATIONS_LIST } from '../../data/adminMockData';

export default function AdminHeader({ onOpenSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="admin-header">
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

        {/* Authenticated Console Badge from admin.html */}
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

      {/* Right: Search, Notifications & Executive Profile */}
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
          title="Search Registry"
        >
          <Search size={20} />
        </button>

        {/* Search input popup */}
        {showSearchModal && (
          <div
            style={{
              position: 'absolute',
              top: '52px',
              right: '80px',
              width: '320px',
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
              placeholder="Search artisans, GI tags, lineages, escrows..."
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
            title="System Notifications"
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
                width: '320px',
                backgroundColor: 'var(--color-surface-container-lowest)',
                borderRadius: '1rem',
                boxShadow: '0 8px 24px rgba(44, 42, 41, 0.12)',
                border: '1px solid var(--color-surface-container-high)',
                padding: '1rem',
                zIndex: 60,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="font-title-md" style={{ fontSize: '14px' }}>Executive Attestations</span>
                <span className="badge-secondary" style={{ fontSize: '9px' }}>2 Pending</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ADMIN_NOTIFICATIONS_LIST.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--color-surface-container-low)',
                      fontSize: '12px',
                    }}
                  >
                    <p style={{ fontWeight: 500, color: 'var(--color-on-surface)' }}>{alert.title}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', fontSize: '10px', color: 'var(--color-outline)' }}>
                      <span>{alert.category}</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Executive Profile Widget from admin.html */}
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
              Anand Singh Shyam
            </div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                color: 'var(--color-outline)',
                letterSpacing: '0.04em',
              }}
            >
              Executive Curator &amp; Master Artist
            </div>
          </div>
          <img
            alt="Executive Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA06qM_1-72Ootd3Ez73hQQjNUHHLNFnY5HG1huE9-oWsEb-vHQx7M63T2HU0_AbvOfQR90WwQcI4fpB77SlkV46lu94wqNDjw85etKNn3RZHX1bFnZG7tFbcGoddu3d9kxUesuJ5w8gz5dnW9k9YzqOSf8YUDSlwpySxFWNtRqalPGY3z1VhQcURwrzJl-OQUwdnZigmwdrEsjjmRMSrStXa2Y9rvwt1JHg2VzATljvILpgtQ2zUmlMA"
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
