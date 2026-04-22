
//  SkinDx — Frontend App Logic

const API = 'http://localhost:3000';

// ---- State ----
let currentUser = null;
let selectedFile = null;

// ---- Init ----
window.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('skindx_user');
  const token = localStorage.getItem('skindx_token');
  if (stored && token) {
    currentUser = JSON.parse(stored);
    updateNav();
    showPage('home');
  } else {
    showPage('home');
  }

  // Drag & Drop
  const dropZone = document.getElementById('dropZone');
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  });
});

// ---- Navigation ----
function showPage(page) {
  // Auth guard
  const protectedPages = ['upload', 'history'];
  const adminPages = ['admin'];

  if (protectedPages.includes(page) && !currentUser) {
    showPage('login');
    return;
  }
  if (adminPages.includes(page)) {
    if (!currentUser || currentUser.role !== 'admin') {
      showPage('home');
      return;
    }
    loadAdminData();
  }
  if (page === 'history') loadHistory();

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // Update home hero button
  const heroLoginBtn = document.getElementById('heroLoginBtn');
  const heroUploadBtn = document.getElementById('heroUploadBtn');
  if (heroLoginBtn && heroUploadBtn) {
    if (currentUser) {
      heroLoginBtn.style.display = 'none';
      heroUploadBtn.style.display = 'inline-flex';
    } else {
      heroLoginBtn.style.display = 'inline-flex';
      heroUploadBtn.style.display = 'none';
    }
  }
}

function updateNav() {
  const loggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  document.getElementById('navLogin').style.display = loggedIn ? 'none' : 'inline-flex';
  document.getElementById('navLogout').style.display = loggedIn ? 'inline-flex' : 'none';
  document.getElementById('navUpload').style.display = loggedIn ? 'inline-flex' : 'none';
  document.getElementById('navHistory').style.display = loggedIn ? 'inline-flex' : 'none';
  document.getElementById('navAdmin').style.display = isAdmin ? 'inline-flex' : 'none';

  const heroLoginBtn = document.getElementById('heroLoginBtn');
  const heroUploadBtn = document.getElementById('heroUploadBtn');
  if (heroLoginBtn && heroUploadBtn) {
    heroLoginBtn.style.display = loggedIn ? 'none' : 'inline-flex';
    heroUploadBtn.style.display = loggedIn ? 'inline-flex' : 'none';
  }
}

// ---- Auth ----
async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';

  if (!email || !password) {
    errEl.textContent = 'Please fill in all fields.';
    errEl.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.error || 'Login failed.';
      errEl.style.display = 'block';
      return;
    }

    currentUser = data.user;
    localStorage.setItem('skindx_token', data.token);
    localStorage.setItem('skindx_user', JSON.stringify(data.user));
    updateNav();
    showPage('home');
  } catch (err) {
    errEl.textContent = 'Cannot connect to server. Make sure the backend is running.';
    errEl.style.display = 'block';
  }
}

async function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errEl = document.getElementById('registerError');
  const sucEl = document.getElementById('registerSuccess');
  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (!name || !email || !password) {
    errEl.textContent = 'Please fill in all fields.';
    errEl.style.display = 'block';
    return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.error || 'Registration failed.';
      errEl.style.display = 'block';
      return;
    }

    sucEl.textContent = 'Account created! Redirecting to login...';
    sucEl.style.display = 'block';
    setTimeout(() => showPage('login'), 1800);
  } catch (err) {
    errEl.textContent = 'Cannot connect to server.';
    errEl.style.display = 'block';
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('skindx_token');
  localStorage.removeItem('skindx_user');
  updateNav();
  showPage('home');
}

function getToken() {
  return localStorage.getItem('skindx_token');
}

// ---- Image Upload ----
function previewImage(event) {
  const file = event.target.files[0];
  if (file) handleFileSelect(file);
}

