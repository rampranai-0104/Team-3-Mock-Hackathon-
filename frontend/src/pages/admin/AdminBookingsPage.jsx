import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_BOOKINGS_LIST } from '../../data/adminMockData';

/**
 * AdminBookingsPage - Institutional Bookings Ledger & Escrow Releases
 * Connects to Express /api/admin/bookings endpoint.
 */
export default function AdminBookingsPage() {
  const columns = [
    {
      header: 'Booking / Institution',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.institution}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Program / Workshop',
      accessor: 'program',
    },
    {
      header: 'Assigned Master Guild',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.artisan}
        </span>
      ),
    },
    {
      header: 'Cohort Size',
      accessor: 'cohort',
    },
    {
      header: 'Escrow Amount',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
          {row.escrow}
        </span>
      ),
    },
    {
      header: 'Dates',
      accessor: 'date',
    },
    {
      header: 'Escrow Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor:
              row.status === 'Ready for Release'
                ? 'var(--color-primary-container)'
                : row.status === 'Disbursed'
                ? 'var(--color-secondary-container)'
                : 'var(--color-surface-container)',
            color:
              row.status === 'Ready for Release'
                ? 'var(--color-on-primary-container)'
                : row.status === 'Disbursed'
                ? 'var(--color-on-secondary-container)'
                : 'var(--color-on-surface)',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'View Contract', variant: 'surface' },
    { label: 'Execute Release', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="Institutional Bookings & Escrow Ledger"
      subtitle="Corporate Residencies, Educational Masterclasses & Milestone-Based Smart Escrow"
      data={ADMIN_BOOKINGS_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search bookings by institution, program, artisan, or escrow status..."
      filterKey="status"
      filterOptions={['Ready for Release', 'Pending Milestone', 'Disbursed']}
    />
  );
}
