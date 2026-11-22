import React, { useState } from 'react';
import { Plus } from 'lucide-react';

type Props = {
  onAdd: (text: string, priority: 'low' | 'medium' | 'high') => void;
};

const priorityPillActive: Record<string, React.CSSProperties> = {
  low:    { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  medium: { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  high:   { background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' },
};

export default function TaskForm({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), priority);
    setText('');
  };

  const isDisabled = !text.trim();

  return (
    <div
      className="rounded-[12px] p-4 sm:p-5 transition-shadow duration-150"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Text input */}
        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-2.5 rounded-[8px] text-sm transition-all duration-150 focus:outline-none"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgb(99 102 241 / .15)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Priority select + Add button */}
        <div className="flex items-center gap-2.5">
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            aria-label="Select task priority"
            className="px-3 py-2.5 rounded-[8px] text-xs font-semibold cursor-pointer transition-all duration-150 focus:outline-none capitalize"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgb(99 102 241 / .15)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button
            type="submit"
            disabled={isDisabled}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[8px] text-xs font-semibold text-white whitespace-nowrap transition-all duration-150 active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            style={{
              background: isDisabled ? 'var(--color-surface-2)' : 'var(--color-primary)',
              color: isDisabled ? 'var(--color-text-muted)' : '#fff',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              boxShadow: isDisabled ? 'none' : '0 1px 3px rgb(99 102 241 / .4)',
            }}
            onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
            onMouseLeave={e => { if (!isDisabled) e.currentTarget.style.background = 'var(--color-primary)'; }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Task</span>
          </button>
        </div>
      </form>

      {/* Quick priority pills */}
      <div className="mt-3.5 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
          Quick priority:
        </span>
        {(['low', 'medium', 'high'] as const).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className="px-2.5 py-1 rounded-[6px] text-[11px] font-semibold capitalize transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            style={
              priority === p
                ? priorityPillActive[p]
                : {
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }
            }
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