function handleFileSelect(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const errEl = document.getElementById('uploadError');

  if (!allowed.includes(file.type)) {
    errEl.textContent = 'Only JPG, PNG, and WEBP images are allowed.';
    errEl.style.display = 'block';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    errEl.textContent = 'File too large. Max size is 5MB.';
    errEl.style.display = 'block';
    return;
  }

  errEl.style.display = 'none';
  selectedFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('dropZone').style.display = 'none';
    document.getElementById('imagePreview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  selectedFile = null;
  document.getElementById('imageInput').value = '';
  document.getElementById('dropZone').style.display = 'block';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('resultCard').style.display = 'none';
}

async function submitPrediction() {
  if (!selectedFile) {
    const errEl = document.getElementById('uploadError');
    errEl.textContent = 'Please select an image first.';
    errEl.style.display = 'block';
    return;
  }

  const btn = document.getElementById('predictBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Analyzing...';

  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    const res = await fetch(`${API}/predict`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    const data = await res.json();

    if (!res.ok) {
      document.getElementById('uploadError').textContent = data.error || 'Prediction failed.';
      document.getElementById('uploadError').style.display = 'block';
      return;
    }

    showResult(data.result);
  } catch (err) {
    document.getElementById('uploadError').textContent = 'Server error. Please try again.';
    document.getElementById('uploadError').style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Analyze Image';
  }
}

function showResult(result) {
  const card = document.getElementById('resultCard');
  document.getElementById('resultDisease').textContent = result.disease;

  const pct = parseFloat(result.confidence);
  document.getElementById('confidencePct').textContent = result.confidence;
  document.getElementById('resultCard').style.display = 'block';

  // Animate bar
  setTimeout(() => {
    document.getElementById('confidenceFill').style.width = pct + '%';
  }, 100);
}

// ---- History ----
async function loadHistory() {
  const container = document.getElementById('historyList');
  container.innerHTML = '<div class="loading">Loading history...</div>';

  try {
    const res = await fetch(`${API}/predict/history`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();

    if (!res.ok) { container.innerHTML = `<div class="loading">${data.error}</div>`; return; }

    const history = data.history;
    if (history.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔬</div><p>No diagnoses yet. <a href="#" onclick="showPage('upload')" style="color:var(--accent)">Upload your first image</a></p></div>`;
      return;
    }

    container.innerHTML = history.map(item => `
      <div class="history-item">
        <div>
          <div class="history-disease">${item.predicted_disease}</div>
          <div class="history-meta">${new Date(item.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
        </div>
        <div class="history-confidence">${(item.confidence * 100).toFixed(1)}%</div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<div class="loading">Failed to load history.</div>';
  }
}

// ---- Admin ----
async function loadAdminData() {
  loadAdminStats();
  loadAdminUsers();
}

async function loadAdminStats() {
  try {
    const res = await fetch(`${API}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('statUsers').textContent = data.stats.total_users;
      document.getElementById('statPredictions').textContent = data.stats.total_predictions;
      document.getElementById('statAdmins').textContent = data.stats.total_admins;
    }
  } catch {}
}

async function loadAdminUsers() {
  const tbody = document.getElementById('usersBody');
  try {
    const res = await fetch(`${API}/admin/users`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) { tbody.innerHTML = `<tr><td colspan="6" class="loading">${data.error}</td></tr>`; return; }

    tbody.innerHTML = data.users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td><span class="role-badge role-${u.role}">${u.role}</span></td>
        <td>${new Date(u.created_at).toLocaleDateString()}</td>
        <td>${u.role !== 'admin' ? `<button class="btn btn-danger" onclick="deleteUser(${u.id})">Delete</button>` : '—'}</td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Failed to load users.</td></tr>';
  }
}

async function loadAdminPredictions() {
  const tbody = document.getElementById('predictionsBody');
  try {
    const res = await fetch(`${API}/admin/predictions`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) { tbody.innerHTML = `<tr><td colspan="5" class="loading">${data.error}</td></tr>`; return; }

    tbody.innerHTML = data.predictions.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.user_name}<br/><small style="color:var(--text3)">${p.email}</small></td>
        <td>${p.predicted_disease}</td>
        <td style="color:var(--accent)">${(p.confidence * 100).toFixed(1)}%</td>
        <td>${new Date(p.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Failed to load predictions.</td></tr>';
  }
}

async function deleteUser(id) {
  if (!confirm('Delete this user and all their data?')) return;
  try {
    const res = await fetch(`${API}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (res.ok) { loadAdminUsers(); loadAdminStats(); }
  } catch {}
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');

  if (tab === 'predictions') loadAdminPredictions();
  if (tab === 'users') loadAdminUsers();
}
