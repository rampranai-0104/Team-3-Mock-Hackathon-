import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  MapPin,
  Brush,
  CheckCircle2,
  Edit3,
  Save,
  Loader2,
  AlertTriangle,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import artisanService from '../services/artisanService';

export default function ArtisanProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    city: '',
    state: '',
    country: '',
    languages: '',
    experience: '',
  });

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await artisanService.getProfile();
      const data = res?.data || null;
      setProfile(data);
      if (data) {
        setForm({
          displayName: data.displayName || '',
          bio: data.bio || '',
          city: data.location?.city || '',
          state: data.location?.state || '',
          country: data.location?.country || 'India',
          languages: (data.languages || []).join(', '),
          experience: data.experience ?? '',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load your profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await artisanService.updateProfile({
        displayName: form.displayName.trim(),
        bio: form.bio,
        location: { city: form.city, state: form.state, country: form.country },
        languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
        experience: Number(form.experience) || 0,
      });
      setIsEditing(false);
      setSaveSuccess(true);
      await loadProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(`Could not save profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      await artisanService.uploadMedia(file);
      await loadProfile();
    } catch (err) {
      alert(`Could not upload media: ${err.message}`);
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleMediaDelete = async (mediaId) => {
    if (!window.confirm('Remove this media item from your profile?')) return;
    try {
      await artisanService.deleteMedia(mediaId);
      await loadProfile();
    } catch (err) {
      alert(`Could not delete media: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '10px', color: 'var(--color-on-surface-variant)' }}>
        <Loader2 size={20} className="spin" />
        <span>Loading your profile…</span>
      </div>
    );
  }

  if (error && !profile) {
    return (
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
    );
  }

  const user = profile?.userId || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Hero Card */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          boxShadow: '0 4px 12px rgba(44, 42, 41, 0.05)',
          padding: '2rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
            <div
              style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                flexShrink: 0,
                backgroundColor: 'var(--color-surface-container-highest)',
              }}
            >
              <img
                src={profile?.profileImage || user?.avatar || ''}
                alt={profile?.displayName || user?.name || 'Artist'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {profile?.verificationStatus === 'approved' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-on-secondary)',
                    borderRadius: '50%',
                    padding: '4px',
                    display: 'flex',
                  }}
                  title="Verified Artist"
                >
                  <ShieldCheck size={14} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                className="badge-secondary"
                style={{ textTransform: 'capitalize', width: 'fit-content' }}
              >
                {profile?.verificationStatus || 'pending'}
              </span>

              <h1 className="font-headline-md" style={{ color: 'var(--color-on-surface)', marginTop: '2px' }}>
                {profile?.displayName || user?.name || 'Unnamed Artisan'}
              </h1>
              <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: '650px' }}>
                {user?.email} {user?.phone ? `• ${user.phone}` : ''}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-outline)', fontSize: '13px' }}>
                  <MapPin size={16} />
                  <span>
                    {[profile?.location?.city, profile?.location?.state, profile?.location?.country]
                      .filter(Boolean)
                      .join(', ') || 'Location not set'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-outline)', fontSize: '13px' }}>
                  <Brush size={16} />
                  <span>{profile?.experience || 0} years of experience</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-surface"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={15} />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
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
          Profile changes have been saved.
        </div>
      )}

      {error && profile && (
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

      {/* Editable / Read-only Section */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <h2 className="font-title-lg" style={{ marginBottom: '1rem' }}>Studio Information</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Display Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
                />
              ) : (
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{profile?.displayName}</div>
              )}
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Years of Experience
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
                />
              ) : (
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{profile?.experience || 0} years</div>
              )}
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
                />
              ) : (
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{profile?.location?.city || '—'}</div>
              )}
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                State
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
                />
              ) : (
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{profile?.location?.state || '—'}</div>
              )}
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Spoken Languages (comma separated)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
                />
              ) : (
                <div style={{ fontSize: '14px' }}>{(profile?.languages || []).join(' • ') || '—'}</div>
              )}
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Art Forms
              </label>
              <div style={{ fontSize: '14px' }}>
                {(profile?.artFormIds || []).map((af) => af.name).join(', ') || 'Not assigned yet'}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Biography
              </label>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '0.5rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)', fontFamily: 'var(--font-sans)' }}
                />
              ) : (
                <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {profile?.bio || 'No biography added yet.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="font-title-lg">Profile Media Gallery</h2>
            <label className="btn-surface" style={{ cursor: 'pointer' }}>
              <UploadCloud size={16} />
              <span>{uploadingMedia ? 'Uploading…' : 'Upload Media'}</span>
              <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} disabled={uploadingMedia} style={{ display: 'none' }} />
            </label>
          </div>

          {(profile?.media || []).length === 0 ? (
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>No media uploaded yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
              {profile.media.map((m) => (
                <div key={m._id} style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', height: '120px', backgroundColor: 'var(--color-surface-container-high)' }}>
                  {m.type === 'video' ? (
                    <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  ) : (
                    <img src={m.url} alt={m.title || 'Media'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <button
                    type="button"
                    onClick={() => handleMediaDelete(m._id)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      padding: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                    title="Remove media"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn-surface" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              <span>{saving ? 'Saving…' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
