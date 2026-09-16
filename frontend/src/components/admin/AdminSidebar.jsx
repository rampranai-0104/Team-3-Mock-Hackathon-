import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Palette,
  Calendar,
  Package,
  UserCheck,
  BarChart3,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isCurrent = (path) => {
    if (path === '/dashboard/admin') {
      return location.pathname === '/dashboard/admin' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { to: '/dashboard/admin', label: 'Dashboard / Overview', icon: LayoutDashboard },
    { to: '/dashboard/admin/artists', label: 'Artists', icon: Users },
    { to: '/dashboard/admin/art-forms', label: 'Art Forms', icon: Palette },
    { to: '/dashboard/admin/events', label: 'Events', icon: Calendar },
    { to: '/dashboard/admin/products', label: 'Products', icon: Package },
    { to: '/dashboard/admin/users', label: 'Users', icon: UserCheck },
    { to: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`admin-sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Brand Header from admin.html */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <img
                alt="Tvarita Brandmark"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XV--XeXyWO-zdokp8Yhr9BQVGGexBV9BU8yOyYcO__PgMxJHy1eP6NQs0MFlCG85n3xNuNjNaPV3D8FlavcyfsEVZuYkLVEUSUyArXAMzDd3nXUexnoLkRypDrgi6v3y6PDVuZzL7XWS7XdgCjeGWOhKJ2V4mDnVBDkZQCbrEbwqAp0dfhipgHsxdMDF1X_Z_NBWX5dvE4JKqo7AiztssOxzpehh7SNm88gljn8AN2zZNNfwW6JTi3KQA"
                style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
              />
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
                  Executive Console
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
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

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard/admin'}
                  onClick={onClose}
                  className={`admin-nav-item ${active ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Verified Folk Guild Plinth from admin.html */}
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
