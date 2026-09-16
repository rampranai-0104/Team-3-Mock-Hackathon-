import React, { useState, useEffect, useCallback } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import MarketplaceAudit from '../../components/admin/MarketplaceAudit';
import adminService from '../../services/adminService';
import { Package, QrCode, ShoppingBag, CheckCircle2, X, Loader2 } from 'lucide-react';

const MODERATION_STYLE = {
  draft: { bg: 'var(--color-surface-container)', color: 'var(--color-on-surface)' },
  pending_review: { bg: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' },
  approved: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  rejected: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
  archived: { bg: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' },
};

const ORDER_STATUS_STYLE = {
  created: { bg: 'var(--color-surface-container)', color: 'var(--color-on-surface)' },
  pending: { bg: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' },
  paid: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  processing: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  shipped: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  delivered: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  cancelled: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
  refunded: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
};

/**
 * AdminProductsPage - Products & Marketplace Module
 * Wired to real backend: GET/PATCH/DELETE /api/admin/products, GET/PATCH /api/admin/orders
 */
export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'curation' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [artistOptions, setArtistOptions] = useState([]);
  const [artFormOptions, setArtFormOptions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [productForm, setProductForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const res = await adminService.getProducts({ limit: 100 });
      const data = res?.data || res;
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const res = await adminService.getOrders({ limit: 100 });
      const data = res?.data || res;
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab, orders.length, fetchOrders]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [artistRes, artFormRes] = await Promise.all([
          adminService.getArtists({ limit: 100, verificationStatus: 'approved' }),
          adminService.getArtForms({ limit: 100 }),
        ]);
        const artistData = artistRes?.data || artistRes;
        const artFormData = artFormRes?.data || artFormRes;
        setArtistOptions(Array.isArray(artistData?.artists) ? artistData.artists : []);
        setArtFormOptions(Array.isArray(artFormData?.artForms) ? artFormData.artForms : []);
      } catch (err) {
        console.error('Failed to load artist/art form options:', err.message);
      }
    }
    fetchOptions();
  }, []);

  const openCreateProduct = () => {
    setSelectedProduct(null);
    setProductForm({ artistId: '', artFormId: '', title: '', description: '', price: 0, stock: 1 });
    setModalMode('createProduct');
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    try {
      const res = await adminService.createProduct({
        artistId: productForm.artistId,
        artFormId: productForm.artFormId,
        title: productForm.title,
        description: productForm.description,
        price: Number(productForm.price) || 0,
        stock: Number(productForm.stock) || 1,
      });
      const created = res?.data || res;
      setProducts((prev) => [created, ...prev]);
      showNotice(`Product "${productForm.title}" created.`);
      setModalMode(null);
    } catch (err) {
      setError(err.message || 'Failed to create product.');
    } finally {
      setSaving(false);
    }
  };

  const handleModerateProduct = async (row, status) => {
    try {
      const res = await adminService.moderateProduct(row._id, status);
      const updated = res?.data || res;
      setProducts((prev) => prev.map((p) => (p._id === row._id ? { ...p, ...updated } : p)));
      showNotice(`Product "${row.title}" moderation set to ${status}.`);
    } catch (err) {
      setError(err.message || 'Failed to update product.');
    }
  };

  const handleDeleteProduct = async (row) => {
    if (!window.confirm(`Delete or archive "${row.title}"?`)) return;
    try {
      const res = await adminService.deleteProduct(row._id);
      const data = res?.data || res;
      if (data?.status === 'archived') {
        setProducts((prev) => prev.map((p) => (p._id === row._id ? { ...p, status: 'archived', moderationStatus: 'archived' } : p)));
        showNotice(`"${row.title}" has order history and was archived.`);
      } else {
        setProducts((prev) => prev.filter((p) => p._id !== row._id));
        showNotice(`"${row.title}" was deleted.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    }
  };

  const handleUpdateOrderStatus = async (row, status) => {
    try {
      const res = await adminService.updateOrder(row._id, status);
      const updated = res?.data || res;
      setOrders((prev) => prev.map((o) => (o._id === row._id ? { ...o, ...updated } : o)));
      showNotice(`Order #${row.orderNumber} marked as ${status}.`);
    } catch (err) {
      setError(err.message || 'Failed to update order.');
    }
  };

  const productColumns = [
    {
      header: 'Product',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>{row.artFormId?.name || '—'}</div>
        </div>
      ),
    },
    { header: 'Artist', accessor: (row) => row.artistId?.displayName || '—' },
    {
      header: 'Price',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{row.price?.toLocaleString?.() ?? row.price}</span>
      ),
    },
    { header: 'Stock', accessor: 'stock' },
    {
      header: 'Moderation',
      accessor: (row) => {
        const s = MODERATION_STYLE[row.moderationStatus] || MODERATION_STYLE.draft;
        return (
          <span className="badge-editorial" style={{ backgroundColor: s.bg, color: s.color, textTransform: 'capitalize' }}>
            {row.moderationStatus?.replace('_', ' ')}
          </span>
        );
      },
    },
  ];

  const productActions = [
    { label: 'Approve', variant: 'primary', onClick: (row) => handleModerateProduct(row, 'approved') },
    { label: 'Reject', variant: 'surface', onClick: (row) => handleModerateProduct(row, 'rejected') },
    { label: 'Delete', variant: 'surface', onClick: handleDeleteProduct },
  ];

  const orderColumns = [
    {
      header: 'Order',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>#{row.orderNumber}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>{(row.items || []).length} item(s)</div>
        </div>
      ),
    },
    { header: 'Buyer', accessor: (row) => row.buyerId?.name || '—' },
    {
      header: 'Items',
      accessor: (row) => (row.items || []).map((it) => it.title || it.name).filter(Boolean).join(', ') || '—',
    },
    {
      header: 'Total',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{row.total?.toLocaleString?.() ?? row.total}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => {
        const s = ORDER_STATUS_STYLE[row.status] || ORDER_STATUS_STYLE.created;
        return (
          <span className="badge-editorial" style={{ backgroundColor: s.bg, color: s.color, textTransform: 'capitalize' }}>
            {row.status}
          </span>
        );
      },
    },
  ];

  const orderActions = [
    { label: 'View', variant: 'surface', onClick: (row) => { setSelectedOrder(row); setModalMode('order'); } },
    { label: 'Ship', variant: 'primary', onClick: (row) => handleUpdateOrderStatus(row, 'shipped') },
    { label: 'Deliver', variant: 'surface', onClick: (row) => handleUpdateOrderStatus(row, 'delivered') },
    { label: 'Cancel', variant: 'surface', onClick: (row) => handleUpdateOrderStatus(row, 'cancelled') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Products, Marketplace & Orders
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Product catalog, moderation, and order fulfillment
          </p>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '9999px', padding: '4px', gap: '4px' }}>
          <TabButton active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} icon={<Package size={16} />} label="Product Catalog" />
          <TabButton active={activeTab === 'curation'} onClick={() => setActiveTab('curation')} icon={<QrCode size={16} />} label="Moderation Audit" />
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={16} />} label={`Orders (${orders.length})`} />
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

      {activeTab === 'catalog' && (
        loadingProducts ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', padding: '2rem' }}>
            <Loader2 size={18} className="animate-spin" /> Loading products...
          </div>
        ) : (
          <AdminManagementView
            title="Product Catalog"
            subtitle="Marketplace Inventory & Moderation Status"
            data={products}
            columns={productColumns}
            actions={productActions}
            searchPlaceholder="Search products by title, artist, or status..."
            filterKey="moderationStatus"
            filterOptions={['approved', 'pending_review', 'rejected', 'archived', 'draft']}
            addLabel="Add Product"
            onAdd={openCreateProduct}
          />
        )
      )}

      {activeTab === 'curation' && <MarketplaceAudit />}

      {activeTab === 'orders' && (
        loadingOrders ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', padding: '2rem' }}>
            <Loader2 size={18} className="animate-spin" /> Loading orders...
          </div>
        ) : (
          <AdminManagementView
            title="Order Fulfillment"
            subtitle="Buyer Acquisitions & Shipment Status"
            data={orders}
            columns={orderColumns}
            actions={orderActions}
            searchPlaceholder="Search orders by number or buyer..."
            filterKey="status"
            filterOptions={['created', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']}
          />
        )
      )}

      {/* Create Product modal */}
      {modalMode === 'createProduct' && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={() => setModalMode(null)}
        >
          <div
            style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '1.25rem', padding: '2rem', maxWidth: '520px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>Add New Product</h3>
              <button type="button" onClick={() => setModalMode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Artist</label>
                <select
                  value={productForm.artistId}
                  onChange={(e) => setProductForm((f) => ({ ...f, artistId: e.target.value }))}
                  style={modalInputStyle}
                >
                  <option value="">Select artist...</option>
                  {artistOptions.map((a) => (
                    <option key={a._id} value={a._id}>{a.displayName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Art Form</label>
                <select
                  value={productForm.artFormId}
                  onChange={(e) => setProductForm((f) => ({ ...f, artFormId: e.target.value }))}
                  style={modalInputStyle}
                >
                  <option value="">Select art form...</option>
                  {artFormOptions.map((af) => (
                    <option key={af._id} value={af._id}>{af.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Title</label>
                <input type="text" value={productForm.title || ''} onChange={(e) => setProductForm((f) => ({ ...f, title: e.target.value }))} style={modalInputStyle} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Description</label>
                <textarea value={productForm.description || ''} onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))} style={{ ...modalInputStyle, minHeight: '60px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Price</label>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))} style={modalInputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Stock</label>
                  <input type="number" value={productForm.stock} onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))} style={modalInputStyle} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button type="button" className="btn-surface" onClick={() => setModalMode(null)} style={{ padding: '8px 16px', fontSize: '13px' }}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSaveProduct} disabled={saving || !productForm.artistId || !productForm.artFormId || !productForm.title} style={{ padding: '8px 18px', fontSize: '13px' }}>
                {saving ? 'Saving...' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && modalMode === 'order' && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={() => { setSelectedOrder(null); setModalMode(null); }}
        >
          <div
            style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '1.25rem', padding: '2rem', maxWidth: '540px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>Order #{selectedOrder.orderNumber}</h3>
              <button type="button" onClick={() => { setSelectedOrder(null); setModalMode(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-on-surface-variant)' }}>
              <div><strong>Buyer:</strong> {selectedOrder.buyerId?.name} ({selectedOrder.buyerId?.email})</div>
              <div><strong>Items:</strong> {(selectedOrder.items || []).map((it) => `${it.title || it.name} x${it.quantity}`).join(', ')}</div>
              <div><strong>Subtotal:</strong> {selectedOrder.subtotal}</div>
              <div><strong>Shipping:</strong> {selectedOrder.shipping}</div>
              <div><strong>Total:</strong> {selectedOrder.total}</div>
              <div><strong>Status:</strong> {selectedOrder.status}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button type="button" className="btn-surface" onClick={() => { setSelectedOrder(null); setModalMode(null); }} style={{ padding: '8px 16px', fontSize: '13px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalInputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-surface-container-high)',
  backgroundColor: 'var(--color-surface-container-lowest)', fontSize: '13px', color: 'var(--color-on-surface)', marginTop: '4px',
};

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
