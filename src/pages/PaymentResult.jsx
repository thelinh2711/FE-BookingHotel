// src/pages/PaymentResult.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("PROCESSING"); // PROCESSING | PAID | FAILED
  const [info, setInfo] = useState({
    orderId: "",
    amount: 0,
    transactionNo: "",
    responseCode: "",
  });

  useEffect(() => {
    const search = location.search || "";
    const params = new URLSearchParams(search);

    const orderId = params.get("vnp_TxnRef") || "";
    const responseCode = params.get("vnp_ResponseCode") || "";
    const transactionNo = params.get("vnp_TransactionNo") || "";
    const amountRaw = params.get("vnp_Amount") || "0";
    const amount = Math.round(Number(amountRaw) / 100); // VNPay *100

    setInfo({
      orderId,
      transactionNo,
      responseCode,
      amount,
    });

    // Forward đúng toàn bộ query sang BE để validate checksum + update DB
    // BE: GET /api/payment/vnpay-return?...
    const forwardToBackend = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/payment/vnpay-return${search}`
        );

        // Nếu BE validate ok, dựa vào vnp_ResponseCode để hiển thị
        if (responseCode === "00") {
          setStatus("PAID");
        } else {
          setStatus("FAILED");
        }

        // BE hiện trả về string redirectUrl, bạn có thể muốn tự động điều hướng:
        // if (typeof res.data === "string" && res.data.startsWith("http")) {
        //   window.location.href = res.data;
        // }
      } catch (err) {
        console.error("Lỗi xác thực thanh toán ở BE:", err);
        setStatus("FAILED");
      }
    };

    forwardToBackend();
  }, [location.search]);

  if (status === "PROCESSING") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">Đang xác thực thanh toán...</h2>
      </div>
    );
  }

  const isSuccess = status === "PAID";

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      {isSuccess ? (
        <h2 className="text-2xl font-bold text-green-600">Thanh toán thành công 🎉</h2>
      ) : (
        <h2 className="text-2xl font-bold text-red-600">Thanh toán thất bại ❌</h2>
      )}

      <div className="mt-4 border rounded p-4 text-left bg-gray-50">
        <p><span className="font-semibold">Mã đơn hàng (orderId):</span> {info.orderId}</p>
        <p><span className="font-semibold">Mã giao dịch VNPay:</span> {info.transactionNo || "-"}</p>
        <p><span className="font-semibold">Số tiền:</span> {Number(info.amount).toLocaleString("vi-VN")} ₫</p>
        <p><span className="font-semibold">Response code:</span> {info.responseCode}</p>
      </div>

      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Xem đơn của tôi
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 border rounded"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;
