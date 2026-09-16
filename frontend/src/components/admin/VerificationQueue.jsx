import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { ADMIN_VERIFICATION_QUEUE } from '../../data/adminMockData';

export default function VerificationQueue() {
  const [queue] = useState(ADMIN_VERIFICATION_QUEUE);
  const [searchTerm, setSearchTerm] = useState('');
  const [mintStatus, setMintStatus] = useState({}); // { [id]: 'idle' | 'minting' | 'minted' }

  const handleApproveAndMint = (id, name) => {
    setMintStatus((prev) => ({ ...prev, [id]: 'minting' }));

    setTimeout(() => {
      setMintStatus((prev) => ({ ...prev, [id]: 'minted' }));
      alert(`Cryptographic Provenance Token minted for ${name}! Attestation recorded in Sovereign Heritage Registry.`);
    }, 950);
  };

  const handleRequestSeal = (id, name) => {
    alert(`Formal verification dispatch sent to the Odisha State Craft Guild Council for ${name}.`);
  };

  const handlePlayAudio = (title) => {
    alert(`Playing Oral Archive: "${title}". Validating native dialect terminology and Suvasini lineage recital.`);
  };

  const filteredQueue = queue.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lineage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Search & Filter Header from admin.html */}
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
            Pending Verification &amp; Provenance Endorsement
          </h2>
          <p className="font-body-md" style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Review field interviews, oral lineage claims, local panchayat endorsements, and craft evidence prior to immutable ledger minting.
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
              placeholder="Search craft lineage or district..."
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
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            <Filter size={14} />
            <span>All 6 States</span>
          </button>
        </div>
      </div>

      {/* Verification Queue Table from admin.html */}
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
                <th style={{ padding: '1rem 1.5rem' }}>Artisan &amp; Lineage</th>
                <th style={{ padding: '1rem 1.5rem' }}>Heritage Art Form</th>
                <th style={{ padding: '1rem 1.5rem' }}>Oral History Archive</th>
                <th style={{ padding: '1rem 1.5rem' }}>Cooperative Validation</th>
                <th style={{ padding: '1rem 1.5rem' }}>GI Compliance</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Governance Action</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px', color: 'var(--color-on-surface)' }}>
              {filteredQueue.map((item, index) => {
                const status = mintStatus[item.id] || 'idle';
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderTop: index > 0 ? '1px solid var(--color-surface-container)' : 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Column 1: Artisan & Lineage */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.avatar}
                          alt={item.name}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        />
                        <div>
                          <div className="font-title-md" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                            {item.name}
                          </div>
                          <div className="font-label-caps" style={{ color: 'var(--color-tertiary)', fontSize: '10px' }}>
                            {item.lineage}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Heritage Art Form */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--color-secondary-container)',
                          color: 'var(--color-on-secondary-container)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {item.artForm}
                      </span>
                    </td>

                    {/* Column 3: Oral History Archive */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(item.audioTitle)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-primary)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <PlayCircle size={18} />
                        <span>{item.audioTitle}</span>
                      </button>
                    </td>

                    {/* Column 4: Cooperative Validation */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: item.cooperative.includes('Pending') ? 'var(--color-outline)' : 'var(--color-secondary)',
                          fontSize: '13px',
                          fontWeight: 500,
                        }}
                      >
                        {item.cooperative.includes('Pending') ? (
                          <Clock size={16} />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                        <span>{item.cooperative}</span>
                      </div>
                    </td>

                    {/* Column 5: GI Compliance */}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--color-surface-container-high)',
                          color: 'var(--color-on-surface-variant)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.giCompliance}
                      </span>
                    </td>

                    {/* Column 6: Governance Action (Approve & Mint micro-interaction) */}
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      {item.actionType === 'approve' ? (
                        status === 'minted' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '9999px',
                              backgroundColor: 'var(--color-secondary)',
                              color: 'var(--color-on-secondary)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            <CheckCircle2 size={16} />
                            <span>Provenance Issued</span>
                          </span>
                        ) : status === 'minting' ? (
                          <button
                            type="button"
                            disabled
                            className="btn-primary"
                            style={{ padding: '6px 16px', fontSize: '12px', opacity: 0.8, cursor: 'not-allowed' }}
                          >
                            <RefreshCw size={14} className="animate-spin-fast" />
                            <span>Minting...</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleApproveAndMint(item.id, item.name)}
                            style={{ padding: '6px 16px', fontSize: '12px' }}
                          >
                            Approve &amp; Mint
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          className="btn-surface"
                          onClick={() => handleRequestSeal(item.id, item.name)}
                          style={{ padding: '6px 16px', fontSize: '12px' }}
                        >
                          Request Guild Seal
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
