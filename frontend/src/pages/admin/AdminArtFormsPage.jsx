import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_ART_FORMS_LIST } from '../../data/adminMockData';

/**
 * AdminArtFormsPage - Cultural Taxonomy & Living Heritage Traditions
 * Connects to Express /api/admin/art-forms endpoint.
 */
export default function AdminArtFormsPage() {
  const columns = [
    {
      header: 'Tradition / Art Form',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', maxWidth: '280px', marginTop: '2px' }}>
            {row.description}
          </div>
        </div>
      ),
    },
    {
      header: 'Pigment Base & Medium',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.tradition}
        </span>
      ),
    },
    {
      header: 'Geographical Origin',
      accessor: 'region',
    },
    {
      header: 'GI Status',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}>
          {row.giStatus}
        </span>
      ),
    },
    {
      header: 'Active Custodians',
      accessor: (row) => `${row.activeArtisans} Registered`,
    },
    {
      header: 'Protection Tier',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'View Ontology', variant: 'surface' },
    { label: 'Edit Taxonomy', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="Indigenous Art Forms & Taxonomy"
      subtitle="Living Heritage Ontologies, Sacred Pigment Formulae & GI Protection Registries"
      data={ADMIN_ART_FORMS_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search traditions, GI registration IDs, sacred pigments..."
      addLabel="Register Tradition"
      onAdd={() => alert('New Tradition Registration: Ready for API connection.')}
    />
  );
}
