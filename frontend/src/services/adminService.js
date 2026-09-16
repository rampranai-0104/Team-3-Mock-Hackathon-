import api from './api';

const toFormData = (data) => {
  if (data instanceof FormData) return data;
  const formData = new FormData();
  Object.entries(data || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

export const adminService = {
  // Dashboard & Analytics
  async getDashboardStats() {
    return await api.get('/admin/dashboard');
  },

  async getAnalyticsOverview() {
    return await api.get('/admin/analytics/overview');
  },

  async getArtistAnalytics() {
    return await api.get('/admin/analytics/artists');
  },

  async getArtFormAnalytics() {
    return await api.get('/admin/analytics/art-forms');
  },

  async getEngagementAnalytics() {
    return await api.get('/admin/analytics/engagement');
  },

  async getRevenueAnalytics() {
    return await api.get('/admin/analytics/revenue');
  },

  // Users Management
  async getUsers(params = {}) {
    return await api.get('/admin/users', { params });
  },

  async getUserById(userId) {
    return await api.get(`/admin/users/${userId}`);
  },

  async updateUser(userId, userData) {
    return await api.patch(`/admin/users/${userId}`, userData);
  },

  async updateUserStatus(userId, status) {
    return await api.patch(`/admin/users/${userId}`, { status });
  },

  async deleteUser(userId) {
    return await api.delete(`/admin/users/${userId}`);
  },

  // Artists Verification
  async getArtists(params = {}) {
    return await api.get('/admin/artists', { params });
  },

  async getArtistById(artistId) {
    return await api.get(`/admin/artists/${artistId}`);
  },

  async createArtist(artistData) {
    return await api.post('/admin/artists', artistData);
  },

  async updateArtist(artistId, artistData) {
    return await api.patch(`/admin/artists/${artistId}`, artistData);
  },

  async approveArtist(artistId) {
    return await api.post(`/admin/artists/${artistId}/approve`);
  },

  async rejectArtist(artistId, reason = '') {
    return await api.post(`/admin/artists/${artistId}/reject`, { reason });
  },

  async bulkImportArtists(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/admin/artists/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Art Forms Taxonomy
  async getArtForms(params = {}) {
    return await api.get('/admin/art-forms', { params });
  },

  async createArtForm(artFormData) {
    return await api.post('/admin/art-forms', toFormData(artFormData), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async updateArtForm(artFormId, artFormData) {
    return await api.patch(`/admin/art-forms/${artFormId}`, toFormData(artFormData), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteArtForm(artFormId) {
    return await api.delete(`/admin/art-forms/${artFormId}`);
  },

  // Events Moderation
  async getEvents(params = {}) {
    return await api.get('/admin/events', { params });
  },

  async createEvent(eventData) {
    return await api.post('/admin/events', eventData);
  },

  async updateEvent(eventId, eventData) {
    return await api.patch(`/admin/events/${eventId}`, eventData);
  },

  async moderateEvent(eventId, status) {
    return await api.patch(`/admin/events/${eventId}`, { status });
  },

  async deleteEvent(eventId) {
    return await api.delete(`/admin/events/${eventId}`);
  },

  // Products Moderation
  async getProducts(params = {}) {
    return await api.get('/admin/products', { params });
  },

  async createProduct(productData) {
    return await api.post('/admin/products', productData);
  },

  async updateProduct(productId, productData) {
    return await api.patch(`/admin/products/${productId}`, productData);
  },

  async moderateProduct(productId, status) {
    return await api.patch(`/admin/products/${productId}`, { status });
  },

  async deleteProduct(productId) {
    return await api.delete(`/admin/products/${productId}`);
  },

  // Bookings Ledger
  async getBookings(params = {}) {
    return await api.get('/admin/bookings', { params });
  },

  async updateBooking(bookingId, status) {
    return await api.patch(`/admin/bookings/${bookingId}`, { status });
  },

  // Orders Ledger
  async getOrders(params = {}) {
    return await api.get('/admin/orders', { params });
  },

  async updateOrder(orderId, status) {
    return await api.patch(`/admin/orders/${orderId}`, { status });
  },

  // Requests (Individual & Institutional)
  async getRequests(params = {}) {
    return await api.get('/admin/requests', { params });
  },

  async updateRequest(requestId, status) {
    return await api.patch(`/admin/requests/${requestId}`, { status });
  },
};

export default adminService;
