import React, { useState } from 'react';
import AdminManagementView from '../../components/admin/AdminManagementView';
import BookingLedger from '../../components/admin/BookingLedger';
import { ADMIN_EVENTS_LIST } from '../../data/adminMockData';
import { Calendar, Building, Handshake, CheckCircle2, X } from 'lucide-react';

/**
 * AdminEventsPage - Core Feature 3: Events Module
 * Encompasses Events, Exhibitions, Workshops, Masterclasses, Institutional Residencies & Escrow.
 */
export default function AdminEventsPage() {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'residencies' | 'escrow'
  const [events, setEvents] = useState(ADMIN_EVENTS_LIST);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | 'assign' | 'participants'
  const [actionNotice, setActionNotice] = useState(null);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleApproveEvent = (row) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === row.id ? { ...e, status: 'Confirmed' } : e))
    );
    showNotice(`Event "${row.title}" approved and scheduled.`);
  };

  const handleCancelEvent = (row) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === row.id ? { ...e, status: 'Cancelled' } : e))
    );
    showNotice(`Event "${row.title}" has been cancelled.`);
  };

  const columns = [
    {
      header: 'Event & Module',
      accessor: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{row.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Organizer: {row.organizer}</div>
        </div>
      ),
    },
    {
      header: 'Lead Master Artisan',
      accessor: (row) => (
        <span className="badge-editorial" style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>
          {row.artist}
        </span>
      ),
    },
    {
      header: 'Location / Venue',
      accessor: 'location',
    },
    {
      header: 'Schedule Dates',
      accessor: 'date',
    },
    {
      header: 'Cohort Size',
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
          {row.participants}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className="badge-editorial"
          style={{
            backgroundColor:
              row.status === 'Confirmed'
                ? 'var(--color-secondary-container)'
                : row.status === 'Cancelled'
                ? 'var(--color-primary-container)'
                : 'var(--color-surface-container)',
            color:
              row.status === 'Confirmed'
                ? 'var(--color-on-secondary-container)'
                : row.status === 'Cancelled'
                ? 'var(--color-on-primary-container)'
                : 'var(--color-on-surface)',
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
        setSelectedEvent(row);
        setModalMode('edit');
      },
    },
    {
      label: 'Assign Artist',
      variant: 'surface',
      onClick: (row) => {
        setSelectedEvent(row);
        setModalMode('assign');
      },
    },
    {
      label: 'Participants',
      variant: 'surface',
      onClick: (row) => {
        setSelectedEvent(row);
        setModalMode('participants');
      },
    },
    {
      label: 'Approve',
      variant: 'primary',
      onClick: handleApproveEvent,
    },
    {
      label: 'Cancel',
      variant: 'surface',
      onClick: handleCancelEvent,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header & Feature Context */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Events, Exhibitions & Institutional Masterclasses
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Living Heritage Workshops, Corporate Residencies, Museum Loans & Smart Escrow Clearances
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
            onClick={() => setActiveTab('events')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'events' ? 700 : 500,
              backgroundColor: activeTab === 'events' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'events' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Calendar size={16} />
            <span>All Events & Workshops</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('residencies')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'residencies' ? 700 : 500,
              backgroundColor: activeTab === 'residencies' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'residencies' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Building size={16} />
            <span>Exhibitions & Residencies</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('escrow')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'escrow' ? 700 : 500,
              backgroundColor: activeTab === 'escrow' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'escrow' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Handshake size={16} />
            <span>Institutional Escrow (₹42.5L)</span>
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

      {/* Tab 1: All Events & Workshops */}
      {activeTab === 'events' && (
        <AdminManagementView
          title="Scheduled Masterclasses & Workshops"
          subtitle="Living Heritage Sessions, Master Artisan Assignments & Participant Registrations"
          data={events}
          columns={columns}
          actions={actions}
          searchPlaceholder="Search events by title, organizer, artist, or venue..."
          filterKey="status"
          filterOptions={['Confirmed', 'Scheduled', 'Cancelled']}
          addLabel="Create Event"
          onAdd={() => {
            setSelectedEvent({
              title: '',
              artist: '',
              organizer: '',
              location: '',
              date: '',
              participants: '',
              status: 'Scheduled',
            });
            setModalMode('create');
          }}
        />
      )}

      {/* Tab 2: Exhibitions & Institutional Residencies */}
      {activeTab === 'residencies' && (
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
              Institutional Exhibitions & Corporate Residencies
            </h3>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px' }}>
              Museum partnerships, tech campus cultural hubs, and public festival pavilions with full artist accommodation & material grants.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              {[
                {
                  id: 'RES-01',
                  title: 'National Gallery of Modern Art (NGMA) Residency',
                  host: 'NGMA New Delhi',
                  dates: 'Oct 14 - 18, 2025',
                  artisan: 'Master Bhaskar Chitrakar',
                  cohort: '24 Curatorial Scholars',
                  grant: '₹4,50,000 Fully Escrowed',
                  status: 'Active Now',
                },
                {
                  id: 'RES-02',
                  title: 'Google India Heritage Campus Residency',
                  host: 'Google India Heritage Labs (Bengaluru)',
                  dates: 'Oct 28 - 30, 2025',
                  artisan: 'Mayur Vayeda & Ganjad Collective',
                  cohort: '240 Tech Participants',
                  grant: '₹6,50,000 Milestone 2 Approved',
                  status: 'Confirmed',
                },
                {
                  id: 'RES-03',
                  title: 'Kala Ghoda Living Heritage Pavilion',
                  host: 'Mumbai Heritage Arts Trust',
                  dates: 'Nov 12 - 16, 2025',
                  artisan: 'Anand Singh Shyam & Warli Elders',
                  cohort: 'Public Walk-in Exhibition',
                  grant: '₹5,20,000 Civic Trust Grant',
                  status: 'Scheduled',
                },
              ].map((item) => (
                <div
                  key={item.id}
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
                        {item.status}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-outline)' }}>
                        {item.id}
                      </span>
                    </div>

                    <h4 className="font-headline-sm" style={{ fontSize: '17px', marginTop: '8px', color: 'var(--color-on-surface)' }}>
                      {item.title}
                    </h4>

                    <div style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '2px' }}>
                      Host: {item.host} • {item.dates}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '8px', lineHeight: 1.5 }}>
                      <div><strong>Lead Artist: </strong> {item.artisan}</div>
                      <div><strong>Cohort: </strong> {item.cohort}</div>
                      <div><strong>Honorarium Grant: </strong> <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.grant}</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '0.75rem', borderTop: '1px solid var(--color-surface-container)' }}>
                    <button
                      type="button"
                      className="btn-surface"
                      onClick={() => showNotice(`Viewing curatorial dossier for ${item.title}`)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
                    >
                      Dossier
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => showNotice(`Logistics & Travel Grant cleared for ${item.artisan}`)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Logistics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Institutional Escrow Pipeline */}
      {activeTab === 'escrow' && (
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
              Institutional Escrow Ledger • ₹42,50,000 Secured • 0% Extractive Intermediary Cut
            </span>
            <button
              type="button"
              className="btn-surface"
              onClick={() => showNotice('Escrow multi-sig state audited. All funds locked in sovereign smart contract.')}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Verify Smart Escrow
            </button>
          </div>

          <BookingLedger />
        </div>
      )}

      {/* Modal Dialog for Create / Edit / Assign / Participants */}
      {selectedEvent && modalMode && (
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
          onClick={() => setSelectedEvent(null)}
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
                {modalMode === 'create' && 'Create New Masterclass / Event'}
                {modalMode === 'edit' && `Edit Event: ${selectedEvent.title}`}
                {modalMode === 'assign' && `Assign Lead Artist: ${selectedEvent.title}`}
                {modalMode === 'participants' && `Cohort Participants: ${selectedEvent.title}`}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Event Title</label>
                <input
                  type="text"
                  defaultValue={selectedEvent.title}
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
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Lead Master Artisan</label>
                <input
                  type="text"
                  defaultValue={selectedEvent.artist}
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
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Host / Institution</label>
                <input
                  type="text"
                  defaultValue={selectedEvent.organizer}
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
                onClick={() => setSelectedEvent(null)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  showNotice(`Event saved successfully.`);
                  setSelectedEvent(null);
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
