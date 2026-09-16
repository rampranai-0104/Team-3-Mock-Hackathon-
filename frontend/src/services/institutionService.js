import api from './api';

export const institutionService = {
  // Profile
  async getProfile() {
    return await api.get('/institutions/me');
  },

  async updateProfile(profileData) {
    return await api.patch('/institutions/me', profileData);
  },

  // Experiences
  async getExperiences(params = {}) {
    return await api.get('/institutions/experiences', { params });
  },

  // Requests (Custom workshop & residency inquiries)
  async getRequests(params = {}) {
    return await api.get('/requests', { params });
  },

  async createRequest(requestData) {
    return await api.post('/requests', requestData);
  },

  async getRequestById(id) {
    return await api.get(`/requests/${id}`);
  },

  async updateRequest(id, requestData) {
    return await api.patch(`/requests/${id}`, requestData);
  },

  async cancelRequest(id) {
    return await api.post(`/requests/${id}/cancel`);
  },

  // Bookings
  async getBookings(params = {}) {
    return await api.get('/institutions/me/bookings', { params });
  },

  async createBooking(bookingData) {
    return await api.post('/bookings', bookingData);
  },

  async getBookingById(id) {
    return await api.get(`/bookings/${id}`);
  },

  async cancelBooking(id) {
    return await api.post(`/bookings/${id}/cancel`);
  },

  // Orders
  async getOrders(params = {}) {
    return await api.get('/institutions/me/orders', { params });
  },

  async createOrder(orderData) {
    return await api.post('/orders', orderData);
  },

  async getOrderById(id) {
    return await api.get(`/orders/${id}`);
  },

  async cancelOrder(id) {
    return await api.post(`/orders/${id}/cancel`);
  }
};

export default institutionService;
