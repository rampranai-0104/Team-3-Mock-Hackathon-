import React, { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  Award,
  MapPin,
  Brush,
  CheckCircle2,
  Edit3,
  Save,
  RefreshCw,
} from 'lucide-react';
import { ARTIST_PROFILE } from '../data/artisanMockData';

export default function ArtisanProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ ...ARTIST_PROFILE });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Master Artisan Hero Card from artist.html */}
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
            position: 'absolute',
            right: '-4rem',
            top: '-4rem',
            width: '20rem',
            height: '20rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 219, 207, 0.3)',
            filter: 'blur(3rem)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            {/* Portrait & Core Credentials */}
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
                  src={profileData.avatar}
                  alt={profileData.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
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
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="GI Tagged & National Heritage Certified"
                >
                  <ShieldCheck size={14} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-secondary">{profileData.awards[0]}</span>
                  <span className="badge-tertiary">{profileData.giRegistration}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      color: 'var(--color-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-secondary)',
                      }}
                    />
                    {profileData.phoneStatus} ({profileData.phone})
                  </span>
                </div>

                <h1 className="font-headline-md" style={{ color: 'var(--color-on-surface)', marginTop: '2px' }}>
                  {profileData.name}
                </h1>
                <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: '650px' }}>
                  {profileData.title} • {profileData.location}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', paddingTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-outline)', fontSize: '13px' }}>
                    <MapPin size={16} />
                    <span>Ganjad Village Studio, Dahanu</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-outline)', fontSize: '13px' }}>
                    <Award size={16} />
                    <span>{profileData.mentorRole}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action: Studio Coordinator Emergency Call & Edit Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
              <a
                href="tel:+918001234567"
                className="btn-primary"
                style={{
                  padding: '12px 18px',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Phone size={22} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>
                    Helpdesk / सहाय्यक कक्ष
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Call Studio Coordinator</div>
                </div>
              </a>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--color-surface-container)',
                  fontSize: '12px',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={14} color="var(--color-secondary)" />
                  Synced 4 mins ago
                </span>
                <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>SMS Mode: ON</span>
              </div>

              <button
                type="button"
                className="btn-surface"
                onClick={() => setIsEditing(!isEditing)}
                style={{ width: '100%' }}
              >
                <Edit3 size={15} />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile Information'}</span>
              </button>
            </div>
          </div>
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
          Profile changes have been successfully saved to your Studio Ledger!
        </div>
      )}

      {/* Profile Details Sections (Editable Form or Read-only Display) */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Personal Information */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-primary)' }}><Award size={20} /></span>
            <h2 className="font-title-lg">१. Personal Information / वैयक्तिक माहिती</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'var(--color-surface-container-low)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              ) : (
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{profileData.name}</div>
              )}
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.dob}
                  onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'var(--color-surface-container-low)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              ) : (
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{profileData.dob}</div>
              )}
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Phone Number (SMS Linked)
              </label>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{profileData.phone}</div>
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Studio Contact Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'var(--color-surface-container-low)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              ) : (
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{profileData.email}</div>
              )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Studio Physical Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'var(--color-surface-container-low)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>{profileData.location}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Art Information & Lineage */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-secondary)' }}><Brush size={20} /></span>
            <h2 className="font-title-lg">२. Art Information &amp; Heritage Lineage / कला परंपरा</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Art Form &amp; Tradition
              </label>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Authentic Warli Tribal Painting</div>
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Years of Master Experience
              </label>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{profileData.experienceYears} Years</div>
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Lineage / पीढी
              </label>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{profileData.lineage}</div>
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Spoken Languages
              </label>
              <div style={{ fontSize: '14px' }}>{profileData.languages.join(' • ')}</div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Artisan Biography
              </label>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-outline-variant)',
                    backgroundColor: 'var(--color-surface-container-low)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              ) : (
                <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {profileData.bio}
                </p>
              )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Sacred Cultural Significance
              </label>
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                {profileData.culturalSignificance}
              </p>
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Natural Materials Used
              </label>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>
                {profileData.materials.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div>
              <label className="font-label-caps" style={{ color: 'var(--color-outline)', display: 'block', marginBottom: '4px' }}>
                Ancestral Techniques
              </label>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>
                {profileData.techniques.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Heritage, Awards & Certifications */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-primary)' }}><ShieldCheck size={20} /></span>
            <h2 className="font-title-lg">३. Heritage &amp; Authenticity Certifications / कायदेशीर प्रमाणीकरण</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div style={{ padding: '12px', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                Geographical Indication (GI) Status
              </span>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-secondary)', marginTop: '4px' }}>
                Registered Producer ({profileData.giRegistration})
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                Protected under Geographical Indications of Goods Act (Govt. of India)
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                National &amp; State Honors
              </span>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-primary)', marginTop: '4px' }}>
                {profileData.awards.join(' • ')}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                Conferred for tribal conservation and excellence in living folk forms
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '0.75rem', backgroundColor: 'var(--color-surface-container-low)' }}>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
                Folk Guild Trust Affiliation
              </span>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-on-surface)', marginTop: '4px' }}>
                {profileData.guild}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                Elder status with collective voting rights on tribal royalty disbursals
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons for Edit/Save */}
        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              className="btn-surface"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Save size={16} />
              <span>Save Changes / बदल सेव्ह करा</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
