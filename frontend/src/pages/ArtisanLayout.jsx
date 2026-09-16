import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ArtisanSidebar from '../components/artisan/ArtisanSidebar';
import ArtisanHeader from '../components/artisan/ArtisanHeader';
import LanguageBar from '../components/artisan/LanguageBar';
import FooterToolbar from '../components/artisan/FooterToolbar';
import '../styles/artisan.css';

export default function ArtisanLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="artisan-shell">
      {/* Persistent Left Sidebar / Mobile Drawer */}
      <ArtisanSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="artisan-main-wrapper">
        <ArtisanHeader onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="artisan-main">
          {/* Top Accessibility & Language Bar */}
          <LanguageBar />

          {/* Child Route Page Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <Outlet />
          </div>

          {/* Bottom Accessibility / SMS Alerts Toolbar */}
          <FooterToolbar />
        </main>
      </div>
    </div>
  );
}
