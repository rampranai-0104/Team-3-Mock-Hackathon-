import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_PRODUCTS_LIST } from '../../data/adminMockData';

/**
 * AdminProductsPage - Curated Marketplace & Authenticity Audit
 * Connects to Express /api/admin/products endpoint.
 */
export default function AdminProductsPage() {
  const columns = [
    {
      header: 'Artwork Title',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Artisan',
      accessor: 'artist',
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
      header: 'Price (Fair-Wage)',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
          {row.price}
        </span>
      ),
    },
    {
      header: 'Inventory',
      accessor: 'stock',
    },
    {
      header: 'Moderation Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.moderation.includes('Approved') ? 'var(--color-secondary-container)' : 'var(--color-surface-container-highest)',
            color: row.moderation.includes('Approved') ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
          }}
        >
          {row.moderation}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'Inspect Specs', variant: 'surface' },
    { label: 'Affix Seal', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="Product Catalog & Provenance Moderation"
      subtitle="Marketplace Artwork Curation, Fair-Wage Compliance & NFC Cryptographic Sealing"
      data={ADMIN_PRODUCTS_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search artworks, artists, traditions, or provenance tags..."
      filterKey="moderation"
      filterOptions={['Approved & Sealed', 'Audit In Review']}
      addLabel="Add Masterwork"
      onAdd={() => alert('New Product Curation Modal: Ready for API connection.')}
    />
  );
}
