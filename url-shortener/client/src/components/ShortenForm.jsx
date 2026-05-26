import React, { useState } from 'react';
import { Link2, Copy, Check, Sparkles, Calendar } from 'lucide-react';

export default function ShortenForm({ onShortenSuccess }) {
  const [url, setUrl] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('7');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          expiresInDays: parseInt(expiresInDays),
          customCode: customCode.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
      setUrl('');
      setCustomCode('');
      if (onShortenSuccess) {
        onShortenSuccess(); // Trigger dashboard list refresh
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.short_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sparkles size={20} style={{ color: 'hsl(var(--primary))' }} /> Create Short Link
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="urlInput">Destination URL</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }}>
              <Link2 size={18} />
            </span>
            <input
              id="urlInput"
              type="text"
              required
              placeholder="https://example.com/very-long-url-path"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.75rem', width: '100%', minWidth: 'auto' }}
            />
          </div>
        </div>

        <div className="input-flex-container">
          <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
            <label className="form-label" htmlFor="expirySelect">Link Expiration</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <select
                id="expirySelect"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                className="select-field"
                style={{ width: '100%' }}
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">1 Year</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ flex: 2, minWidth: '220px' }}>
            <label className="form-label" htmlFor="customCodeInput">Custom Backhalf (Optional)</label>
            <input
              id="customCodeInput"
              type="text"
              placeholder="e.g. promo2026"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Generating Link...' : 'Shorten URL'}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {result && (
        <div className="result-panel">
          <div className="result-header">
            <Check size={18} /> Generated Successfully!
          </div>
          <div className="result-content">
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: '0.25rem' }}>Your Short Link:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a href={result.short_url} target="_blank" rel="noopener noreferrer" className="short-url-link">
                  {result.short_url}
                </a>
                <button 
                  onClick={handleCopy}
                  className="btn-icon" 
                  style={{ position: 'relative', border: '1px solid hsl(var(--success) / 0.3)', background: 'hsl(var(--success) / 0.05)', color: 'hsl(var(--success))' }}
                  title="Copy Link"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied && <span className="copy-tooltip">Copied!</span>}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={12} /> Expires on: {new Date(result.expires_at).toLocaleDateString()}
              </p>
            </div>
            
            <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid hsl(var(--border-card))' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(result.short_url)}&color=6366f1`} 
                alt="QR Code" 
                style={{ width: '90px', height: '90px' }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
