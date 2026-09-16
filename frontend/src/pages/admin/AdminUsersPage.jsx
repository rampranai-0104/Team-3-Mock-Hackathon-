import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_USERS_LIST } from '../../data/adminMockData';

/**
 * AdminUsersPage - Users & Multi-Tier Access Governance
 * Connects to Express /api/admin/users endpoint.
 */
export default function AdminUsersPage() {
  const columns = [
    {
      header: 'User Identity',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>ID: {row.id} • Joined {row.registered}</div>
        </div>
      ),
    },
    {
      header: 'Role / Permission Tier',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.role}
        </span>
      ),
    },
    {
      header: 'Recent Activity',
      accessor: 'activity',
    },
    {
      header: 'Governance Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.status.includes('Root') ? 'var(--color-primary-container)' : 'var(--color-secondary-container)',
            color: row.status.includes('Root') ? 'var(--color-on-primary-container)' : 'var(--color-on-secondary-container)',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'View Profile', variant: 'surface' },
    { label: 'Audit Keys', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="User Accounts & Access Control"
      subtitle="Master Artisans, Accredited Institutions, Verified Patrons & Multi-Sig Governance Keys"
      data={ADMIN_USERS_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search users by name, role, or access tier..."
      filterKey="role"
      filterOptions={['Master Artisan', 'Verified Collector', 'Institution Lead', 'Executive Admin']}
    />
  );
}
