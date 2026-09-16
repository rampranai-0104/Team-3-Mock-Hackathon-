import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  UserCheck,
  Building,
  CheckCircle,
  XCircle,
  Calendar,
  Car,
  Brush,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { INDIVIDUAL_REQUESTS, INSTITUTION_REQUESTS } from '../data/artisanMockData';

export default function ArtisanRequests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'institutions' ? 'institutions' : 'individual';

  const handleTabSwitch = (tab) => {
    setSearchParams({ tab });
  };

  // State for individual requests
  const [individualList, setIndividualList] = useState(INDIVIDUAL_REQUESTS);
  // State for institution requests
  const [institutionList, setInstitutionList] = useState(INSTITUTION_REQUESTS);

  const [notification, setNotification] = useState(null);

  const handleIndividualAction = (id, newStatus) => {
    setIndividualList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setNotification(`Request ${id} marked as ${newStatus}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInstitutionAccept = (id, orgName, amount) => {
    setInstitutionList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Confirmed & Accepted' } : item))
    );
    setNotification(`Accepted workshop from ${orgName} (${amount}). Added to your studio calendar!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleProposeDate = (orgName) => {
    const proposed = prompt(`Enter proposed new dates for ${orgName}:`, 'Nov 18 - 22, 2025');
    if (proposed) {
      alert(`Proposed date "${proposed}" sent to ${orgName} coordinator via SMS and Studio Dispatch.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Studio Commissions &amp; Event Inquiries
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Direct collector requests and national institutional invitations with zero platform commission.
          </p>
        </div>

        <span className="badge-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
          Honorarium Guarantee Active
        </span>
      </div>

      {notification && (
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
          {notification}
        </div>
      )}

      {/* Big Tactile Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => handleTabSwitch('individual')}
          className={`tab-pill ${activeTab === 'individual' ? 'active' : ''}`}
        >
          <UserCheck size={18} />
          <span>१. Individual Requests ({individualList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('institutions')}
          className={`tab-pill ${activeTab === 'institutions' ? 'active' : ''}`}
        >
          <Building size={18} />
          <span>२. Group &amp; Institution Requests ({institutionList.length})</span>
        </button>
      </div>

      {/* TAB 1: INDIVIDUAL REQUESTS */}
      {activeTab === 'individual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {individualList.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={req.avatar}
                        alt={req.requesterName}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{req.requesterName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-outline)' }}>{req.location}</div>
                      </div>
                    </div>
                    <span
                      className={`badge-${req.status === 'Accepted' || req.status === 'Completed' ? 'secondary' : req.status === 'Rejected' ? 'tertiary' : 'primary'}`}
                      style={{ fontSize: '11px' }}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                      {req.requestType}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px', fontStyle: 'italic' }}>
                      "{req.message}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--color-outline)' }}>Proposed: {req.date}</span>
                    <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)' }}>
                      {req.proposedAmount}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-surface-container)' }}>
                  {req.status !== 'Accepted' && req.status !== 'Completed' ? (
                    <>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => handleIndividualAction(req.id, 'Accepted')}
                        style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                      >
                        <CheckCircle size={14} /> Accept
                      </button>
                      <button
                        type="button"
                        className="btn-surface"
                        onClick={() => handleIndividualAction(req.id, 'Rejected')}
                        style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  ) : (
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '12px', color: 'var(--color-secondary)', fontWeight: 600 }}>
                      ✓ Order In Motion
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn-surface"
                    onClick={() => alert(`Details for ${req.requesterName}:\nArtwork: ${req.artworkInterest}\nContact: Phone SMS Linked\nAmount: ${req.proposedAmount}`)}
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GROUP & INSTITUTION REQUESTS (Matching artist.html style) */}
      {activeTab === 'institutions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {institutionList.map((inst) => (
              <div
                key={inst.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-sans)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        backgroundColor: 'var(--color-primary-fixed)',
                        color: 'var(--color-on-primary-fixed-variant)',
                      }}
                    >
                      {inst.badge}
                    </span>
                    <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                      {inst.dates}
                    </span>
                  </div>

                  <h3 className="font-title-lg" style={{ color: 'var(--color-on-surface)', marginTop: '4px' }}>
                    {inst.organization}
                  </h3>
                  <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {inst.location} • {inst.wing}
                  </p>

                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '0.75rem',
                      backgroundColor: 'var(--color-surface-container-low)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-on-surface-variant)' }}>
                        <Users size={16} color="var(--color-secondary)" /> Participants
                      </span>
                      <span style={{ fontWeight: 700 }}>{inst.participants}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-on-surface-variant)' }}>
                        <Car size={16} color="var(--color-secondary)" /> Travel &amp; Stay
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{inst.travel}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-on-surface-variant)' }}>
                        <Brush size={16} color="var(--color-secondary)" /> Materials
                      </span>
                      <span style={{ fontWeight: 700 }}>{inst.materials}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1rem' }}>
                  {inst.status !== 'Confirmed & Accepted' ? (
                    <>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleInstitutionAccept(inst.id, inst.organization, inst.honorarium)}
                        style={{ width: '100%', padding: '12px' }}
                      >
                        <CheckCircle size={18} />
                        <span>Accept Workshop ({inst.honorarium})</span>
                      </button>

                      <button
                        type="button"
                        className="btn-surface"
                        onClick={() => handleProposeDate(inst.organization)}
                        style={{ width: '100%', color: 'var(--color-primary)' }}
                      >
                        <Calendar size={16} />
                        <span>Propose New Date / तारीख बदला</span>
                      </button>
                    </>
                  ) : (
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '0.75rem',
                        backgroundColor: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                        fontWeight: 700,
                        textAlign: 'center',
                        fontSize: '13px',
                      }}
                    >
                      ✓ Workshop Confirmed &amp; Added to Calendar
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
