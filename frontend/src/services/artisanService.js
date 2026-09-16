import api from './api';

export const artisanService = {
  // Artist profile
  async getProfile() {
    return await api.get('/artists/me');
  },

  async updateProfile(profileData) {
    return await api.patch('/artists/me', profileData);
  },

  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('media', file);
    return await api.post('/artists/me/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async deleteMedia(mediaId) {
    return await api.delete(`/artists/me/media/${mediaId}`);
  },

  // Products / Artworks
  async getProducts(params = {}) {
    return await api.get('/artists/me/products', { params });
  },

  async getProductById(productId) {
    return await api.get(`/artists/me/products/${productId}`);
  },

  async createProduct(productData) {
    return await api.post('/artists/me/products', productData);
  },

  async updateProduct(productId, productData) {
    return await api.patch(`/artists/me/products/${productId}`, productData);
  },

  async deleteProduct(productId) {
    return await api.delete(`/artists/me/products/${productId}`);
  },

  async uploadProductMedia(productId, file) {
    const formData = new FormData();
    formData.append('media', file);
    return await api.post(`/artists/me/products/${productId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Requests (Individual & Institutional)
  async getRequests(params = {}) {
    return await api.get('/artists/me/requests', { params });
  },

  async getRequestById(requestId) {
    return await api.get(`/artists/me/requests/${requestId}`);
  },

  async updateRequestStatus(requestId, status, notes = '') {
    return await api.patch(`/artists/me/requests/${requestId}`, { status, notes });
  },

  // Events / Workshops
  async getEvents(params = {}) {
    return await api.get('/artists/me/events', { params });
  },

  async createEvent(eventData) {
    return await api.post('/artists/me/events', eventData);
  },

  async updateEvent(eventId, eventData) {
    return await api.patch(`/artists/me/events/${eventId}`, eventData);
  },

  // The backend has no DELETE route for artist events; cancelling sets status
  // to 'cancelled' via the same PATCH endpoint instead of removing the event.
  async cancelEvent(eventId) {
    return await api.patch(`/artists/me/events/${eventId}`, { status: 'cancelled' });
  },

  // Earnings
  async getEarnings() {
    return await api.get('/artists/me/earnings');
  },

  // Followers
  async getFollowers(params = {}) {
    return await api.get('/artists/me/followers', { params });
  }
};

export default artisanService;
