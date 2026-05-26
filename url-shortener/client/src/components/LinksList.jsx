import React, { useState } from 'react';
import { Search, Copy, Check, BarChart2, Trash2, ExternalLink, QrCode } from 'lucide-react';

export default function LinksList({ links, loading, onDeleteSuccess, onViewAnalytics }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [hoveredQr, setHoveredQr] = useState(null);

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter links by search
  const filteredLinks = links.filter(link => {
    return (
      link.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>📊 Short Links Dashboard</h2>
        
        {/* Search bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }}>
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ padding: '0.5rem 0.75rem 0.5rem 2.25rem', fontSize: '0.9rem', width: '100%', minWidth: 'auto', borderRadius: '10px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid hsl(var(--primary) / 0.1)', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>Loading active links...</p>
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔗</div>
          <p className="empty-state-text">
            {searchTerm ? 'No search matches found' : 'No shortened links yet'}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: '0.25rem' }}>
            {searchTerm ? 'Try checking your search terms' : 'Shorten your first destination URL above! 🎉'}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Short Link</th>
                <th>Original URL</th>
                <th>Clicks</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => {
                const shortUrl = `${window.location.origin}/${link.shortCode}`;
                const createdDate = new Date(link.createdAt).toLocaleDateString();
                const expiryDate = link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never';

                return (
                  <tr key={link._id}>
                    <td className="font-mono-code">
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {link.shortCode} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                      </a>
                    </td>
                    <td>
                      <div className="url-truncate" title={link.originalUrl}>
                        {link.originalUrl}
                      </div>
                    </td>
                    <td>
                      <span className="badge-clicks">{link.clicksCount}</span>
                    </td>
                    <td className="badge-expiry">{createdDate}</td>
                    <td className="badge-expiry" style={{ color: link.expiresAt ? 'inherit' : 'hsl(var(--success))' }}>{expiryDate}</td>
                    <td>
                      <div className="action-group">
                        {/* Copy Link */}
                        <button
                          onClick={() => handleCopy(link._id, shortUrl)}
                          className="btn-icon"
                          title="Copy short link"
                          style={{ position: 'relative' }}
                        >
                          {copiedId === link._id ? <Check size={14} style={{ color: 'hsl(var(--success))' }} /> : <Copy size={14} />}
                          {copiedId === link._id && <span className="copy-tooltip" style={{ fontSize: '0.7rem' }}>Copied!</span>}
                        </button>

                        {/* Interactive QR Display */}
                        <div 
                          style={{ position: 'relative' }}
                          onMouseEnter={() => setHoveredQr(link._id)}
                          onMouseLeave={() => setHoveredQr(null)}
                        >
                          <button className="btn-icon" title="QR Code Preview">
                            <QrCode size={14} />
                          </button>
                          
                          {hoveredQr === link._id && (
                            <div style={{
                              position: 'absolute',
                              bottom: '100%',
                              left: '50%',
                              transform: 'translateX(-50%) translateY(-8px)',
                              background: '#ffffff',
                              padding: '0.5rem',
                              borderRadius: '12px',
                              boxShadow: 'var(--shadow-lg)',
                              border: '1px solid hsl(var(--border-card))',
                              zIndex: 100
                            }}>
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(shortUrl)}&color=6366f1`} 
                                alt="QR Code" 
                                style={{ width: '80px', height: '80px', display: 'block' }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Analytics view */}
                        <button
                          onClick={() => onViewAnalytics(link.shortCode)}
                          className="btn-icon"
                          title="View detailed analytics"
                        >
                          <BarChart2 size={14} />
                        </button>

                        {/* Delete URL */}
                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this short link?')) {
                              try {
                                const response = await fetch(`/api/links/${link._id}`, { method: 'DELETE' });
                                if (response.ok) {
                                  onDeleteSuccess();
                                }
                              } catch (err) {
                                console.error('Failed to delete', err);
                              }
                            }
                          }}
                          className="btn-icon delete"
                          title="Delete link"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
