import React, { useEffect, useState } from 'react';
import { ActivityTracker } from 'activity-tracker-lite';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, Circle, ListTodo, TrendingUp } from 'lucide-react';

type Props = {
  stats?: { total: number; completed: number; active: number };
  fromTracker?: ActivityTracker;
};

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

/* ── Task Statistics Panel ───────────────────────────────────────────── */
function TaskStatsPanel({ stats }: { stats: { total: number; completed: number; active: number } }) {
  const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cards = [
    {
      label: 'Total',
      value: stats.total,
      icon: <ListTodo size={15} />,
      style: {
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        numColor: 'var(--color-text)',
        iconColor: 'var(--color-text-muted)',
      },
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <CheckCircle2 size={15} />,
      style: {
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        numColor: '#16a34a',
        iconColor: '#16a34a',
      },
    },
    {
      label: 'In Progress',
      value: stats.active,
      icon: <Circle size={15} />,
      style: {
        background: '#fffbeb',
        border: '1px solid #fde68a',
        numColor: '#d97706',
        iconColor: '#d97706',
      },
    },
    {
      label: 'Progress %',
      value: `${progressPercent}%`,
      icon: <TrendingUp size={15} />,
      style: {
        background: 'var(--color-primary-light)',
        border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)',
        numColor: 'var(--color-primary)',
        iconColor: 'var(--color-primary)',
      },
    },
  ];

  return (
    <div
      className="rounded-[12px] p-5 space-y-4"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <h3
        className="text-sm font-bold flex items-center gap-2"
        style={{ color: 'var(--color-text)' }}
      >
        <span className="w-1 h-4 bg-indigo-500 rounded-full" />
        Task Statistics
      </h3>

      {/* 4-card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(({ label, value, icon, style }) => (
          <div
            key={label}
            className="p-3.5 rounded-[10px]"
            style={{ background: style.background, border: style.border }}
          >
            <div className="flex items-center justify-between mb-1.5" style={{ color: style.iconColor }}>
              <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
              {icon}
            </div>
            <div className="text-2xl font-bold leading-none" style={{ color: style.numColor }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Completion progress bar */}
      <div className="pt-1">
        <div
          className="flex justify-between text-xs font-medium mb-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span>Overall Completion</span>
          <span>{progressPercent}%</span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, background: 'var(--color-primary)' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Activity Analytics Panel (from tracker) ─────────────────────────── */
function ActivityPanel({ trackerStats }: { trackerStats: any }) {
  const eventCounts = trackerStats.eventCounts || [];
  const chartData = eventCounts.slice(0, 5).map((e: any) => ({
    name: e.eventName.replace(/_/g, ' '),
    count: e.count,
  }));

  return (
    <div
      className="rounded-[12px] p-5"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <h3
        className="text-sm font-bold mb-4 flex items-center gap-2"
        style={{ color: 'var(--color-text)' }}
      >
        <span className="w-1 h-4 bg-violet-500 rounded-full" />
        Activity Analytics
      </h3>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <MetricRow label="Total Events"  value={trackerStats.basics.totalEvents ?? 0} />
        <MetricRow label="Page Views"    value={trackerStats.basics.totalPageViews ?? 0} />
        <MetricRow label="Sessions"      value={trackerStats.basics.totalSessions ?? 0} />
        <MetricRow label="Avg Duration"  value={`${Math.round((trackerStats.basics.averageSessionDurationMs ?? 0) / 1000)}s`} />
      </div>

      {/* Event distribution chart */}
      {chartData.length > 0 && (
        <div
          className="pt-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-wide mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Event Distribution
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'var(--color-text-muted)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ── Metric mini-card ────────────────────────────────────────────────── */
function MetricRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      className="p-2.5 rounded-[8px] text-center"
      style={{
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </div>
      <div className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
        {value}
      </div>
    </div>
  );
}

/* ── Default export ──────────────────────────────────────────────────── */
export default function StatsPanel({ stats, fromTracker }: Props) {
  const [trackerStats, setTrackerStats] = useState<any>(null);

  useEffect(() => {
    if (!fromTracker) return;
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await fromTracker.getStats();
        if (!cancelled) {
          setTrackerStats(data);
        }
      } catch (err) {
        console.error('Failed to load tracker stats:', err);
      }
    }

    loadStats();
    return () => { cancelled = true; };
  }, [fromTracker]);

  if (stats) return <TaskStatsPanel stats={stats} />;
  if (fromTracker && trackerStats) return <ActivityPanel trackerStats={trackerStats} />;
  return null;
}
