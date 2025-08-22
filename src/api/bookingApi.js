// src/api/bookingApi.js
import api from "./api";

/**
 * NOTE: These endpoints are placeholders.
 * Implement them in your backend. The FE expects responses as documented below.
 */
const bookingApi = {
  /**
   * Lock a room in Redis and start a payment session.
   * @param {Object} payload - { roomId, checkin, checkout, guests, totalPrice, paymentMethod }
   * @returns {Promise<{result: { orderId, orderCode, status, lockExpireAt, payment: { provider, qrImage, qrUrl }}}>} 
   * - qrImage: data URL (base64) recommended from backend OR use qrUrl
   */
  lockAndCreatePayment: (payload) => api.post("/api/bookings/lock", payload).then(r => r.data),

  /**
   * Check booking status (pending|paid|expired|refunded|manual_review).
   * @param {string} orderId
   */
  getStatus: (orderId) => api.get(`/api/bookings/status/${orderId}`).then(r => r.data),

  /**
   * Verify payment after the user claims they paid (hit provider/VNPay returnURL on BE).
   * @param {string} orderId
   */
  verifyPayment: (orderId) => api.post(`/api/payments/verify`, { orderId }).then(r => r.data),

  /**
   * Cancel the booking (and release Redis lock).
   * @param {string} orderId
   */
  cancel: (orderId) => api.post(`/api/bookings/${orderId}/cancel`).then(r => r.data),

  /**
   * Get current user's bookings.
   */
  listMine: () => api.get("/api/bookings/me").then(r => r.data),

  /**
   * Leave a review for a completed booking.
   * @param {string} bookingId
   * @param {{rating:number, comment:string}} data
   */
  review: (bookingId, data) => api.post(`/api/bookings/${bookingId}/reviews`, data).then(r => r.data),
};

export default bookingApi;