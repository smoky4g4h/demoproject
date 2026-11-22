import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Pencil, X, AlertCircle } from 'lucide-react';

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

const priorityConfig = {
  low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  high: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
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

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <AlertCircle size={28} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No tasks found</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          {tasks.filter(t => !t.completed).length === 0
            ? "All your tasks are completed! Great job!"
            : "Start by adding a new task above."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => {
        const config = priorityConfig[task.priority];
        const isCompleted = task.completed;

        return (
          <div
            key={task.id}
            className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
              isCompleted
                ? `${config.bg} ${config.border} opacity-70`
                : 'border-slate-200 hover:border-indigo-200'
            }`}
          >
            <div className="p-4 flex items-center gap-4">
              {/* Checkbox */}
              <button
                onClick={() => onToggle(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white scale-110'
                    : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                {isCompleted && <Check size={13} strokeWidth={3} />}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleKeyDown}
                      className="flex-1 px-3 py-1.5 bg-white border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                    <button
                      onClick={saveEdit}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditText(''); }}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <p className={`text-sm font-medium truncate transition-all ${
                      isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(task.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {editingId !== task.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => confirmDelete(task.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirmId === task.id
                        ? 'bg-rose-100 text-rose-600'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    title={deleteConfirmId === task.id ? "Click again to confirm" : "Delete task"}
                  >
                    {deleteConfirmId === task.id ? <X size={15} /> : <Trash2 size={15} />}
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
