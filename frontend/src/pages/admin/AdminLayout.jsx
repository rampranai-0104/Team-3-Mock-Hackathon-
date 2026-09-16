import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Gavel } from 'lucide-react';
import '../../styles/admin.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      {/* Persistent Left Sidebar / Mobile Drawer */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main-wrapper">
        <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="admin-main">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            {/* Child Route Page Content */}
            <Outlet />

            {/* Cultural Protocol Footer Notice from admin.html */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'var(--color-surface-container-low)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                marginTop: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--color-secondary)' }}>
                  <Gavel size={24} />
                </span>
                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', maxWidth: '650px', fontSize: '13px' }}>
                  All provenance certificates, tribal welfare payouts, and oral archives are cryptographically attested according to the <strong>UNESCO Convention for the Safeguarding of the Intangible Cultural Heritage</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                  Network Consensus: 100% OK
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
