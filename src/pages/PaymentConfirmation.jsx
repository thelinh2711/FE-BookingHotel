import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, Clock, CheckCircle, ArrowLeft, User, Mail, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { CartContext } from '../context/CartContext';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { removeFromCart } = useContext(CartContext);
  const cartItems = location.state?.cartItems || [];
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Tính tổng tiền
  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    // Validate customer info
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin khách hàng');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare booking data for backend
      const bookingData = {
        customer: customerInfo,
        bookings: cartItems.map(item => ({
          roomId: item.room.id,
          quantity: item.quantity,
          checkInDate: item.checkInDate,
          checkInTime: item.checkInTime,
          checkOutDate: item.checkOutDate,
          checkOutTime: item.checkOutTime,
          adults: item.adults,
          children: item.children,
          selectedAddons: item.selectedAddons,
          totalPrice: item.totalPrice
        })),
        paymentMethod,
        totalAmount: getTotalAmount()
      };

      // Call backend API to create payment
      // const paymentResponse = await api.post('/api/payments/create-vnpay', bookingData);
      
      // For now, simulate payment creation
      console.log('Creating VNPay payment:', bookingData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate VNPay redirect URL
      const vnpayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${getTotalAmount()}&vnp_Command=pay&vnp_CreateDate=${new Date().toISOString().replace(/[-:]/g, '').slice(0, 14)}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:3000/payment/return&vnp_TmnCode=DEMO&vnp_TxnRef=${Date.now()}&vnp_Version=2.1.0`;
      
      // Remove paid items from cart
      cartItems.forEach(item => {
        removeFromCart(item.id);
      });
      
      // Redirect to VNPay (in real app)
      // window.location.href = paymentResponse.data.paymentUrl;
      
      // For demo, show success
      navigate('/payment/success', {
        state: {
          orderInfo: {
            orderId: `ORDER_${Date.now()}`,
            amount: getTotalAmount(),
            items: cartItems
          }
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có mục nào để thanh toán</h2>
            <Button onClick={() => navigate('/cart')}>Quay về giỏ hàng</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về giỏ hàng
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Xác nhận đặt phòng & Thanh toán</h1>
            <p className="text-gray-600">Hoàn tất thông tin để hoàn thành đặt phòng</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Customer Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin khách hàng</h2>
                
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
                        value={customerInfo.fullName}
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
                        value={customerInfo.phone}
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
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ email"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      name="notes"
                      value={customerInfo.notes}
                      onChange={handleInputChange}
                      placeholder="Yêu cầu đặc biệt..."
                      rows="3"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Phương thức thanh toán</h2>
                
                <div className="space-y-4">
                  {/* VNPay Option */}
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === 'vnpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VNPay</span>
                        </div>
                        <span className="font-medium text-gray-800">VNPay</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Khuyến nghị</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Thanh toán an toàn qua VNPay - Hỗ trợ thẻ ATM, Internet Banking, QR Code
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600">Bảo mật SSL 256-bit</span>
                      </div>
                    </div>
                  </label>

                  {/* ATM/Internet Banking Option */}
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      disabled
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-6 h-6 text-gray-400" />
                        <span className="font-medium text-gray-600">Chuyển khoản ngân hàng</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Sắp có</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Thanh toán trực tiếp qua chuyển khoản ngân hàng
                      </p>
                    </div>
                  </label>

                  {/* Cash Option */}
                  <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      disabled
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-gray-400" />
                        <span className="font-medium text-gray-600">Thanh toán tại khách sạn</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Sắp có</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Thanh toán bằng tiền mặt khi nhận phòng
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">Thanh toán an toàn</h3>
                    <p className="text-sm text-blue-700">
                      Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối. 
                      Chúng tôi không lưu trữ thông tin thẻ của bạn.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Tóm tắt đơn hàng</h3>
                
                {/* Items List */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={item.room?.image || item.room?.roomImagePaths?.[0]} 
                          alt={item.room?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{item.room?.name}</h4>
                          <p className="text-xs text-gray-600">{item.quantity} phòng × {item.nights} đêm</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày:</span>
                          <span>{item.checkInDate} → {item.checkOutDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Khách:</span>
                          <span>{item.adults} người lớn{item.children > 0 && `, ${item.children} trẻ em`}</span>
                        </div>
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dịch vụ:</span>
                            <span>{item.selectedAddons.length} mục</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium text-blue-600">
                          <span>Tổng:</span>
                          <span>{item.totalPrice?.toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Tổng thanh toán</span>
                    <span className="text-blue-600">
                      {getTotalAmount().toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone}
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition duration-200 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Thanh toán VNPay
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Bằng cách thanh toán, bạn đồng ý với điều khoản sử dụng của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentConfirmation;