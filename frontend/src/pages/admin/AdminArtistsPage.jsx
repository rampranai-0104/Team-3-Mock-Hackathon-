import React, { useState } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import VerificationQueue from '../../components/admin/VerificationQueue';
import { ADMIN_ARTISTS_LIST, ADMIN_LINEAGES_LIST } from '../../data/adminMockData';
import { Users, UserCheck, ShieldCheck, History, Award, CheckCircle2, X } from 'lucide-react';

/**
 * AdminArtistsPage - Core Feature 1: Artists Module
 * Encompasses Artist Management, Artist Profiles, Verification Queue, Lineage & Provenance.
 */
export default function AdminArtistsPage() {
  const [activeTab, setActiveTab] = useState('management'); // 'management' | 'verification' | 'lineages'
  const [artists, setArtists] = useState(ADMIN_ARTISTS_LIST);
  const [selectedArtist, setSelectedArtist] = useState(null); // for profile/provenance modal
  const [modalType, setModalType] = useState(null); // 'view' | 'edit' | 'lineage' | 'provenance'
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleSuspendArtist = (row) => {
    const updatedStatus = row.status === 'Suspended' ? 'Active' : 'Suspended';
    setArtists((prev) =>
      prev.map((a) => (a.id === row.id ? { ...a, status: updatedStatus } : a))
    );
    showNotice(`Artisan ${row.name} status updated to "${updatedStatus}".`);
  };

  const columns = [
    {
      header: 'Artist Name & Profile',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Art Form & Tradition',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.artForm}
        </span>
      ),
    },
    {
      header: 'Region / Guild',
      accessor: 'region',
    },
    {
      header: 'GI Compliance & Accreditation',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.verification.includes('GI') ? 'var(--color-secondary-container)' : 'var(--color-surface-container)',
            color: row.verification.includes('GI') ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
          }}
        >
          {row.verification}
        </span>
      ),
    },
    {
      header: 'Portfolio & Reach',
      accessor: (row) => `${row.productsCount} Artworks • ${row.eventsCount} Workshops • ${row.followersCount} Followers`,
    },
    {
      header: 'Artist Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor:
              row.status === 'Active'
                ? 'var(--color-secondary-container)'
                : row.status === 'Suspended'
                ? 'var(--color-primary-container)'
                : 'var(--color-surface-container-highest)',
            color:
              row.status === 'Active'
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
  ];

  const actions = [
    {
      label: 'View',
      variant: 'surface',
      onClick: (row) => {
        setSelectedArtist(row);
        setModalType('view');
      },
    },
    {
      label: 'Edit',
      variant: 'surface',
      onClick: (row) => {
        setSelectedArtist(row);
        setModalType('edit');
      },
    },
    {
      label: 'Lineage',
      variant: 'surface',
      onClick: (row) => {
        setSelectedArtist(row);
        setModalType('lineage');
      },
    },
    {
      label: 'Provenance',
      variant: 'surface',
      onClick: (row) => {
        setSelectedArtist(row);
        setModalType('provenance');
      },
    },
    {
      label: 'Toggle Status',
      variant: 'primary',
      onClick: handleSuspendArtist,
    },
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
            Master Artisan Profiles, Living Lineage Registries, GI Geographical Indication Compliance & Provenance Minting
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
            onClick={() => setActiveTab('management')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'management' ? 700 : 500,
              backgroundColor: activeTab === 'management' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'management' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Users size={16} />
            <span>Artist Management</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'verification' ? 700 : 500,
              backgroundColor: activeTab === 'verification' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'verification' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <UserCheck size={16} />
            <span>Verification Queue (3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lineages')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'lineages' ? 700 : 500,
              backgroundColor: activeTab === 'lineages' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'lineages' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <History size={16} />
            <span>Lineage & Provenance</span>
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

      {/* Tab 1: Artist Management View */}
      {activeTab === 'management' && (
        <AdminManagementView
          title="Master Artisan Registry"
          subtitle="Accredited Custodians, Lineage Attestations & Multi-Sig Guild Affiliations"
          data={artists}
          columns={columns}
          actions={actions}
          searchPlaceholder="Search by artist name, art form, GI accreditation, or region..."
          filterKey="status"
          filterOptions={['Active', 'Pending', 'Suspended']}
          addLabel="Onboard New Artisan"
          onAdd={() => showNotice('Artisan Onboarding Modal opened (Ready for Express API).')}
        />
      )}

      {/* Tab 2: Tvarita Verification Queue */}
      {activeTab === 'verification' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--color-surface-container-low)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--color-secondary)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                Tvarita Sovereign Living Verification Queue • 3 Applications Awaiting Attestation
              </span>
            </div>
            <button
              type="button"
              className="btn-surface"
              onClick={() => showNotice('Verification criteria refreshed against Geographical Indications Registry.')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Audit Guidelines
            </button>
          </div>

          <VerificationQueue />
        </div>
      )}

      {/* Tab 3: Lineage & Provenance Information */}
      {activeTab === 'lineages' && (
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
              Ancestral Lineages & Sacred Provenance Records
            </h3>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px' }}>
              Canonical generational trees, sacred pigment secret recipes, and oral history shlokas attested under UNESCO ICH standards.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              {ADMIN_LINEAGES_LIST.map((lin) => (
                <div
                  key={lin.id}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    backgroundColor: 'var(--color-surface-container-low)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    border: '1px solid var(--color-surface-container-high)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <span className="badge-editorial" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
                        {lin.generation}
                      </span>
                      <span className="badge-editorial" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}>
                        {lin.status}
                      </span>
                    </div>

                    <h4 className="font-headline-sm" style={{ fontSize: '18px', marginTop: '10px', color: 'var(--color-on-surface)' }}>
                      {lin.lineageTitle}
                    </h4>

                    <div style={{ fontSize: '13px', color: 'var(--color-on-surface)', fontWeight: 600, marginTop: '4px' }}>
                      Lead Custodian: {lin.masterArtist}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '2px' }}>
                      {lin.region}
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                      <div>
                        <strong style={{ color: 'var(--color-on-surface)' }}>Canonical Motif: </strong>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>{lin.canonicalMotif}</span>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--color-on-surface)' }}>Sacred Medium: </strong>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>{lin.sacredPigment}</span>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--color-on-surface)' }}>Oral Lore: </strong>
                        <span style={{ color: 'var(--color-secondary)' }}>{lin.oralRecordsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '0.75rem', borderTop: '1px solid var(--color-surface-container)' }}>
                    <button
                      type="button"
                      className="btn-surface"
                      onClick={() => showNotice(`Viewing complete ancestral tree for ${lin.masterArtist}`)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
                    >
                      View Ancestry Tree
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => showNotice(`Oral Shloka recordings stream loaded for ${lin.masterArtist}`)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Listen Lore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for View / Edit / Lineage / Provenance */}
      {selectedArtist && modalType && (
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
          onClick={() => setSelectedArtist(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              borderRadius: '1.25rem',
              padding: '2rem',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--color-primary)" />
                <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>
                  {modalType === 'view' && `Artist Profile: ${selectedArtist.name}`}
                  {modalType === 'edit' && `Edit Profile: ${selectedArtist.name}`}
                  {modalType === 'lineage' && `Lineage Dossier: ${selectedArtist.name}`}
                  {modalType === 'provenance' && `Cryptographic Provenance: ${selectedArtist.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtist(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-on-surface-variant)' }}>
              <div><strong>Registration ID:</strong> {selectedArtist.id}</div>
              <div><strong>Art Form:</strong> {selectedArtist.artForm}</div>
              <div><strong>Geographic Region:</strong> {selectedArtist.region}</div>
              <div><strong>Accreditation:</strong> {selectedArtist.verification}</div>
              <div><strong>Active Status:</strong> {selectedArtist.status}</div>
              <div><strong>Living Works:</strong> {selectedArtist.productsCount} Artworks Cataloged</div>
              <div><strong>Masterclasses Held:</strong> {selectedArtist.eventsCount} Workshops</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button
                type="button"
                className="btn-surface"
                onClick={() => setSelectedArtist(null)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  showNotice(`Action completed for ${selectedArtist.name}`);
                  setSelectedArtist(null);
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
