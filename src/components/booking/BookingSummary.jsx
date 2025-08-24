// src/components/booking/BookingSummary.jsx - Updated for addon quantity
import React from 'react';
import { Calendar, Users, ShoppingBag } from 'lucide-react';

const BookingSummary = ({ 
  room, 
  quantity, 
  checkInDate, 
  checkInTime, 
  checkOutDate, 
  checkOutTime, 
  adults, 
  children, 
  selectedAddons = [] // Now array of {id, addonName, price, quantity}
}) => {
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.max(0, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)));
  };

  const calculateRoomTotal = () => {
    const nights = calculateNights();
    const roomPrice = room?.price || 0;
    return nights * quantity * roomPrice;
  };

  const calculateAddonsTotal = () => {
    return selectedAddons.reduce((total, addon) => {
      return total + (Number(addon.price) * addon.quantity);
    }, 0);
  };

  const calculateTotalPrice = () => {
    const roomTotal = calculateRoomTotal();
    const addonsTotal = calculateAddonsTotal();
    const tax = (roomTotal + addonsTotal) * 0.1; // 10% thuế
    return roomTotal + addonsTotal + tax;
  };

  const nights = calculateNights();
  const roomTotal = calculateRoomTotal();
  const addonsTotal = calculateAddonsTotal();
  const tax = (roomTotal + addonsTotal) * 0.1;
  const totalPrice = calculateTotalPrice();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Tóm tắt đặt phòng</h3>
      
      {/* Room Info */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <img 
            src={room?.image || room?.roomImagePaths?.[0]} 
            alt={room?.name}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
            }}
          />
          <div>
            <h4 className="font-medium text-gray-800">{room?.name}</h4>
            <p className="text-sm text-gray-600">{quantity} phòng</p>
            <p className="text-sm font-medium text-blue-600">
              {room?.price?.toLocaleString('vi-VN')}₫/đêm
            </p>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      {checkInDate && checkOutDate && (
        <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Nhận phòng: {checkInDate} lúc {checkInTime}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Trả phòng: {checkOutDate} lúc {checkOutTime}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{adults} người lớn{children > 0 && `, ${children} trẻ em`}</span>
          </div>
          
          <div className="text-sm text-blue-600 font-medium">
            {nights} đêm
          </div>
        </div>
      )}

      {/* Selected Addons */}
      {selectedAddons.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-100">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Dịch vụ thêm
          </h4>
          <div className="space-y-2">
            {selectedAddons.map((addon) => (
              <div key={addon.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {addon.addonName} x{addon.quantity}
                </span>
                <span className="font-medium">
                  {(Number(addon.price) * addon.quantity).toLocaleString('vi-VN')}₫
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Phòng ({room?.price?.toLocaleString('vi-VN')}₫ x {nights} đêm x {quantity})
            </span>
            <span className="font-medium">{roomTotal.toLocaleString('vi-VN')}₫</span>
          </div>
          
          {addonsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dịch vụ thêm</span>
              <span className="font-medium">{addonsTotal.toLocaleString('vi-VN')}₫</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Thuế và phí (10%)</span>
            <span className="font-medium">{tax.toLocaleString('vi-VN')}₫</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo khi chưa chọn ngày */}
      {(!checkInDate || !checkOutDate) && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Vui lòng chọn ngày nhận và trả phòng
        </div>
      )}
    </div>
  );
};

export default BookingSummary;