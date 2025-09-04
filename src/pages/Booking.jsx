import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import RoomQuantitySelector from '../components/booking/RoomQuantitySelector';
import DateTimeSelector from '../components/booking/DateTimeSelector';
import GuestSelector from '../components/booking/GuestSelector';
import AddonSelector from '../components/booking/AddonSelector';
import BookingSummary from '../components/booking/BookingSummary';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import addonApi from '../api/addonApi';

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const room = location.state?.room;
  const { addToCart, loading: cartLoading } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // State
  const [quantity, setQuantity] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load addons
  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const response = await addonApi.getAll();
        setAddons(response.filter(addon => addon.active));
      } catch (error) {
        console.error('Failed to fetch addons:', error);
        setAddons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAddons();
  }, []);

  // Check authentication
  useEffect(() => {
    if (!user) {
      alert('Vui lòng đăng nhập để đặt phòng');
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Redirect nếu không có room
  if (!room) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin phòng</h2>
            <p className="text-gray-600 mb-6">Vui lòng chọn phòng từ trang chủ</p>
            <Button onClick={() => navigate('/')}>Quay về trang chủ</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handlers
  const handleDateTimeChange = (field, value) => {
    switch (field) {
      case 'checkInDate':
        setCheckInDate(value);
        break;
      case 'checkInTime':
        setCheckInTime(value);
        break;
      case 'checkOutDate':
        setCheckOutDate(value);
        break;
      case 'checkOutTime':
        setCheckOutTime(value);
        break;
    }
  };

  const handleGuestChange = (type, value) => {
    if (type === 'adults') {
      setAdults(value);
    } else if (type === 'children') {
      setChildren(value);
    }
  };

  const handleAddonChange = (updatedAddons) => {
    setSelectedAddons(updatedAddons);
  };

  const isBookingValid = () => {
    return (
      user &&
      room &&
      quantity > 0 &&
      checkInDate &&
      checkOutDate &&
      new Date(checkOutDate) > new Date(checkInDate) &&
      adults > 0
    );
  };

  const handleAddToCart = async () => {
    if (!isBookingValid()) {
      alert('Vui lòng điền đầy đủ thông tin đặt phòng');
      return;
    }

    setIsAdding(true);

    try {
      // Calculate pricing for frontend display
      const nights = Math.max(0, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)));
      const roomTotal = nights * quantity * (room.price || 0);
      const addonsTotal = selectedAddons.reduce((total, addon) => {
        return total + (Number(addon.price) * addon.quantity);
      }, 0);
      const tax = (roomTotal + addonsTotal) * 0.1;
      const totalPrice = roomTotal + addonsTotal + tax;

      const bookingData = {
        room,
        quantity,
        checkInDate,
        checkInTime,
        checkOutDate,
        checkOutTime,
        adults,
        children,
        selectedAddons,
        nights,
        roomTotal,
        addonsTotal,
        tax,
        totalPrice
      };

      // Add to cart using backend API
      const response = await addToCart(bookingData);

      if (response) {
        // Show success message
        setShowSuccess(true);

        // Show different message for fallback
        if (response.fallback) {
          console.log('Added to cart using localStorage fallback');
        }

        // Auto hide success message and navigate
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/cart');
        }, 2000);
      }

    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });

      // Handle specific error cases
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Dữ liệu không hợp lệ';
        alert(`Lỗi: ${errorMessage}`);
      } else if (error.response?.status === 409) {
        alert('Phòng này đã có người đặt hoặc không còn trống. Vui lòng chọn phòng khác.');
      } else if (error.response?.status === 500) {
        alert('Lỗi server. Vui lòng thử lại sau.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        alert('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng';
        alert(`Lỗi: ${errorMessage}. Vui lòng thử lại.`);
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin dịch vụ...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          Đã thêm vào giỏ hàng thành công!
        </div>
      )}
      
      {/* Loading overlay when adding to cart */}
      {(isAdding || cartLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Đang thêm vào giỏ hàng...</span>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt phòng</h1>
            <p className="text-gray-600">Hoàn thiện thông tin đặt phòng của bạn</p>
            {user && (
              <p className="text-sm text-blue-600 mt-1">
                Đang đặt phòng cho: {user.name || user.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Room Quantity */}
              <RoomQuantitySelector
                room={room}
                quantity={quantity}
                onQuantityChange={setQuantity}
                maxQuantity={room.quantity || 10}
              />

              {/* Date & Time Selection */}
              <DateTimeSelector
                checkInDate={checkInDate}
                checkInTime={checkInTime}
                checkOutDate={checkOutDate}
                checkOutTime={checkOutTime}
                onChange={handleDateTimeChange}
              />

              {/* Guest Selection */}
              <GuestSelector
                adults={adults}
                children={children}
                onGuestChange={handleGuestChange}
                maxGuests={room.capacity || room.maxGuests || 10}
              />

              {/* Addon Selection */}
              <AddonSelector
                addons={addons}
                selectedAddons={selectedAddons}
                onAddonChange={handleAddonChange}
              />

              {/* Add to Cart Button */}
              <div className="pt-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isBookingValid() || isAdding || cartLoading}
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAdding || cartLoading
                    ? 'Đang thêm...' 
                    : isBookingValid() 
                    ? 'Thêm vào giỏ hàng' 
                    : 'Vui lòng điền đầy đủ thông tin'}
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4 pt-4 pb-8">
                <Button
                  variant="outline"
                  onClick={() => navigate('/cart')}
                  className="flex-1 justify-center border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Xem giỏ hàng
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1 justify-center"
                >
                  Tiếp tục đặt phòng
                </Button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <BookingSummary
                room={room}
                quantity={quantity}
                checkInDate={checkInDate}
                checkInTime={checkInTime}
                checkOutDate={checkOutDate}
                checkOutTime={checkOutTime}
                adults={adults}
                children={children}
                selectedAddons={selectedAddons}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;