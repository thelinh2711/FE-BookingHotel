// src/api/roomApi.js
import api from "./api";

const roomApi = {
  // Lấy danh sách tất cả room classes
  getAllRoomClasses: async () => {
    const response = await api.get("/api/room-classes");
    return response.data;
  },

  // Tạo room class mới
  createRoomClass: async (roomClassData) => {
    const response = await api.post("/api/room-classes", roomClassData);
    return response.data;
  },

  // Cập nhật room class
  updateRoomClass: async (id, roomClassData) => {
    const response = await api.put(`/api/room-classes/${id}`, roomClassData);
    return response.data;
  },

  // Xóa room class
  deleteRoomClass: async (id) => {
    const response = await api.delete(`/api/room-classes/${id}`);
    return response.data;
  },

  // Lấy chi tiết room class
  getRoomClassDetail: async (id) => {
    const response = await api.get(`/api/room-classes/${id}`);
    return response.data;
  },

  // Lấy danh sách rooms theo room class
  getRoomsByClass: async (roomClassId) => {
    const response = await api.get(`/api/room-classes/${roomClassId}/rooms`);
    return response.data;
  },

  // Tạo room mới trong room class
  createRoom: async (roomClassId, roomData) => {
    const response = await api.post(`/api/room-classes/${roomClassId}/rooms`, roomData);
    return response.data;
  },

  // Cập nhật room
  updateRoom: async (roomId, roomData) => {
    const response = await api.put(`/api/rooms/${roomId}`, roomData);
    return response.data;
  },

  // Xóa room
  deleteRoom: async (roomId) => {
    const response = await api.delete(`/api/rooms/${roomId}`);
    return response.data;
  },

  // Lấy chi tiết room
  getRoomDetail: async (roomId) => {
    const response = await api.get(`/api/rooms/${roomId}`);
    return response.data;
  }
};

export default roomApi;
