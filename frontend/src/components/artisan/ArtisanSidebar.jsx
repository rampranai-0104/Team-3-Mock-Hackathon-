import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Inbox,
  Calendar,
  Wallet,
  Users,
  Package,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronDown,
  X,
} from 'lucide-react';

export default function ArtisanSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [requestsOpen, setRequestsOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCurrent = (path) => {
    if (path === '/dashboard/artisan') {
      return location.pathname === '/dashboard/artisan';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`artisan-sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar Shell */}
      <aside className={`artisan-sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '18px',
                }}
              >
                T
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1',
                    color: 'var(--color-on-surface)',
                  }}
                >
                  TVARITA
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '9px',
                    letterSpacing: '0.14em',
                    color: 'var(--color-outline)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Artist Dashboard
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-outline)',
                display: isOpen ? 'flex' : 'none',
                alignItems: 'center',
                padding: '4px',
              }}
              title="Close Menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* 1. Overview */}
            <NavLink
              to="/dashboard/artisan"
              end
              onClick={onClose}
              className={`artisan-nav-item ${isCurrent('/dashboard/artisan') ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>

            {/* 2. My Profile */}
            <NavLink
              to="/dashboard/artisan/profile"
              onClick={onClose}
              className={`artisan-nav-item ${isCurrent('/dashboard/artisan/profile') ? 'active' : ''}`}
            >
              <User size={18} />
              <span>My Profile</span>
            </NavLink>

            {/* 3. Requests (Collapsible Sub-links) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <NavLink
                  to="/dashboard/artisan/requests"
                  onClick={onClose}
                  className={`artisan-nav-item ${isCurrent('/dashboard/artisan/requests') ? 'active' : ''}`}
                  style={{ flexGrow: 1 }}
                >
                  <Inbox size={18} />
                  <span>Requests</span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => setRequestsOpen(!requestsOpen)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: 'var(--color-outline)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Toggle Requests Submenu"
                >
                  <ChevronDown
                    size={15}
                    style={{
                      transform: requestsOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
              </div>

              {requestsOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  <NavLink
                    to="/dashboard/artisan/requests?tab=individual"
                    onClick={onClose}
                    className="artisan-nav-subitem"
                  >
                    • Individual Requests
                  </NavLink>
                  <NavLink
                    to="/dashboard/artisan/requests?tab=institutions"
                    onClick={onClose}
                    className="artisan-nav-subitem"
                  >
                    • Group / Institutions
                  </NavLink>
                </div>
              )}
            </div>

            {/* 4. Events */}
            <NavLink
              to="/dashboard/artisan/events"
              onClick={onClose}
              className={`artisan-nav-item ${isCurrent('/dashboard/artisan/events') ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>Events &amp; Calendar</span>
            </NavLink>

            {/* 5. Earnings */}
            <NavLink
              to="/dashboard/artisan/earnings"
              onClick={onClose}
              className={`artisan-nav-item ${isCurrent('/dashboard/artisan/earnings') ? 'active' : ''}`}
            >
              <Wallet size={18} />
              <span>Earnings &amp; Payouts</span>
            </NavLink>

            {/* 6. Followers */}
            <NavLink
              to="/dashboard/artisan/followers"
              onClick={onClose}
              className={`artisan-nav-item ${isCurrent('/dashboard/artisan/followers') ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Followers &amp; Guild</span>
            </NavLink>

            {/* 7. Products */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <NavLink
                  to="/dashboard/artisan/products"
                  onClick={onClose}
                  className={`artisan-nav-item ${isCurrent('/dashboard/artisan/products') ? 'active' : ''}`}
                  style={{ flexGrow: 1 }}
                >
                  <Package size={18} />
                  <span>Artworks &amp; Products</span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => setProductsOpen(!productsOpen)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: 'var(--color-outline)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Toggle Products Submenu"
                >
                  <ChevronDown
                    size={15}
                    style={{
                      transform: productsOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
              </div>

              {productsOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  <NavLink
                    to="/dashboard/artisan/products?tab=add"
                    onClick={onClose}
                    className="artisan-nav-subitem"
                  >
                    • Add Artwork
                  </NavLink>
                  <NavLink
                    to="/dashboard/artisan/products?tab=manage"
                    onClick={onClose}
                    className="artisan-nav-subitem"
                  >
                    • Manage Catalog
                  </NavLink>
                </div>
              )}
            </div>

            {/* 8. Settings */}
            <NavLink
              to="/dashboard/artisan/settings"
              onClick={onClose}
              className={`artisan-nav-item ${isCurrent('/dashboard/artisan/settings') ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>

            {/* 9. Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="artisan-nav-item"
              style={{ marginTop: '0.5rem', color: 'var(--color-error)' }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Guild Verification Bottom Card from artist.html */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '12px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-surface-container)',
            marginTop: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'var(--color-outline)',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Verified Folk Guild
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-on-surface)',
              }}
            >
              Dindori Gond Collective
            </span>
            <ShieldCheck size={18} color="var(--color-secondary)" />
          </div>
        </div>
      </aside>
    </>
  );
}
