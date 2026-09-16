import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Palette,
  Calendar,
  Package,
  UserCheck,
  BarChart3,
  LogOut,
  X,
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
                  flexShrink: 0,
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

          {/* Sign Out Button */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-surface-container-high)' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '8px 12px',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-error, #ba1a1a)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-error-container, #ffdad6)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
