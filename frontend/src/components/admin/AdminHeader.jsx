import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ onOpenSidebar }) {
  const { user } = useAuth();
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
              {user?.name || 'Admin'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                color: 'var(--color-outline)',
                letterSpacing: '0.04em',
              }}
            >
              {user?.email || ''}
            </div>
          </div>
          {user?.avatar ? (
            <img
              alt={user?.name || 'Admin'}
              src={user.avatar}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--color-surface-container-highest)',
              }}
            />
          ) : (
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-fixed)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
