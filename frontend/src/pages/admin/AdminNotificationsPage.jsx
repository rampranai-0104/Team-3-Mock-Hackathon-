import React, { useState } from 'react';
import { ADMIN_NOTIFICATIONS_LIST } from '../../data/adminMockData';
import { Bell, CheckCheck, ShieldCheck, CreditCard, Sparkles, Truck } from 'lucide-react';

/**
 * AdminNotificationsPage - Administrative Event Stream & Provenance Alerts
 * Connects to Express /api/admin/notifications endpoint.
 */
export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(ADMIN_NOTIFICATIONS_LIST);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Artisan Verification':
        return <ShieldCheck size={18} color="var(--color-secondary)" />;
      case 'Institutional Escrow':
        return <CreditCard size={18} color="var(--color-primary)" />;
      case 'Provenance Minting':
        return <Sparkles size={18} color="var(--color-tertiary)" />;
      case 'Logistics Attestation':
        return <Truck size={18} color="var(--color-primary)" />;
      default:
        return <Bell size={18} color="var(--color-primary)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            System Notifications & Governance Alerts
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Real-time verification events, escrow milestone completions and provenance attestations
          </p>
        </div>

        <button
          type="button"
          className="btn-surface"
          onClick={markAllRead}
          style={{ padding: '8px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <CheckCheck size={16} />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        {notifications.map((item, idx) => (
          <div
            key={item.id}
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              borderTop: idx > 0 ? '1px solid var(--color-surface-container)' : 'none',
              backgroundColor: item.unread ? 'var(--color-surface-container-lowest)' : 'var(--color-surface-container-low)',
              transition: 'background-color 0.2s',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {getCategoryIcon(item.category)}
            </div>

            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
                  {item.category}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-outline)', fontFamily: 'var(--font-sans)' }}>
                  {item.time}
                </span>
              </div>

              <div
                style={{
                  marginTop: '6px',
                  fontSize: '14px',
                  fontWeight: item.unread ? 600 : 400,
                  color: 'var(--color-on-surface)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {item.title}
              </div>
            </div>

            {item.unread && (
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  flexShrink: 0,
                  marginTop: '6px',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
