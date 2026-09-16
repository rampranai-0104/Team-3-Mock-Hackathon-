import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_ARTISTS_LIST } from '../../data/adminMockData';

/**
 * AdminArtistsPage - Master Artisan Registry & Verification Governance
 * Readily connects to Express /api/admin/artists endpoint.
 */
export default function AdminArtistsPage() {
  const columns = [
    {
      header: 'Artisan Name',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Art Form & Lineage',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.artForm}
        </span>
      ),
    },
    {
      header: 'Region / Guild',
      accessor: 'region',
    },
    {
      header: 'Accreditation',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.verification.includes('GI') ? 'var(--color-secondary-container)' : 'var(--color-surface-container)',
            color: row.verification.includes('GI') ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
          }}
        >
          {row.verification}
        </span>
      ),
    },
    {
      header: 'Portfolio',
      accessor: (row) => `${row.productsCount} Artworks • ${row.eventsCount} Workshops`,
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.status === 'Active' ? 'var(--color-secondary-container)' : 'var(--color-surface-container-highest)',
            color: row.status === 'Active' ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'View Dossier', variant: 'surface' },
    { label: 'Audit Lineage', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="Master Artisan Registry"
      subtitle="Sovereign Guild Artisans, Lineage Proofs & GI Geographical Indication Accreditations"
      data={ADMIN_ARTISTS_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search by artisan name, lineage, GI badge, or region..."
      filterKey="status"
      filterOptions={['Active', 'Pending']}
      addLabel="Onboard Master Artisan"
      onAdd={() => alert('Artisan Onboarding Modal: Ready for API connection.')}
    />
  );
}
