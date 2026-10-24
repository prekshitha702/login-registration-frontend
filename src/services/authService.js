// Central API Service connecting Frontend to Registration & Login Microservices

const REGISTRATION_SERVICE_URL = 'http://localhost:8081/api/registration';
const LOGIN_SERVICE_URL = 'http://localhost:8082/api/login';

export const authService = {
  // ==================== Registration Service (Port 8081) ====================
  async register({ username, email, password, fullName }) {
    const response = await fetch(`${REGISTRATION_SERVICE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, fullName }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  async checkRegistrationHealth() {
    try {
      const response = await fetch(`${REGISTRATION_SERVICE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  // ==================== Login Service (Port 8082) ====================
  async login({ username, password }) {
    const response = await fetch(`${LOGIN_SERVICE_URL}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Persist session if successful
    if (data.data && data.data.token) {
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('auth_user', JSON.stringify({
        userId: data.data.userId,
        username: data.data.username,
        email: data.data.email,
        fullName: data.data.fullName,
        issuedAt: data.data.issuedAt,
        expiresAt: data.data.expiresAt,
      }));
    }

    return data;
  },

  async logout() {
    const token = localStorage.getItem('auth_token');
    try {
      if (token) {
        await fetch(`${LOGIN_SERVICE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      console.warn('Backend logout notification failed:', e);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  async validateToken() {
    const token = localStorage.getItem('auth_token');
    if (!token) return { valid: false };

    try {
      const response = await fetch(`${LOGIN_SERVICE_URL}/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        return { valid: false };
      }

      return { valid: true, data: data.data };
    } catch {
      return { valid: false };
    }
  },

  async checkLoginHealth() {
    try {
      const response = await fetch(`${LOGIN_SERVICE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Helpers
  getCurrentUser() {
    const stored = localStorage.getItem('auth_user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
};
