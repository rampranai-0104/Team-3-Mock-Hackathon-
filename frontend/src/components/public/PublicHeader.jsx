import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TVARITA_BRANDMARK } from '../../data/publicMockData';
import { Search, Bookmark, ShoppingBag, Bell, Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function PublicHeader({ cartCount = 3, onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="public-header-fixed">
        {/* Main Clean Nav Bar */}
        <div className="public-container">
          <div className="public-main-nav">
            {/* Left: Brandmark */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <img
                  alt="Tvarita Brandmark"
                  src={TVARITA_BRANDMARK}
                  style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      letterSpacing: '-0.02em',
                      lineHeight: '1',
                      color: 'var(--color-on-surface)',
                    }}
                  >
                    TVARITA
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: 'var(--color-outline)',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    Living Indigenous Arts
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Actions Cluster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Search button */}
              <button
                type="button"
                aria-label="Search Archive"
                onClick={() => alert('Search Living Cultural Archive (⌘K)')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-surface-container-low)',
                  border: '1px solid var(--color-surface-container-high)',
                  color: 'var(--color-on-surface-variant)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <Search size={16} />
                <span className="hidden-sm">Search</span>
                <kbd
                  style={{
                    backgroundColor: 'var(--color-surface-container)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: 'var(--color-outline)',
                  }}
                  className="hidden-sm"
                >
                  ⌘K
                </kbd>
              </button>

              {/* Saved */}
              <button
                type="button"
                aria-label="Saved Artworks"
                onClick={() => alert('Saved Artworks Portfolio: 0 items')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: 'var(--color-on-surface-variant)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bookmark size={20} />
              </button>

              {/* Cart Trigger */}
              <button
                type="button"
                aria-label="Marketplace Cart"
                onClick={onOpenCart || (() => alert(`Acquisition Portfolio: ${cartCount} Artworks Reserved`))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: 'var(--color-on-surface-variant)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => alert('Living Heritage Notifications: Direct artist field recordings available.')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: 'var(--color-on-surface-variant)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Bell size={20} />
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                  }}
                />
              </button>

              {/* Login & Join Tvarita */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-on-surface)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  <LogIn size={15} />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="btn-terracotta"
                  style={{
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  <UserPlus size={15} />
                  <span>Join Tvarita</span>
                </Link>
              </div>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                className="mobile-hamburger"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: 'var(--color-on-surface)',
                  display: 'none',
                }}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-container-high)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={TVARITA_BRANDMARK} alt="Tvarita" style={{ height: '28px' }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 'bold' }}>TVARITA</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface)' }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              alert('Search Living Cultural Archive (⌘K)');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface-container-low)',
              border: '1px solid var(--color-surface-container-high)',
              color: 'var(--color-on-surface)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Search size={18} />
            <span>Search Living Archive</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenCart) onOpenCart();
              else alert(`Acquisition Portfolio: ${cartCount} Artworks Reserved`);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface-container-low)',
              border: '1px solid var(--color-surface-container-high)',
              color: 'var(--color-on-surface)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={18} />
              <span>Acquisition Cart</span>
            </div>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              alert('Saved Artworks Portfolio: 0 items');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface-container-low)',
              border: '1px solid var(--color-surface-container-high)',
              color: 'var(--color-on-surface)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Bookmark size={18} />
            <span>Saved Artworks</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              alert('Living Heritage Notifications: Direct artist field recordings available.');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface-container-low)',
              border: '1px solid var(--color-surface-container-high)',
              color: 'var(--color-on-surface)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '1.5rem', borderTop: '1px solid var(--color-surface-container-high)' }}>
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px',
              textAlign: 'center',
              borderRadius: '9999px',
              border: '1px solid var(--color-outline-variant)',
              textDecoration: 'none',
              color: 'var(--color-on-surface)',
              fontWeight: 600,
            }}
          >
            Login to Account
          </Link>
          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-terracotta"
            style={{ textAlign: 'center', justifyContent: 'center' }}
          >
            Join the Living Heritage
          </Link>
        </div>
      </div>
    </>
  );
}
