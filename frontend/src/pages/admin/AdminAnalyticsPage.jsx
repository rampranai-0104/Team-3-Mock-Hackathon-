import React, { useState } from 'react';
import AnalyticsVisualizations from '../../components/admin/AnalyticsVisualizations';
import { Download, RefreshCw } from 'lucide-react';

/**
 * AdminAnalyticsPage - Macro Economic Impact & Living Tradition Analytics
 * Connects to Express /api/admin/analytics endpoint.
 */
export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState('24m');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Analytics Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Macro Economic & Cultural Impact
          </h1>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
            Direct Artisan Honorariums, Regional Dispersions & Global Student Immersion Reach
          </p>
        </div>

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
            <span>Sync Stats</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => alert('Exporting Cultural Impact Report (CSV/PDF)...')}
            style={{ padding: '8px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Primary Visualizations */}
      <AnalyticsVisualizations />
    </div>
  );
}
