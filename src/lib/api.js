import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue  = [];
// Tracks whether the last refresh attempt failed.
// If true we know there is no valid session and we must NOT try again
// until the user explicitly logs in. Prevents the infinite-loop.
let refreshFailed = false;

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  failedQueue = [];
};

// URLs that must NEVER trigger a refresh attempt
const NO_REFRESH_URLS = [
  '/auth/refresh',
  '/auth/logout',
  '/users/login',
  '/users/send-otp',
  '/users/verify-otp-register',
  '/users/forgot-password',
  '/users/reset-password',
  '/auth/google',
];

const shouldRetryWithRefresh = (error) => {
  if (error.response?.status !== 401) return false;
  if (error.config?._retry) return false;
  if (refreshFailed) return false; // already know session is gone — don't loop
  const url = error.config?.url || '';
  if (NO_REFRESH_URLS.some(u => url.includes(u))) return false;
  return true;
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!shouldRetryWithRefresh(error)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another refresh is already in flight — queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(original))
        .catch((e) => Promise.reject(e));
    }

    original._retry   = true;
    isRefreshing      = true;

    try {
      await api.post('/auth/refresh');
      refreshFailed = false;   // refresh succeeded — clear the flag
      processQueue(null);
      return api(original);
    } catch (refreshError) {
      // Refresh failed — mark so we never retry until next login
      refreshFailed = true;
      processQueue(refreshError);

      // Clear Zustand auth state silently (no further API calls)
      try {
        const { useAuthStore } = await import('@/store');
        // Set user to null directly without calling the logout endpoint
        useAuthStore.setState({ user: null });
      } catch {}

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Call this after a successful login so the interceptor knows
// it can attempt refresh again if needed
export const resetRefreshState = () => { refreshFailed = false; };

export const authApi = {
  getMe:       ()           => api.get('/auth/me'),
  refresh:     ()           => api.post('/auth/refresh'),
  logout:      ()           => api.post('/auth/logout'),
  googleLogin: (credential) => api.post('/auth/google', { credential }),
};

export const usersApi = {
  register:             (data)       => api.post('/users/register', data),
  login:                (data)       => api.post('/users/login', data),
  getAll:               ()           => api.get('/users'),
  updateMe:             (data)       => api.patch('/users/me', data),
  updateRole:           (id, role)   => api.patch(`/users/${id}/role`, { newRole: role }),
  sendOtp:              (data)       => api.post('/users/send-otp', data),
  verifyOtpAndRegister: (data)       => api.post('/users/verify-otp-register', data),
  forgotPassword:       (data)       => api.post('/users/forgot-password', data),
  resetPassword:        (data)       => api.post('/users/reset-password', data),
};

export const productsApi = {
  getAll:      ()           => api.get('/products'),
  getOne:      (id)         => api.get(`/products/${id}`),
  create:      (data)       => api.post('/products', data),
  update:      (id, data)   => api.patch(`/products/${id}`, data),
  delete:      (id)         => api.delete(`/products/${id}`),
  getWatchers: (id)         => api.get(`/products/${id}/notify/watchers`),
};

export const ordersApi = {
  getAll:          ()                         => api.get('/orders'),
  getOne:          (id)                       => api.get(`/orders/${id}`),
  getUserOrders:   (id)                       => api.get(`/orders/user/${id}`),
  getOrderReviews: (id)                       => api.get(`/orders/${id}/reviews`),
  create:          (data)                     => api.post('/orders', data),
  verifyGuestOtp:  (data)                     => api.post('/orders/verify-guest-otp', data),
  resendGuestOtp:  (data)                     => api.post('/orders/resend-guest-otp', data),
  updateStatus:    (id, status, notifyClient) => api.patch(`/orders/${id}`, { newStatus: status, notifyClient }),
  track:           (id)                       => api.get(`/orders/${id}/track`),
};

export const notifyApi = {
  status:   (productId, variantId) => api.get(`/products/${productId}/notify/status`, { params: { variantId } }),
  register: (productId, variantId) => api.post(`/products/${productId}/notify`, { variantId }),
  remove:   (productId, variantId) => api.delete(`/products/${productId}/notify`, { data: { variantId } }),
};

export const reviewsApi = {
  getAll:         ()                  => api.get('/reviews'),
  getApproved:    ()                  => api.get('/reviews/approved'),
  getForProduct:  (productId)         => api.get(`/reviews/product/${productId}`),
  create:         (data)              => api.post('/reviews', data),
  update:         (id, data)          => api.patch(`/reviews/${id}`, data),
  delete:         (id)                => api.delete(`/reviews/${id}`),
  getFormContext: (token)             => api.get(`/reviews/form/${token}`),
  submitForm:     (token, data)       => api.post(`/reviews/form/${token}`, data),
};

export const activityApi = {
  getAll: () => api.get('/activity'),
};

export const marketingApi = {
  getAudience:  ()      => api.get('/marketing/audience'),
  sendCampaign: (data)  => api.post('/marketing/send', data),
};

export const couponApi = {
  validate: (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount }),
  getAll:   ()                  => api.get('/coupons'),
  create:   (data)              => api.post('/coupons', data),
  update:   (id, d)             => api.patch(`/coupons/${id}`, d),
  delete:   (id)                => api.delete(`/coupons/${id}`),
};

export const wishlistApi = {
  get:    ()    => api.get('/wishlist'),
  add:    (id)  => api.post(`/wishlist/${id}`),
  remove: (id)  => api.delete(`/wishlist/${id}`),
};

export const contactApi = {
  submit:   (data) => api.post('/contact', data),
  getAll:   ()     => api.get('/contact'),
  markRead: (id)   => api.patch(`/contact/${id}/read`),
  delete:   (id)   => api.delete(`/contact/${id}`),
};

export default api;
