import { Wifi, Car, Coffee } from 'lucide-react';

const OrderSummary = ({ selectedRoom, formData, pricing }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Tóm tắt đặt phòng
      </h3>
      
      {/* Room Info */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src={selectedRoom.image} 
            alt={selectedRoom.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{selectedRoom.name}</h4>
            <p className="text-sm text-gray-600">Tối đa {selectedRoom.maxGuests} khách</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            {selectedRoom.amenities.map((amenity, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {amenity === "Wifi miễn phí" && <Wifi className="w-3 h-3 mr-1" />}
                {amenity === "Bãi đậu xe" && <Car className="w-3 h-3 mr-1" />}
                {amenity === "Bữa sáng" && <Coffee className="w-3 h-3 mr-1" />}
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Details */}
      {formData.checkIn && formData.checkOut && (
        <div className="border-b border-gray-200 pb-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nhận phòng:</span>
            <span className="font-medium">{new Date(formData.checkIn).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Trả phòng:</span>
            <span className="font-medium">{new Date(formData.checkOut).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số đêm:</span>
            <span className="font-medium">{pricing.nights} đêm</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số phòng:</span>
            <span className="font-medium">{formData.rooms} phòng</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số khách:</span>
            <span className="font-medium">{formData.guests} khách</span>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      {pricing.nights > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {selectedRoom.price.toLocaleString('vi-VN')}₫ x {pricing.nights} đêm x {formData.rooms} phòng
            </span>
            <span className="font-medium">{pricing.roomTotal.toLocaleString('vi-VN')}₫</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Thuế và phí (10%)</span>
            <span className="font-medium">{pricing.tax.toLocaleString('vi-VN')}₫</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{pricing.total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
