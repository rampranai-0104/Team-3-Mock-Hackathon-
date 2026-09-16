import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Camera,
  DollarSign,
  PlusCircle,
  Package,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import ArtworkImage from '../components/common/ArtworkImage';
import artisanService from '../services/artisanService';

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export default function ArtisanProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'add' ? 'add' : 'manage';

  const handleTabSwitch = (tab) => {
    setSearchParams({ tab });
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishMessage, setPublishMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await artisanService.getProducts();
      setProducts(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'painting',
    price: '35000',
    stock: '1',
    description: '',
    imageFile: null,
    imagePreview: '',
  });

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewProduct((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!newProduct.title.trim()) {
      alert('Please provide an Artwork Title.');
      return;
    }

    const priceNum = Number(newProduct.price) || 0;
    const stockNum = Number(newProduct.stock) || 1;

    setSubmitting(true);
    try {
      const res = await artisanService.createProduct({
        title: newProduct.title.trim(),
        description: newProduct.description || 'Authentic hand-painted artwork with natural pigments.',
        price: priceNum,
        stock: stockNum,
        category: newProduct.category || 'painting',
      });

      const createdId = res?.data?._id;

      if (createdId && newProduct.imageFile) {
        try {
          await artisanService.uploadProductMedia(createdId, newProduct.imageFile);
        } catch (uploadErr) {
          console.warn('Product created, but media upload failed:', uploadErr.message);
        }
      }

      setPublishMessage(`"${newProduct.title}" was published to your catalog.`);
      handleTabSwitch('manage');
      setNewProduct({
        title: '',
        category: 'painting',
        price: '35000',
        stock: '1',
        description: '',
        imageFile: null,
        imagePreview: '',
      });
      await loadProducts();
      setTimeout(() => setPublishMessage(null), 4000);
    } catch (err) {
      alert(`Could not publish artwork: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (product) => {
    const isSoldOut = product.stock <= 0 || product.status === 'inactive';
    try {
      await artisanService.updateProduct(product._id, {
        status: isSoldOut ? 'active' : 'inactive',
        stock: isSoldOut ? 1 : 0,
      });
      await loadProducts();
    } catch (err) {
      alert(`Could not update product: ${err.message}`);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Remove "${product.title}" from your live catalog?`)) return;
    try {
      await artisanService.deleteProduct(product._id);
      await loadProducts();
    } catch (err) {
      alert(`Could not remove product: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Studio Inventory &amp; Live Gallery Catalog
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            List, price, and manage your handcrafted artworks.
          </p>
        </div>

        {activeTab === 'manage' && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => handleTabSwitch('add')}
          >
            <Camera size={20} />
            <span>Add New Painting</span>
          </button>
        )}
      </div>

      {publishMessage && (
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
          {publishMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-error-container, #fdecea)',
            color: 'var(--color-on-error-container, #611a15)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          type="button"
          onClick={() => handleTabSwitch('manage')}
          className={`tab-pill ${activeTab === 'manage' ? 'active' : ''}`}
        >
          <Package size={18} />
          <span>Manage Products ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('add')}
          className={`tab-pill ${activeTab === 'add' ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          <span>Add Artwork</span>
        </button>
      </div>

      {/* TAB: ADD PRODUCT */}
      {activeTab === 'add' && (
        <form
          onSubmit={handlePublish}
          style={{
            backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: '1.5rem',
            padding: '1.75rem',
            boxShadow: '0 4px 12px rgba(44, 42, 41, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-surface-container-high)', paddingBottom: '1rem' }}>
            <h2 className="font-title-lg">List a New Artwork</h2>
            <span className="badge-secondary">Draft</span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.5rem',
              borderRadius: '1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Artwork Title
              </label>
              <input
                type="text"
                placeholder="e.g., Lagna Chowk Ritual Mural"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface-container-low)',
                }}
              />
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface-container-low)',
                }}
              />
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Price (₹)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={16} />
                <input
                  type="number"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'var(--color-surface-container-low)',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Stock (units available)
              </label>
              <input
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface-container-low)',
                }}
              />
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Photo
              </label>
              <input type="file" accept="image/*" onChange={handleImageSelect} />
              {newProduct.imagePreview && (
                <img
                  src={newProduct.imagePreview}
                  alt="Preview"
                  style={{ marginTop: '8px', width: '100%', maxWidth: '160px', height: '120px', objectFit: 'cover', borderRadius: '0.5rem' }}
                />
              )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the artwork, materials, and story behind it..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface-container-low)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="btn-surface"
              onClick={() => handleTabSwitch('manage')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              {submitting ? <Loader2 size={16} className="spin" /> : null}
              <span>{submitting ? 'Publishing…' : 'Publish Artwork →'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: MANAGE PRODUCTS */}
      {activeTab === 'manage' && (
        <>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-on-surface-variant)', padding: '2rem 0' }}>
              <Loader2 size={20} className="spin" />
              <span>Loading your products…</span>
            </div>
          ) : products.length === 0 ? (
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              You haven't listed any artworks yet. Click "Add New Painting" to get started.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {products.map((p) => {
                const isSoldOut = p.stock <= 0 || p.status === 'inactive';
                return (
                  <div
                    key={p._id}
                    style={{
                      borderRadius: '1rem',
                      backgroundColor: 'var(--color-surface-container-lowest)',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ position: 'relative', height: '220px' }}>
                        <ArtworkImage src={p.images?.[0]?.url || p.media?.[0]?.url} alt={p.title} style={{ width: '100%', height: '100%' }} />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(251, 249, 243, 0.95)',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '10px',
                            fontWeight: 700,
                          }}
                        >
                          {isSoldOut ? 'SOLD OUT' : 'IN STOCK'}
                        </span>
                        <span
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-on-secondary)',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '14px',
                            fontWeight: 700,
                          }}
                        >
                          {formatINR(p.price)}
                        </span>
                      </div>

                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span className="font-label-caps" style={{ color: 'var(--color-outline)', fontSize: '10px' }}>
                          {p.category} • Stock: {p.stock}
                        </span>

                        <h3 className="font-title-lg" style={{ color: 'var(--color-on-surface)' }}>
                          {p.title}
                        </h3>

                        <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.5' }}>
                          {p.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Card Controls */}
                    <div
                      style={{
                        padding: '1rem 1.25rem',
                        borderTop: '1px solid var(--color-surface-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          color: 'var(--color-secondary)',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        <ShieldCheck size={16} /> {p.moderationStatus}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => toggleAvailability(p)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--color-surface-container)',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--color-on-surface)',
                          }}
                        >
                          {isSoldOut ? 'Mark Available' : 'Mark Sold'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--color-surface-container)',
                            color: 'var(--color-error)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Delete / Archive Artwork"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
