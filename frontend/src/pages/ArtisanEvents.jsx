import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  CheckCircle2,
  History,
  Building,
  PlusCircle,
  Loader2,
  AlertTriangle,
  Ban,
} from 'lucide-react';
import artisanService from '../services/artisanService';

const EVENT_TYPES = ['workshop', 'performance', 'exhibition', 'masterclass', 'talk'];

const emptyForm = {
  title: '',
  type: 'workshop',
  dateTime: '',
  durationMinutes: '60',
  capacity: '20',
  price: '0',
  city: '',
  description: '',
};

export default function ArtisanEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await artisanService.getEvents();
      setEvents(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const now = useMemo(() => new Date(), []);

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => e.status !== 'cancelled' && e.status !== 'completed' && new Date(e.dateTime) >= now)
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
    [events, now]
  );

  const pastEvents = useMemo(
    () =>
      events
        .filter((e) => e.status === 'completed' || (e.status !== 'cancelled' && new Date(e.dateTime) < now))
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)),
    [events, now]
  );

  const cancelledEvents = useMemo(
    () => events.filter((e) => e.status === 'cancelled'),
    [events]
  );

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dateTime) {
      alert('Please provide a title and a date/time for the event.');
      return;
    }

    setSubmitting(true);
    try {
      await artisanService.createEvent({
        title: form.title.trim(),
        type: form.type,
        dateTime: new Date(form.dateTime).toISOString(),
        durationMinutes: Number(form.durationMinutes) || 60,
        capacity: Number(form.capacity) || 1,
        price: Number(form.price) || 0,
        description: form.description,
        location: { city: form.city },
        status: 'pending_approval',
      });
      setMessage('Workshop proposal submitted for admin approval.');
      setForm(emptyForm);
      setShowForm(false);
      await loadEvents();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      alert(`Could not submit event: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEvent = async (event) => {
    if (!window.confirm(`Cancel "${event.title}"? This cannot be undone.`)) return;
    try {
      await artisanService.cancelEvent(event._id);
      await loadEvents();
    } catch (err) {
      alert(`Could not cancel event: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Exhibitions, Workshops &amp; Studio Events
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Propose new workshops and manage your event calendar.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          <PlusCircle size={18} />
          <span>{showForm ? 'Close Form' : 'Propose New Workshop'}</span>
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          {message}
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

      {/* NEW EVENT FORM */}
      {showForm && (
        <form
          onSubmit={handleCreateEvent}
          style={{
            padding: '1.5rem',
            borderRadius: '1.5rem',
            backgroundColor: 'var(--color-surface-container-lowest)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
              Workshop Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
            />
          </div>

          <div>
            <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={form.dateTime}
              onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
            />
          </div>

          <div>
            <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
              Duration (minutes)
            </label>
            <input
              type="number"
              min="15"
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
            />
          </div>

          <div>
            <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
              Capacity
            </label>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
            />
          </div>

          <div>
            <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
              Price per seat (₹)
            </label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
            />
          </div>

          <div>
            <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-surface" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="spin" /> : null}
              <span>{submitting ? 'Submitting…' : 'Submit for Approval'}</span>
            </button>
          </div>
          <p className="font-body-sm" style={{ gridColumn: '1 / -1', color: 'var(--color-on-surface-variant)' }}>
            New workshops are submitted as "pending approval" — an admin must publish them before they appear publicly.
          </p>
        </form>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-on-surface-variant)', padding: '2rem 0' }}>
          <Loader2 size={20} className="spin" />
          <span>Loading your events…</span>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Upcoming Events Column */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.5rem',
              borderRadius: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={20} color="var(--color-primary)" />
              <h2 className="font-title-lg">Upcoming Events ({upcomingEvents.length})</h2>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No upcoming events.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt._id}
                    style={{
                      padding: '14px',
                      borderRadius: '1rem',
                      backgroundColor: 'var(--color-surface-container-low)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                        {evt.title}
                      </h3>
                      <span className="badge-secondary" style={{ fontSize: '10px', textTransform: 'capitalize' }}>
                        {evt.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building size={14} /> {evt.type}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {evt.location?.city || 'Location TBD'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '11px', color: 'var(--color-outline)' }}>
                      <span>{new Date(evt.dateTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{evt.bookedCount || 0}/{evt.capacity} booked</span>
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleCancelEvent(evt)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--color-surface-container)',
                          color: 'var(--color-error)',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Ban size={14} /> Cancel Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past & Cancelled Events Column */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.5rem',
              borderRadius: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} color="var(--color-secondary)" />
              <h2 className="font-title-lg">Past &amp; Cancelled Events</h2>
            </div>

            {pastEvents.length === 0 && cancelledEvents.length === 0 ? (
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No past events yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...pastEvents, ...cancelledEvents].map((past) => (
                  <div
                    key={past._id}
                    style={{
                      padding: '14px',
                      borderRadius: '1rem',
                      backgroundColor: 'var(--color-surface-container-low)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                        {past.title}
                      </h3>
                      <span className="badge-tertiary" style={{ fontSize: '10px', textTransform: 'capitalize' }}>
                        {past.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {past.location?.city || 'Location TBD'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--color-outline)' }}>
                        {new Date(past.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {past.bookedCount || 0} booked
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>₹{Number(past.price || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
