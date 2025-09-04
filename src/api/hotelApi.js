// src/api/hotelApi.js
import api from "./api";

const hotelApi = {
  // Lấy danh sách tất cả hotels
  getAllHotels: async () => {
    const response = await api.get("/api/hotels");
    return response.data;
  },

  // Tạo hotel mới
  createHotel: async (hotelData) => {
    const response = await api.post("/api/hotels", hotelData);
    return response.data;
  },

  // Cập nhật hotel
  updateHotel: async (id, hotelData) => {
    const response = await api.put(`/api/hotels/${id}`, hotelData);
    return response.data;
  },

  // Xóa hotel
  deleteHotel: async (id) => {
    const response = await api.delete(`/api/hotels/${id}`);
    return response.data;
  },

  // Lấy chi tiết hotel
  getHotelDetail: async (id) => {
    const response = await api.get(`/api/hotels/${id}`);
    return response.data;
  }
};

export default hotelApi;
