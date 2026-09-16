import React, { useState } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import TaxonomyTree from '../../components/admin/TaxonomyTree';
import { ADMIN_ART_FORMS_LIST } from '../../data/adminMockData';
import { Palette, Layers, MapPin, CheckCircle2, X } from 'lucide-react';

/**
 * AdminArtFormsPage - Core Feature 2: Art Forms Module
 * Encompasses Art Forms, Traditions, Regions, Materials, Techniques, Cultural Taxonomy.
 */
export default function AdminArtFormsPage() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' | 'taxonomy' | 'regions'
  const [forms, setForms] = useState(ADMIN_ART_FORMS_LIST);
  const [selectedForm, setSelectedForm] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | 'tradition' | 'region'
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleArchiveForm = (row) => {
    const updatedStatus = row.status === 'Archived' ? 'Canonical Protected' : 'Archived';
    setForms((prev) =>
      prev.map((f) => (f.id === row.id ? { ...f, status: updatedStatus } : f))
    );
    showNotice(`Tradition "${row.title}" status changed to ${updatedStatus}.`);
  };

  const columns = [
    {
      header: 'Tradition / Art Form',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', maxWidth: '280px', marginTop: '2px' }}>
            {row.description}
          </div>
        </div>
      ),
    },
    {
      header: 'Sacred Medium & Materials',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.tradition}
        </span>
      ),
    },
    {
      header: 'Origin & Region',
      accessor: 'region',
    },
    {
      header: 'GI Legal Status',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}>
          {row.giStatus}
        </span>
      ),
    },
    {
      header: 'Active Custodians',
      accessor: (row) => `${row.activeArtisans} Registered`,
    },
    {
      header: 'Protection Tier',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.status === 'Archived' ? 'var(--color-surface-container-highest)' : 'var(--color-primary-container)',
            color: row.status === 'Archived' ? 'var(--color-on-surface-variant)' : 'var(--color-on-primary-container)',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      variant: 'surface',
      onClick: (row) => {
        setSelectedForm(row);
        setModalMode('edit');
      },
    },
    {
      label: 'Tradition',
      variant: 'surface',
      onClick: (row) => {
        setSelectedForm(row);
        setModalMode('tradition');
      },
    },
    {
      label: 'Region',
      variant: 'surface',
      onClick: (row) => {
        setSelectedForm(row);
        setModalMode('region');
      },
    },
    {
      label: 'Archive',
      variant: 'primary',
      onClick: handleArchiveForm,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header & Feature Context */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Art Forms & Cultural Taxonomy
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Living Traditions, Sacred Mineral Pigment Formulae, Geographical Indications & Generational Ontologies
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
            onClick={() => setActiveTab('registry')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'registry' ? 700 : 500,
              backgroundColor: activeTab === 'registry' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'registry' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Palette size={16} />
            <span>Art Forms Registry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('taxonomy')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'taxonomy' ? 700 : 500,
              backgroundColor: activeTab === 'taxonomy' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'taxonomy' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Layers size={16} />
            <span>Cultural Taxonomy Tree</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('regions')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'regions' ? 700 : 500,
              backgroundColor: activeTab === 'regions' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'regions' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <MapPin size={16} />
            <span>Traditions & Regions</span>
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

      {/* Tab 1: Art Forms Registry Table */}
      {activeTab === 'registry' && (
        <AdminManagementView
          title="Living Indigenous Art Forms"
          subtitle="Accredited Forms, Canonical Pigment Formulae & Legal Protection Tiers"
          data={forms}
          columns={columns}
          actions={actions}
          searchPlaceholder="Search art forms by title, tradition, region, or GI status..."
          addLabel="Add Art Form"
          onAdd={() => {
            setSelectedForm({
              title: '',
              tradition: '',
              region: '',
              giStatus: 'Pending Registration',
              activeArtisans: 0,
              description: '',
              status: 'Draft',
            });
            setModalMode('add');
          }}
        />
      )}

      {/* Tab 2: Cultural Taxonomy Tree */}
      {activeTab === 'taxonomy' && (
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
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Canonical Tree Taxonomy • Sacred Motifs, Pigment Formulations & Oral History Archive
            </span>
            <button
              type="button"
              className="btn-surface"
              onClick={() => showNotice('Taxonomy validation passed. Canonical IDs synchronized.')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Verify Canonical Hash
            </button>
          </div>

          <TaxonomyTree />
        </div>
      )}

      {/* Tab 3: Traditions & Regions */}
      {activeTab === 'regions' && (
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
              Geographical Regions & Indigenous Material Mapping
            </h3>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px' }}>
              Geographical indications (GI), tribal bedrock sources, organic pigment harvesting guidelines, and regional guild hubs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              {[
                {
                  region: 'North Sahyadri & Palghar, Maharashtra',
                  artForm: 'Warli Pictography',
                  materials: 'Geru mud plaster, rice flour binder, bamboo needle quill',
                  gi: 'GI-IN-0391 (Registered 2014)',
                  custodians: '384 Active Elders',
                },
                {
                  region: 'Dindori, Mandla & Betul, Madhya Pradesh',
                  artForm: 'Gond Chitrakala',
                  materials: 'Peeli Mitti, Sukhi geru, Cow dung wash, Chhind leaf resin',
                  gi: 'GI-IN-0442 (Registered 2018)',
                  custodians: '512 Active Elders',
                },
                {
                  region: 'Nathdwara, Udaipur, Rajasthan',
                  artForm: 'Temple Pichwai',
                  materials: 'Muslin cloth, 24K gold foil, Lapis lazuli, Kikar gum binder',
                  gi: 'GI-IN-0089 (Accredited 2008)',
                  custodians: '240 Master Craftsmen',
                },
                {
                  region: 'Raghurajpur & Puri, Odisha',
                  artForm: 'Tala Pattachitra',
                  materials: 'Tala palm-leaf strips, iron needle stylus, lamp soot ink',
                  gi: 'GI-IN-0022 (Registered 2005)',
                  custodians: '346 Lineage Artists',
                },
              ].map((item, idx) => (
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
                        {item.gi}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {item.custodians}
                      </span>
                    </div>

                    <h4 className="font-headline-sm" style={{ fontSize: '17px', marginTop: '8px', color: 'var(--color-on-surface)' }}>
                      {item.artForm}
                    </h4>

                    <div style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '2px' }}>
                      {item.region}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '8px', lineHeight: 1.5 }}>
                      <strong>Natural Medium: </strong> {item.materials}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '0.75rem', borderTop: '1px solid var(--color-surface-container)' }}>
                    <button
                      type="button"
                      className="btn-surface"
                      onClick={() => showNotice(`Managing region parameters for ${item.region}`)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
                    >
                      Manage Region
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => showNotice(`Tradition protocol opened for ${item.artForm}`)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Tradition Docs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for Add / Edit / Tradition / Region */}
      {selectedForm && modalMode && (
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
          onClick={() => setSelectedForm(null)}
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
              <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>
                {modalMode === 'add' && 'Add New Indigenous Art Form'}
                {modalMode === 'edit' && `Edit Art Form: ${selectedForm.title}`}
                {modalMode === 'tradition' && `Manage Tradition: ${selectedForm.title}`}
                {modalMode === 'region' && `Manage Region: ${selectedForm.region}`}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedForm(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Title / Tradition Name</label>
                <input
                  type="text"
                  defaultValue={selectedForm.title}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-surface-container-high)',
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    fontSize: '13px',
                    color: 'var(--color-on-surface)',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Geographic Origin Region</label>
                <input
                  type="text"
                  defaultValue={selectedForm.region}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-surface-container-high)',
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    fontSize: '13px',
                    color: 'var(--color-on-surface)',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Sacred Materials & Pigments</label>
                <input
                  type="text"
                  defaultValue={selectedForm.tradition}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-surface-container-high)',
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    fontSize: '13px',
                    color: 'var(--color-on-surface)',
                    marginTop: '4px',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button
                type="button"
                className="btn-surface"
                onClick={() => setSelectedForm(null)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  showNotice(`Saved changes for ${selectedForm.title || 'new art form'}.`);
                  setSelectedForm(null);
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Save Art Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
