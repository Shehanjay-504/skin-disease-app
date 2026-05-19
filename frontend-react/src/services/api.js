const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to make authenticated requests
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('skindx_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.noAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// Auth endpoints
export const authService = {
  login: (email, password) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      noAuth: true,
    }),
  register: (name, email, password) =>
    apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      noAuth: true,
    }),
};

// Predict endpoints
export const predictService = {
  predict: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('skindx_token');
    return fetch(`${API}/api/predict`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  getHistory: () =>
    apiCall('/api/predict/history'),
};

// Admin endpoints
export const adminService = {
  getStats: () =>
    apiCall('/api/admin/stats'),
  getUsers: () =>
    apiCall('/api/admin/users'),
  deleteUser: (userId) =>
    apiCall(`/api/admin/users/${userId}`, { method: 'DELETE' }),
};
