import { Wifi, Car, Coffee } from 'lucide-react';

const OrderSummary = ({ selectedRoom, formData, pricing }) => {
  // 🔹 Kiểm tra props tồn tại
  if (!selectedRoom) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Tóm tắt đặt phòng
        </h3>
        <p className="text-gray-500">Chưa có thông tin phòng</p>
      </div>
    );
  }

  // 🔹 Xử lý giá trị mặc định an toàn
  const room = {
    name: selectedRoom.name || selectedRoom.roomClassName || 'Phòng Standard',
    image: selectedRoom.image || selectedRoom.roomImagePaths?.[0] || '/placeholder.jpg',
    maxGuests: selectedRoom.maxGuests || selectedRoom.capacity || 2,
    price: selectedRoom.price || selectedRoom.priceOriginal || 0,
    amenities: selectedRoom.amenities || selectedRoom.features || [],
  };

  // 🔹 Xử lý amenities/features một cách an toàn
  const getAmenities = () => {
    // Nếu là mảng string
    if (Array.isArray(room.amenities)) {
      return room.amenities.map(item => 
        typeof item === 'string' ? item : (item.featureName || item.name || '')
      ).filter(Boolean);
    }
    return [];
  };

  const amenities = getAmenities();

  // 🔹 Xử lý formData và pricing với giá trị mặc định
  const safeFormData = {
    checkIn: formData?.checkIn || null,
    checkOut: formData?.checkOut || null,
    rooms: formData?.rooms || 1,
    guests: formData?.guests || 1,
  };

  const safePricing = {
    nights: pricing?.nights || 0,
    roomTotal: pricing?.roomTotal || 0,
    tax: pricing?.tax || 0,
    total: pricing?.total || 0,
  };

  // Icon mapping cho amenities
  const getAmenityIcon = (amenity) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <Wifi className="w-3 h-3 mr-1" />;
    if (lowerAmenity.includes('parking') || lowerAmenity.includes('đậu xe')) return <Car className="w-3 h-3 mr-1" />;
    if (lowerAmenity.includes('breakfast') || lowerAmenity.includes('sáng')) return <Coffee className="w-3 h-3 mr-1" />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Tóm tắt đặt phòng
      </h3>
      
      {/* Room Info */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src={room.image} 
            alt={room.name}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
            }}
          />
          <div>
            <h4 className="font-semibold text-gray-800">{room.name}</h4>
            <p className="text-sm text-gray-600">Tối đa {room.maxGuests} khách</p>
          </div>
        </div>
        
        {/* Amenities - Kiểm tra trước khi render */}
        {amenities.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details */}
      {safeFormData.checkIn && safeFormData.checkOut && (
        <div className="border-b border-gray-200 pb-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nhận phòng:</span>
            <span className="font-medium">
              {new Date(safeFormData.checkIn).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Trả phòng:</span>
            <span className="font-medium">
              {new Date(safeFormData.checkOut).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số đêm:</span>
            <span className="font-medium">{safePricing.nights} đêm</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số phòng:</span>
            <span className="font-medium">{safeFormData.rooms} phòng</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số khách:</span>
            <span className="font-medium">{safeFormData.guests} khách</span>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      {safePricing.nights > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {room.price.toLocaleString('vi-VN')}₫ x {safePricing.nights} đêm x {safeFormData.rooms} phòng
            </span>
            <span className="font-medium">
              {safePricing.roomTotal.toLocaleString('vi-VN')}₫
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Thuế và phí (10%)</span>
            <span className="font-medium">
              {safePricing.tax.toLocaleString('vi-VN')}₫
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng</span>
              <span className="text-blue-600">
                {safePricing.total.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo khi chưa chọn ngày */}
      {(!safeFormData.checkIn || !safeFormData.checkOut) && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Vui lòng chọn ngày nhận và trả phòng
        </div>
      )}
    </div>
  );
};

export default OrderSummary;