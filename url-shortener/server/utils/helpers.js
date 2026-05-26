// Helper: Validate URL
function isValidUrl(string) {
  try {
    new URL(string.startsWith('http') ? string : 'http://' + string);
    return true;
  } catch {
    return false;
  }
}

// Helper: Base62 Code Generator
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function generateShortCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Helper: Parse User-Agent
function parseUserAgent(uaString) {
  if (!uaString) return { browser: 'Unknown', platform: 'Unknown' };

  let browser = 'Unknown';
  let platform = 'Unknown';

  // OS Detection
  if (uaString.includes('Windows')) platform = 'Windows';
  else if (uaString.includes('Macintosh') || uaString.includes('Mac OS X')) platform = 'macOS';
  else if (uaString.includes('Android')) platform = 'Android';
  else if (uaString.includes('iPhone') || uaString.includes('iPad')) platform = 'iOS';
  else if (uaString.includes('Linux')) platform = 'Linux';

  // Browser Detection
  if (uaString.includes('Firefox')) browser = 'Firefox';
  else if (uaString.includes('Chrome') && !uaString.includes('Chromium') && !uaString.includes('Edg')) browser = 'Chrome';
  else if (uaString.includes('Safari') && !uaString.includes('Chrome')) browser = 'Safari';
  else if (uaString.includes('Edg')) browser = 'Edge';
  else if (uaString.includes('Opera') || uaString.includes('OPR')) browser = 'Opera';

  return { browser, platform };
}

module.exports = { isValidUrl, generateShortCode, parseUserAgent };
