import api from './api';

export const authService = {
  /**
   * User login
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    // Returns { success: true, data: { user: {...}, token: "..." } }
    const { user, token } = res.data || res;
    if (token) {
      localStorage.setItem('tvarita_token', token);
      localStorage.setItem('tvarita_user', JSON.stringify(user));
    }
    return { user, token };
  },

  /**
   * User registration
   * @param {Object} userData - { name, email, password, role, phone }
   */
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    const { user, token, otpSent, otp } = res.data || res;
    if (token) {
      localStorage.setItem('tvarita_token', token);
      localStorage.setItem('tvarita_user', JSON.stringify(user));
    }
    return { user, token, otpSent, otp, message: res.message };
  },

  /**
   * Fetch current authenticated user
   */
  async getMe() {
    const res = await api.get('/auth/me');
    const user = res.data?.user || res.data || res;
    if (user) {
      localStorage.setItem('tvarita_user', JSON.stringify(user));
    }
    return user;
  },

  /**
   * Send OTP via Brevo
   */
  async sendOtp(email, purpose = 'verification', name = '') {
    return await api.post('/auth/send-otp', { email, purpose, name });
  },

  /**
   * Verify OTP
   */
  async verifyOtp(email, otp, purpose = 'verification') {
    return await api.post('/auth/verify-otp', { email, otp, purpose });
  },

  /**
   * Clear local session
   */
  logout() {
    localStorage.removeItem('tvarita_token');
    localStorage.removeItem('tvarita_user');
  },

  /**
   * Check if token is present
   */
  isAuthenticated() {
    return !!localStorage.getItem('tvarita_token');
  },

  /**
   * Get cached user
   */
  getCachedUser() {
    try {
      const u = localStorage.getItem('tvarita_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
};

export default authService;
