import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import ArtisanLayout from './pages/ArtisanLayout';
import ArtisanOverview from './pages/ArtisanOverview';
import ArtisanProfile from './pages/ArtisanProfile';
import ArtisanRequests from './pages/ArtisanRequests';
import ArtisanEvents from './pages/ArtisanEvents';
import ArtisanEarnings from './pages/ArtisanEarnings';
import ArtisanFollowers from './pages/ArtisanFollowers';
import ArtisanProducts from './pages/ArtisanProducts';
import ArtisanSettings from './pages/ArtisanSettings';

/**
 * Public Landing Page Placeholder
 * Per user requirement: "/" is reserved for future Public Landing Page (no auto-redirect).
 */
function PublicLandingPlaceholder() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fbf9f3',
        color: '#1b1c18',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: '#9f3c16',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 'bold',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(159, 60, 22, 0.25)',
        }}
      >
        T
      </div>

      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '40px',
          color: '#1b1c18',
          marginBottom: '0.5rem',
        }}
      >
        TVARITA
      </h1>

      <p
        style={{
          fontSize: '18px',
          color: '#57423b',
          maxWidth: '540px',
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}
      >
        Living Heritage &amp; Fair Trade Indigenous Folk Art Portal.
        <br />
        <span style={{ fontSize: '14px', color: '#8a726a' }}>
          (Public Landing Page reserved for future release)
        </span>
      </p>

      <Link
        to="/dashboard/artisan"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 28px',
          borderRadius: '9999px',
          backgroundColor: '#9f3c16',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(159, 60, 22, 0.25)',
          transition: 'all 0.2s',
        }}
      >
        <span>Open Artist Dashboard →</span>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root is reserved for Future Public Landing Page without redirect */}
        <Route path="/" element={<PublicLandingPlaceholder />} />

        {/* Artist Dashboard Routes */}
        <Route path="/dashboard/artisan" element={<ArtisanLayout />}>
          <Route index element={<ArtisanOverview />} />
          <Route path="profile" element={<ArtisanProfile />} />
          <Route path="requests" element={<ArtisanRequests />} />
          <Route path="requests/individual" element={<ArtisanRequests />} />
          <Route path="requests/institutions" element={<ArtisanRequests />} />
          <Route path="events" element={<ArtisanEvents />} />
          <Route path="earnings" element={<ArtisanEarnings />} />
          <Route path="followers" element={<ArtisanFollowers />} />
          <Route path="products" element={<ArtisanProducts />} />
          <Route path="products/add" element={<ArtisanProducts />} />
          <Route path="products/manage" element={<ArtisanProducts />} />
          <Route path="settings" element={<ArtisanSettings />} />
        </Route>

        {/* Catch all to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
