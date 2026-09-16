import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Camera,
  Mic,
  DollarSign,
  PlusCircle,
  Package,
  CheckCircle2,
  Trash2,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { PRODUCTS_CATALOG } from '../data/artisanMockData';
import ArtworkImage from '../components/common/ArtworkImage';

export default function ArtisanProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'add' ? 'add' : 'manage';

  const handleTabSwitch = (tab) => {
    setSearchParams({ tab });
  };

  // Products state
  const [products, setProducts] = useState(PRODUCTS_CATALOG);
  const [publishMessage, setPublishMessage] = useState(null);

  // 3-Step Creation Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'Sacred Ritual Murals',
    dimensions: '30" x 30"',
    medium: 'Natural Rice Flour on Geru Canvas',
    price: '35000',
    description: '',
    isGICertified: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfYOLqnyFuizYb_zyRj_3XOnbSi9VdMFDGaHapNLL0GbY6X7NpnT1ICUf3GylM8NnJfW-_Zyuvzkh_RE3XFZH-WfxlFQcPyU0LyoyeWgEKOizNkUEYjEedYOnFT6oo7Pet_JyVvpWowOVxEKA5TXWl-Gp6WdsowGIlYOSFbCcmV4L-tVL5ePWze_OuGw0IAR65zijvpzp0rcUDYlEfSAn5BifKRAatFd7BF7fox-hHv_jVs0puQLpXKg',
  });

  const handleVoiceRecord = () => {
    alert("रेकॉर्डिंग सुरू: तुमची कथा बोला... (Voice recorded in Marathi: 'हे चित्र लग्नातील शुभ चौकाचे आहे, ज्यामध्ये निसर्ग आणि सुवासिनींचा आशीर्वाद आहे.')");
    setNewProduct((prev) => ({
      ...prev,
      description: 'Sacred wedding blessing chowk invoked with Suvasini songs for household abundance and fertility.',
    }));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newProduct.title) {
      alert('Please provide an Artwork Title.');
      return;
    }

    const created = {
      id: `PRD-${Date.now()}`,
      title: newProduct.title,
      category: newProduct.category,
      dimensions: newProduct.dimensions,
      medium: newProduct.medium,
      price: `₹${Number(newProduct.price).toLocaleString()}`,
      stockStatus: 'IN STOCK • READY TO SHIP',
      isGICertified: newProduct.isGICertified,
      orders: 'New listing',
      description: newProduct.description || 'Authentic hand-painted Warli artwork with natural pigments.',
      image: newProduct.image,
    };

    setProducts([created, ...products]);
    setPublishMessage(`"${created.title}" successfully published to Public Gallery & Provenance Ledger!`);
    handleTabSwitch('manage');
    setWizardStep(1);
    setNewProduct({
      title: '',
      category: 'Sacred Ritual Murals',
      dimensions: '30" x 30"',
      medium: 'Natural Rice Flour on Geru Canvas',
      price: '35000',
      description: '',
      isGICertified: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfYOLqnyFuizYb_zyRj_3XOnbSi9VdMFDGaHapNLL0GbY6X7NpnT1ICUf3GylM8NnJfW-_Zyuvzkh_RE3XFZH-WfxlFQcPyU0LyoyeWgEKOizNkUEYjEedYOnFT6oo7Pet_JyVvpWowOVxEKA5TXWl-Gp6WdsowGIlYOSFbCcmV4L-tVL5ePWze_OuGw0IAR65zijvpzp0rcUDYlEfSAn5BifKRAatFd7BF7fox-hHv_jVs0puQLpXKg',
    });
    setTimeout(() => setPublishMessage(null), 4000);
  };

  const toggleAvailability = (id) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isSold = item.stockStatus.includes('SOLD');
          return {
            ...item,
            stockStatus: isSold ? 'IN STOCK • READY TO SHIP' : 'SOLD OUT • IN ARCHIVE',
          };
        }
        return item;
      })
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this artwork from your live catalog?')) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
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
            Simple 3-step listing process for master artisans. Touch the button to snap or speak.
          </p>
        </div>

        {activeTab === 'manage' && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => handleTabSwitch('add')}
          >
            <Camera size={20} />
            <span>नवीन कलाकृती जोडा (Photograph &amp; List New Painting)</span>
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          type="button"
          onClick={() => handleTabSwitch('manage')}
          className={`tab-pill ${activeTab === 'manage' ? 'active' : ''}`}
        >
          <Package size={18} />
          <span>१. Manage Products ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('add')}
          className={`tab-pill ${activeTab === 'add' ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          <span>२. 3-Step Add Artwork Flow</span>
        </button>
      </div>

      {/* TAB: 3-STEP ADD PRODUCTS WIZARD (From artist.html) */}
      {activeTab === 'add' && (
        <div
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                ★
              </span>
              <h2 className="font-title-lg">Simple 3-Step Listing for Master Artisans</h2>
            </div>
            <span className="badge-secondary">Draft In Progress</span>
          </div>

          {/* 3 Step Visual Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Step 1: Camera */}
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'var(--color-surface-container-lowest)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: wizardStep === 1 ? '2px solid var(--color-primary)' : '1px solid transparent',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-fixed)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  cursor: 'pointer',
                }}
                onClick={() => alert('Camera active: Select or capture high-resolution painting on your phone.')}
              >
                <Camera size={32} />
              </div>
              <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                १. फोटो काढा (Step 1: Take Photo)
              </h3>
              <p className="font-body-sm" style={{ color: 'var(--color-outline)', marginTop: '4px' }}>
                Tap your phone camera or select from studio gallery.
              </p>
              <span
                style={{
                  marginTop: '10px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-surface-container)',
                  fontSize: '10px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Back camera recommended
              </span>
            </div>

            {/* Step 2: Voice Story */}
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'var(--color-surface-container-lowest)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: wizardStep === 2 ? '2px solid var(--color-secondary)' : '1px solid transparent',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  cursor: 'pointer',
                }}
                onClick={handleVoiceRecord}
              >
                <Mic size={32} />
              </div>
              <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                २. तोंडी सांगा (Step 2: Voice Story)
              </h3>
              <p className="font-body-sm" style={{ color: 'var(--color-outline)', marginTop: '4px' }}>
                Speak the folklore story in Marathi or your tribal dialect.
              </p>
              <span
                style={{
                  marginTop: '10px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                  fontSize: '10px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                }}
              >
                Auto-translates to English
              </span>
            </div>

            {/* Step 3: Set Price */}
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'var(--color-surface-container-lowest)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: wizardStep === 3 ? '2px solid var(--color-tertiary)' : '1px solid transparent',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-tertiary-fixed)',
                  color: 'var(--color-on-tertiary-fixed-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <DollarSign size={32} />
              </div>
              <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                ३. किंमत ठरवा (Step 3: Set Price)
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>₹</span>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={{
                    width: '120px',
                    padding: '6px 10px',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    fontWeight: 700,
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'var(--color-surface-container)',
                  }}
                />
              </div>
              <span
                style={{
                  marginTop: '10px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                  fontSize: '10px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                }}
              >
                You get 100% of this amount
              </span>
            </div>
          </div>

          {/* Form Specifications Input */}
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
                Artwork Title / चित्राचे नाव
              </label>
              <input
                type="text"
                placeholder="e.g., Suvasini Lagna Chowk Ritual"
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
                Dimensions (Inches)
              </label>
              <input
                type="text"
                value={newProduct.dimensions}
                onChange={(e) => setNewProduct({ ...newProduct, dimensions: e.target.value })}
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
                Medium &amp; Natural Pigments
              </label>
              <input
                type="text"
                value={newProduct.medium}
                onChange={(e) => setNewProduct({ ...newProduct, medium: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface-container-low)',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Folklore Story &amp; Description (Transcribed from Voice)
              </label>
              <textarea
                rows={3}
                placeholder="Click voice button above or type story..."
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
              type="button"
              className="btn-primary"
              onClick={handlePublish}
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              Publish Artwork to Public Gallery &amp; Ledger →
            </button>
          </div>
        </div>
      )}

      {/* TAB: MANAGE PRODUCTS (From artist.html) */}
      {activeTab === 'manage' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
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
                  <ArtworkImage src={p.image} alt={p.title} style={{ width: '100%', height: '100%' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(251, 249, 243, 0.95)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                  >
                    {p.stockStatus}
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
                    {p.price}
                  </span>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="font-label-caps" style={{ color: 'var(--color-outline)', fontSize: '10px' }}>
                    {p.medium} • {p.dimensions}
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
                  }}
                >
                  <ShieldCheck size={16} /> GI Certified
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => toggleAvailability(p.id)}
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
                    {p.stockStatus.includes('SOLD') ? 'Mark Available' : 'Mark Sold'}
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(`Print QR Tag & Authenticity label for ${p.title}`)}
                    style={{
                      padding: '6px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-surface-container)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Print QR Tag"
                  >
                    <QrCode size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
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
                    title="Delete Artwork"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
