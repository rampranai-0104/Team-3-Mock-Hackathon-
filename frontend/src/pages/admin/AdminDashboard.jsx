import React, { useState } from 'react';
import SystemBanner from '../../components/admin/SystemBanner';
import AdminKpiSection from '../../components/admin/AdminKpiSection';
import VerificationQueue from '../../components/admin/VerificationQueue';
import TaxonomyTree from '../../components/admin/TaxonomyTree';
import BookingLedger from '../../components/admin/BookingLedger';
import MarketplaceAudit from '../../components/admin/MarketplaceAudit';
import AnalyticsVisualizations from '../../components/admin/AnalyticsVisualizations';
import {
  UserCheck,
  Layers,
  Handshake,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('queue');

  const tabs = [
    { id: 'queue', label: 'Artisan Verification Queue', count: 5, icon: UserCheck },
    { id: 'taxonomy', label: 'Cultural Taxonomy Tree', count: null, icon: Layers },
    { id: 'bookings', label: 'Institutional Bookings Ledger', count: null, icon: Handshake },
    { id: 'marketplace', label: 'Marketplace Curation Audit', count: null, icon: CheckCircle },
    { id: 'analytics', label: 'Analytical Visualizations', count: null, icon: BarChart3 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Top Operational Banner & System Header from admin.html */}
      <SystemBanner />

      {/* Macro Impact KPIs: High Editorial Plinths */}
      <AdminKpiSection />

      {/* Interactive Control Tabs (Console Controller from admin.html) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {/* Pill Container */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-surface-container-low)',
              padding: '6px',
              borderRadius: '9999px',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                    color: isSelected ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 1px 4px rgba(159, 60, 22, 0.25)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isSelected
                          ? 'var(--color-surface-container-lowest)'
                          : 'var(--color-surface-container-high)',
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-on-surface)',
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-outline)',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
            className="xl-flex"
          >
            <span>SECURITY LEVEL 4</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} />
            <span>ROOT MULTI-SIG ACTIVATED</span>
          </div>
        </div>

        {/* Active Tab Panel */}
        <div style={{ marginTop: '0.5rem' }}>
          {activeTab === 'queue' && <VerificationQueue />}
          {activeTab === 'taxonomy' && <TaxonomyTree />}
          {activeTab === 'bookings' && <BookingLedger />}
          {activeTab === 'marketplace' && <MarketplaceAudit />}
          {activeTab === 'analytics' && <AnalyticsVisualizations />}
        </div>
      </div>
    </div>
  );
}
