import React, { useState, useEffect } from 'react';
import { Users, History, School, UserCheck, Clock, Handshake, ShoppingBag } from 'lucide-react';
import adminService from '../../services/adminService';

const TILE_DEFS = [
  { key: 'users', title: 'Total Registered Users', icon: 'users', color: 'var(--color-secondary)' },
  { key: 'artists', title: 'Total Artists', icon: 'artists', color: 'var(--color-primary)' },
  { key: 'pendingArtistVerifications', title: 'Pending Verifications', icon: 'pending', color: 'var(--color-tertiary)' },
  { key: 'artForms', title: 'Active Art Forms', icon: 'artForms', color: 'var(--color-secondary)' },
  { key: 'events', title: 'Total Events', icon: 'events', color: 'var(--color-secondary)' },
  { key: 'bookings', title: 'Total Bookings', icon: 'bookings', color: 'var(--color-primary)' },
  { key: 'orders', title: 'Total Orders', icon: 'orders', color: 'var(--color-primary)' },
];

const getIcon = (name) => {
  switch (name) {
    case 'users':
      return <Users size={22} color="var(--color-secondary)" />;
    case 'artists':
      return <UserCheck size={22} color="var(--color-primary)" />;
    case 'pending':
      return <Clock size={22} color="var(--color-tertiary)" />;
    case 'artForms':
      return <History size={22} color="var(--color-secondary)" />;
    case 'events':
      return <School size={22} color="var(--color-secondary)" />;
    case 'bookings':
      return <Handshake size={22} color="var(--color-primary)" />;
    case 'orders':
      return <ShoppingBag size={22} color="var(--color-primary)" />;
    default:
      return <Users size={22} color="var(--color-primary)" />;
  }
};

export default function AdminKpiSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await adminService.getDashboardStats();
        const data = res?.data || res;
        if (mounted) setStats(data || {});
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load dashboard statistics.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchStats();
    return () => { mounted = false; };
  }, []);

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        width: '100%',
      }}
    >
      {error && (
        <div
          style={{
            gridColumn: '1 / -1',
            padding: '10px 14px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-primary-container)',
            color: 'var(--color-on-primary-container)',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      {TILE_DEFS.map((tile) => (
        <div
          key={tile.key}
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
              {tile.title}
            </span>
            {getIcon(tile.icon)}
          </div>

          <div style={{ margin: '1rem 0' }}>
            <div className="font-headline-md font-display-hero" style={{ color: 'var(--color-on-surface)' }}>
              {loading ? '—' : (stats && stats[tile.key] !== undefined ? stats[tile.key].toLocaleString() : '0')}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
