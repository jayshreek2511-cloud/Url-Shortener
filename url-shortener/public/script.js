// Link shortening and rendering

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('bg-green-600');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('bg-green-600');
    }, 2000);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('shortenForm');
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');
  const linksBody = document.getElementById('linksBody');
  const refreshBtn = document.getElementById('refreshLinksBtn');

  // Handle QR code library globally
  const getQRCodeLib = () => window.QRCode || window.qrcode;

  async function renderLinks(rows) {
    if (!rows || rows.length === 0) {
      linksBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-gray-400 text-lg font-medium">No short links yet. Create your first one above! 🎉</td>
        </tr>
      `;
      return;
    }

    linksBody.innerHTML = rows.map(row => {
      const shortLink = `${window.location.origin}/${row.short_code}`;
      const created = new Date(row.created_at).toLocaleDateString();
      const expiry = row.expires_at ? new Date(row.expires_at).toLocaleDateString() : 'Never';

      return `
        <tr class="table-row">
          <td class="px-6 py-4 whitespace-nowrap font-mono">
            <a href="${shortLink}" target="_blank" class="text-indigo-600 hover:text-indigo-800 font-semibold">${row.short_code}</a>
          </td>
          <td class="px-6 py-4 max-w-[18rem]">
            <div title="${row.original_url}" class="text-sm text-gray-900 truncate max-w-full">${row.original_url}</div>
          </td>
          <td class="px-6 py-4">
            <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">${row.clicks}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${created}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${expiry}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <button onclick="copyToClipboard('${shortLink}', this)" class="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors">Copy</button>
              <canvas id="qr-${row.short_code}" class="w-8 h-8 rounded shadow-sm"></canvas>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Render QR codes for each row
    const qrLib = getQRCodeLib();
    if (qrLib) {
      linksBody.querySelectorAll('canvas[id^="qr-"]').forEach(canvas => {
        const code = canvas.id.split('-')[1];
        const link = `${window.location.origin}/${code}`;
        qrLib.toCanvas(canvas, link, { 
          width: 32, 
          margin: 0, 
          color: { dark: '#1E40AF', light: '#FFFFFF' } 
        });
      });
    }
  }

  async function loadLinks() {
    try {
      const response = await fetch('/api/links');
      const rows = await response.json();
      renderLinks(rows);
    } catch (err) {
      console.error('Unable to load links', err);
      linksBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-red-500 text-lg font-medium">Unable to load links. Refresh the page.</td>
        </tr>
      `;
    }
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const urlInput = document.getElementById('urlInput');
    const expiresInDays = form.expiresInDays.value || '7';
    errorDiv.classList.add('hidden');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: urlInput.value.trim(),
          expiresInDays: expiresInDays
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { error: 'Invalid server response' };
      }

      if (response.ok && data.short_url) {
        resultDiv.innerHTML = `
          <div class="flex flex-col sm:flex-row gap-6 items-center">
            <div class="flex-1">
              <p class="font-semibold text-green-800 mb-1">Success! Your short link:</p>
              <div class="flex items-center gap-2">
                <a href="${data.short_url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 font-mono text-lg font-bold break-all">${data.short_url}</a>
                <button onclick="copyToClipboard('${data.short_url}', this)" class="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-2 bg-white rounded-xl shadow-inner border border-gray-100">
              <canvas id="qr-result" class="w-24 h-24"></canvas>
            </div>
          </div>
        `;
        resultDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        urlInput.value = '';
        
        const qrLib = getQRCodeLib();
        const qrCanvas = document.getElementById('qr-result');
        if (qrLib && qrCanvas) {
          qrLib.toCanvas(qrCanvas, data.short_url, { width: 96, margin: 1 });
        }
        
        loadLinks();
      } else {
        errorDiv.textContent = data.error || 'Server error occurred.';
        errorDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');
      }
    } catch (err) {
      console.error('Request failed:', err);
      errorDiv.textContent = 'Error: ' + err.message;
      errorDiv.classList.remove('hidden');
      resultDiv.classList.add('hidden');
    }
  });
;

  refreshBtn.addEventListener('click', loadLinks);
  loadLinks();
});


