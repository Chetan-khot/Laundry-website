// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Set auth token in localStorage
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Clear auth token
function clearAuthToken() {
  localStorage.removeItem('authToken');
}

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  async register(userData) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  async getCurrentUser() {
    return await apiRequest('/auth/me');
  },

  logout() {
    clearAuthToken();
    // Also clear old localStorage items
    localStorage.removeItem('loggedInName');
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('loggedInAddress');
  },

  isAuthenticated() {
    return !!getAuthToken();
  }
};

// Orders API
export const ordersAPI = {
  async getAll() {
    return await apiRequest('/orders');
  },

  async getById(id) {
    return await apiRequest(`/orders/${id}`);
  },

  async create(orderData) {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async updateStatus(id, status) {
    return await apiRequest(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

// Payments API
export const paymentsAPI = {
  async getAll() {
    return await apiRequest('/payments');
  },

  async getById(id) {
    return await apiRequest(`/payments/${id}`);
  },

  async create(paymentData) {
    return await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }
};

// Users API
export const usersAPI = {
  async getProfile() {
    return await apiRequest('/users/profile');
  },

  async updateProfile(profileData) {
    return await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async changePassword(currentPassword, newPassword) {
    return await apiRequest('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

// Services API
export const servicesAPI = {
  async getAll() {
    return await apiRequest('/services');
  },

  async getMemberships() {
    return await apiRequest('/services/memberships');
  }
};

