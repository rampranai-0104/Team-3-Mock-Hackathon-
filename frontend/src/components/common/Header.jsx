import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header({ 
  activePortal, 
  activeTab, 
  setActiveTab, 
  cartCount = 0,
  onOpenCart 
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef(null);

  const publicTabs = [
    { id: 'art-forms', label: '1. Explore Art Forms', icon: 'palette' },
    { id: 'artists', label: '2. Explore Artists', icon: 'groups' },
    { id: 'events', label: '3. Upcoming Events', icon: 'event' },
    { id: 'activity', label: '4. My Activity', icon: 'verified_user' },
    { id: 'marketplace', label: '5. Marketplace / Products', icon: 'storefront' }
  ];

  const institutionTabs = [
    { id: 'inst-art-forms', label: '1. Explore Art Forms', icon: 'school' },
    { id: 'book-workshops', label: '2. Book Workshops', icon: 'auto_stories' },
    { id: 'requests', label: '3. Requests', icon: 'assignment' },
    { id: 'inst-events', label: '4. Upcoming Events', icon: 'calendar_month' },
    { id: 'product-buying', label: '5. Product Buying', icon: 'inventory_2' }
  ];

  const currentTabs = activePortal === 'public' ? publicTabs : institutionTabs;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  return (
    <header className="portal-header-fixed">
      <div className="portal-header-inner">
        {/* Left: Brandmark */}
        <Link to="/" className="portal-brandmark">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[24px]">palette</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-xl font-bold tracking-tight text-on-surface leading-none">
              TVARITA
            </span>
            <span className="font-label-caps text-[9px] tracking-[0.2em] text-outline uppercase font-semibold mt-0.5">
              Living Indigenous Arts
            </span>
          </div>
        </Link>

        {/* Center: EXACTLY ONE Single Dashboard Navigation */}
        <nav className="portal-dashboard-nav" aria-label="Dashboard Navigation">
          {currentTabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`portal-nav-tab-btn ${isActive ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions & User Profile */}
        <div className="portal-actions">
          {/* Search bar simulation */}
          <button
            type="button"
            onClick={() => alert('Search Cultural Archive (⌘K)')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border border-outline-variant/20"
            title="Search (⌘K)"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="hidden xl:inline text-xs text-outline">Search</span>
            <kbd className="hidden xl:inline px-1.5 py-0.5 rounded bg-surface-container text-[10px] text-outline font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors relative"
            title="Cart"
          >
            <span className="material-symbols-outlined text-[22px]">local_mall</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => alert('Living Heritage Notifications')}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="portal-user-trigger"
              aria-label="User Profile & Role Navigation"
              aria-expanded={userDropdownOpen}
            >
              <div className="portal-user-avatar">
                {activePortal === 'public' ? (
                  !avatarError ? (
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                      alt=""
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                  )
                ) : (
                  <span className="material-symbols-outlined text-[18px] text-primary">assured_workload</span>
                )}
              </div>
            </button>

            {/* Role & Profile Dropdown */}
            {userDropdownOpen && (
              <div className="portal-user-dropdown" role="menu">
                <div className="portal-dropdown-header">
                  <p className="font-title-md text-xs font-bold text-on-surface leading-tight">
                    {user?.name || (activePortal === 'public' ? 'Patron' : 'Institution')}
                  </p>
                  {user?.email && (
                    <p className="font-label-caps text-[10px] text-primary font-semibold mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    if (setActiveTab) setActiveTab(activePortal === 'public' ? 3 : 2);
                  }}
                  className="portal-dropdown-link"
                >
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  <span>Account / Profile</span>
                </button>

                <div className="portal-dropdown-divider" />

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="portal-dropdown-link text-on-surface-variant hover:text-primary w-full text-left"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
