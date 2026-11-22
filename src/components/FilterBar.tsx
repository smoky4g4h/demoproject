import React from 'react';

type FilterType = 'all' | 'active' | 'completed';

type Props = {
  current: FilterType;
  onChange: (filter: FilterType) => void;
};

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

export default function FilterBar({ current, onChange }: Props) {
  return (
    <div
      className="p-1 rounded-[10px] flex gap-1"
      style={{
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
      }}
      role="tablist"
      aria-label="Task filter"
    >
      {filters.map(({ key, label }) => {
        const isActive = current === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className="flex-1 py-1.5 px-3 rounded-[8px] text-xs sm:text-sm font-medium transition-all duration-150 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
            style={
              isActive
                ? {
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    fontWeight: 600,
                    boxShadow: 'var(--shadow-xs)',
                  }
                : {
                    background: 'transparent',
                    color: 'var(--color-text-muted)',
                  }
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
