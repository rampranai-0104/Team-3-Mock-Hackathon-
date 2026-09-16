import React from 'react';

export default function Header({ 
  activePortal, 
  setActivePortal, 
  activeTab, 
  setActiveTab, 
  cartCount = 0,
  onOpenCart 
}) {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,42,41,0.06)] border-b border-outline-variant/30">
      {/* Top Provenance & Portal Switcher Ribbon */}
      <div className="bg-surface-container-high px-gutter-mobile lg:px-margin py-1.5 text-[11px] font-label-caps">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold tracking-wider">
              GI TAG AUTHENTIC
            </span>
            <span className="hidden sm:inline text-on-surface-variant font-medium">
              100% Direct-to-Artisan Royalties • Certified Tribal Provenance
            </span>
          </div>

          {/* Interactive Portal Switcher */}
          <div className="flex items-center gap-space-sm">
            <span className="hidden md:inline text-outline font-medium">Active Portal:</span>
            <div className="inline-flex rounded-full bg-surface-container-lowest p-0.5 shadow-sm border border-outline-variant/40">
              <button
                type="button"
                onClick={() => {
                  setActivePortal('public');
                  setActiveTab(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                  activePortal === 'public'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">person</span>
                <span>Public / Civilian</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePortal('institution');
                  setActiveTab(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                  activePortal === 'institution'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">assured_workload</span>
                <span>School / Corporate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-18 max-w-7xl mx-auto px-gutter-mobile lg:px-margin flex items-center justify-between gap-space-md py-2.5">
        {/* Brandmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
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
        </div>

        {/* Portal-specific Tab Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low px-2 py-1.5 rounded-full border border-outline-variant/30">
          {currentTabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-primary' : 'text-outline'}`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions Cluster */}
        <div className="flex items-center gap-2">
          {/* Search bar simulation */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border border-outline-variant/20"
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
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
          </button>

          {/* User Profile Avatar */}
          <div className="pl-1 flex items-center">
            <div className="w-8 h-8 rounded-full ring-2 ring-primary/40 overflow-hidden bg-surface-container flex items-center justify-center">
              {activePortal === 'public' ? (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                  alt="Aarav Mehta"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[18px] text-primary">assured_workload</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 bg-surface-container-low overflow-x-auto no-scrollbar border-t border-outline-variant/20">
        {currentTabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all ${
                isActive
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
