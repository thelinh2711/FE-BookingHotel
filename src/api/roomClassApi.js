import api from "./api";

export const getRoomClassById = (id) =>
  api.get(`/api/room-classes/${id}`);

export const getAllRoomClassesByHotel = (hotelId) =>
  api.get(`/api/room-classes/hotel/${hotelId}`);
