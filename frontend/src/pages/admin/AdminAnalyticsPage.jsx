import React, { useState } from 'react';
import AnalyticsVisualizations from '../../components/admin/AnalyticsVisualizations';
import { BarChart3, Users, Calendar, ShoppingBag, Download, RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';

/**
 * AdminAnalyticsPage - Core Feature 6: Analytics Module
 * Encompasses Macro Economic Trajectory, Artist Growth, Art Form Statistics,
 * Event Participation, Product Activity, and Direct Artisan Earnings.
 */
export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('macro'); // 'macro' | 'artists' | 'events' | 'revenue'
  const [timeframe, setTimeframe] = useState('24m');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNotice('Analytical metrics re-indexed against decentralized ledger nodes.');
      setTimeout(() => setNotice(null), 3500);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header & Feature Context */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Analytics & Sovereign Economic Impact
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Direct Artisan Honorariums, Living Tradition Preservations, Global Immersion Cohorts & Fair-Trade Trajectory
          </p>
        </div>

        {/* Global Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '9999px', padding: '4px' }}>
            {['6m', '12m', '24m', 'All'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setTimeframe(period)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: timeframe === period ? 700 : 500,
                  backgroundColor: timeframe === period ? 'var(--color-primary)' : 'transparent',
                  color: timeframe === period ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-surface"
            onClick={handleRefresh}
            style={{ padding: '8px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync Ledger</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setNotice('Exported UNESCO Cultural & Financial Impact Report (PDF/CSV).');
              setTimeout(() => setNotice(null), 3500);
            }}
            style={{ padding: '8px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {notice && (
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
          {notice}
        </div>
      )}

      {/* Tab Selector */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--color-surface-container-low)',
          borderRadius: '9999px',
          padding: '4px',
          gap: '4px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('macro')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'macro' ? 700 : 500,
            backgroundColor: activeTab === 'macro' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'macro' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          <BarChart3 size={16} />
          <span>Macro Trajectory & Impact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('artists')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'artists' ? 700 : 500,
            backgroundColor: activeTab === 'artists' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'artists' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          <Users size={16} />
          <span>Artist Growth & Regional Share</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('events')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'events' ? 700 : 500,
            backgroundColor: activeTab === 'events' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'events' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          <Calendar size={16} />
          <span>Events & Audience Reach</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('revenue')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'revenue' ? 700 : 500,
            backgroundColor: activeTab === 'revenue' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'revenue' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          <ShoppingBag size={16} />
          <span>Marketplace & Direct Revenue</span>
        </button>
      </div>

      {/* Tab 1: Macro Trajectory & Impact (Original SVG Visualizations from admin.html) */}
      {activeTab === 'macro' && (
        <AnalyticsVisualizations />
      )}

      {/* Tab 2: Artist Growth & Regional Share */}
      {activeTab === 'artists' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.75rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Quarterly Onboarding Velocity</span>
            <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
              1,482 Master Artisans
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
              <TrendingUp size={16} />
              <span>+14% Verified Lineages (Q3 2025)</span>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Gond Chitrakala (Madhya Pradesh)', count: '512 Artisans', pct: '36%' },
                { label: 'Warli Pictography (Maharashtra)', count: '384 Artisans', pct: '28%' },
                { label: 'Tala Pattachitra (Odisha)', count: '346 Artisans', pct: '20%' },
                { label: 'Temple Pichwai (Rajasthan)', count: '240 Artisans', pct: '16%' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{item.label}</span>
                    <span style={{ color: 'var(--color-outline)' }}>{item.count}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '9999px' }}>
                    <div style={{ width: item.pct, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '9999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.75rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Apprentice Lineage Continuity</span>
            <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
              890 Youth Apprentices
            </h3>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>
              Youth family members actively trained under registered Master Artisans with stipend guarantees funded directly by institutional immersion residency fees.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.5rem' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Dahanu Warli Youth Circle</span>
                <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 700 }}>240 Active</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Patangarh Gond Shloka Guild</span>
                <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 700 }}>310 Active</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Raghurajpur Chitrakar Gurukul</span>
                <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 700 }}>180 Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Events & Audience Reach */}
      {activeTab === 'events' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.75rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Global Immersion Footprint</span>
            <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
              148,900 Participants
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '4px' }}>
              In 34 Countries & 128 Institutional Residencies
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)' }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Institutional Masterclasses (NGMA, NID, IIT IDC)</div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                  54,200 Scholars & Designers • 890 Hours Taught
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)' }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Corporate Residencies (Google, Microsoft, Tata)</div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                  42,800 Engineers & Leaders • 720 Hours Taught
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)' }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Public Heritage Pavilions (Kala Ghoda, Dahanu)</div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                  51,900 General Walk-ins • 1,240 Hours Open
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.75rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Institutional Escrow Reliability</span>
            <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
              100% Escrow Completion
            </h3>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>
              Zero payment disputes since launch. All institutional honorarium disbursements are backed by upfront multi-sig smart contract deposits released upon verified milestone completions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.5rem' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Average Time to Full Payout</span>
                <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 700 }}>&lt; 24 Hours</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Milestone Escrow Rate</span>
                <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 700 }}>100% Secured</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Marketplace Activity & Earnings */}
      {activeTab === 'revenue' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.75rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Cumulative Artisan Payouts</span>
            <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
              ₹6.82 Crore Disbursed
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '4px' }}>
              0% Extractive Commission • 100% Retained by Master Guilds
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>Direct Artwork Acquisitions</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>₹4.24 Cr (62%)</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>Institutional Residency Honorariums</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-secondary)' }}>₹2.58 Cr (38%)</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>Platform Extractive Cut</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-tertiary)' }}>₹0 (Zero Cut)</span>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              padding: '1.75rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>Living Wage Compliance</span>
            <h3 className="font-headline-sm" style={{ marginTop: '4px', color: 'var(--color-on-surface)' }}>
              2.5x State Rural Base
            </h3>
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>
              All works cataloged on the Tvarita Sovereign Registry undergo mandatory fair-trade valuation formulas to protect indigenous elders against speculative underpricing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.5rem' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>NFC Provenance Sealing Rate</span>
                <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 700 }}>94% Cryptographically Affixed</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Disbursals to Tribal Pigment Funds</span>
                <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 700 }}>10% Autonomous Allocation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
