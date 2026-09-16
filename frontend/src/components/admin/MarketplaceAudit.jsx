import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import ArtworkImage from '../common/ArtworkImage';

const MODERATION_LABEL = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  archived: 'Archived',
};

export default function MarketplaceAudit() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  const [actionId, setActionId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getProducts();
      const data = res?.data || res;
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showAlert = (msg) => {
    setActiveAlert(msg);
    setTimeout(() => setActiveAlert(null), 3500);
  };

  const handleModerate = async (id, status, title) => {
    setActionId(id);
    try {
      const res = await adminService.moderateProduct(id, status);
      const updated = res?.data || res;
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...updated } : p)));
      showAlert(`"${title}" marked as ${MODERATION_LABEL[status] || status}.`);
    } catch (err) {
      setError(err.message || 'Failed to update product moderation status.');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Remove "${title}" from the marketplace?`)) return;
    setActionId(id);
    try {
      await adminService.deleteProduct(id);
      await fetchProducts();
      showAlert(`"${title}" removed or archived.`);
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Marketplace Product Moderation
          </h2>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Review, approve, or reject products submitted to the marketplace.
          </p>
        </div>

        <button
          type="button"
          className="btn-surface"
          onClick={fetchProducts}
          style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {activeAlert && (
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
          {activeAlert}
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
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div style={{ color: 'var(--color-outline)', padding: '2rem', textAlign: 'center' }}>
          No products found.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((product) => {
            const imageUrl = product.images?.[0]?.url || product.media?.[0]?.url || '';
            const isBusy = actionId === product._id;
            return (
              <div
                key={product._id}
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ position: 'relative', height: '220px', borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <ArtworkImage src={imageUrl} alt={product.title} style={{ width: '100%', height: '100%' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(251, 249, 243, 0.95)',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--color-on-surface)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {MODERATION_LABEL[product.moderationStatus] || product.moderationStatus}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                      {product.artFormId?.name || 'Unassigned'}
                    </span>
                    <span className="font-title-md" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                      {product.price?.toLocaleString?.() ?? product.price}
                    </span>
                  </div>

                  <h4 className="font-headline-sm" style={{ fontSize: '18px', color: 'var(--color-on-surface)' }}>
                    {product.title}
                  </h4>

                  <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.4' }}>
                    Artist: <strong>{product.artistId?.displayName || '—'}</strong> • Stock: {product.stock}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={isBusy || product.moderationStatus === 'approved'}
                    onClick={() => handleModerate(product._id, 'approved', product.title)}
                    style={{ flex: 1, padding: '10px', fontSize: '13px', minWidth: '100px' }}
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button
                    type="button"
                    className="btn-surface"
                    disabled={isBusy || product.moderationStatus === 'rejected'}
                    onClick={() => handleModerate(product._id, 'rejected', product.title)}
                    style={{ padding: '10px', fontSize: '13px' }}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(product._id, product.title)}
                    style={{
                      padding: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-surface-container-high)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Delete / Archive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
