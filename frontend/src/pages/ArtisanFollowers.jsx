import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Users,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import artisanService from '../services/artisanService';

export default function ArtisanFollowers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [followers, setFollowers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function loadFollowers() {
      setLoading(true);
      setError(null);
      try {
        const res = await artisanService.getFollowers({ page, limit: 20 });
        if (!mounted) return;
        setFollowers(res?.data?.followers || []);
        setFollowerCount(res?.data?.followerCount ?? 0);
        setTotalPages(res?.data?.totalPages ?? 1);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load followers.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFollowers();
    return () => { mounted = false; };
  }, [page]);

  const filteredFollowers = useMemo(
    () =>
      followers.filter((fol) =>
        (fol.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [followers, searchTerm]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Patron &amp; Collector Network
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Everyone who follows your studio, straight from your live follower list.
          </p>
        </div>
      </div>

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

      {/* Follower Stats */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '1rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '320px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Users size={24} />
        </div>
        <div>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Total Followers</span>
          <div className="font-display-hero" style={{ fontSize: '28px', color: 'var(--color-on-surface)' }}>
            {followerCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-surface-container-low)',
          padding: '8px 14px',
          borderRadius: '0.75rem',
          maxWidth: '380px',
        }}
      >
        <Search size={18} color="var(--color-outline)" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            width: '100%',
          }}
        />
      </div>

      {/* Followers Grid */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-on-surface-variant)', padding: '2rem 0' }}>
          <Loader2 size={20} className="spin" />
          <span>Loading followers…</span>
        </div>
      ) : filteredFollowers.length === 0 ? (
        <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          No followers match your search yet.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredFollowers.map((follower) => (
            <div
              key={follower.followId}
              style={{
                padding: '1.25rem',
                borderRadius: '1rem',
                backgroundColor: 'var(--color-surface-container-lowest)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {follower.user?.avatar ? (
                  <img
                    src={follower.user.avatar}
                    alt={follower.user.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-surface-container-high)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {(follower.user?.name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                    {follower.user?.name || 'Anonymous Patron'}
                  </h3>
                  {follower.user?.preferredLanguage && (
                    <div style={{ fontSize: '11px', color: 'var(--color-outline)' }}>
                      Prefers: {follower.user.preferredLanguage}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--color-outline)', paddingTop: '8px', borderTop: '1px solid var(--color-surface-container)' }}>
                Followed: {follower.followedAt ? new Date(follower.followedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn-surface"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="font-body-sm" style={{ alignSelf: 'center', color: 'var(--color-on-surface-variant)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="btn-surface"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
