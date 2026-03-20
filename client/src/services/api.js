import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const movieService = {
  getMovies: (params) => api.get('/movies', { params }),
  getMovieById: (id) => api.get(`/movies/${id}`),
  searchMovies: (query) => api.get('/movies/search', { params: { query } })
};

export const showService = {
  getShows: (params) => api.get('/shows', { params }),
  getShowById: (id) => api.get(`/shows/${id}`),
  getShowsByMovie: (movieId, params) => api.get(`/shows/movie/${movieId}`, { params }),
  getUpcomingShows: (params) => api.get('/shows/upcoming', { params })
};

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getUserBookings: (params) => api.get('/bookings/user/all', { params }),
  getAvailableSeats: (showId) => api.get(`/bookings/${showId}/seats`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  confirmBooking: (id) => api.put(`/bookings/${id}/confirm`)
};

export const paymentService = {
  createPaymentIntent: (data) => api.post('/payments/intent', data),
  handlePaymentSuccess: (data) => api.post('/payments/success', data),
  getPaymentHistory: (params) => api.get('/payments/history', { params }),
  getPaymentDetails: (id) => api.get(`/payments/${id}`),
  refundPayment: (id) => api.post(`/payments/${id}/refund`)
};

export const userService = {
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (data) => api.put('/users/profile', data),
  getUserStats: () => api.get('/users/stats'),
  getUpcomingBookings: () => api.get('/users/bookings/upcoming'),
  savePaymentMethod: (data) => api.post('/users/payment-methods', data),
  getSavedPaymentMethods: () => api.get('/users/payment-methods'),
  deletePaymentMethod: (id) => api.delete(`/users/payment-methods/${id}`)
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllMovies: (params) => api.get('/admin/movies', { params }),
  updateMovieStatus: (movieId, data) => api.put(`/admin/movies/${movieId}/status`, data),
  getAllShows: (params) => api.get('/admin/shows', { params }),
  deleteShow: (showId) => api.delete(`/admin/shows/${showId}`),
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  getRevenueReport: (params) => api.get('/admin/revenue/report', { params }),
  manageUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (userId, data) => api.put(`/admin/users/${userId}/role`, data)
};

export default api;
