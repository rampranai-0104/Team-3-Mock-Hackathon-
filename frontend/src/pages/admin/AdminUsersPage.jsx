import React, { useState, useEffect, useCallback } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import adminService from '../../services/adminService';
import { Users, ShieldCheck, CheckCircle2, X, Loader2 } from 'lucide-react';

const ROLE_STYLE = {
  admin: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
  institution: { bg: 'var(--color-tertiary-container)', color: 'var(--color-on-tertiary-container)' },
  artist: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  public: { bg: 'var(--color-surface-container)', color: 'var(--color-on-surface)' },
};

const STATUS_STYLE = {
  active: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  suspended: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
  inactive: { bg: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' },
};

/**
 * AdminUsersPage - Users Module
 * Wired to real backend: GET/PATCH/DELETE /api/admin/users
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit'
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({ limit: 100 });
      const data = res?.data || res;
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openView = (row) => {
    setSelectedUser(row);
    setModalMode('view');
  };

  const openEdit = (row) => {
    setSelectedUser(row);
    setFormData({ name: row.name || '', phone: row.phone || '', role: row.role || 'public', status: row.status || 'active' });
    setModalMode('edit');
  };

  const handleSuspendToggle = async (row) => {
    const newStatus = row.status === 'suspended' ? 'active' : 'suspended';
    try {
      await adminService.updateUserStatus(row._id, newStatus);
      setUsers((prev) => prev.map((u) => (u._id === row._id ? { ...u, status: newStatus } : u)));
      showNotice(`User "${row.name}" status changed to ${newStatus}.`);
    } catch (err) {
      setError(err.message || 'Failed to update user status.');
    }
  };

  const handleDeactivate = async (row) => {
    if (!window.confirm(`Deactivate user "${row.name}"?`)) return;
    try {
      await adminService.deleteUser(row._id);
      setUsers((prev) => prev.map((u) => (u._id === row._id ? { ...u, status: 'inactive' } : u)));
      showNotice(`User "${row.name}" deactivated.`);
    } catch (err) {
      setError(err.message || 'Failed to deactivate user.');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const res = await adminService.updateUser(selectedUser._id, formData);
      const updated = res?.data || res;
      setUsers((prev) => prev.map((u) => (u._id === selectedUser._id ? { ...u, ...updated } : u)));
      showNotice(`Updated user details for ${selectedUser.name}.`);
      setSelectedUser(null);
      setModalMode(null);
    } catch (err) {
      setError(err.message || 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-outline)' }}>ID: {row._id}</div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (row) => {
        const s = ROLE_STYLE[row.role] || ROLE_STYLE.public;
        return (
          <span className="badge-editorial" style={{ backgroundColor: s.bg, color: s.color, textTransform: 'capitalize' }}>
            {row.role}
          </span>
        );
      },
    },
    {
      header: 'Email',
      accessor: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
          {row.email || '—'}
        </span>
      ),
    },
    {
      header: 'Registered',
      accessor: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'),
    },
    {
      header: 'Status',
      accessor: (row) => {
        const s = STATUS_STYLE[row.status] || STATUS_STYLE.inactive;
        return (
          <span className="badge-editorial" style={{ backgroundColor: s.bg, color: s.color, textTransform: 'capitalize' }}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Email Verified',
      accessor: (row) => (row.emailVerified ? 'Yes' : 'No'),
    },
  ];

  const actions = [
    { label: 'View', variant: 'surface', onClick: openView },
    { label: 'Edit', variant: 'surface', onClick: openEdit },
    { label: 'Suspend/Activate', variant: 'primary', onClick: handleSuspendToggle },
    { label: 'Deactivate', variant: 'surface', onClick: handleDeactivate },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Users Management
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Public users, artists, institutions, and administrators
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', fontSize: '13px' }}>
          <Users size={16} />
          <span>{users.length} Total Users</span>
        </div>
      </div>

      {actionNotice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          {actionNotice}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-primary-container)',
            color: 'var(--color-on-primary-container)',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', padding: '2rem' }}>
          <Loader2 size={18} className="animate-spin" />
          Loading users...
        </div>
      ) : (
        <AdminManagementView
          title="User Accounts"
          subtitle="Public Patrons, Artists, Institutions & Administrators"
          data={users}
          columns={columns}
          actions={actions}
          searchPlaceholder="Search users by name, email, or role..."
          filterKey="role"
          filterOptions={['public', 'artist', 'institution', 'admin']}
        />
      )}

      {/* Modal */}
      {selectedUser && modalMode && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
          }}
          onClick={() => { setSelectedUser(null); setModalMode(null); }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '1.25rem', padding: '2rem',
              maxWidth: '520px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column', gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>
                {modalMode === 'view' && `User Profile: ${selectedUser.name}`}
                {modalMode === 'edit' && `Edit User: ${selectedUser.name}`}
              </h3>
              <button type="button" onClick={() => { setSelectedUser(null); setModalMode(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                <X size={20} />
              </button>
            </div>

            {modalMode === 'view' && (
              <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-on-surface-variant)' }}>
                <div><strong>User ID:</strong> {selectedUser._id}</div>
                <div><strong>Email:</strong> {selectedUser.email}</div>
                <div><strong>Phone:</strong> {selectedUser.phone || '—'}</div>
                <div><strong>Role:</strong> {selectedUser.role}</div>
                <div><strong>Registered:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '—'}</div>
                <div><strong>Status:</strong> {selectedUser.status}</div>
                <div><strong>Email Verified:</strong> {selectedUser.emailVerified ? 'Yes' : 'No'}</div>
              </div>
            )}

            {modalMode === 'edit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FormField label="Name" value={formData.name} onChange={(v) => setFormData((f) => ({ ...f, name: v }))} />
                <FormField label="Phone" value={formData.phone} onChange={(v) => setFormData((f) => ({ ...f, phone: v }))} />
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value }))}
                    style={selectStyle}
                  >
                    <option value="public">public</option>
                    <option value="artist">artist</option>
                    <option value="institution">institution</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                    style={selectStyle}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="suspended">suspended</option>
                  </select>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button type="button" className="btn-surface" onClick={() => { setSelectedUser(null); setModalMode(null); }} style={{ padding: '8px 16px', fontSize: '13px' }}>
                Close
              </button>
              {modalMode === 'edit' && (
                <button type="button" className="btn-primary" onClick={handleSaveEdit} disabled={saving} style={{ padding: '8px 18px', fontSize: '13px' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-surface-container-high)',
  backgroundColor: 'var(--color-surface-container-lowest)', fontSize: '13px', color: 'var(--color-on-surface)', marginTop: '4px',
};

function FormField({ label, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      />
    </div>
  );
}
