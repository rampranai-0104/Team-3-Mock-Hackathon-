import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Public Landing & Authentication Pages */
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PatronDashboard from './pages/PatronDashboard';
import InstitutionDashboard from './pages/InstitutionDashboard';

/* Artist Dashboard Imports (Preserved 100% untouched) */
import ArtisanLayout from './pages/ArtisanLayout';
import ArtisanOverview from './pages/ArtisanOverview';
import ArtisanProfile from './pages/ArtisanProfile';
import ArtisanRequests from './pages/ArtisanRequests';
import ArtisanEvents from './pages/ArtisanEvents';
import ArtisanEarnings from './pages/ArtisanEarnings';
import ArtisanFollowers from './pages/ArtisanFollowers';
import ArtisanProducts from './pages/ArtisanProducts';
import ArtisanSettings from './pages/ArtisanSettings';

/* Admin Executive Console Imports (Preserved 100% untouched) */
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminArtistsPage from './pages/admin/AdminArtistsPage';
import AdminArtFormsPage from './pages/admin/AdminArtFormsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 3. Temporary Patron & Institution Placeholders (Minimal as requested) */}
        <Route path="/dashboard/patron" element={<PatronDashboard />} />
        <Route path="/patron" element={<Navigate to="/dashboard/patron" replace />} />

        <Route path="/dashboard/institution" element={<InstitutionDashboard />} />
        <Route path="/institution" element={<Navigate to="/dashboard/institution" replace />} />

        {/* 4. Artist Dashboard Routes (Preserved untouched) */}
        <Route path="/artisan" element={<Navigate to="/dashboard/artisan" replace />} />
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

        {/* 5. Admin Executive Console Routes (Preserved untouched) */}
        <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
        <Route path="/dashboard/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Core 6 Features */}
          <Route path="artists" element={<AdminArtistsPage />} />
          <Route path="artists/verification" element={<AdminArtistsPage />} />
          <Route path="artists/lineages" element={<AdminArtistsPage />} />

          <Route path="art-forms" element={<AdminArtFormsPage />} />
          <Route path="art-forms/taxonomy" element={<AdminArtFormsPage />} />

          <Route path="events" element={<AdminEventsPage />} />
          <Route path="events/exhibitions" element={<AdminEventsPage />} />

          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/curation" element={<AdminProductsPage />} />
          <Route path="products/orders" element={<AdminProductsPage />} />

          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/guild" element={<AdminUsersPage />} />

          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="analytics/impact" element={<AdminAnalyticsPage />} />

          <Route path="settings" element={<AdminSettingsPage />} />

          {/* Secondary aliases */}
          <Route path="requests" element={<Navigate to="/dashboard/admin/artists" replace />} />
          <Route path="bookings" element={<Navigate to="/dashboard/admin/events" replace />} />
          <Route path="orders" element={<Navigate to="/dashboard/admin/products" replace />} />
          <Route path="knowledge" element={<Navigate to="/dashboard/admin/art-forms" replace />} />
          <Route path="notifications" element={<Navigate to="/dashboard/admin/settings" replace />} />
        </Route>

        {/* Catch all to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
