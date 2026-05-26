import React from 'react';
import { Link2, MousePointerClick, CheckCircle, BarChart2, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ links }) {
  // Aggregate Stats
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicksCount || 0), 0);
  const activeLinks = links.filter(link => {
    if (!link.expiresAt) return true;
    return new Date(link.expiresAt) > new Date();
  }).length;
  const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : '0.0';

  // Aggregate clicks timeline across ALL links
  const getAggregatedTraffic = () => {
    const grouped = {};
    links.forEach(link => {
      if (link.clicks) {
        link.clicks.forEach(click => {
          const date = new Date(click.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          grouped[date] = (grouped[date] || 0) + 1;
        });
      }
    });

    // Sort dates chronologically
    const sorted = Object.entries(grouped)
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return sorted.slice(-10); // Last 10 days of traffic
  };

  const trafficData = getAggregatedTraffic();

  const stats = [
    { name: 'Total Links', value: totalLinks, icon: <Link2 size={22} />, colorClass: '' },
    { name: 'Total Clicks', value: totalClicks, icon: <MousePointerClick size={22} />, colorClass: 'clicks' },
    { name: 'Active Links', value: activeLinks, icon: <CheckCircle size={22} />, colorClass: 'active' },
    { name: 'Avg. Clicks / Link', value: avgClicks, icon: <BarChart2 size={22} />, colorClass: '' }
  ];

  return (
    <div>
      {/* Stats Cards Grid */}
      <div className="dashboard-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className={`stat-icon ${stat.colorClass}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.name}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregated Traffic Chart */}
      {totalClicks > 0 && trafficData.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: 'hsl(var(--primary))' }} /> Network Clicks Traffic (Overall)
          </h3>
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="dashboardTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="hsl(var(--text-muted))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--text-muted))" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--bg-card))', 
                    border: '1px solid hsl(var(--border-card))', 
                    borderRadius: '12px',
                    color: 'hsl(var(--text-main))',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem'
                  }} 
                />
                <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#dashboardTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
