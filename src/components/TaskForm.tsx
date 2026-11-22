import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

type Props = {
  onAdd: (text: string, priority: 'low' | 'medium' | 'high') => void;
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

  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center">
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer font-medium text-sm ${priorityColors[priority]} border-transparent`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold shadow-md shadow-indigo-200 hover:shadow-lg disabled:shadow-none active:scale-95"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </form>

      {/* Priority quick select */}
      <div className="px-4 pb-3 flex gap-2">
        {(['low', 'medium', 'high'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150 border ${
              priority === p
                ? p === 'low' ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                : p === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-300'
                : 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {p} priority
          </button>
        ))}
      </div>
    </div>
  );
}
