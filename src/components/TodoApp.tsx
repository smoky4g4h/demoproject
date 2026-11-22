import React, { useState, useEffect } from 'react';
import { useActivityTracker } from 'activity-tracker-lite/react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import FilterBar from './FilterBar';
import StatsPanel from './StatsPanel';
import { CheckCircle2, LayoutDashboard, Zap, Shield, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Banner / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                TaskPulse Pro
              </h1>
              <p className="text-xs text-slate-400 font-medium">Powered by activity-tracker-lite</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 border border-slate-200">
              <span className={`w-2.5 h-2.5 rounded-full ${userState === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              User Status: <span className="capitalize">{userState}</span>
            </div>
            <a
              href="/analytics"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2 text-sm font-semibold group"
            >
              <LayoutDashboard size={17} className="transition-transform group-hover:scale-110" />
              Analytics Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Center Tasks Section */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium mb-3">
                    <Sparkles size={13} /> Real-time Activity Monitored
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back, Developer!</h2>
                  <p className="text-indigo-100 text-sm max-w-md">
                    Every task interaction, filter change, and idle timeout is being captured seamlessly by your tracker package.
                  </p>
                </div>
              </div>
            </div>

            <TaskForm onAdd={addTask} />
            <FilterBar current={filter} onChange={changeFilter} />
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          </div>

          {/* Right Sidebar Stats & Info */}
          <div className="space-y-6 animate-fade-in">
            <StatsPanel stats={stats} />
            <StatsPanel fromTracker={tracker} />

            {sessionData && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-indigo-600" /> Active Session State
                </h3>
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Session ID</span>
                    <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {sessionData.id.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-700">
                      {Math.round((Date.now() - sessionData.startTime) / 1000)}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-500">Inactivity Limit</span>
                    <span className="font-semibold text-slate-700">60s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-400">
          Built with <span className="text-indigo-600 font-medium">activity-tracker-lite</span> & React 19. All events stored locally in memory.
        </div>
      </footer>
    </div>
  );
}
