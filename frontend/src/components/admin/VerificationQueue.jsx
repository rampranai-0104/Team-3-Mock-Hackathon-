import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function VerificationQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionStatus, setActionStatus] = useState({}); // { [id]: 'approving' | 'rejecting' }

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getArtists({ verificationStatus: 'pending' });
      const data = res?.data || res;
      setQueue(Array.isArray(data?.artists) ? data.artists : []);
    } catch (err) {
      setError(err.message || 'Failed to load verification queue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleApprove = async (id) => {
    setActionStatus((prev) => ({ ...prev, [id]: 'approving' }));
    try {
      await adminService.approveArtist(id);
      setQueue((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to approve artist.');
    } finally {
      setActionStatus((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter a reason for rejection (optional):', '') || '';
    setActionStatus((prev) => ({ ...prev, [id]: 'rejecting' }));
    try {
      await adminService.rejectArtist(id, reason);
      setQueue((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to reject artist.');
    } finally {
      setActionStatus((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const filteredQueue = queue.filter((item) => {
    const name = item.displayName || '';
    const artForms = (item.artFormIds || []).map((af) => af?.name).filter(Boolean).join(' ');
    const location = `${item.location?.city || ''} ${item.location?.state || ''}`;
    const term = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(term) ||
      artForms.toLowerCase().includes(term) ||
      location.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Search & Filter Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '1.25rem 1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div>
          <h2 className="font-headline-sm" style={{ fontSize: '20px', color: 'var(--color-on-surface)' }}>
            Pending Artist Verification
          </h2>
          <p className="font-body-md" style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Review artist profiles awaiting verification and approve or reject onboarding.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-surface-container-low)',
              padding: '6px 14px',
              borderRadius: '9999px',
            }}
          >
            <Search size={16} color="var(--color-outline)" />
            <input
              type="text"
              placeholder="Search by name, art form, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-on-surface)',
                width: '200px',
              }}
            />
          </div>

          <button
            type="button"
            className="btn-surface"
            onClick={fetchQueue}
            style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--color-primary-container)',
            color: 'var(--color-on-primary-container)',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      {/* Verification Queue Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                color: 'var(--color-on-surface-variant)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <tr>
                <th style={{ padding: '1rem 1.5rem' }}>Artist</th>
                <th style={{ padding: '1rem 1.5rem' }}>Art Forms</th>
                <th style={{ padding: '1rem 1.5rem' }}>Location</th>
                <th style={{ padding: '1rem 1.5rem' }}>Experience</th>
                <th style={{ padding: '1rem 1.5rem' }}>Profile Completeness</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px', color: 'var(--color-on-surface)' }}>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-outline)' }}>
                    <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                    Loading verification queue...
                  </td>
                </tr>
              ) : filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-outline)' }}>
                    No artists are currently pending verification.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item, index) => {
                  const status = actionStatus[item._id];
                  return (
                    <tr
                      key={item._id}
                      style={{
                        borderTop: index > 0 ? '1px solid var(--color-surface-container)' : 'none',
                      }}
                    >
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="font-title-md" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                          {item.displayName}
                        </div>
                        <div className="font-label-caps" style={{ color: 'var(--color-tertiary)', fontSize: '10px' }}>
                          {item.hasUserAccount ? (item.userId?.email || 'Linked account') : 'No linked account'}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                        {(item.artFormIds || []).length === 0 ? (
                          <span style={{ color: 'var(--color-outline)', fontSize: '12px' }}>—</span>
                        ) : (
                          (item.artFormIds || []).map((af) => (
                            <span
                              key={af._id}
                              style={{
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                backgroundColor: 'var(--color-secondary-container)',
                                color: 'var(--color-on-secondary-container)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-block',
                                marginRight: '4px',
                                marginBottom: '4px',
                              }}
                            >
                              {af.name}
                            </span>
                          ))
                        )}
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        {[item.location?.city, item.location?.state].filter(Boolean).join(', ') || '—'}
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        {item.experience ? `${item.experience} yrs` : '—'}
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        {item.profileCompleteness !== undefined ? `${item.profileCompleteness}%` : '—'}
                      </td>

                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={!!status}
                            onClick={() => handleApprove(item._id)}
                            style={{ padding: '6px 14px', fontSize: '12px', opacity: status ? 0.7 : 1 }}
                          >
                            {status === 'approving' ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            className="btn-surface"
                            disabled={!!status}
                            onClick={() => handleReject(item._id)}
                            style={{ padding: '6px 14px', fontSize: '12px', opacity: status ? 0.7 : 1 }}
                          >
                            {status === 'rejecting' ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
