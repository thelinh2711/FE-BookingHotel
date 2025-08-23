import { useNavigate } from 'react-router-dom';
import Button from './Button';

const BookingCard = ({ room }) => {
  const navigate = useNavigate();

  if (!room) return null;

  // Lấy giá gốc
  const originalPrice = Number(room.priceOriginal || room.originalPrice || room.price || 0);
  
  // Lấy phần trăm giảm giá
  const discountPercent = Number(room.discountPercent || room.discount || 0);
  
  // Tính giá sau giảm
  // Nếu có trường price thì dùng, không thì tính từ originalPrice và discountPercent
  let currentPrice = room.price;
  
  if (!currentPrice && originalPrice && discountPercent > 0) {
    // Tính giá sau giảm từ giá gốc và % giảm
    currentPrice = originalPrice - (originalPrice * discountPercent / 100);
  } else if (!currentPrice) {
    currentPrice = originalPrice;
  }
  
  currentPrice = Number(currentPrice);
  
  // Kiểm tra có giảm giá hay không
  const hasDiscount = discountPercent > 0 && originalPrice > currentPrice;
  
  // Tính số tiền tiết kiệm
  const savedAmount = hasDiscount ? (originalPrice - currentPrice) : 0;

  const handleBookNow = () => {
    const bookingData = {
      room: {
        id: room.id,
        name: room.roomClassName || room.name || 'Standard Room',
        price: currentPrice,
        originalPrice: originalPrice,
        discountPercent: discountPercent,
        image: room.roomImagePaths?.[0] || room.image || room.hotel?.imageUrl,
        maxGuests: room.capacity || room.maxGuests || 2,
        features: room.features?.map(f => 
          typeof f === 'string' ? f : (f.featureName || f.name)
        ) || []
      }
    };

    navigate('/booking', { state: bookingData });
  };

  // Format số tiền với dấu phân cách hàng nghìn
  const formatPrice = (price) => {
    return Math.round(price).toLocaleString('vi-VN');
  };

  return (
    <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-24">
      {/* Tiêu đề */}
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-600 mb-1">Start Booking</p>
        <div className="h-px bg-slate-200"></div>
      </div>

      {/* Hiển thị giá gốc và % giảm nếu có */}
      {hasDiscount && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg text-slate-400 line-through">
              {formatPrice(originalPrice)}VND
            </span>
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded font-semibold">
              -{discountPercent}% OFF
            </span>
          </div>
        </div>
      )}

      {/* Giá hiện tại (giá chính) */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">
            {formatPrice(currentPrice)}VND
          </span>
        </div>
        <span className="text-sm text-slate-500">/ night</span>
      </div>

      {/* Hiển thị số tiền tiết kiệm */}
      {hasDiscount && savedAmount > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-700 font-medium">
              Save {formatPrice(savedAmount)}VND today!
            </p>
          </div>
        </div>
      )}

      {/* Thông tin thêm */}
      <div className="mb-5 space-y-2">
        
        {room.capacity && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Max guests</span>
            <span className="font-medium">{room.capacity} persons</span>
          </div>
        )}
      </div>

      {/* Nút Book Now */}
      <Button 
        className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        onClick={handleBookNow}
      >
        Book Now
      </Button>

      {/* Ghi chú */}
      <p className="mt-3 text-xs text-center text-slate-400">
        Free cancellation within 24 hours
      </p>

      
    </div>
  );
};

export default BookingCard;