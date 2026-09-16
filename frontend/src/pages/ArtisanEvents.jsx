import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Touchpad,
  History,
  Building,
} from 'lucide-react';
import {
  UPCOMING_EVENTS,
  PAST_EVENTS,
  INITIAL_CALENDAR_DAYS,
} from '../data/artisanMockData';

export default function ArtisanEvents() {
  const [calendarDays, setCalendarDays] = useState(INITIAL_CALENDAR_DAYS);
  const [saveMessage, setSaveMessage] = useState(null);

  // Toggle Day slot between Free and Booked
  const handleToggleDay = (index) => {
    const item = calendarDays[index];
    if (!item.isCurrentMonth) return;

    const newDays = [...calendarDays];
    if (item.status === 'free') {
      newDays[index] = { ...item, status: 'booked', label: 'BOOKED' };
    } else {
      newDays[index] = { ...item, status: 'free', label: 'FREE' };
    }
    setCalendarDays(newDays);
  };

  const handleSaveSchedule = () => {
    setSaveMessage('Availability schedule synced automatically with national curators and gallery visitors.');
    setTimeout(() => setSaveMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Exhibitions, Workshops &amp; Studio Availability
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Manage your physical gallery attendance, live tribal painting demos, and public calendar.
          </p>
        </div>

        {/* Legend Indicator from artist.html */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '8px 16px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-surface-container-lowest)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '4px',
                backgroundColor: 'var(--color-secondary-container)',
              }}
            />
            <span className="font-label-md" style={{ color: 'var(--color-on-surface)' }}>
              मोकळे (Free / Open Studio)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '4px',
                backgroundColor: 'var(--color-primary)',
              }}
            />
            <span className="font-label-md" style={{ color: 'var(--color-on-surface)' }}>
              व्यस्त (Booked / Exhibition)
            </span>
          </div>
        </div>
      </div>

      {saveMessage && (
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
          {saveMessage}
        </div>
      )}

      {/* SECTION: Monthly Calendar Interactive Matrix (from artist.html) */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '1.5rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-container)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-title-lg" style={{ fontWeight: 700 }}>
              ऑक्टोबर २०२५ (October 2025)
            </span>
            <button
              type="button"
              style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-container)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Next Month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
            Touch day cell to flip status (Free ↔ Booked)
          </span>
        </div>

        {/* Day of Week Headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            textAlign: 'center',
          }}
        >
          {['रवि (SUN)', 'सोम (MON)', 'मंगळ (TUE)', 'बुध (WED)', 'गुरु (THU)', 'शुक्र (FRI)', 'शनि (SAT)'].map((d) => (
            <div
              key={d}
              className="font-label-caps"
              style={{ color: 'var(--color-outline)', padding: '6px 0' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 7-column Calendar Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
          }}
        >
          {calendarDays.map((slot, idx) => {
            if (!slot.isCurrentMonth) {
              return (
                <div
                  key={idx}
                  className="calendar-grid-cell inactive"
                >
                  <span className="font-label-md" style={{ color: 'var(--color-outline)' }}>
                    {slot.day}
                  </span>
                </div>
              );
            }

            const isFree = slot.status === 'free';
            return (
              <div
                key={idx}
                className={`calendar-grid-cell ${isFree ? 'free' : 'booked'}`}
                onClick={() => handleToggleDay(idx)}
              >
                <span className="font-title-md" style={{ fontWeight: 700 }}>
                  {slot.day}
                </span>
                <span className="font-label-caps" style={{ fontSize: '10px', fontWeight: 800 }}>
                  {slot.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Save Schedule Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '10px 14px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-surface-container-low)',
            marginTop: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--color-secondary)' }}>
              <Touchpad size={18} />
            </span>
            <span className="font-body-sm">
              Dates sync automatically with national curators and gallery visitors.
            </span>
          </div>

          <button
            type="button"
            className="btn-surface"
            onClick={handleSaveSchedule}
          >
            Save Schedule / बदल सेव्ह करा
          </button>
        </div>
      </div>

      {/* UPCOMING & PAST EVENTS */}
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
            <h2 className="font-title-lg">Upcoming Confirmed Events ({UPCOMING_EVENTS.length})</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {UPCOMING_EVENTS.map((evt) => (
              <div
                key={evt.id}
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
                  <span className="badge-secondary" style={{ fontSize: '10px' }}>
                    {evt.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={14} /> Organizer: {evt.organizer}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {evt.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '11px', color: 'var(--color-outline)' }}>
                  <span>{evt.date}</span>
                  <span>{evt.participants}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events Column */}
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
            <h2 className="font-title-lg">Past Exhibitions &amp; Archives</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PAST_EVENTS.map((past) => (
              <div
                key={past.id}
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
                  <span className="badge-tertiary" style={{ fontSize: '10px' }}>
                    Archived
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {past.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--color-outline)' }}>{past.date} • {past.attendance}</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{past.honorarium}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
