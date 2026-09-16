import React, { useState } from 'react';
import {
  Search,
  Radio,
  Mic,
  MapPin,
  CheckCircle2,
  Send,
  X,
} from 'lucide-react';
import { FOLLOWERS_LIST } from '../data/artisanMockData';

export default function ArtisanFollowers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showVoiceBroadcast, setShowVoiceBroadcast] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const filteredFollowers = FOLLOWERS_LIST.filter((fol) => {
    const matchesSearch =
      fol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fol.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fol.role.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && fol.role.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const handleStartBroadcast = () => {
    setIsRecording(true);
  };

  const handleFinishBroadcast = () => {
    setIsRecording(false);
    setShowVoiceBroadcast(false);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header & Broadcast Trigger */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Tribal Art Lovers &amp; Collector Network
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Connect directly with 4,820 patron followers without algorithmic interference.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowVoiceBroadcast(true)}
        >
          <Radio size={18} />
          <span>Send Voice Update / आवाज संदेश पाठवा</span>
        </button>
      </div>

      {broadcastSent && (
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
          Your voice folklore update has been beamed to all 4,820 subscribed followers!
        </div>
      )}

      {/* Follower Stats KPI Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div style={{ padding: '1.25rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Total Followers</span>
          <div className="font-display-hero" style={{ fontSize: '32px', color: 'var(--color-on-surface)', marginTop: '4px' }}>
            4,820
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 600 }}>
            +280 added from National Folk Fair
          </span>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Verified Collectors</span>
          <div className="font-display-hero" style={{ fontSize: '32px', color: 'var(--color-primary)', marginTop: '4px' }}>
            1,240
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
            Commission buyers &amp; gallerists
          </span>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Institutions &amp; Curators</span>
          <div className="font-display-hero" style={{ fontSize: '32px', color: 'var(--color-secondary)', marginTop: '4px' }}>
            340
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
            Museums &amp; academic labs
          </span>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '1rem', backgroundColor: 'var(--color-surface-container-lowest)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Art Enthusiasts</span>
          <div className="font-display-hero" style={{ fontSize: '32px', color: 'var(--color-on-surface)', marginTop: '4px' }}>
            3,240
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
            Folk culture students &amp; admirers
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem',
          borderRadius: '1rem',
          backgroundColor: 'var(--color-surface-container-low)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '8px 14px',
            borderRadius: '0.75rem',
            flexGrow: 1,
            maxWidth: '380px',
          }}
        >
          <Search size={18} color="var(--color-outline)" />
          <input
            type="text"
            placeholder="Search by name, city, or interest..."
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

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Collector', 'Curator', 'Architect'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: activeFilter === f ? 700 : 500,
                backgroundColor: activeFilter === f ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
                color: activeFilter === f ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Followers Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredFollowers.map((follower) => (
          <div
            key={follower.id}
            style={{
              padding: '1.25rem',
              borderRadius: '1rem',
              backgroundColor: 'var(--color-surface-container-lowest)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={follower.avatar}
                alt={follower.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                  {follower.name}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--color-secondary)', fontWeight: 600 }}>
                  {follower.role}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-outline)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {follower.location}
                </div>
              </div>
            </div>

            <div>
              <span className="font-label-caps" style={{ color: 'var(--color-outline)', fontSize: '10px' }}>
                Follower Interests:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {follower.interests.map((int, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-surface-container)',
                      fontSize: '10px',
                      color: 'var(--color-on-surface)',
                    }}
                  >
                    {int}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--color-surface-container)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-outline)' }}>
                Followed: {follower.followedDate}
              </span>
              <button
                type="button"
                className="btn-surface"
                onClick={() => alert(`Direct SMS message sent to ${follower.name}'s collector portal.`)}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Broadcast Modal */}
      {showVoiceBroadcast && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(27, 28, 24, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              borderRadius: '1.5rem',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="font-title-lg">Send Voice Studio Update</h3>
              <button
                type="button"
                onClick={() => setShowVoiceBroadcast(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Speak in Marathi, Hindi, or Warli dialect. Your voice note will be translated into English subtitles and delivered to your 4,820 followers.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
              <button
                type="button"
                onClick={handleStartBroadcast}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: isRecording ? 'var(--color-error)' : 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(159, 60, 22, 0.3)',
                }}
              >
                <Mic size={36} className={isRecording ? 'pulse-mic' : ''} />
              </button>
            </div>

            <span style={{ fontSize: '13px', fontWeight: 600 }}>
              {isRecording ? 'Listening... Speak your folklore story now!' : 'Tap mic to start recording (30 seconds max)'}
            </span>

            {isRecording && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleFinishBroadcast}
                style={{ marginTop: '0.5rem' }}
              >
                <Send size={16} />
                <span>Finish &amp; Beam Broadcast</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
