import React, { useState, useEffect, useCallback } from 'react';
import {
  Brush,
  ChevronRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function TaxonomyTree() {
  const [artForms, setArtForms] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [notice, setNotice] = useState(null);

  const fetchArtForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getArtForms();
      const data = res?.data || res;
      const list = Array.isArray(data?.artForms) ? data.artForms : [];
      setArtForms(list);
      setSelectedId((prev) => (prev && list.some((f) => f._id === prev)) ? prev : (list[0]?._id || null));
    } catch (err) {
      setError(err.message || 'Failed to load art forms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtForms();
  }, [fetchArtForms]);

  const selected = artForms.find((f) => f._id === selectedId) || null;

  const handleToggleStatus = async () => {
    if (!selected) return;
    const nextStatus = selected.status === 'active' ? 'inactive' : 'active';
    setToggling(true);
    try {
      const res = await adminService.updateArtForm(selected._id, { status: nextStatus });
      const updated = res?.data || res;
      setArtForms((prev) => prev.map((f) => (f._id === selected._id ? { ...f, ...updated } : f)));
      setNotice(`"${selected.name}" status updated to ${nextStatus}.`);
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update art form status.');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        width: '100%',
      }}
    >
      {/* Main Detail Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '2rem',
          borderRadius: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          gridColumn: 'span 2',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)' }}>
            <Loader2 size={18} className="animate-spin" />
            Loading art form taxonomy...
          </div>
        ) : error ? (
          <div style={{ color: 'var(--color-primary)', fontSize: '13px' }}>{error}</div>
        ) : !selected ? (
          <div style={{ color: 'var(--color-outline)', fontSize: '13px' }}>No art forms found. Add one from the Art Forms registry.</div>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span>Slug: {selected.slug}</span>
                </div>
                <h3 className="font-headline-md" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
                  {selected.name}
                </h3>
              </div>

              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: selected.status === 'active' ? 'var(--color-secondary-container)' : 'var(--color-surface-container-highest)',
                  color: selected.status === 'active' ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                }}
              >
                {selected.status}
              </span>
            </div>

            {selected.description && (
              <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px', lineHeight: 1.5 }}>
                {selected.description}
              </p>
            )}

            {/* Detail Blocks */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Regions</span>
                <div className="font-title-md" style={{ color: 'var(--color-on-surface)', marginTop: '4px', fontSize: '13px' }}>
                  {(selected.regions && selected.regions.length > 0) ? selected.regions.join(', ') : 'Not specified'}
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Techniques</span>
                <div className="font-title-md" style={{ color: 'var(--color-on-surface)', marginTop: '4px', fontSize: '13px' }}>
                  {(selected.techniques && selected.techniques.length > 0) ? selected.techniques.join(', ') : 'Not specified'}
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Materials</span>
                <div className="font-title-md" style={{ color: 'var(--color-on-surface)', marginTop: '4px', fontSize: '13px' }}>
                  {(selected.materials && selected.materials.length > 0) ? selected.materials.join(', ') : 'Not specified'}
                </div>
              </div>
            </div>

            {selected.history && (
              <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
                <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>History</span>
                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px', fontSize: '12px', lineHeight: 1.5 }}>
                  {selected.history}
                </p>
              </div>
            )}

            {notice && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {notice}
              </div>
            )}

            {/* Footer & Action */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-surface-container)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-tertiary)', fontSize: '12px' }}>
                <CheckCircle2 size={16} color="var(--color-secondary)" />
                <span>Created {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '—'}</span>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleToggleStatus}
                disabled={toggling}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                {toggling ? <RefreshCw size={14} className="animate-spin" /> : null}
                <span>{selected.status === 'active' ? 'Deactivate Art Form' : 'Activate Art Form'}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Side Taxonomy Navigation List */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '1.5rem',
          borderRadius: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 className="font-title-lg" style={{ fontSize: '16px' }}>Art Forms Catalog</h4>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>{artForms.length} Total</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '480px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ color: 'var(--color-outline)', fontSize: '13px' }}>Loading...</div>
          ) : artForms.length === 0 ? (
            <div style={{ color: 'var(--color-outline)', fontSize: '13px' }}>No art forms yet.</div>
          ) : (
            artForms.map((af) => {
              const isSelected = selectedId === af._id;
              return (
                <div
                  key={af._id}
                  onClick={() => setSelectedId(af._id)}
                  style={{
                    padding: '12px',
                    borderRadius: '0.75rem',
                    backgroundColor: isSelected
                      ? 'var(--color-surface-container-high)'
                      : 'var(--color-surface-container-low)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                      <Brush size={18} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-on-surface)' }}>
                        {af.name}
                      </div>
                      <div className="font-label-caps" style={{ color: 'var(--color-outline)', fontSize: '9px' }}>
                        {(af.regions && af.regions[0]) || af.status}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--color-outline)" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
