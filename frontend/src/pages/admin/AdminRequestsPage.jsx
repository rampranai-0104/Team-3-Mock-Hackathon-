import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_REQUESTS_LIST } from '../../data/adminMockData';

/**
 * AdminRequestsPage - Institutional & Individual Custom Commission Pipeline
 * Connects to Express /api/admin/requests endpoint.
 */
export default function AdminRequestsPage() {
  const columns = [
    {
      header: 'Request Reference',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.id}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{row.date}</div>
        </div>
      ),
    },
    {
      header: 'Requester / Entity',
      accessor: 'requester',
    },
    {
      header: 'Engagement Type',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.type}
        </span>
      ),
    },
    {
      header: 'Requested Master Artisan',
      accessor: 'artist',
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.status === 'Approved' ? 'var(--color-secondary-container)' : 'var(--color-primary-container)',
            color: row.status === 'Approved' ? 'var(--color-on-secondary-container)' : 'var(--color-on-primary-container)',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'View Brief', variant: 'surface' },
    { label: 'Approve Escrow', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="Commission & Residency Requests"
      subtitle="Institutional Briefs, Collector Custom Commissions & Guild Allocation"
      data={ADMIN_REQUESTS_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search requests by entity, type, or requested artisan..."
      filterKey="status"
      filterOptions={['Approved', 'In Review']}
    />
  );
}
