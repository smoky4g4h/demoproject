import React, { useEffect, useState } from 'react';
import { useActivityTracker } from 'activity-tracker-lite/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Activity, Clock, TrendingUp, Calendar, User } from 'lucide-react';

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
  const barChartData = eventCounts.map(e => ({
    name: e.eventName.replace(/_/g, ' '),
    count: e.count,
  }));

  const pageChartData = topPages.slice(0, 5).map(p => ({
    name: p.url.split('/').pop()?.slice(0, 20) || p.url,
    count: p.count,
  }));

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-200">
              <TrendingUp size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-xs text-slate-400 font-medium">Real-time Activity Insights</p>
            </div>
          </div>

          <a
            href="/"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg active:scale-95"
          >
            ← Back to Tasks
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            userState === 'active'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              userState === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`} />
            {userState === 'active' ? 'User Active' : 'User Idle'}
          </div>
          <span className="text-sm text-slate-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          {analytics?.includesEstimates && (
            <span className="text-xs text-slate-400 italic ml-auto">
              Some metrics are estimated
            </span>
          )}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricCard
            icon={<Calendar size={24} />}
            label="Total Page Views"
            value={basics.totalPageViews ?? 0}
            sublabel="Historical visits"
            color="from-blue-500 to-cyan-500"
            bgColor="bg-blue-50"
          />
          <MetricCard
            icon={<Activity size={24} />}
            label="Total Events"
            value={basics.totalEvents ?? 0}
            sublabel="All tracked interactions"
            color="from-indigo-500 to-violet-500"
            bgColor="bg-indigo-50"
          />
          <MetricCard
            icon={<Clock size={24} />}
            label="Avg Session Duration"
            value={`${Math.round((basics.averageSessionDurationMs ?? 0) / 1000)}s`}
            sublabel="Per session average"
            color="from-emerald-500 to-teal-500"
            bgColor="bg-emerald-50"
          />
          <MetricCard
            icon={<User size={24} />}
            label="Total Sessions"
            value={basics.totalSessions ?? 0}
            sublabel="Unique sessions"
            color="from-purple-500 to-pink-500"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatBox
            title="Active Time"
            value={formatMs(basics.totalActiveTimeMs)}
            description="Measured interaction time"
            trend="+12%"
            trendUp={true}
            color="emerald"
          />
          <StatBox
            title="Idle Time"
            value={formatMs(basics.totalIdleTimeMs)}
            description="Estimated idle periods"
            trend="-3%"
            trendUp={false}
            color="amber"
          />
          <StatBox
            title="Event Rate"
            value={`${Math.min(basics.totalEvents ?? 0, 999)}m`}
            description="Events captured today"
            trend="+5%"
            trendUp={true}
            color="violet"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Event Distribution" subtitle="By event type">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barChartData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    color: '#fff'
                  }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
                  {barChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#f472b6'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Pages" subtitle="Most visited URLs">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={pageChartData} margin={{ bottom: 20 }}>
                <defs>
                  <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPages)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-violet-600" />
                Recent Activity
              </h3>
              <p className="text-sm text-slate-500 mt-1">Showing last {Math.min(events.length, 50)} events</p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 text-sm font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
            >
              Refresh Now
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wide">Timestamp</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wide">Event Type</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wide">Properties</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Activity size={40} className="opacity-50" />
                        <p className="font-medium">No activity recorded yet</p>
                        <p className="text-xs">Start interacting with the app to see events appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  events.slice().reverse().slice(0, 20).map((event, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                        {new Date(event.timestamp).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getEventBadgeClass(event.name)}`}>
                          <EventDot name={event.name} />
                          {formatEventName(event.name)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 max-w-xs truncate">
                        {JSON.stringify(event.properties || {})}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                          Captured ✓
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Session Info Panel */}
        {session && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-base font-bold mb-5 flex items-center gap-2">
              <User size={18} className="text-violet-400" />
              Current Session Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <SessionInfoItem
                label="Session ID"
                value={session.id.slice(0, 8) + '...'}
                mono={true}
              />
              <SessionInfoItem
                label="Started At"
                value={new Date(session.startTime).toLocaleTimeString()}
              />
              <SessionInfoItem
                label="Elapsed Time"
                value={formatMs(Date.now() - session.startTime)}
                highlight={true}
              />
              <SessionInfoItem
                label="Status"
                value={session.duration !== undefined ? 'Ended' : 'Active'}
                highlight={session.duration === undefined}
                dotColor={session.duration === undefined ? 'bg-emerald-400' : 'bg-slate-400'}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Sub Components ──────────────────────────────────────────────────────────

function MetricCard({ icon, label, value, sublabel, color, bgColor }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500 mb-1 font-medium">{label}</div>
          <div className="text-4xl font-bold text-slate-800 tracking-tight">{value}</div>
          <div className="text-xs text-slate-400 mt-1">{sublabel}</div>
        </div>
        <div className={`p-3 rounded-xl ${bgColor} bg-opacity-50`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value, description, trend, trendUp, color }: any) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    violet: 'bg-violet-50 border-violet-100',
  };

  return (
    <div className={`rounded-2xl border ${colors[color]} p-5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{description}</div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function SessionInfoItem({ label, value, mono, highlight, dotColor }: any) {
  return (
    <div>
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
      <div className={`font-mono text-sm ${highlight ? 'text-emerald-400 font-bold' : 'text-white'}`}>
        {dotColor && <span className={`inline-block w-2 h-2 rounded-full ${dotColor} mr-2`} />}
        {value}
      </div>
    </div>
  );
}

// ─── Helper Functions ────────────────────────────────────────────────────────

function getEventBadgeClass(eventName: string): string {
  const map: Record<string, string> = {
    'page_view': 'bg-blue-100 text-blue-700',
    'session_start': 'bg-purple-100 text-purple-700',
    'user_active': 'bg-emerald-100 text-emerald-700',
    'user_idle': 'bg-amber-100 text-amber-700',
    'task_created': 'bg-indigo-100 text-indigo-700',
    'task_updated': 'bg-cyan-100 text-cyan-700',
    'task_deleted': 'bg-red-100 text-red-700',
    'task_completed': 'bg-green-100 text-green-700',
    'filter_changed': 'bg-violet-100 text-violet-700',
    'app_opened': 'bg-pink-100 text-pink-700',
  };
  return map[eventName] || 'bg-slate-100 text-slate-700';
}

function EventDot({ name }: { name: string }) {
  const colors: Record<string, string> = {
    'page_view': 'bg-blue-500',
    'session_start': 'bg-purple-500',
    'user_active': 'bg-emerald-500',
    'user_idle': 'bg-amber-500',
    'task_created': 'bg-indigo-500',
    'task_updated': 'bg-cyan-500',
    'task_deleted': 'bg-red-500',
    'task_completed': 'bg-green-500',
    'filter_changed': 'bg-violet-500',
    'app_opened': 'bg-pink-500',
  };
  return <span className={`w-2 h-2 rounded-full ${colors[name] || 'bg-slate-500'}`} />;
}

function formatEventName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatMs(ms: number): string {
  if (!ms || ms === 0) return '0s';
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}
