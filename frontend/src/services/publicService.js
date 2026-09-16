import api from './api';

export const publicService = {
  // Art Forms
  async getArtForms(params = {}) {
    return await api.get('/public/art-forms', { params });
  },

  async getArtFormById(id) {
    return await api.get(`/public/art-forms/${id}`);
  },

  // Artists
  async getArtists(params = {}) {
    return await api.get('/public/artists', { params });
  },

  async getArtistById(id) {
    return await api.get(`/public/artists/${id}`);
  },

  // Events / Workshops
  async getEvents(params = {}) {
    return await api.get('/public/events', { params });
  },

  async getEventById(id) {
    return await api.get(`/public/events/${id}`);
  },

  // Products / Marketplace
  async getProducts(params = {}) {
    return await api.get('/public/products', { params });
  },

  async getProductById(id) {
    return await api.get(`/public/products/${id}`);
  },

  // Search
  async search(query, type = 'all') {
    return await api.get('/public/search', { params: { q: query, type } });
  },

  // Follow / Unfollow
  async followArtist(artistId) {
    return await api.post(`/public/artists/${artistId}/follow`);
  },

  async unfollowArtist(artistId) {
    return await api.delete(`/public/artists/${artistId}/follow`);
  },

  async getFollowedArtists() {
    return await api.get('/public/following');
  },

  // Bookings (create workshop booking)
  async bookWorkshop(bookingData) {
    return await api.post('/bookings', bookingData);
  },

  async getMyBookings() {
    return await api.get('/bookings');
  },

  // Orders (art acquisition)
  async createOrder(orderData) {
    return await api.post('/orders', orderData);
  },

  async getMyOrders() {
    return await api.get('/orders');
  },

  // Activity
  async getMyActivity() {
    return await api.get('/public/activity');
  },

  // Knowledge
  async getKnowledgeItems(params = {}) {
    return await api.get('/public/knowledge', { params });
  },

  async getKnowledgeItemById(id) {
    return await api.get(`/public/knowledge/${id}`);
  },

  // Learning Journeys
  async getLearningJourneys(params = {}) {
    return await api.get('/public/learning', { params });
  },

  async getLearningJourneyById(id) {
    return await api.get(`/public/learning/${id}`);
  },

  // Follow status
  async checkFollowStatus(artistId) {
    return await api.get(`/public/artists/${artistId}/follow`);
  },

  // Community
  async getCommunityPosts(params = {}) {
    return await api.get('/public/community/posts', { params });
  },

  async createCommunityPost(postData) {
    // Backend expects multipart/form-data (uploadPostImages middleware)
    const formData = postData instanceof FormData ? postData : (() => {
      const fd = new FormData();
      Object.entries(postData || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => fd.append(key, v));
        } else {
          fd.append(key, value);
        }
      });
      return fd;
    })();
    return await api.post('/public/community/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async likeCommunityPost(postId) {
    return await api.post(`/public/community/posts/${postId}/like`);
  },

  async unlikeCommunityPost(postId) {
    return await api.delete(`/public/community/posts/${postId}/like`);
  },

  async getCommunityComments(postId) {
    return await api.get(`/public/community/posts/${postId}/comments`);
  },

  async addCommunityComment(postId, commentData) {
    return await api.post(`/public/community/posts/${postId}/comments`, commentData);
  },

  async getCommunityHashtags() {
    return await api.get('/public/community/hashtags');
  }
};

export default publicService;
