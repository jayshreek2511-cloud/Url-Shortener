import React, { useState, useEffect } from 'react';
import ShortenForm from './components/ShortenForm';
import LinksList from './components/LinksList';
import Dashboard from './components/Dashboard';
import LinkDetailsModal from './components/LinkDetailsModal';
import { RefreshCw, Zap } from 'lucide-react';

export default function App() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLinkCode, setSelectedLinkCode] = useState(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/links');
      if (!response.ok) {
        throw new Error('Failed to load short links');
      }
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="glass-container">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header Block */}
        <header className="header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
              color: '#ffffff',
              padding: '0.6rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px -4px hsl(var(--primary) / 0.4)'
            }}>
              <Zap size={22} fill="white" />
            </div>
            <div>
              <h1 className="header-title" style={{ margin: 0, lineHeight: 1.1 }}>
                SmartLink
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>
                High-Performance URL Analytics
              </p>
            </div>
          </div>
          
          <div className="header-controls">
            <button 
              onClick={fetchLinks} 
              className="theme-toggle" 
              title="Refresh Dashboard Data"
              aria-label="Refresh data"
            >
              <RefreshCw size={18} className={loading ? 'spin-anim' : ''} />
            </button>
          </div>
        </header>

        {/* System Error Banner */}
        {error && (
          <div className="error-banner" style={{ marginBottom: '1.5rem' }}>
            ⚠️ Error: {error}
          </div>
        )}

        {/* Cumulative Stats Grid */}
        <Dashboard links={links} />

        {/* Main Interface Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Create link form */}
          <div style={{ position: 'sticky', top: '2rem' }}>
            <ShortenForm onShortenSuccess={fetchLinks} />
          </div>

          {/* Active Links list */}
          <div style={{ flex: 2 }}>
            <LinksList 
              links={links} 
              loading={loading} 
              onDeleteSuccess={fetchLinks} 
              onViewAnalytics={(code) => setSelectedLinkCode(code)}
            />
          </div>

        </div>

      </div>

      {/* Analytics Modal overlay */}
      {selectedLinkCode && (
        <LinkDetailsModal 
          linkCode={selectedLinkCode} 
          onClose={() => setSelectedLinkCode(null)} 
        />
      )}

      {/* Global CSS animation injections */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
