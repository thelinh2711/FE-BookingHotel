import api from "./api";

const bookingApi = {
  // === CART OPERATIONS ===
  
  // Lấy giỏ hàng hiện tại
  getCart: () => api.get("/api/bookings/cart").then(r => r.data),
  
  // Thêm phòng vào giỏ hàng
  addToCart: (bookingRoomRequest) => 
    api.post("/api/bookings/cart/add", bookingRoomRequest).then(r => r.data),
  
  // Xóa phòng khỏi giỏ hàng
  removeFromCart: (bookingRoomId) => 
    api.delete(`/api/bookings/cart/remove/${bookingRoomId}`).then(r => r.data),
  
  // Cập nhật addon của phòng trong giỏ hàng
  updateCartItemAddons: (bookingRoomId, addons) => 
    api.put(`/api/bookings/cart/update-addons/${bookingRoomId}`, addons).then(r => r.data),
  
  // Xóa toàn bộ giỏ hàng
  clearCart: () => api.delete("/api/bookings/cart/clear"),
  
  // Checkout - chuyển cart thành booking
  checkout: () => api.post("/api/bookings/cart/checkout").then(r => r.data),
  
  // === BOOKING OPERATIONS ===
  
  // Lấy danh sách booking của user (đã hoàn thành)
  getMyBookings: () => api.get("/api/bookings/my-bookings").then(r => r.data),
  
  // Lấy chi tiết một booking
  getBookingById: (bookingId) => api.get(`/api/bookings/${bookingId}`).then(r => r.data),
  
  // Hủy booking
  cancelBooking: (bookingId) => api.put(`/api/bookings/${bookingId}/cancel`).then(r => r.data),
};

export default bookingApi;