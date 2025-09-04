// src/pages/PaymentPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Nhận state từ Cart.jsx
  // GỢI Ý: Cart nên truyền thêm bookingId; nếu chưa có, cố lấy từ item đầu tiên
  const { cartItems, totalAmount, bookingId: bookingIdFromCart } = location.state || {};
  const bookingId = bookingIdFromCart || cartItems?.[0]?.bookingId;

  if (!cartItems || cartItems.length === 0 || !totalAmount || !bookingId) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-bold">Thiếu dữ liệu thanh toán</h2>
        <p className="text-gray-600 mt-2">
          Cần có danh sách item, tổng tiền, và bookingId.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/cart")}
        >
          Quay lại giỏ hàng
        </button>
      </div>
    );
  }

  // Gọi BE tạo URL VNPay (BE dùng GET /api/payment/vnpay?amount&orderId)
  const handleVNPayPayment = async () => {
    try {
      // BE PaymentService yêu cầu orderId dạng: "BOOKING-{bookingId}-{timestamp}"
      const orderId = `BOOKING-${bookingId}-${Date.now()}`;

      const res = await axios.get(
        `http://localhost:8080/api/payment/vnpay`,
        {
          params: {
            amount: Math.round(Number(totalAmount) || 0),
            orderId,
          },
        }
      );

      // BE trả về ResponseEntity.ok(url) => body là string URL
      const paymentUrl = typeof res.data === "string" ? res.data : null;

      if (paymentUrl) {
        window.location.href = paymentUrl; // chuyển sang VNPay
      } else {
        alert("Không nhận được URL thanh toán từ máy chủ.");
      }
    } catch (err) {
      console.error("Lỗi khi tạo thanh toán VNPay:", err);
      alert("Không thể tạo thanh toán VNPay. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Xác nhận thanh toán</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Danh sách phòng/dịch vụ</h2>
        <ul className="border rounded p-4 bg-gray-50">
          {cartItems.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between py-2 border-b last:border-b-0"
            >
              <span>{item.room?.name || item.roomClassName || "Hạng phòng"}</span>
              <span>
                {(Number(item.totalPrice) || 0).toLocaleString("vi-VN")} ₫
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-right mb-6">
        <span className="text-lg font-bold">
          Tổng tiền: {Number(totalAmount).toLocaleString("vi-VN")} ₫
        </span>
      </div>

      <button
        onClick={handleVNPayPayment}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Thanh toán qua VNPay
      </button>

      <div className="mt-4">
        <button
          onClick={() => navigate("/cart")}
          className="px-4 py-2 border rounded"
        >
          Quay lại giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
