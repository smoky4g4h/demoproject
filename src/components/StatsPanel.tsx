import React, { useEffect, useState } from 'react';
import { ActivityTracker } from 'activity-tracker-lite';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Props = {
  stats?: { total: number; completed: number; active: number };
  fromTracker?: ActivityTracker;
};

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

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

  // Task Statistics Panel
  if (stats) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-indigo-600 rounded-full" />
          Task Statistics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-100">
            <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.total}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Tasks</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-emerald-50 to-white rounded-xl border border-emerald-100">
            <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.completed}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Completed</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-amber-50 to-white rounded-xl border border-amber-100">
            <div className="text-3xl font-bold text-amber-600 mb-1">{stats.active}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">In Progress</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Progress</span>
            <span className="font-semibold">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Activity Analytics Panel
  if (fromTracker && trackerStats) {
    const eventCounts = trackerStats.eventCounts || [];

    const chartData = eventCounts.slice(0, 5).map(e => ({
      name: e.eventName.replace(/_/g, ' '),
      count: e.count,
    }));

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-violet-600 rounded-full" />
          Activity Analytics
        </h3>

        {/* Key metrics */}
        <div className="space-y-3 mb-6">
          <MetricRow label="Total Events" value={trackerStats.basics.totalEvents ?? 0} color="text-indigo-600" />
          <MetricRow label="Page Views" value={trackerStats.basics.totalPageViews ?? 0} color="text-violet-600" />
          <MetricRow label="Sessions" value={trackerStats.basics.totalSessions ?? 0} color="text-purple-600" />
          <MetricRow label="Avg Session Duration" value={`${Math.round((trackerStats.basics.averageSessionDurationMs ?? 0) / 1000)}s`} color="text-pink-600" />
        </div>

        {/* Event distribution chart */}
        {chartData.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Event Distribution</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((_entry, index) => (
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

  return null;
}

function MetricRow({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`font-bold text-sm ${color}`}>{value}</span>
    </div>
  );
}
