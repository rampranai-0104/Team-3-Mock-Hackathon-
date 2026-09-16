import React, { useState } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import MarketplaceAudit from '../../components/admin/MarketplaceAudit';
import { ADMIN_PRODUCTS_LIST, ADMIN_ORDERS_LIST } from '../../data/adminMockData';
import { Package, QrCode, ShoppingBag, CheckCircle2, X } from 'lucide-react';

/**
 * AdminProductsPage - Core Feature 4: Products Module
 * Encompasses Artwork/Product Management, Marketplace Curation, Product Moderation, GI Authenticity, Provenance, Inventory, and Orders.
 */
export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'curation' | 'orders'
  const [products, setProducts] = useState(ADMIN_PRODUCTS_LIST);
  const [orders] = useState(ADMIN_ORDERS_LIST);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'review' | 'edit' | 'provenance' | 'order'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleApproveProduct = (row) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, moderation: 'Approved & Sealed' } : p))
    );
    showNotice(`Artwork "${row.title}" approved and marked for physical NFC sealing.`);
  };

  const handleRejectProduct = (row) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, moderation: 'Rejected' } : p))
    );
    showNotice(`Artwork "${row.title}" has been rejected.`);
  };

  const handleRequestChanges = (row) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, moderation: 'Changes Requested' } : p))
    );
    showNotice(`Requested composition & material changes for "${row.title}".`);
  };

  const productColumns = [
    {
      header: 'Artwork Title & Ref',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Master Artisan',
      accessor: 'artist',
    },
    {
      header: 'Tradition & Medium',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.tradition}
        </span>
      ),
    },
    {
      header: 'Fair-Wage Price',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
          {row.price}
        </span>
      ),
    },
    {
      header: 'Inventory Status',
      accessor: 'stock',
    },
    {
      header: 'GI Authenticity & Moderation',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor:
              row.moderation.includes('Approved')
                ? 'var(--color-secondary-container)'
                : row.moderation.includes('Rejected')
                ? 'var(--color-primary-container)'
                : 'var(--color-surface-container-highest)',
            color:
              row.moderation.includes('Approved')
                ? 'var(--color-on-secondary-container)'
                : row.moderation.includes('Rejected')
                ? 'var(--color-on-primary-container)'
                : 'var(--color-on-surface-variant)',
          }}
        >
          {row.moderation}
        </span>
      ),
    },
  ];

  const productActions = [
    {
      label: 'Review',
      variant: 'surface',
      onClick: (row) => {
        setSelectedProduct(row);
        setModalMode('review');
      },
    },
    {
      label: 'Edit',
      variant: 'surface',
      onClick: (row) => {
        setSelectedProduct(row);
        setModalMode('edit');
      },
    },
    {
      label: 'Provenance',
      variant: 'surface',
      onClick: (row) => {
        setSelectedProduct(row);
        setModalMode('provenance');
      },
    },
    {
      label: 'Approve',
      variant: 'primary',
      onClick: handleApproveProduct,
    },
    {
      label: 'Changes',
      variant: 'surface',
      onClick: handleRequestChanges,
    },
    {
      label: 'Reject',
      variant: 'surface',
      onClick: handleRejectProduct,
    },
  ];

  const orderColumns = [
    {
      header: 'Order ID & NFC Tag',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.id}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Tag: {row.nfcTag}</div>
        </div>
      ),
    },
    {
      header: 'Collector / Patron',
      accessor: 'collector',
    },
    {
      header: 'Acquired Artwork',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.artwork}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{row.tradition}</div>
        </div>
      ),
    },
    {
      header: 'Master Artisan',
      accessor: 'artisan',
    },
    {
      header: 'Amount',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
          {row.amount}
        </span>
      ),
    },
    {
      header: 'Settlement & Logistics',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor: row.status.includes('Settled') ? 'var(--color-secondary-container)' : 'var(--color-primary-container)',
            color: row.status.includes('Settled') ? 'var(--color-on-secondary-container)' : 'var(--color-on-primary-container)',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const orderActions = [
    {
      label: 'View Provenance',
      variant: 'surface',
      onClick: (row) => {
        setSelectedOrder(row);
        setModalMode('order');
      },
    },
    {
      label: 'Manage Order',
      variant: 'primary',
      onClick: (row) => {
        showNotice(`Order management pipeline opened for #${row.id}. Courier tracking and NFC attestation active.`);
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header & Feature Context */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Products, Marketplace Curation & Provenance
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Original Indigenous Artworks, Moderation Audits, GI Authenticity Proofs & Physical NFC Sealing
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
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'catalog' ? 700 : 500,
              backgroundColor: activeTab === 'catalog' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'catalog' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Package size={16} />
            <span>Artwork Management</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('curation')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'curation' ? 700 : 500,
              backgroundColor: activeTab === 'curation' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'curation' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <QrCode size={16} />
            <span>Marketplace Curation Audit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              backgroundColor: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <ShoppingBag size={16} />
            <span>Provenance Orders ({orders.length})</span>
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

      {/* Tab 1: Product / Artwork Management */}
      {activeTab === 'catalog' && (
        <AdminManagementView
          title="Curated Artwork Catalog & Moderation"
          subtitle="Physical Artwork Inventory, Fair-Trade Compliance & Cryptographic Authenticity Proofs"
          data={products}
          columns={productColumns}
          actions={productActions}
          searchPlaceholder="Search artworks by title, artist, tradition, or moderation status..."
          filterKey="moderation"
          filterOptions={['Approved & Sealed', 'Audit In Review', 'Changes Requested', 'Rejected']}
          addLabel="Add Masterpiece"
          onAdd={() => {
            setSelectedProduct({
              title: '',
              artist: '',
              tradition: '',
              price: '₹0',
              stock: '1 Original',
              moderation: 'Audit In Review',
            });
            setModalMode('edit');
          }}
        />
      )}

      {/* Tab 2: Marketplace Curation Audit (Bento Grid) */}
      {activeTab === 'curation' && (
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
              Provenance Seal Audit • NFC Physical Hardware Pairing & High-Resolution Artwork Inspector
            </span>
            <button
              type="button"
              className="btn-surface"
              onClick={() => showNotice('NFC Hardware Dispatch Scanner ready.')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Batch NFC Scanner
            </button>
          </div>

          <MarketplaceAudit />
        </div>
      )}

      {/* Tab 3: Provenance Orders */}
      {activeTab === 'orders' && (
        <AdminManagementView
          title="Direct Patron Acquisitions & Provenance Pipeline"
          subtitle="Masterwork Shipments, Physical NFC Verification & Escrow Settlement Records"
          data={orders}
          columns={orderColumns}
          actions={orderActions}
          searchPlaceholder="Search orders by ID, collector, artwork, or NFC tag..."
          filterKey="status"
          filterOptions={['Delivered & Settled', 'In Transit (NFC Affixed)', 'Vault Escrow Secured']}
        />
      )}

      {/* Modal Dialog for Review / Edit / Provenance / Order */}
      {(selectedProduct || selectedOrder) && modalMode && (
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
          onClick={() => {
            setSelectedProduct(null);
            setSelectedOrder(null);
          }}
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
                {modalMode === 'review' && `Product Review: ${selectedProduct?.title}`}
                {modalMode === 'edit' && `Edit Artwork: ${selectedProduct?.title}`}
                {modalMode === 'provenance' && `Provenance Record: ${selectedProduct?.title}`}
                {modalMode === 'order' && `Order Provenance: #${selectedOrder?.id}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedOrder(null);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-on-surface-variant)' }}>
              {selectedProduct && (
                <>
                  <div><strong>Reference ID:</strong> {selectedProduct.id}</div>
                  <div><strong>Tradition:</strong> {selectedProduct.tradition}</div>
                  <div><strong>Artisan:</strong> {selectedProduct.artist}</div>
                  <div><strong>Price:</strong> {selectedProduct.price}</div>
                  <div><strong>Inventory:</strong> {selectedProduct.stock}</div>
                  <div><strong>Status:</strong> {selectedProduct.moderation}</div>
                </>
              )}
              {selectedOrder && (
                <>
                  <div><strong>Order Reference:</strong> {selectedOrder.id}</div>
                  <div><strong>Collector:</strong> {selectedOrder.collector}</div>
                  <div><strong>Artwork:</strong> {selectedOrder.artwork}</div>
                  <div><strong>NFC Tag ID:</strong> {selectedOrder.nfcTag}</div>
                  <div><strong>Settlement Status:</strong> {selectedOrder.status}</div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button
                type="button"
                className="btn-surface"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedOrder(null);
                }}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  showNotice('Product metadata and provenance updated.');
                  setSelectedProduct(null);
                  setSelectedOrder(null);
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
