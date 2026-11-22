import React, { useState, useEffect } from 'react';
import { useActivityTracker } from 'activity-tracker-lite/react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import FilterBar from './FilterBar';
import StatsPanel from './StatsPanel';
import { CheckCircle2, LayoutDashboard, Shield, Sparkles, Moon, Sun } from 'lucide-react';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
};

type Filter = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const tracker = useActivityTracker();
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Explore activity-tracker-lite documentation', completed: true, priority: 'high', createdAt: Date.now() - 3600000 },
    { id: '2', text: 'Build a reactive SaaS dashboard', completed: false, priority: 'medium', createdAt: Date.now() - 1800000 },
    { id: '3', text: 'Test user inactivity timeout triggers', completed: false, priority: 'low', createdAt: Date.now() - 600000 },
  ]);
  const [filter, setFilter] = useState<Filter>('all');
  const [sessionData, setSessionData] = useState<any>(null);
  const [userState, setUserState] = useState<string>('active');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Sync dark mode state with HTML attribute
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  // Track app opened on first load
  useEffect(() => {
    tracker.track('app_opened', { demoVersion: '1.0.0' });
  }, [tracker]);

  // Load session data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const session = tracker.getSession();
      setSessionData(session);
      setUserState(tracker.getUserState());
    }, 1000);
    return () => clearInterval(interval);
  }, [tracker]);

  const addTask = (text: string, priority: Task['priority']) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTasks(prev => [task, ...prev]);
    tracker.track('task_created', { priority, taskId: task.id });
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const updated = { ...task, completed: !task.completed };
          if (!updated.completed) {
            tracker.track('task_updated', { taskId: id });
          }
          if (updated.completed) {
            tracker.track('task_completed', { taskId: id });
          }
          return updated;
        }
        return task;
      }),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    tracker.track('task_deleted', { taskId: id });
  };

  const updateTask = (id: string, text: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id && task.text !== text) {
          tracker.track('task_updated', { taskId: id });
          return { ...task, text };
        }
        return task;
      }),
    );
  };

  const changeFilter = (newFilter: Filter) => {
    setFilter(newFilter);
    tracker.track('filter_changed', { filter: newFilter });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] [data-theme='dark']:bg-[#0f172a] flex flex-col transition-colors duration-200"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ── 1. Header bar ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Logo + wordmark */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-indigo-500 flex items-center justify-center text-white flex-shrink-0"
                 style={{ boxShadow: '0 2px 8px rgb(99 102 241 / .35)' }}>
              <CheckCircle2 size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] font-bold tracking-tight truncate leading-tight"
                  style={{ color: 'var(--color-text)' }}>
                TaskPulse Pro
              </h1>
              <p className="text-[10px] font-medium hidden sm:block leading-none mt-0.5"
                 style={{ color: 'var(--color-text-muted)' }}>
                Activity-tracker-lite integrated
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Real-time Activity Monitored indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                 style={{
                   background: 'var(--color-surface-2)',
                   border: '1px solid var(--color-border)',
                   color: 'var(--color-text-muted)',
                 }}>
              <span className="status-dot" aria-label="Live monitoring active" />
              Real-time Activity Monitored
            </div>

            {/* User status chip */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                 style={{
                   background: 'var(--color-primary-light)',
                   border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)',
                   color: 'var(--color-primary)',
                 }}>
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${userState === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
              />
              <span className="capitalize">{userState}</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-8 h-8 flex items-center justify-center rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {darkMode ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
            </button>

            {/* Analytics Dashboard button */}
            <a
              href="/analytics"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold text-white transition-all duration-150 active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              style={{ background: 'var(--color-primary)', boxShadow: '0 1px 3px rgb(99 102 241 / .4)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
            >
              <LayoutDashboard size={14} strokeWidth={2} />
              <span className="hidden sm:inline">Analytics Dashboard</span>
              <span className="sm:hidden">Analytics</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="max-w-[900px] w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col gap-5">

        {/* ── 2. Welcome / hero section ────────────────────────────── */}
        <section
          className="rounded-[12px] p-6 relative overflow-hidden animate-fade-in-up"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {/* Decorative indigo blob */}
          <div className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full bg-indigo-500/8 blur-3xl" />
          <div className="pointer-events-none absolute right-20 -bottom-6 w-24 h-24 rounded-full bg-violet-500/6 blur-2xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3"
                  style={{
                    background: 'var(--color-primary-light)',
                    border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                    color: 'var(--color-primary)',
                  }}>
              <Sparkles size={11} strokeWidth={2.5} />
              SaaS Workspace
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5 leading-snug"
                style={{ color: 'var(--color-text)' }}>
              Welcome back, Developer! 👋
            </h2>
            <p className="text-sm max-w-lg leading-relaxed"
               style={{ color: 'var(--color-text-muted)' }}>
              Manage your tasks with zero friction. Every interaction is tracked seamlessly in real-time.
            </p>
          </div>
        </section>

        {/* ── 3. Add-task card ─────────────────────────────────────── */}
        <section>
          <TaskForm onAdd={addTask} />
        </section>

        {/* ── 4. Filter tabs ───────────────────────────────────────── */}
        <section>
          <FilterBar current={filter} onChange={changeFilter} />
        </section>

        {/* ── 5. Task list ─────────────────────────────────────────── */}
        <section>
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </section>

        {/* ── 6. Stats section ─────────────────────────────────────── */}
        <section>
          <StatsPanel stats={stats} />
        </section>

        {/* Additional Activity Stats Panel from tracker */}
        <section>
          <StatsPanel fromTracker={tracker} />
        </section>

        {/* Active Session State card */}
        {sessionData && (
          <section
            className="rounded-[12px] p-5"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2"
                style={{ color: 'var(--color-text)' }}>
              <Shield size={15} className="text-indigo-500" />
              Active Session State
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
              {[
                { label: 'Session ID', value: `${sessionData.id.slice(0, 8)}…`, mono: true },
                { label: 'Duration', value: `${Math.round((Date.now() - sessionData.startTime) / 1000)}s` },
                { label: 'Inactivity Limit', value: '60s' },
              ].map(({ label, value, mono }) => (
                <div
                  key={label}
                  className="flex justify-between sm:flex-col gap-1 p-3 rounded-[8px]"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                >
                  <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                  <span className={`font-semibold ${mono ? 'font-mono' : ''}`}
                        style={{ color: 'var(--color-text)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer
        className="py-5 mt-4"
        style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}
      >
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center text-[11px]"
             style={{ color: 'var(--color-text-muted)' }}>
          TaskPulse Pro &nbsp;•&nbsp; Built with{' '}
          <span className="text-indigo-500 font-semibold">activity-tracker-lite</span>
          {' '}&amp; React 19
        </div>
      </footer>
    </div>
  );
}
