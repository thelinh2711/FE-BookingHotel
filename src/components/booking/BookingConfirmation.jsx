import { CheckCircle } from 'lucide-react';
import Button from '../Button';

const BookingConfirmation = () => {
  return (
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
};

export default BookingConfirmation;
