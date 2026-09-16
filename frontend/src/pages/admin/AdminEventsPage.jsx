import React, { useState, useEffect, useCallback } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import BookingLedger from '../../components/admin/BookingLedger';
import adminService from '../../services/adminService';
import { Calendar, Handshake, CheckCircle2, X, Loader2 } from 'lucide-react';

const STATUS_STYLE = {
  draft: { bg: 'var(--color-surface-container)', color: 'var(--color-on-surface)' },
  pending_approval: { bg: 'var(--color-surface-container-highest)', color: 'var(--color-on-surface-variant)' },
  published: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  ongoing: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  completed: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  cancelled: { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
};

/**
 * AdminEventsPage - Events Module
 * Wired to real backend: GET/POST/PATCH/DELETE /api/admin/events
 */
export default function AdminEventsPage() {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'escrow'
  const [events, setEvents] = useState([]);
  const [artistOptions, setArtistOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getEvents({ limit: 100 });
      const data = res?.data || res;
      setEvents(Array.isArray(data?.events) ? data.events : []);
    } catch (err) {
      setError(err.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArtistOptions = useCallback(async () => {
    try {
      const res = await adminService.getArtists({ limit: 100, verificationStatus: 'approved' });
      const data = res?.data || res;
      setArtistOptions(Array.isArray(data?.artists) ? data.artists : []);
    } catch (err) {
      // Non-blocking: artist dropdown will simply be empty
      console.error('Failed to load artists for event assignment:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchArtistOptions();
  }, [fetchEvents, fetchArtistOptions]);

  const openCreate = () => {
    setSelectedEvent(null);
    setFormData({
      title: '', type: 'workshop', artistIds: [], description: '',
      dateTime: '', durationMinutes: 60, city: '', capacity: 20, price: 0, status: 'published',
    });
    setModalMode('create');
  };

  const openEdit = (row) => {
    setSelectedEvent(row);
    setFormData({
      title: row.title || '',
      type: row.type || 'workshop',
      artistIds: (row.artistIds || []).map((a) => a._id),
      description: row.description || '',
      dateTime: row.dateTime ? new Date(row.dateTime).toISOString().slice(0, 16) : '',
      durationMinutes: row.durationMinutes || 60,
      city: row.location?.city || '',
      capacity: row.capacity || 20,
      price: row.price || 0,
      status: row.status || 'published',
    });
    setModalMode('edit');
  };

  const handleModerate = async (row, status) => {
    try {
      const res = await adminService.moderateEvent(row._id, status);
      const updated = res?.data || res;
      setEvents((prev) => prev.map((e) => (e._id === row._id ? { ...e, ...updated } : e)));
      showNotice(`Event "${row.title}" status changed to ${status}.`);
    } catch (err) {
      setError(err.message || 'Failed to update event status.');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete or cancel event "${row.title}"?`)) return;
    try {
      const res = await adminService.deleteEvent(row._id);
      const data = res?.data || res;
      if (data?.status === 'cancelled') {
        setEvents((prev) => prev.map((e) => (e._id === row._id ? { ...e, status: 'cancelled' } : e)));
        showNotice(`Event "${row.title}" has active bookings and was cancelled.`);
      } else {
        setEvents((prev) => prev.filter((e) => e._id !== row._id));
        showNotice(`Event "${row.title}" deleted.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete event.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        artistIds: formData.artistIds,
        description: formData.description,
        dateTime: formData.dateTime ? new Date(formData.dateTime).toISOString() : undefined,
        durationMinutes: Number(formData.durationMinutes) || 60,
        location: { city: formData.city },
        capacity: Number(formData.capacity) || 1,
        price: Number(formData.price) || 0,
        status: formData.status,
      };

      if (modalMode === 'create') {
        const res = await adminService.createEvent(payload);
        const created = res?.data || res;
        setEvents((prev) => [created, ...prev]);
        showNotice(`Event "${formData.title}" created.`);
      } else if (modalMode === 'edit' && selectedEvent) {
        const res = await adminService.updateEvent(selectedEvent._id, payload);
        const updated = res?.data || res;
        setEvents((prev) => prev.map((e) => (e._id === selectedEvent._id ? { ...e, ...updated } : e)));
        showNotice(`Saved changes for "${formData.title}".`);
      }
      setSelectedEvent(null);
      setModalMode(null);
    } catch (err) {
      setError(err.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Event',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', textTransform: 'capitalize' }}>{row.type}</div>
        </div>
      ),
    },
    {
      header: 'Artists',
      accessor: (row) => (row.artistIds || []).map((a) => a?.displayName).filter(Boolean).join(', ') || '—',
    },
    {
      header: 'Location',
      accessor: (row) => row.location?.city || '—',
    },
    {
      header: 'Date',
      accessor: (row) => (row.dateTime ? new Date(row.dateTime).toLocaleDateString() : '—'),
    },
    {
      header: 'Seats',
      accessor: (row) => `${row.bookedCount || 0}/${row.capacity}`,
    },
    {
      header: 'Status',
      accessor: (row) => {
        const s = STATUS_STYLE[row.status] || STATUS_STYLE.draft;
        return (
          <span className="badge-editorial" style={{ backgroundColor: s.bg, color: s.color, textTransform: 'capitalize' }}>
            {row.status?.replace('_', ' ')}
          </span>
        );
      },
    },
  ];

  const actions = [
    { label: 'Edit', variant: 'surface', onClick: openEdit },
    { label: 'Publish', variant: 'primary', onClick: (row) => handleModerate(row, 'published') },
    { label: 'Cancel', variant: 'surface', onClick: (row) => handleModerate(row, 'cancelled') },
    { label: 'Delete', variant: 'surface', onClick: handleDelete },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Events & Workshops
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Workshops, masterclasses, exhibitions, and institutional bookings
          </p>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '9999px', padding: '4px', gap: '4px' }}>
          <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={16} />} label="All Events" />
          <TabButton active={activeTab === 'escrow'} onClick={() => setActiveTab('escrow')} icon={<Handshake size={16} />} label="Bookings Ledger" />
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

      {activeTab === 'events' && (
        loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-outline)', padding: '2rem' }}>
            <Loader2 size={18} className="animate-spin" /> Loading events...
          </div>
        ) : (
          <AdminManagementView
            title="Scheduled Events & Workshops"
            subtitle="Artist Assignments, Capacity, and Publication Status"
            data={events}
            columns={columns}
            actions={actions}
            searchPlaceholder="Search events by title or type..."
            filterKey="status"
            filterOptions={['published', 'draft', 'pending_approval', 'ongoing', 'completed', 'cancelled']}
            addLabel="Create Event"
            onAdd={openCreate}
          />
        )
      )}

      {activeTab === 'escrow' && <BookingLedger />}

      {/* Modal */}
      {modalMode && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={() => { setSelectedEvent(null); setModalMode(null); }}
        >
          <div
            style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '1.25rem', padding: '2rem', maxWidth: '560px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="font-headline-sm" style={{ fontSize: '20px', margin: 0 }}>
                {modalMode === 'create' ? 'Create New Event' : `Edit Event: ${selectedEvent?.title}`}
              </h3>
              <button type="button" onClick={() => { setSelectedEvent(null); setModalMode(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FormField label="Event Title" value={formData.title} onChange={(v) => setFormData((f) => ({ ...f, title: v }))} />

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Type</label>
                <select value={formData.type} onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))} style={inputStyle}>
                  <option value="workshop">workshop</option>
                  <option value="performance">performance</option>
                  <option value="exhibition">exhibition</option>
                  <option value="masterclass">masterclass</option>
                  <option value="talk">talk</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Artists (select one or more)</label>
                <select
                  multiple
                  value={formData.artistIds || []}
                  onChange={(e) => setFormData((f) => ({ ...f, artistIds: Array.from(e.target.selectedOptions).map((o) => o.value) }))}
                  style={{ ...inputStyle, minHeight: '90px' }}
                >
                  {artistOptions.map((a) => (
                    <option key={a._id} value={a._id}>{a.displayName}</option>
                  ))}
                </select>
              </div>

              <FormField label="Description" value={formData.description} onChange={(v) => setFormData((f) => ({ ...f, description: v }))} textarea />
              <FormField label="Date & Time" value={formData.dateTime} onChange={(v) => setFormData((f) => ({ ...f, dateTime: v }))} type="datetime-local" />
              <FormField label="Duration (minutes)" value={formData.durationMinutes} onChange={(v) => setFormData((f) => ({ ...f, durationMinutes: v }))} type="number" />
              <FormField label="City" value={formData.city} onChange={(v) => setFormData((f) => ({ ...f, city: v }))} />
              <FormField label="Capacity" value={formData.capacity} onChange={(v) => setFormData((f) => ({ ...f, capacity: v }))} type="number" />
              <FormField label="Price" value={formData.price} onChange={(v) => setFormData((f) => ({ ...f, price: v }))} type="number" />

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Status</label>
                <select value={formData.status} onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))} style={inputStyle}>
                  <option value="draft">draft</option>
                  <option value="pending_approval">pending_approval</option>
                  <option value="published">published</option>
                  <option value="ongoing">ongoing</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-container)' }}>
              <button type="button" className="btn-surface" onClick={() => { setSelectedEvent(null); setModalMode(null); }} style={{ padding: '8px 16px', fontSize: '13px' }}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '8px 18px', fontSize: '13px' }}>
                {saving ? 'Saving...' : 'Save Event'}
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

function FormField({ label, value, onChange, textarea, type = 'text' }) {
  return (
    <div>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>{label}</label>
      {textarea ? (
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />
      ) : (
        <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}
