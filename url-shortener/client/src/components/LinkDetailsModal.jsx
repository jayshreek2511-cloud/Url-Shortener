import React from 'react';
import { X, Calendar, Globe, Monitor, Compass, AlertCircle, BarChart2 } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

export default function LinkDetailsModal({ linkCode, onClose }) {
  const [linkDetails, setLinkDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  React.useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/links/${linkCode}/analytics`);
        if (!response.ok) {
          throw new Error('Failed to load detailed analytics');
        }
        const data = await response.json();
        setLinkDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (linkCode) {
      fetchDetails();
    }
  }, [linkCode]);

  if (!linkCode) return null;

  // Process data for charts
  const getTimelineData = () => {
    if (!linkDetails || !linkDetails.clicks) return [];
    const grouped = {};
    linkDetails.clicks.forEach(click => {
      const date = new Date(click.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped).map(([date, count]) => ({ date, clicks: count })).slice(-7);
  };

  const getPieData = (key) => {
    if (!linkDetails || !linkDetails.clicks) return [];
    const counts = {};
    linkDetails.clicks.forEach(click => {
      const val = click[key] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const timelineData = getTimelineData();
  const browserData = getPieData('browser');
  const platformData = getPieData('platform');
  const referrerData = getPieData('referrer');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>
              📊 Link Analytics Dashboard
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: '0.25rem' }}>
              Detailed reporting for code: <span style={{ fontWeight: 700, color: 'hsl(var(--primary))', fontFamily: 'var(--font-mono)' }}>{linkCode}</span>
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid hsl(var(--primary) / 0.1)', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: 'hsl(var(--text-muted))', fontWeight: 500 }}>Fetching link analytics...</p>
            </div>
          )}

          {error && (
            <div className="error-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {!loading && !error && linkDetails && (
            <div>
              {/* Quick info overview */}
              <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'hsl(var(--border-card) / 0.2)' }}>
                <div style={{ wordBreak: 'break-all', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--text-muted))', display: 'block' }}>Destination Link</span>
                  <a href={linkDetails.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--text-main))', fontWeight: 600, textDecoration: 'none' }}>
                    {linkDetails.originalUrl}
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--text-muted))', display: 'block' }}>Total Clicks</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--primary))' }}>{linkDetails.clicksCount}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--text-muted))', display: 'block' }}>Created On</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{new Date(linkDetails.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--text-muted))', display: 'block' }}>Expires On</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: linkDetails.expiresAt ? 'inherit' : 'hsl(var(--success))' }}>
                      {linkDetails.expiresAt ? new Date(linkDetails.expiresAt).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {linkDetails.clicksCount === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📈</div>
                  <p className="empty-state-text">No clicks recorded yet.</p>
                  <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: '0.25rem' }}>Share your shortened link to gather visual analytics!</p>
                </div>
              ) : (
                <div>
                  {/* Timeline Chart */}
                  <div className="chart-card" style={{ marginBottom: '1.5rem', height: '280px' }}>
                    <h4 className="chart-title">
                      <BarChart2 size={16} /> Clicks History (Recent Days)
                    </h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <AreaChart data={timelineData}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="hsl(var(--text-muted))" fontSize={11} tickLine={false} />
                        <YAxis stroke="hsl(var(--text-muted))" fontSize={11} allowDecimals={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'hsl(var(--bg-card))', 
                            border: '1px solid hsl(var(--border-card))', 
                            borderRadius: '10px',
                            color: 'hsl(var(--text-main))',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.85rem'
                          }} 
                        />
                        <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Browser, Platform & Referrer charts */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    
                    <div className="chart-card" style={{ height: '240px' }}>
                      <h4 className="chart-title"><Globe size={16} /> Browser Breakdown</h4>
                      <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={browserData} layout="vertical">
                          <XAxis type="number" stroke="hsl(var(--text-muted))" fontSize={10} hide />
                          <YAxis type="category" dataKey="name" stroke="hsl(var(--text-muted))" fontSize={11} width={80} tickLine={false} />
                          <Tooltip contentStyle={{ background: 'hsl(var(--bg-card))', border: '1px solid hsl(var(--border-card))', borderRadius: '10px' }} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {browserData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card" style={{ height: '240px' }}>
                      <h4 className="chart-title"><Monitor size={16} /> Device OS Breakdown</h4>
                      <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                          <Pie
                            data={platformData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {platformData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: 'hsl(var(--bg-card))', border: '1px solid hsl(var(--border-card))', borderRadius: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '-1rem' }}>
                        {platformData.map((entry, index) => (
                          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                            <span style={{ fontWeight: 600 }}>{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Referrers Section */}
                  <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
                    <h4 className="chart-title"><Compass size={16} /> Referrers Distribution</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {referrerData.map((ref, idx) => {
                        const pct = Math.round((ref.value / linkDetails.clicksCount) * 100);
                        return (
                          <div key={ref.name}>
                            <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                              <span>{ref.name}</span>
                              <span style={{ marginLeft: 'auto', color: 'hsl(var(--primary))' }}>{ref.value} clicks ({pct}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'hsl(var(--border-card))', borderRadius: '99px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: COLORS[idx % COLORS.length], borderRadius: '99px' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clicks list table */}
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', marginTop: '1.5rem', color: 'hsl(var(--text-main))' }}>
                    📋 Raw Clicks Log
                  </h4>
                  <div className="table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table className="analytics-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Referrer</th>
                          <th>Browser</th>
                          <th>Platform</th>
                        </tr>
                      </thead>
                      <tbody>
                        {linkDetails.clicks.slice().reverse().map((click, index) => (
                          <tr key={index}>
                            <td>{new Date(click.timestamp).toLocaleString()}</td>
                            <td style={{ fontWeight: 600 }}>{click.referrer}</td>
                            <td>{click.browser}</td>
                            <td>
                              <span className="badge-clicks" style={{ background: 'hsl(var(--accent) / 0.1)', color: 'hsl(var(--accent))' }}>
                                {click.platform}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
