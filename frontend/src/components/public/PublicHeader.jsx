import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TVARITA_BRANDMARK } from '../../data/publicMockData';
import { Search, Bookmark, ShoppingBag, Bell, Menu, X, ChevronDown, LogIn, UserPlus } from 'lucide-react';

export default function PublicHeader({ cartCount = 3, onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Public Enthusiast');
  const navigate = useNavigate();

  const handleRoleSelect = (role, route) => {
    setSelectedRole(role);
    setRoleDropdownOpen(false);
    navigate(route);
  };

  return (
    <>
      <header className="public-header-fixed">
        {/* Top GI & UNESCO Ribbon from landingpage.html */}
        <div className="public-ribbon">
          <div
            className="public-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge-gi">GI TAG AUTHENTIC</span>
              <span style={{ color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
                100% Direct-to-Artisan Royalties • Certified Tribal Provenance
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--color-on-surface-variant)', fontWeight: 500 }} className="hidden-sm">
                UNESCO Intangible Cultural Heritage Preservation Partner
              </span>

              {/* Role Quick Selector Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    border: '1px solid var(--color-surface-container-high)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
                  <span>{selectedRole}</span>
                  <ChevronDown size={14} color="var(--color-on-surface-variant)" />
                </button>

                {roleDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '6px',
                      backgroundColor: 'var(--color-surface-container-lowest)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      border: '1px solid var(--color-surface-container-high)',
                      minWidth: '200px',
                      zIndex: 110,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('Public Enthusiast', '/')}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: 'var(--color-on-surface)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      Public Enthusiast
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('Artist Studio', '/dashboard/artisan')}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: 'var(--color-on-surface)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      Artist Studio
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('Admin Console', '/dashboard/admin')}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: 'var(--color-on-surface)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      Executive Admin
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav Bar (h-20) from landingpage.html */}
        <div className="public-container">
          <div className="public-main-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Brandmark */}
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

              {/* Desktop Nav Links */}
              <nav className="public-nav-links" style={{ display: 'flex' }}>
                <a href="#traditions" className="public-nav-link active">Explore Traditions</a>
                <a href="#master-artists" className="public-nav-link">Master Artists</a>
                <a href="#workshops" className="public-nav-link">Workshops &amp; Immersion</a>
                <a href="#marketplace" className="public-nav-link">Living Marketplace</a>
                <a href="#terroir" className="public-nav-link">Heritage Archive</a>
                <Link to="/dashboard/institution" className="public-nav-link">Institutional</Link>
              </nav>
            </div>

            {/* Header Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

              <button
                type="button"
                aria-label="Marketplace Cart"
                onClick={onOpenCart || (() => alert('Acquisition Portfolio: 3 Artworks Reserved'))}
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
              </button>

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

              {/* Login & Register Buttons */}
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

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a
            href="#traditions"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: '16px', fontWeight: 600 }}
          >
            Explore Traditions
          </a>
          <a
            href="#master-artists"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: '16px', fontWeight: 600 }}
          >
            Master Artists
          </a>
          <a
            href="#workshops"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: '16px', fontWeight: 600 }}
          >
            Workshops &amp; Immersion
          </a>
          <a
            href="#marketplace"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: '16px', fontWeight: 600 }}
          >
            Living Marketplace
          </a>
          <a
            href="#terroir"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--color-on-surface)', fontSize: '16px', fontWeight: 600 }}
          >
            Heritage Archive
          </a>
        </nav>

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
