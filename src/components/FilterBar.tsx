import React from 'react';
import { Filter } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed';

type Props = {
  current: FilterType;
  onChange: (filter: FilterType) => void;
};

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Tasks' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

export default function FilterBar({ current, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 flex gap-1">
      <Filter size={16} className="text-slate-400 ml-2 self-center" />
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            current === key
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
