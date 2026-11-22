import React, { useEffect, useState } from 'react';
import { useActivityTracker } from 'activity-tracker-lite/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Activity, Clock, TrendingUp, Calendar, User, ArrowLeft } from 'lucide-react';

export default function AnalyticsDashboard() {
  const tracker = useActivityTracker();
  const [analytics, setAnalytics] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [userState, setUserState] = useState<string>('active');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      const [analyticsData, eventsData, sessionData] = await Promise.all([
        tracker.getStats(),
        tracker.getEvents(),
        Promise.resolve(tracker.getSession()),
      ]);
      setAnalytics(analyticsData);
      setEvents(eventsData.slice(-50));
      setSession(sessionData);
      setUserState(tracker.getUserState());
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [tracker]);

  const eventCounts = analytics?.eventCounts || [];
  const topPages = analytics?.topPages || [];
  const basics = analytics?.basics || {};

  // Chart data preparation
  const barChartData = eventCounts.map((e: any) => ({
    name: e.eventName.replace(/_/g, ' '),
    count: e.count,
  }));

  const pageChartData = topPages.slice(0, 5).map((p: any) => ({
    name: p.url.split('/').pop()?.slice(0, 20) || p.url,
    count: p.count,
  }));

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-[10px] bg-indigo-500 flex items-center justify-center text-white flex-shrink-0"
              style={{ boxShadow: '0 2px 8px rgb(99 102 241 / .35)' }}
            >
              <TrendingUp size={17} strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight leading-tight" style={{ color: 'var(--color-text)' }}>
                Analytics Dashboard
              </h1>
              <p className="text-[10px] font-medium leading-none mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                Real-time Activity Insights
              </p>
            </div>
          </div>

          <a
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-xs font-semibold text-white transition-all duration-150 active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            style={{ background: 'var(--color-text)', boxShadow: 'var(--shadow-xs)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <ArrowLeft size={14} />
            <span>Back to Tasks</span>
          </a>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col gap-5">

        {/* Status badge */}
        <div
          className="flex items-center justify-between gap-3 p-4 rounded-[12px]"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
              style={
                userState === 'active'
                  ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
                  : { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${userState === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
              />
              {userState === 'active' ? 'User Active' : 'User Idle'}
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          {analytics?.includesEstimates && (
            <span className="text-xs italic hidden sm:inline" style={{ color: 'var(--color-text-muted)' }}>
              Includes estimates
            </span>
          )}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard icon={<Calendar size={18} />} label="Total Page Views" value={basics.totalPageViews ?? 0} sublabel="Visits" />
          <MetricCard icon={<Activity size={18} />} label="Total Events"     value={basics.totalEvents ?? 0}     sublabel="Interactions" />
          <MetricCard icon={<Clock size={18} />}    label="Avg Duration"     value={`${Math.round((basics.averageSessionDurationMs ?? 0) / 1000)}s`} sublabel="Per session" />
          <MetricCard icon={<User size={18} />}     label="Total Sessions"   value={basics.totalSessions ?? 0}   sublabel="Unique sessions" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Event Distribution" subtitle="By event type">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData}>
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
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {barChartData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#f472b6'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Pages" subtitle="Most visited URLs">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={pageChartData}>
                <defs>
                  <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPages)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Activity Timeline */}
        <div
          className="rounded-[12px] p-5"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Calendar size={15} className="text-indigo-500" />
                Recent Activity Log
              </h3>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              style={{
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Time', 'Event', 'Details'].map(h => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                      No activity recorded yet
                    </td>
                  </tr>
                ) : (
                  events.slice().reverse().slice(0, 15).map((event, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors duration-100"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = 'var(--color-surface-2)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = 'transparent')}
                    >
                      <td className="py-2.5 px-3 font-mono whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-semibold text-indigo-500">{event.name}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono max-w-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                        {JSON.stringify(event.properties || {})}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value, sublabel }: any) {
  return (
    <div
      className="rounded-[12px] p-4 transition-shadow duration-150"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div className="flex items-center justify-between mb-1" style={{ color: 'var(--color-text-muted)' }}>
        <span className="text-[11px] font-medium">{label}</span>
        {icon}
      </div>
      <div className="text-xl font-bold tracking-tight leading-none" style={{ color: 'var(--color-text)' }}>
        {value}
      </div>
      <div className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
        {sublabel}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: any) {
  return (
    <div
      className="rounded-[12px] p-5"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div className="mb-3">
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{title}</h3>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
