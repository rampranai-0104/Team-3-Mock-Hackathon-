import React from 'react';
import { Users, History, Landmark, School, TrendingUp, Package, UserCheck } from 'lucide-react';
import { ADMIN_KPIS } from '../../data/adminMockData';

export default function AdminKpiSection() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'diversity_1':
        return <Users size={22} color="var(--color-primary)" />;
      case 'history_edu':
        return <History size={22} color="var(--color-secondary)" />;
      case 'school':
        return <School size={22} color="var(--color-secondary)" />;
      case 'inventory_2':
        return <Package size={22} color="var(--color-primary)" />;
      case 'group':
        return <UserCheck size={22} color="var(--color-secondary)" />;
      case 'account_balance':
        return <Landmark size={22} color="var(--color-primary)" />;
      default:
        return <Users size={22} color="var(--color-primary)" />;
    }
  };

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        width: '100%',
      }}
    >
      {ADMIN_KPIS.map((kpi) => (
        <div
          key={kpi.id}
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'box-shadow 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-label-caps" style={{ color: 'var(--color-outline)' }}>
              {kpi.title}
            </span>
            {getIcon(kpi.icon)}
          </div>

          <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column' }}>
            <div className="font-headline-md font-display-hero" style={{ color: 'var(--color-on-surface)' }}>
              {kpi.value}
            </div>

            {kpi.trend && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginTop: '4px',
                }}
              >
                <TrendingUp size={14} />
                <span>{kpi.trend}</span>
              </div>
            )}

            {kpi.subtitle && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-on-surface-variant)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-tertiary)' }}>~$820K USD</span>
                <span style={{ color: 'var(--color-outline)' }}>• 0% Platform Extractive Fee</span>
              </div>
            )}
          </div>

          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--color-surface-container-high)',
              height: '6px',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: kpi.progressColor,
                height: '100%',
                borderRadius: '9999px',
                width: `${kpi.progress}%`,
              }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
