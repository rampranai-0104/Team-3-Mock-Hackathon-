import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  UserCheck,
  Building,
  CheckCircle,
  XCircle,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Flag,
} from 'lucide-react';
import artisanService from '../services/artisanService';

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const statusBadgeClass = (status) => {
  if (status === 'accepted' || status === 'completed') return 'badge-secondary';
  if (status === 'rejected' || status === 'cancelled') return 'badge-tertiary';
  return 'badge-primary';
};

export default function ArtisanRequests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'institutions' ? 'institutions' : 'individual';

  const handleTabSwitch = (tab) => {
    setSearchParams({ tab });
  };

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await artisanService.getRequests();
      setRequests(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // The backend Request model distinguishes requests via `requesterType`
  // ('public' or 'institution'); there is no separate endpoint per type.
  const individualList = useMemo(
    () => requests.filter((r) => (r.requesterType || 'public') === 'public'),
    [requests]
  );
  const institutionList = useMemo(
    () => requests.filter((r) => r.requesterType === 'institution'),
    [requests]
  );

  const handleStatusChange = async (request, newStatus) => {
    setActioningId(request._id);
    try {
      await artisanService.updateRequestStatus(request._id, newStatus);
      setNotification(`Request from ${request.requesterId?.name || 'requester'} marked as ${newStatus}.`);
      await loadRequests();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert(`Could not update request: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const renderCard = (req) => (
    <div
      key={req._id}
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
            {req.requesterId?.avatar ? (
              <img
                src={req.requesterId.avatar}
                alt={req.requesterId?.name || 'Requester'}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-container-high)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {(req.requesterId?.name || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{req.requesterId?.name || 'Unknown Requester'}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-outline)' }}>
                {req.location?.city ? `${req.location.city}${req.location.state ? ', ' + req.location.state : ''}` : 'Location not specified'}
              </div>
            </div>
          </div>
          <span className={statusBadgeClass(req.status)} style={{ fontSize: '11px', textTransform: 'capitalize' }}>
            {req.status}
          </span>
        </div>

        <div style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
            {req.title || req.eventType} {req.artFormId?.name ? `• ${req.artFormId.name}` : ''}
          </div>
          {req.message && (
            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px', fontStyle: 'italic' }}>
              "{req.message}"
            </p>
          )}
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
            Group size: {req.groupSize || 1}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '12px' }}>
          <span style={{ color: 'var(--color-outline)' }}>
            Preferred: {req.preferredDate ? new Date(req.preferredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Flexible'}
          </span>
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)' }}>
            {formatINR(req.budget)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-surface-container)' }}>
        {req.status === 'pending' && (
          <>
            <button
              type="button"
              className="btn-primary"
              disabled={actioningId === req._id}
              onClick={() => handleStatusChange(req, 'accepted')}
              style={{ flex: 1, padding: '8px', fontSize: '12px' }}
            >
              <CheckCircle size={14} /> Accept
            </button>
            <button
              type="button"
              className="btn-surface"
              disabled={actioningId === req._id}
              onClick={() => handleStatusChange(req, 'rejected')}
              style={{ flex: 1, padding: '8px', fontSize: '12px' }}
            >
              <XCircle size={14} /> Reject
            </button>
          </>
        )}
        {req.status === 'accepted' && (
          <>
            <button
              type="button"
              className="btn-primary"
              disabled={actioningId === req._id}
              onClick={() => handleStatusChange(req, 'completed')}
              style={{ flex: 1, padding: '8px', fontSize: '12px' }}
            >
              <Flag size={14} /> Mark Completed
            </button>
            <button
              type="button"
              className="btn-surface"
              disabled={actioningId === req._id}
              onClick={() => handleStatusChange(req, 'cancelled')}
              style={{ flex: 1, padding: '8px', fontSize: '12px' }}
            >
              <XCircle size={14} /> Cancel
            </button>
          </>
        )}
        {(req.status === 'completed' || req.status === 'rejected' || req.status === 'cancelled') && (
          <div style={{ width: '100%', textAlign: 'center', fontSize: '12px', color: 'var(--color-secondary)', fontWeight: 600 }}>
            No further action available
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Studio Commissions &amp; Event Inquiries
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Direct collector requests and institutional invitations.
          </p>
        </div>
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
          <span>Individual Requests ({individualList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('institutions')}
          className={`tab-pill ${activeTab === 'institutions' ? 'active' : ''}`}
        >
          <Building size={18} />
          <span>Institution Requests ({institutionList.length})</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-on-surface-variant)', padding: '2rem 0' }}>
          <Loader2 size={20} className="spin" />
          <span>Loading requests…</span>
        </div>
      ) : (
        <>
          {activeTab === 'individual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {individualList.length === 0 ? (
                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No individual requests yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {individualList.map(renderCard)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'institutions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {institutionList.length === 0 ? (
                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No institutional requests yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {institutionList.map(renderCard)}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
