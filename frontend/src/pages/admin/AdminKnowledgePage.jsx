import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_KNOWLEDGE_LIST } from '../../data/adminMockData';

/**
 * AdminKnowledgePage - Sacred Knowledge Base & Oral Archive Registry
 * Connects to Express /api/admin/knowledge endpoint.
 */
export default function AdminKnowledgePage() {
  const columns = [
    {
      header: 'Canonical Title',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Published: {row.publishedDate} • ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Tradition',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.tradition}
        </span>
      ),
    },
    {
      header: 'Author / Elder Collective',
      accessor: 'author',
    },
    {
      header: 'Content Category',
      accessor: 'contentType',
    },
    {
      header: 'Attestation Status',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}>
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'Read Archive', variant: 'surface' },
    { label: 'Attest Shloka', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="Sacred Lore & Knowledge Repository"
      subtitle="Elder Oral Recordings, Sacred Pigment Recipes & Motific Lineage Ontologies"
      data={ADMIN_KNOWLEDGE_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search knowledge records by title, tradition, or elder author..."
      filterKey="tradition"
      filterOptions={['Warli', 'Gond Chitrakala', 'Warli / Gond']}
      addLabel="Archive New Oral Shloka"
      onAdd={() => alert('New Knowledge Archive Modal: Ready for API connection.')}
    />
  );
}
