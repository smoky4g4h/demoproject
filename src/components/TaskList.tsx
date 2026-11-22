import React, { useState, useRef } from 'react';
import { Check, Trash2, Pencil, X, ClipboardList } from 'lucide-react';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
};

type Props = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
};

/* Priority badge styles as inline-style objects so they work with CSS vars */
const priorityBadge: Record<string, React.CSSProperties> = {
  low:    { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  medium: { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  high:   { background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' },
};
const priorityDot: Record<string, string> = {
  low: '#22c55e', medium: '#f59e0b', high: '#f43f5e',
};

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdate(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  const confirmDelete = (id: string) => {
    if (deleteConfirmId === id) {
      onDelete(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  /* ── Empty state ─────────────────────────────────────────────── */
  if (tasks.length === 0) {
    return (
      <div
        className="rounded-[12px] p-14 text-center animate-fade-in-up"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div
          className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <ClipboardList size={24} style={{ color: 'var(--color-text-muted)' }} />
        </div>
        <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--color-text)' }}>
          No tasks here
        </h3>
        <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          All tasks are completed or your list is empty. Add a task above to get started!
        </p>
      </div>
    );
  }

  /* ── Task list ───────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task, idx) => {
        const isCompleted = task.completed;
        const isEditing = editingId === task.id;
        const isConfirmingDelete = deleteConfirmId === task.id;

        return (
          <div
            key={task.id}
            className="group rounded-[12px] transition-all duration-150 animate-fade-in-up"
            style={{
              animationDelay: `${idx * 25}ms`,
              background: isCompleted ? 'color-mix(in srgb, var(--color-surface) 85%, var(--color-surface-2))' : 'var(--color-surface)',
              border: `1px solid ${isCompleted ? 'var(--color-border)' : 'var(--color-border)'}`,
              boxShadow: 'var(--shadow-xs)',
              opacity: isCompleted ? 0.75 : 1,
            }}
            onMouseEnter={e => {
              if (!isCompleted) {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border-hover)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-xs)';
            }}
          >
            <div className="px-4 py-3.5 flex items-center gap-3.5">
              {/* Custom circular checkbox */}
              <button
                onClick={() => onToggle(task.id)}
                aria-label={isCompleted ? 'Mark task incomplete' : 'Mark task complete'}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                style={
                  isCompleted
                    ? { background: '#22c55e', borderColor: '#22c55e', color: '#fff' }
                    : { background: 'transparent', borderColor: 'var(--color-border)' }
                }
                onMouseEnter={e => {
                  if (!isCompleted) {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.background = 'var(--color-primary-light)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isCompleted) {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {isCompleted && <Check size={11} strokeWidth={3} />}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleKeyDown}
                      className="flex-1 px-3 py-1.5 text-sm rounded-[8px] transition-all duration-150 focus:outline-none"
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-primary)',
                        color: 'var(--color-text)',
                        boxShadow: '0 0 0 3px rgb(99 102 241 / .15)',
                      }}
                    />
                    <button
                      onClick={saveEdit}
                      aria-label="Save task edit"
                      className="p-1.5 rounded-[8px] text-emerald-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditText(''); }}
                      aria-label="Cancel task edit"
                      className="p-1.5 rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                      style={{ color: 'var(--color-text-muted)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                    <p
                      className="text-sm font-medium truncate transition-all duration-150"
                      style={{
                        color: isCompleted ? 'var(--color-text-muted)' : 'var(--color-text)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}
                    >
                      {task.text}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Priority pill */}
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={priorityBadge[task.priority]}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: priorityDot[task.priority] }}
                        />
                        <span className="capitalize">{task.priority}</span>
                      </span>
                      {/* Timestamp */}
                      <span
                        className="text-[10px] font-mono hidden sm:inline"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {new Date(task.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit / Delete icon buttons — visible on hover */}
              {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
                  <button
                    onClick={() => startEdit(task)}
                    aria-label="Edit task"
                    title="Edit task"
                    className="w-7 h-7 flex items-center justify-center rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--color-primary-light)';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                    }}
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => confirmDelete(task.id)}
                    aria-label={isConfirmingDelete ? 'Confirm delete task' : 'Delete task'}
                    title={isConfirmingDelete ? 'Click again to confirm' : 'Delete task'}
                    className="w-7 h-7 flex items-center justify-center rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    style={
                      isConfirmingDelete
                        ? { background: '#fff1f2', color: '#e11d48' }
                        : { color: 'var(--color-text-muted)' }
                    }
                    onMouseEnter={e => {
                      if (!isConfirmingDelete) {
                        e.currentTarget.style.background = '#fff1f2';
                        e.currentTarget.style.color = '#e11d48';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isConfirmingDelete) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                      }
                    }}
                  >
                    {isConfirmingDelete ? <X size={14} /> : <Trash2 size={14} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
