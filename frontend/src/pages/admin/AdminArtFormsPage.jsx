import React, { useState, useEffect, useCallback } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import TaxonomyTree from '../../components/admin/TaxonomyTree';
import adminService from '../../services/adminService';
import { Palette, Layers, CheckCircle2, X, Loader2 } from 'lucide-react';

/**
 * AdminArtFormsPage - Art Forms Module
 * Wired to real backend: GET/POST/PATCH/DELETE /api/admin/art-forms (multipart image upload).
 */
export default function AdminArtFormsPage() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' | 'taxonomy'
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const fetchForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getArtForms({ limit: 100 });
      const data = res?.data || res;
      setForms(Array.isArray(data?.artForms) ? data.artForms : []);
    } catch (err) {
      setError(err.message || 'Failed to load art forms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const openAdd = () => {
    setSelectedForm(null);
    setFormData({ name: '', description: '', regions: '', techniques: '', materials: '', status: 'active' });
    setImageFile(null);
    setModalMode('add');
  };

  const openEdit = (row) => {
    setSelectedForm(row);
    setFormData({
      name: row.name || '',
      description: row.description || '',
      regions: (row.regions || []).join(', '),
      techniques: (row.techniques || []).join(', '),
      materials: (row.materials || []).join(', '),
      status: row.status || 'active',
    });
    setImageFile(null);
    setModalMode('edit');
  };

  const handleArchive = async (row) => {
    if (!window.confirm(`Archive or remove "${row.name}"?`)) return;
    try {
      const res = await adminService.deleteArtForm(row._id);
      const data = res?.data || res;
      if (data?.status === 'inactive') {
        setForms((prev) => prev.map((f) => (f._id === row._id ? { ...f, status: 'inactive' } : f)));
        showNotice(`"${row.name}" is referenced by existing records and was archived.`);
      } else {
        setForms((prev) => prev.filter((f) => f._id !== row._id));
        showNotice(`"${row.name}" was deleted.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to archive art form.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        regions: formData.regions ? formData.regions.split(',').map((s) => s.trim()).filter(Boolean) : [],
        techniques: formData.techniques ? formData.techniques.split(',').map((s) => s.trim()).filter(Boolean) : [],
        materials: formData.materials ? formData.materials.split(',').map((s) => s.trim()).filter(Boolean) : [],
        status: formData.status,
      };
      if (imageFile) payload.image = imageFile;

      if (modalMode === 'add') {
        const res = await adminService.createArtForm(payload);
        const created = res?.data || res;
        setForms((prev) => [created, ...prev]);
        showNotice(`Art form "${formData.name}" created.`);
      } else if (modalMode === 'edit' && selectedForm) {
        const res = await adminService.updateArtForm(selectedForm._id, payload);
        const updated = res?.data || res;
        setForms((prev) => prev.map((f) => (f._id === selectedForm._id ? { ...f, ...updated } : f)));
        showNotice(`Saved changes for "${formData.name}".`);
      }
      setSelectedForm(null);
      setModalMode(null);
    } catch (err) {
      setError(err.message || 'Failed to save art form.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Art Form',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', maxWidth: '280px', marginTop: '2px' }}>
            {row.description || '—'}
          </div>
        </div>
      ),
    },
    {
      header: 'Regions',
      accessor: (row) => (row.regions || []).join(', ') || '—',
    },
    {
      header: 'Techniques',
      accessor: (row) => (row.techniques || []).join(', ') || '—',
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.status === 'active' ? 'var(--color-secondary-container)' : 'var(--color-surface-container-highest)',
            color: row.status === 'active' ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
            textTransform: 'capitalize',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: 'Edit', variant: 'surface', onClick: openEdit },
    { label: 'Archive/Delete', variant: 'primary', onClick: handleArchive },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Art Forms & Cultural Taxonomy
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Living traditions, materials, techniques, and geographic origins
          </p>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '9999px', padding: '4px', gap: '4px' }}>
          <TabButton active={activeTab === 'registry'} onClick={() => setActiveTab('registry')} icon={<Palette size={16} />} label="Art Forms Registry" />
          <TabButton active={activeTab === 'taxonomy'} onClick={() => setActiveTab('taxonomy')} icon={<Layers size={16} />} label="Cultural Taxonomy Tree" />
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

      {activeTab === 'registry' && (
        loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', padding: '2rem' }}>
            <Loader2 size={18} className="animate-spin" /> Loading art forms...
          </div>
        ) : (
          <AdminManagementView
            title="Art Forms Registry"
            subtitle="Traditions, Materials, Techniques & Regional Origins"
            data={forms}
            columns={columns}
            actions={actions}
            searchPlaceholder="Search art forms by name, region, or technique..."
            filterKey="status"
            filterOptions={['active', 'inactive', 'draft']}
            addLabel="Add Art Form"
            onAdd={openAdd}
          />
        )
      )}

      {activeTab === 'taxonomy' && <TaxonomyTree />}

      {/* Modal */}
      {modalMode && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={() => { setSelectedForm(null); setModalMode(null); }}
        >
          <div
            style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '1.25rem', padding: '2rem', maxWidth: '540px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>
                {modalMode === 'add' ? 'Add New Art Form' : `Edit Art Form: ${selectedForm?.name}`}
              </h3>
              <button type="button" onClick={() => { setSelectedForm(null); setModalMode(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FormField label="Name" value={formData.name} onChange={(v) => setFormData((f) => ({ ...f, name: v }))} />
              <FormField label="Description" value={formData.description} onChange={(v) => setFormData((f) => ({ ...f, description: v }))} textarea />
              <FormField label="Regions (comma-separated)" value={formData.regions} onChange={(v) => setFormData((f) => ({ ...f, regions: v }))} />
              <FormField label="Techniques (comma-separated)" value={formData.techniques} onChange={(v) => setFormData((f) => ({ ...f, techniques: v }))} />
              <FormField label="Materials (comma-separated)" value={formData.materials} onChange={(v) => setFormData((f) => ({ ...f, materials: v }))} />
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="draft">draft</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  style={{ ...inputStyle, padding: '6px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button type="button" className="btn-surface" onClick={() => { setSelectedForm(null); setModalMode(null); }} style={{ padding: '8px 16px', fontSize: '13px' }}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '8px 18px', fontSize: '13px' }}>
                {saving ? 'Saving...' : 'Save Art Form'}
              </button>
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

function FormField({ label, value, onChange, textarea }) {
  return (
    <div>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>{label}</label>
      {textarea ? (
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />
      ) : (
        <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}
