import React, { useState, useEffect, useCallback } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import VerificationQueue from '../../components/admin/VerificationQueue';
import adminService from '../../services/adminService';
import { ADMIN_LINEAGES_LIST } from '../../data/adminMockData';
import { Users, UserCheck, ShieldCheck, History, Award, CheckCircle2, X, Loader2 } from 'lucide-react';

const VERIFICATION_STYLE = {
  approved: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  pending: { bg: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' },
  rejected: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
  suspended: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
};

/**
 * AdminArtistsPage - Artists Module
 * Wired to real backend: GET/POST/PATCH /api/admin/artists, approve/reject endpoints.
 *
 * Note: The "Lineage & Provenance" tab below uses ADMIN_LINEAGES_LIST, a purely decorative
 * dataset. There is no backend model for artist "lineages" (no Lineage collection or fields
 * on Artist), so this tab is kept as local, static illustrative content only -- it does not
 * claim to be live data and has no wired actions beyond cosmetic notices.
 */
export default function AdminArtistsPage() {
  const [activeTab, setActiveTab] = useState('management'); // 'management' | 'verification' | 'lineages'
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view' | 'edit'
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getArtists({ limit: 100 });
      const data = res?.data || res;
      setArtists(Array.isArray(data?.artists) ? data.artists : []);
    } catch (err) {
      setError(err.message || 'Failed to load artists.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const handleToggleSuspend = async (row) => {
    const nextStatus = row.verificationStatus === 'suspended' ? 'approved' : 'suspended';
    try {
      const res = await adminService.updateArtist(row._id, { verificationStatus: nextStatus });
      const updated = res?.data || res;
      setArtists((prev) => prev.map((a) => (a._id === row._id ? { ...a, ...updated } : a)));
      showNotice(`Artist "${row.displayName}" verification status set to "${nextStatus}".`);
    } catch (err) {
      setError(err.message || 'Failed to update artist status.');
    }
  };

  const openView = (row) => {
    setSelectedArtist(row);
    setModalType('view');
  };

  const openEdit = (row) => {
    setSelectedArtist(row);
    setFormData({
      displayName: row.displayName || '',
      bio: row.bio || '',
      experience: row.experience || 0,
      city: row.location?.city || '',
      state: row.location?.state || '',
    });
    setModalType('edit');
  };

  const handleSaveEdit = async () => {
    if (!selectedArtist) return;
    setSaving(true);
    try {
      const res = await adminService.updateArtist(selectedArtist._id, {
        displayName: formData.displayName,
        bio: formData.bio,
        experience: Number(formData.experience) || 0,
        location: { city: formData.city, state: formData.state },
      });
      const updated = res?.data || res;
      setArtists((prev) => prev.map((a) => (a._id === selectedArtist._id ? { ...a, ...updated } : a)));
      showNotice(`Saved changes for ${selectedArtist.displayName}.`);
      setSelectedArtist(null);
      setModalType(null);
    } catch (err) {
      setError(err.message || 'Failed to save artist.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Artist Name & Profile',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.displayName}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
            {row.hasUserAccount ? (row.userId?.email || 'Linked account') : 'No linked account'}
          </div>
        </div>
      ),
    },
    {
      header: 'Art Forms',
      accessor: (row) => (row.artFormIds || []).map((af) => af?.name).filter(Boolean).join(', ') || '—',
    },
    {
      header: 'Region',
      accessor: (row) => [row.location?.city, row.location?.state].filter(Boolean).join(', ') || '—',
    },
    {
      header: 'Verification Status',
      accessor: (row) => {
        const s = VERIFICATION_STYLE[row.verificationStatus] || VERIFICATION_STYLE.pending;
        return (
          <span className="badge-editorial" style={{ backgroundColor: s.bg, color: s.color, textTransform: 'capitalize' }}>
            {row.verificationStatus}
          </span>
        );
      },
    },
    {
      header: 'Profile Completeness',
      accessor: (row) => `${row.profileCompleteness ?? 0}%`,
    },
    {
      header: 'Experience',
      accessor: (row) => (row.experience ? `${row.experience} yrs` : '—'),
    },
  ];

  const actions = [
    { label: 'View', variant: 'surface', onClick: openView },
    { label: 'Edit', variant: 'surface', onClick: openEdit },
    { label: 'Suspend/Restore', variant: 'primary', onClick: handleToggleSuspend },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header & Feature Context */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Artists Management & Verification
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Artist profiles, verification workflow, and lineage records
          </p>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '9999px', padding: '4px', gap: '4px' }}>
          <TabButton active={activeTab === 'management'} onClick={() => setActiveTab('management')} icon={<Users size={16} />} label="Artist Management" />
          <TabButton active={activeTab === 'verification'} onClick={() => setActiveTab('verification')} icon={<UserCheck size={16} />} label="Verification Queue" />
          <TabButton active={activeTab === 'lineages'} onClick={() => setActiveTab('lineages')} icon={<History size={16} />} label="Lineage & Provenance" />
        </div>
      </div>

      {actionNotice && (
        <div style={{ padding: '12px 16px', borderRadius: '0.75rem', backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          {actionNotice}
        </div>
      )}

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '0.75rem', backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Tab 1: Artist Management View */}
      {activeTab === 'management' && (
        loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', padding: '2rem' }}>
            <Loader2 size={18} className="animate-spin" /> Loading artists...
          </div>
        ) : (
          <AdminManagementView
            title="Artist Registry"
            subtitle="Profiles, Verification Status & Affiliations"
            data={artists}
            columns={columns}
            actions={actions}
            searchPlaceholder="Search by artist name, art form, or region..."
            filterKey="verificationStatus"
            filterOptions={['approved', 'pending', 'rejected', 'suspended']}
          />
        )
      )}

      {/* Tab 2: Verification Queue */}
      {activeTab === 'verification' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem 1.25rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="var(--color-secondary)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Artists awaiting verification approval or rejection
            </span>
          </div>
          <VerificationQueue />
        </div>
      )}

      {/* Tab 3: Lineage & Provenance (decorative-only, no backend model) */}
      {activeTab === 'lineages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 className="font-headline-sm" style={{ fontSize: '20px', color: 'var(--color-on-surface)', marginBottom: '4px' }}>
              Ancestral Lineages & Sacred Provenance Records
            </h3>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px' }}>
              Illustrative reference content only -- lineage tracking has no backend model yet.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              {ADMIN_LINEAGES_LIST.map((lin) => (
                <div key={lin.id} style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid var(--color-surface-container-high)' }}>
                  <span className="badge-editorial" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
                    {lin.generation}
                  </span>
                  <h4 className="font-headline-sm" style={{ fontSize: '18px', marginTop: '10px', color: 'var(--color-on-surface)' }}>
                    {lin.lineageTitle}
                  </h4>
                  <div style={{ fontSize: '13px', color: 'var(--color-on-surface)', fontWeight: 600, marginTop: '4px' }}>
                    Lead Custodian: {lin.masterArtist}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '2px' }}>{lin.region}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedArtist && modalType && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={() => { setSelectedArtist(null); setModalType(null); }}
        >
          <div
            style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '1.25rem', padding: '2rem', maxWidth: '540px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--color-primary)" />
                <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>
                  {modalType === 'view' && `Artist Profile: ${selectedArtist.displayName}`}
                  {modalType === 'edit' && `Edit Profile: ${selectedArtist.displayName}`}
                </h3>
              </div>
              <button type="button" onClick={() => { setSelectedArtist(null); setModalType(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                <X size={20} />
              </button>
            </div>

            {modalType === 'view' && (
              <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-on-surface-variant)' }}>
                <div><strong>Registration ID:</strong> {selectedArtist._id}</div>
                <div><strong>Art Forms:</strong> {(selectedArtist.artFormIds || []).map((af) => af?.name).filter(Boolean).join(', ') || '—'}</div>
                <div><strong>Region:</strong> {[selectedArtist.location?.city, selectedArtist.location?.state].filter(Boolean).join(', ') || '—'}</div>
                <div><strong>Verification:</strong> {selectedArtist.verificationStatus}</div>
                <div><strong>Bio:</strong> {selectedArtist.bio || '—'}</div>
                <div><strong>Experience:</strong> {selectedArtist.experience || 0} yrs</div>
              </div>
            )}

            {modalType === 'edit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FormField label="Display Name" value={formData.displayName} onChange={(v) => setFormData((f) => ({ ...f, displayName: v }))} />
                <FormField label="Bio" value={formData.bio} onChange={(v) => setFormData((f) => ({ ...f, bio: v }))} />
                <FormField label="Experience (years)" value={formData.experience} onChange={(v) => setFormData((f) => ({ ...f, experience: v }))} type="number" />
                <FormField label="City" value={formData.city} onChange={(v) => setFormData((f) => ({ ...f, city: v }))} />
                <FormField label="State" value={formData.state} onChange={(v) => setFormData((f) => ({ ...f, state: v }))} />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button type="button" className="btn-surface" onClick={() => { setSelectedArtist(null); setModalType(null); }} style={{ padding: '8px 16px', fontSize: '13px' }}>
                Close
              </button>
              {modalType === 'edit' && (
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

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px', borderRadius: '9999px', border: 'none', fontSize: '13px',
        fontWeight: active ? 700 : 500,
        backgroundColor: active ? 'var(--color-primary)' : 'transparent',
        color: active ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-surface-container-high)',
  backgroundColor: 'var(--color-surface-container-lowest)', fontSize: '13px', color: 'var(--color-on-surface)', marginTop: '4px',
};

function FormField({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>{label}</label>
      <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}
