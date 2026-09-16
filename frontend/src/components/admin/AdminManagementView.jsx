import React, { useState } from 'react';
import { Search, Plus, CheckCircle2 } from 'lucide-react';

/**
 * Reusable AdminManagementView component for all administrative entities.
 * Designed to cleanly map to future Express/MongoDB REST endpoints.
 */
export default function AdminManagementView({
  title,
  subtitle,
  data = [],
  columns = [],
  actions = [],
  searchPlaceholder = 'Search records...',
  filterKey = null,
  filterOptions = [],
  onAdd = null,
  addLabel = 'Add Record',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [notification, setNotification] = useState(null);

  const filteredData = data.filter((row) => {
    // Search match across string fields
    const matchesSearch = Object.values(row).some((val) =>
      typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter match
    if (!filterKey || selectedFilter === 'All') return matchesSearch;
    return matchesSearch && row[filterKey] === selectedFilter;
  });

  const handleActionClick = (action, row) => {
    if (action.onClick) {
      action.onClick(row);
    } else {
      setNotification(`Action "${action.label}" triggered for ${row.name || row.title || row.id}`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* View Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>

        {onAdd && (
          <button
            type="button"
            className="btn-primary"
            onClick={onAdd}
            style={{ padding: '10px 18px', fontSize: '13px' }}
          >
            <Plus size={16} />
            <span>{addLabel}</span>
          </button>
        )}
      </div>

      {notification && (
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
          {notification}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: 'var(--color-surface-container-low)',
          padding: '1rem',
          borderRadius: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '8px 14px',
            borderRadius: '9999px',
            flexGrow: 1,
            maxWidth: '380px',
          }}
        >
          <Search size={16} color="var(--color-outline)" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-on-surface)',
              width: '100%',
            }}
          />
        </div>

        {filterOptions.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', ...filterOptions].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedFilter(opt)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: selectedFilter === opt ? 700 : 500,
                  backgroundColor: selectedFilter === opt ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
                  color: selectedFilter === opt ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table Display */}
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
                {columns.map((col, idx) => (
                  <th key={idx} style={{ padding: '1rem 1.25rem', width: col.width || 'auto' }}>
                    {col.header}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px', color: 'var(--color-on-surface)' }}>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-outline)' }}>
                    No matching records found in registry.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIdx) => (
                  <tr
                    key={row.id || rowIdx}
                    style={{
                      borderTop: rowIdx > 0 ? '1px solid var(--color-surface-container)' : 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} style={{ padding: '1rem 1.25rem' }}>
                        {typeof col.accessor === 'function'
                          ? col.accessor(row)
                          : row[col.accessor]}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {actions.map((act, actIdx) => (
                            <button
                              key={actIdx}
                              type="button"
                              onClick={() => handleActionClick(act, row)}
                              className={act.variant === 'primary' ? 'btn-primary' : 'btn-surface'}
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
