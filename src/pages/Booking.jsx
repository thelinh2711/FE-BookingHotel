import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  CreditCard, 
  MapPin,
  Clock,
  Bed,
  Wifi,
  Car,
  Coffee,
  CheckCircle
} from 'lucide-react';

const Booking = () => {
  const [formData, setFormData] = useState({
    // Thông tin khách hàng
    fullName: '',
    phone: '',
    email: '',
    notes: '',
    
    // Thông tin đặt phòng
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    
    // Phương thức thanh toán
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dữ liệu mẫu cho phòng được chọn
  const selectedRoom = {
    id: 1,
    name: "Deluxe Ocean View",
    price: 2500000,
    image: "/api/placeholder/400/300",
    amenities: ["Wifi miễn phí", "Bãi đậu xe", "Bữa sáng", "Hồ bơi"],
    maxGuests: 2
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(4); // Chuyển đến bước xác nhận
    }, 2000);
  };

  const calculateTotal = () => {
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const roomTotal = selectedRoom.price * formData.rooms * nights;
    const tax = roomTotal * 0.1; // 10% thuế
    return {
      nights,
      roomTotal,
      tax,
      total: roomTotal + tax
    };
  };

  const pricing = calculateTotal();

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= step 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderGuestInfoForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Thông tin khách hàng
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ email"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Yêu cầu đặc biệt (tùy chọn)"
            rows="3"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderBookingDetailsForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Chi tiết đặt phòng
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày nhận phòng *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày trả phòng *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số khách
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} khách</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số phòng
          </label>
          <div className="relative">
            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="rooms"
              value={formData.rooms}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3].map(num => (
                <option key={num} value={num}>{num} phòng</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Phương thức thanh toán
      </h3>

      <div className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Chọn phương thức thanh toán
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={formData.paymentMethod === 'credit-card'}
                onChange={handleInputChange}
                className="mr-3"
              />
              <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
              <span>Thẻ tín dụng/Ghi nợ</span>
            </label>

            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="bank-transfer"
                checked={formData.paymentMethod === 'bank-transfer'}
                onChange={handleInputChange}
                className="mr-3"
              />
              <MapPin className="w-5 h-5 mr-2 text-gray-600" />
              <span>Chuyển khoản ngân hàng</span>
            </label>

            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleInputChange}
                className="mr-3"
              />
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              <span>Thanh toán tại khách sạn</span>
            </label>
          </div>
        </div>

        {/* Credit Card Form */}
        {formData.paymentMethod === 'credit-card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số thẻ
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hết hạn
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên trên thẻ
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="Tên như trên thẻ"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrderSummary = () => (
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

  const renderConfirmation = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Đặt phòng thành công!
      </h2>
      <p className="text-gray-600 mb-6">
        Cảm ơn bạn đã đặt phòng. Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn.
      </p>
      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
        <h4 className="font-semibold mb-2">Mã đặt phòng: #BK{Date.now().toString().slice(-6)}</h4>
        <p className="text-sm text-gray-600">Vui lòng lưu mã này để tra cứu đặt phòng</p>
      </div>
      <div className="space-x-4">
        <Button onClick={() => window.location.href = '/'}>
          Về trang chủ
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          In phiếu đặt phòng
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt phòng</h1>
          <p className="text-gray-600">Hoàn thành thông tin để xác nhận đặt phòng</p>
        </div>

        {currentStep < 4 && renderStepIndicator()}

        {currentStep === 4 ? (
          renderConfirmation()
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {currentStep >= 1 && renderGuestInfoForm()}
                {currentStep >= 2 && renderBookingDetailsForm()}
                {currentStep >= 3 && renderPaymentForm()}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Quay lại
                    </Button>
                  )}

                  <div className="ml-auto">
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={
                          (currentStep === 1 && (!formData.fullName || !formData.phone || !formData.email)) ||
                          (currentStep === 2 && (!formData.checkIn || !formData.checkOut))
                        }
                      >
                        Tiếp tục
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                      >
                        {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                {renderOrderSummary()}
              </div>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
