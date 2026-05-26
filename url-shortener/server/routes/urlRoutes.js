const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { isValidUrl, generateShortCode, parseUserAgent } = require('../utils/helpers');

// API: Shorten URL
router.post('/api/shorten', async (req, res) => {
  const { url, expiresInDays = 7, customCode } = req.body;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const fullUrl = url.startsWith('http') ? url : 'https://' + url;
  const expiresAt = new Date(Date.now() + parseInt(expiresInDays) * 24 * 60 * 60 * 1000);

  try {
    let code = customCode ? customCode.trim() : '';

    if (code) {
      // Validate custom code
      if (!/^[a-zA-Z0-9_-]{3,15}$/.test(code)) {
        return res.status(400).json({ error: 'Custom code must be 3-15 alphanumeric characters, dashes, or underscores' });
      }

      const existing = await Url.findOne({ shortCode: code });
      if (existing) {
        return res.status(400).json({ error: 'Custom code is already in use' });
      }
    } else {
      // Generate unique Base62 code
      let attempts = 0;
      let isUnique = false;
      while (!isUnique && attempts < 5) {
        code = generateShortCode();
        const existing = await Url.findOne({ shortCode: code });
        if (!existing) {
          isUnique = true;
        }
        attempts++;
      }
      if (!isUnique) {
        return res.status(500).json({ error: 'Failed to generate a unique short URL. Try again.' });
      }
    }

    const newUrl = new Url({
      originalUrl: fullUrl,
      shortCode: code,
      expiresAt: expiresAt
    });

    await newUrl.save();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
      short_url: `${baseUrl}/${code}`,
      short_code: code,
      original_url: fullUrl,
      expires_at: expiresAt
    });

  } catch (err) {
    console.error('Error shortening URL:', err);
    res.status(500).json({ error: 'Server database error' });
  }
});

// API: Get All Active/Non-Expired Links
router.get('/api/links', async (req, res) => {
  try {
    const now = new Date();
    // Fetch non-expired or never-expiring URLs
    const links = await Url.find({
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).sort({ createdAt: -1 }).limit(50);

    res.json(links);
  } catch (err) {
    console.error('Error listing links:', err);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// API: Get Analytics for a Single URL
router.get('/api/links/:shortCode/analytics', async (req, res) => {
  const { shortCode } = req.params;
  try {
    const urlDoc = await Url.findOne({ shortCode });
    if (!urlDoc) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.json({
      shortCode: urlDoc.shortCode,
      originalUrl: urlDoc.originalUrl,
      clicksCount: urlDoc.clicksCount,
      createdAt: urlDoc.createdAt,
      expiresAt: urlDoc.expiresAt,
      clicks: urlDoc.clicks
    });
  } catch (err) {
    console.error('Error getting analytics:', err);
    res.status(500).json({ error: 'Server analytics fetch error' });
  }
});

// API: Delete a Link
router.delete('/api/links/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Url.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.json({ success: true, message: 'URL deleted successfully' });
  } catch (err) {
    console.error('Error deleting URL:', err);
    res.status(500).json({ error: 'Server delete error' });
  }
});

// GET: Short link redirection + Analytics capture
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  // Skip browser requests for favicon
  if (shortCode === 'favicon.ico') {
    return res.status(404).end();
  }

  try {
    const now = new Date();
    const urlDoc = await Url.findOne({
      shortCode,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    });

    if (!urlDoc) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Link Expired or Not Found</title>
          <style>
            body { background: #F7F6FF; color: #1a1a2e; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Segoe UI', sans-serif; }
            .card { max-width: 420px; width: 100%; padding: 2.5rem; background: #fff; border-radius: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.06); border: 1px solid #E4E2F0; text-align: center; }
            .icon { font-size: 3.5rem; margin-bottom: 1rem; }
            h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; color: #1a1a2e; }
            p { color: #6B6880; margin-bottom: 1.5rem; }
            a { display: inline-block; padding: 0.75rem 2rem; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border-radius: 14px; text-decoration: none; font-weight: 600; }
            a:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(124,58,237,0.3); }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">⚠️</div>
            <h1>Link Not Found or Expired</h1>
            <p>The short code you entered is invalid or has expired.</p>
            <a href="/">Go to Dashboard</a>
          </div>
        </body>
        </html>
      `);
    }

    // Capture Analytics
    const uaString = req.headers['user-agent'];
    const { browser, platform } = parseUserAgent(uaString);

    let rawReferrer = req.get('Referrer') || 'Direct';
    let referrer = 'Direct';
    if (rawReferrer && rawReferrer !== 'Direct') {
      try {
        const refUrl = new URL(rawReferrer);
        referrer = refUrl.hostname;
      } catch {
        referrer = rawReferrer;
      }
    }

    // Add click event
    urlDoc.clicks.push({
      timestamp: new Date(),
      referrer,
      browser,
      platform
    });

    urlDoc.clicksCount += 1;
    await urlDoc.save();

    res.redirect(302, urlDoc.originalUrl);

  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Server error processing short code redirect');
  }
});

module.exports = router;
