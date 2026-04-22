// ============================================
// navbar.js — Shared Navigation Component


function renderNavbar() {
  const user = JSON.parse(localStorage.getItem('skindx_user') || 'null');
  const isAdmin = user?.role === 'admin';

  const nav = document.createElement('nav');
  nav.id = 'navbar';
  nav.innerHTML = `
    <div class="nav-logo"><a href="index.html">Skin<span>Dx</span></a></div>
    <div class="nav-links">
      ${user ? `<a href="index.html" class="nav-link">Home</a>` : ''}
      ${user ? `<a href="upload.html" class="nav-link">Diagnose</a>` : ''}
      ${user ? `<a href="history.html" class="nav-link">History</a>` : ''}
      ${isAdmin ? `<a href="admin.html" class="nav-link admin-link">⚙ Admin</a>` : ''}
      ${!user ? `<a href="login.html" class="nav-link">Login</a>` : ''}
      ${!user ? `<a href="register.html" class="nav-link nav-register">Register</a>` : ''}
      ${user ? `<span class="nav-user">👤 ${user.name}</span>` : ''}
      ${user ? `<a href="#" class="nav-link nav-logout" onclick="logout()">Logout</a>` : ''}
    </div>
  `;

  // Insert at top of body
  document.body.insertBefore(nav, document.body.firstChild);

  // Add nav styles
  const style = document.createElement('style');
  style.textContent = `
    #navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem; height: 64px;
      background: rgba(10,13,18,0.9); backdrop-filter: blur(16px);
      border-bottom: 1px solid #252f42;
    }
    .nav-logo a { font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:800; color:#e8edf5; text-decoration:none; }
    .nav-logo span { color:#00d4aa; }
    .nav-links { display:flex; align-items:center; gap:0.25rem; }
    .nav-link { padding:0.4rem 0.85rem; border-radius:8px; text-decoration:none; color:#8a96b0; font-size:0.9rem; font-weight:500; transition:all 0.2s; }
    .nav-link:hover { color:#e8edf5; background:#1e2636; }
    .admin-link { color:#ffa502 !important; }
    .admin-link:hover { background:rgba(255,165,2,0.1) !important; }
    .nav-logout { color:#ff4757 !important; cursor:pointer; }
    .nav-logout:hover { background:rgba(255,71,87,0.1) !important; }
    .nav-register { background:#00d4aa; color:#0a0d12 !important; font-weight:700 !important; }
    .nav-register:hover { background:#00a882 !important; color:#0a0d12 !important; }
    .nav-user { font-size:0.85rem; color:#8a96b0; padding:0 0.5rem; }
    body { padding-top: 64px !important; }
  `;
  document.head.appendChild(style);
}

function logout() {
  localStorage.removeItem('skindx_token');
  localStorage.removeItem('skindx_user');
  window.location.href = 'login.html';
}

function requireAuth() {
  const token = localStorage.getItem('skindx_token');
  if (!token) window.location.href = 'login.html';
}

function requireAdmin() {
  const user = JSON.parse(localStorage.getItem('skindx_user') || 'null');
  if (!user || user.role !== 'admin') window.location.href = 'index.html';
}

function getToken() {
  return localStorage.getItem('skindx_token');
}

// Auto-render navbar when DOM is ready
document.addEventListener('DOMContentLoaded', renderNavbar);
