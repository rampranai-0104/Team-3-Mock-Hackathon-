import React, { useState } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import { ADMIN_USERS_LIST } from '../../data/adminMockData';
import { Users, ShieldCheck, CheckCircle2, X } from 'lucide-react';

/**
 * AdminUsersPage - Core Feature 5: Users Module
 * Encompasses Public Users, Artists, Institutions, Admins, Guild & Access Registry.
 */
export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'guild'
  const [users, setUsers] = useState(ADMIN_USERS_LIST);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit' | 'status'
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleVerifyUser = (row) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === row.id ? { ...u, status: 'Verified' } : u))
    );
    showNotice(`User "${row.name}" verified and accredited.`);
  };

  const handleSuspendUser = (row) => {
    const newStatus = row.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers((prev) =>
      prev.map((u) => (u.id === row.id ? { ...u, status: newStatus } : u))
    );
    showNotice(`User "${row.name}" status changed to ${newStatus}.`);
  };

  const handleChangeStatus = (row) => {
    setSelectedUser(row);
    setModalMode('status');
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-outline)' }}>ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (row) => {
        const getRoleBadgeStyle = (role) => {
          switch (role) {
            case 'Admin':
              return { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' };
            case 'Institution':
              return { bg: 'var(--color-tertiary-container)', color: 'var(--color-on-tertiary-container)' };
            case 'Artist':
              return { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' };
            default:
              return { bg: 'var(--color-surface-container)', color: 'var(--color-on-surface)' };
          }
        };
        const s = getRoleBadgeStyle(row.role);
        return (
          <span className="badge-editorial" style={{ backgroundColor: s.bg, color: s.color }}>
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
      header: 'Registration Date',
      accessor: 'registered',
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor:
              row.status === 'Verified' || row.status === 'Accredited'
                ? 'var(--color-secondary-container)'
                : row.status === 'Suspended'
                ? 'var(--color-primary-container)'
                : 'var(--color-surface-container-highest)',
            color:
              row.status === 'Verified' || row.status === 'Accredited'
                ? 'var(--color-on-secondary-container)'
                : row.status === 'Suspended'
                ? 'var(--color-on-primary-container)'
                : 'var(--color-on-surface-variant)',
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Activity',
      accessor: (row) => (
        <span style={{ fontSize: '12px', color: 'var(--color-on-surface)' }}>
          {row.activity}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View',
      variant: 'surface',
      onClick: (row) => {
        setSelectedUser(row);
        setModalMode('view');
      },
    },
    {
      label: 'Edit',
      variant: 'surface',
      onClick: (row) => {
        setSelectedUser(row);
        setModalMode('edit');
      },
    },
    {
      label: 'Verify',
      variant: 'surface',
      onClick: handleVerifyUser,
    },
    {
      label: 'Change Status',
      variant: 'surface',
      onClick: handleChangeStatus,
    },
    {
      label: 'Suspend',
      variant: 'primary',
      onClick: handleSuspendUser,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header & Feature Context */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Users & Guild Access Governance
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Public Users, Master Artisans, Partner Institutions, Multi-Sig Administrators & Folk Guilds
          </p>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: '9999px',
            padding: '4px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'users' ? 700 : 500,
              backgroundColor: activeTab === 'users' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'users' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Users size={16} />
            <span>All Users Directory ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guild')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'guild' ? 700 : 500,
              backgroundColor: activeTab === 'guild' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'guild' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <ShieldCheck size={16} />
            <span>Guild & Consortium Registry</span>
          </button>
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

      {/* Tab 1: All Users Directory */}
      {activeTab === 'users' && (
        <AdminManagementView
          title="Consortium User Accounts"
          subtitle="Public Patrons, Folk Guild Artisans, Museum Curators & Governance Nodes"
          data={users}
          columns={columns}
          actions={actions}
          searchPlaceholder="Search users by name, email, role, or activity..."
          filterKey="role"
          filterOptions={['Public User', 'Artist', 'Institution', 'Admin']}
          addLabel="Add User"
          onAdd={() => {
            setSelectedUser({
              name: '',
              email: '',
              role: 'Public User',
              registered: 'Today',
              status: 'Active',
              activity: 'Newly Registered',
            });
            setModalMode('edit');
          }}
        />
      )}

      {/* Tab 2: Guild & Consortium Registry */}
      {activeTab === 'guild' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.5rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h3 className="font-headline-sm" style={{ fontSize: '20px', color: 'var(--color-on-surface)', marginBottom: '4px' }}>
              Accredited Folk Guilds & Multi-Sig Signatories
            </h3>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px' }}>
              Autonomous tribal collectives holding sovereign attestation keys for GI compliance and provenance consensus.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              {[
                {
                  guild: 'Dindori Adivasi Gond Sangha',
                  region: 'Madhya Pradesh',
                  leader: 'Anand Singh Shyam',
                  members: '512 Artisans',
                  signatoryStatus: 'Multi-Sig Keyholder #01 Active',
                  compliance: 'GI-IN-0442 Compliant',
                },
                {
                  guild: 'Ganjad Warli Suvasini Guild',
                  region: 'Maharashtra',
                  leader: 'Master Bhaskar Chitrakar',
                  members: '384 Artisans',
                  signatoryStatus: 'Multi-Sig Keyholder #02 Active',
                  compliance: 'GI-IN-0391 Compliant',
                },
                {
                  guild: 'National Gallery of Modern Art (NGMA)',
                  region: 'New Delhi',
                  leader: 'Dr. Alok Ranjan',
                  members: 'Curatorial Board',
                  signatoryStatus: 'Institutional Node #03 Active',
                  compliance: 'UNESCO ICH Accredited',
                },
                {
                  guild: 'Raghurajpur Patta Shilpi Samiti',
                  region: 'Odisha',
                  leader: 'Bhaskar Chitrakar',
                  members: '346 Lineage Artists',
                  signatoryStatus: 'Multi-Sig Keyholder #04 Active',
                  compliance: 'GI-IN-0022 Compliant',
                },
              ].map((g, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    backgroundColor: 'var(--color-surface-container-low)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    border: '1px solid var(--color-surface-container-high)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge-editorial" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}>
                        {g.compliance}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>
                        {g.members}
                      </span>
                    </div>

                    <h4 className="font-headline-sm" style={{ fontSize: '17px', marginTop: '8px', color: 'var(--color-on-surface)' }}>
                      {g.guild}
                    </h4>

                    <div style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '2px' }}>
                      Region: {g.region} • Lead: {g.leader}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface)', marginTop: '8px', fontWeight: 600 }}>
                      Consensus: {g.signatoryStatus}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '0.75rem', borderTop: '1px solid var(--color-surface-container)' }}>
                    <button
                      type="button"
                      className="btn-surface"
                      onClick={() => showNotice(`Audit logs for guild "${g.guild}" loaded.`)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
                    >
                      Audit Guild
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => showNotice(`Multi-sig key verification confirmed for ${g.leader}.`)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Verify Key
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for View / Edit / Status */}
      {selectedUser && modalMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              borderRadius: '1.25rem',
              padding: '2rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>
                {modalMode === 'view' && `User Profile: ${selectedUser.name}`}
                {modalMode === 'edit' && `Edit User: ${selectedUser.name}`}
                {modalMode === 'status' && `Change Status: ${selectedUser.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-on-surface-variant)' }}>
              <div><strong>User ID:</strong> {selectedUser.id}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Role:</strong> {selectedUser.role}</div>
              <div><strong>Registration Date:</strong> {selectedUser.registered}</div>
              <div><strong>Current Status:</strong> {selectedUser.status}</div>
              <div><strong>Recent Activity:</strong> {selectedUser.activity}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button
                type="button"
                className="btn-surface"
                onClick={() => setSelectedUser(null)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  showNotice(`Updated user details for ${selectedUser.name}.`);
                  setSelectedUser(null);
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
