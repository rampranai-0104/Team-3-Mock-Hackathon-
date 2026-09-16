import React from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_EVENTS_LIST } from '../../data/adminMockData';

/**
 * AdminEventsPage - Cultural Events, Masterclasses & Institutional Residencies
 * Connects to Express /api/admin/events endpoint.
 */
export default function AdminEventsPage() {
  const columns = [
    {
      header: 'Event & Module',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Host: {row.organizer}</div>
        </div>
      ),
    },
    {
      header: 'Lead Master Artisan',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.artist}
        </span>
      ),
    },
    {
      header: 'Location / Venue',
      accessor: 'location',
    },
    {
      header: 'Dates',
      accessor: 'date',
    },
    {
      header: 'Cohort Size',
      accessor: 'participants',
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.status === 'Confirmed' ? 'var(--color-secondary-container)' : 'var(--color-surface-container)',
            color: row.status === 'Confirmed' ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface)',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'Event Details', variant: 'surface' },
    { label: 'Approve Schedule', variant: 'primary' },
  ];

  return (
    <AdminManagementView
      title="Masterclasses & Residencies"
      subtitle="Institutional Cultural Immersion Events, Schedule Coordination & Attendance Audit"
      data={ADMIN_EVENTS_LIST}
      columns={columns}
      actions={actions}
      searchPlaceholder="Search events, host institutions, or lead artists..."
      filterKey="status"
      filterOptions={['Confirmed', 'Scheduled']}
      addLabel="Schedule Masterclass"
      onAdd={() => alert('Schedule Masterclass Modal: Ready for API connection.')}
    />
  );
}
