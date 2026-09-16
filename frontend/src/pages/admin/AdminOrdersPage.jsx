import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_ORDERS_LIST } from '../../data/adminMockData';

/**
 * AdminOrdersPage - Direct Collector Orders & Physical Provenance Tracking
 * Connects to Express /api/admin/orders endpoint.
 */
export default function AdminOrdersPage() {
  const columns = [
    {
      header: 'Order Reference',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.id}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>NFC: {row.nfcTag}</div>
        </div>
      ),
    },
    {
      header: 'Collector / Patron',
      accessor: 'collector',
    },
    {
      header: 'Acquired Artwork',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.artwork}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{row.tradition}</div>
        </div>
      ),
    },
    {
      header: 'Master Artisan',
      accessor: 'artisan',
    },
    {
      header: 'Amount',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
          {row.amount}
        </span>
      ),
    },
    {
      header: 'Fulfillment & Provenance',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.status.includes('Settled') ? 'var(--color-secondary-container)' : 'var(--color-primary-container)',
            color: row.status.includes('Settled') ? 'var(--color-on-secondary-container)' : 'var(--color-on-primary-container)',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'Dispatch Details', variant: 'surface' },
    { label: 'Verify NFC', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="Collector Orders & Provenance Pipeline"
      subtitle="Masterwork Direct Acquisitions, Physical NFC Tag Sealing & Payout Clearances"
      data={ADMIN_ORDERS_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search orders by collector, artwork, artisan, or NFC tag..."
      filterKey="status"
      filterOptions={['Delivered & Settled', 'In Transit (NFC Affixed)', 'Vault Escrow Secured']}
    />
  );
}
