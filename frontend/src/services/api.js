const API_BASE = '/api/v1';

/**
 * Helper to execute JSON requests
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('nearu_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[NearU API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Destinations
  getDestinations: () => request('/destinations'),

  // Listings
  getListings: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return request(`/listings${qs ? `?${qs}` : ''}`);
  },

  getListingById: (id, coords = null) => {
    let qs = '';
    if (coords && coords.lat && coords.lng) {
      qs = `?lat=${coords.lat}&lng=${coords.lng}`;
    }
    return request(`/listings/${id}${qs}`);
  },

  createListing: (data) => request('/listings', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateListing: (id, data) => request(`/listings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  // Reviews
  getListingReviews: (id) => request(`/listings/${id}/reviews`),

  addReview: (listingId, data) => request(`/listings/${listingId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Auth & Email OTP
  register: ({ email, password, name, user_type }) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, user_type })
  }),

  sendOtp: (email) => request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  verifyOtp: (email, otp) => request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp })
  }),

  login: ({ email, password }) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  // Favorites
  getFavorites: () => request('/favorites'),

  toggleFavorite: (listing_id) => request('/favorites', {
    method: 'POST',
    body: JSON.stringify({ listing_id })
  })
};
