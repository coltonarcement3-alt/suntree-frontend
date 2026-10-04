const form = document.getElementById('uv-form');
const addressInput = document.getElementById('uv-address');
const errorBox = document.getElementById('uv-error');
const loadingEl = document.getElementById('loading');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = addressInput.value.trim();
  if (!url) return;
  
  // Clear previous errors
  errorBox.classList.remove('show');
  loadingEl.classList.add('show');
  
  try {
    // Determine if it's a search query or URL
    let targetUrl = url;
    if (!url.includes('.') || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      // It's a search query
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    } else if (!url.startsWith('http')) {
      targetUrl = `https://${url}`;
    }
    
    // Encode the URL for Ultraviolet proxy
    // UV uses /uv/service/ prefix
    const proxyUrl = '/uv/service/' + __uv$config.encodeUrl ? encodeURIComponent(targetUrl) : targetUrl;
    
    // Redirect to the proxied URL through Ultraviolet
    window.location.href = proxyUrl;
  } catch (err) {
    loadingEl.classList.remove('show');
    errorBox.textContent = `Error: ${err.message}`;
    errorBox.classList.add('show');
    console.error('Proxy error:', err);
  }
});

// Focus on input when page loads
window.addEventListener('load', () => {
  addressInput.focus();
});
