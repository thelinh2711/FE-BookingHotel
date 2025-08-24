// src/pages/PaymentSuccess.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, Calendar, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderInfo = location.state?.orderInfo;

  if (!orderInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin đơn hàng</h2>
            <Button onClick={() => navigate('/')}>Quay về trang chủ</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    // Logic to download receipt/invoice
    console.log('Downloading receipt for order:', orderInfo.orderId);
    alert('Tính năng tải hóa đơn sẽ được cập nhật sớm!');
  };

  const handleSendEmail = () => {
    // Logic to send confirmation email
    console.log('Sending confirmation email for order:', orderInfo.orderId);
    alert('Email xác nhận đã được gửi!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600 text-lg">
              Cảm ơn bạn đã đặt phòng. Đơn hàng của bạn đã được xác nhận.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium text-gray-800">{orderInfo.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày đặt:</span>
                    <span className="font-medium text-gray-800">
                      {new Date().toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      Đã thanh toán
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium text-gray-800">VNPay</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng thanh toán</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-1">
                      {orderInfo.amount.toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-sm text-blue-700">
                      {orderInfo.items.length} mục đặt phòng
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết đặt phòng</h3>
              <div className="space-y-4">
                {orderInfo.items.map((item, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <img 
                        src={item.room?.image || item.room?.roomImagePaths?.[0]} 
                        alt={item.room?.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.room?.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity} phòng × {item.nights} đêm
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">
                          {item.totalPrice?.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{item.checkInDate} → {item.checkOutDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{item.adults} người lớn{item.children > 0 && `, ${item.children} trẻ em`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Check-in: {item.checkInTime}</span>
                      </div>
                    </div>

                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-2">Dịch vụ thêm:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.selectedAddons.map((addon, addonIndex) => (
                            <span key={addonIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {addon.addonName} x{addon.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownloadReceipt}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Tải hóa đơn
            </Button>
            
            <Button 
              onClick={handleSendEmail}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Gửi email xác nhận
            </Button>

            <Button 
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2"
            >
              Xem đơn hàng của tôi
            </Button>

            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              Tiếp tục đặt phòng
            </Button>
          </div>

          {/* Important Notes */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Lưu ý quan trọng:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Vui lòng mang theo CCCD/CMND và mã đơn hàng khi nhận phòng</li>
              <li>• Thời gian nhận phòng: từ 14:00, trả phòng: trước 12:00</li>
              <li>• Email xác nhận đã được gửi đến địa chỉ email của bạn</li>
              <li>• Liên hệ hotline nếu cần hỗ trợ: 1900-xxxx</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;