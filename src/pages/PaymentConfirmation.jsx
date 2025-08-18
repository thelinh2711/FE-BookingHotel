import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookingApi from "../api/bookingApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Loader2, Clock, QrCode, BadgeCheck, AlertTriangle, CircleX } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function PaymentConfirmation() {
  const q = useQuery();
  const navigate = useNavigate();

  // Read data from previous step or query (fallbacks)
  const initial = {
    roomId: q.get("roomId"),
    checkin: q.get("checkin"),
    checkout: q.get("checkout"),
    guests: Number(q.get("guests") || 1),
    totalPrice: Number(q.get("price") || 0),
    paymentMethod: q.get("method") || "vnpay",
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null); // { orderId, orderCode, status, lockExpireAt, payment }
  const [now, setNow] = useState(Date.now());
  const timerRef = useRef(null);
  const pollRef = useRef(null);

  const remainingMs = useMemo(() => {
    if (!order?.lockExpireAt) return 0;
    return Math.max(0, new Date(order.lockExpireAt).getTime() - now);
  }, [order, now]);

  const remainingStr = useMemo(() => {
    const ms = remainingMs;
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }, [remainingMs]);

  useEffect(() => {
    // tick every second for countdown
    timerRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // on mount: lock room + create payment session (QR)
    (async () => {
      setLoading(true);
      setError("");
      try {
        const payload = {
          roomId: initial.roomId,
          checkin: initial.checkin,
          checkout: initial.checkout,
          guests: initial.guests,
          totalPrice: initial.totalPrice,
          paymentMethod: initial.paymentMethod,
        };
        const res = await bookingApi.lockAndCreatePayment(payload);
        if (res?.result) {
          setOrder(res.result);
        } else {
          throw new Error(res?.message || "Không thể khởi tạo phiên thanh toán.");
        }
      } catch (e) {
        setError(e.message || "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // poll booking status while pending and not expired
    if (!order?.orderId) return;

    const poll = async () => {
      try {
        const s = await bookingApi.getStatus(order.orderId);
        if (s?.result) {
          setOrder((prev) => ({ ...prev, ...s.result }));
          if (["paid", "expired", "refunded", "manual_review", "canceled"].includes(s.result.status)) {
            clearInterval(pollRef.current);
          }
        }
      } catch {}
    };

    pollRef.current = setInterval(poll, 2500);
    return () => clearInterval(pollRef.current);
  }, [order?.orderId]);

  const handleVerify = async () => {
    if (!order?.orderId) return;
    setLoading(true);
    setError("");
    try {
      const v = await bookingApi.verifyPayment(order.orderId);
      if (v?.result) setOrder((prev) => ({ ...prev, ...v.result }));
    } catch (e) {
      setError(e.message || "Không thể xác minh thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order?.orderId) return;
    setLoading(true);
    setError("");
    try {
      const c = await bookingApi.cancel(order.orderId);
      if (c?.result) {
        setOrder((prev) => ({ ...prev, ...c.result }));
      }
    } catch (e) {
      setError(e.message || "Huỷ không thành công");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm"><BadgeCheck size={16}/> Đã thanh toán</span>;
      case "expired":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-3 py-1 text-sm"><AlertTriangle size={16}/> Hết hạn</span>;
      case "refunded":
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-sm">Hoàn tiền</span>;
      case "manual_review":
        return <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-sm">Chờ xử lý</span>;
      case "canceled":
        return <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-sm">Đã huỷ</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm">Đang chờ</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">Xác nhận đặt phòng & Thanh toán</h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3">{error}</div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="animate-spin" /> Đang xử lý...
            </div>
          )}

          {!loading && order && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <section className="md:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl shadow p-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Mã đơn</p>
                      <p className="text-lg font-medium">{order.orderCode || order.orderId}</p>
                    </div>
                    <div>{statusBadge(order.status)}</div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Phòng</p>
                      <p className="font-medium">{initial.roomId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Khách</p>
                      <p className="font-medium">{initial.guests}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Nhận phòng</p>
                      <p className="font-medium">{initial.checkin}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Trả phòng</p>
                      <p className="font-medium">{initial.checkout}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tổng tiền</p>
                      <p className="font-semibold">{initial.totalPrice.toLocaleString()}₫</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-gray-500" />
                      <p className="text-gray-700">Thời gian giữ chỗ còn: <span className="font-semibold">{remainingStr}</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-5">
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><QrCode size={18}/> Mã QR {order?.payment?.provider?.toUpperCase() || initial.paymentMethod.toUpperCase()}</h3>
                  {order?.payment?.qrImage ? (
                    <img src={order.payment.qrImage} alt="QR" className="w-64 h-64 object-contain" />
                  ) : order?.payment?.qrUrl ? (
                    <img src={order.payment.qrUrl} alt="QR" className="w-64 h-64 object-contain" />
                  ) : (
                    <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      Chờ QR từ máy chủ...
                    </div>
                  )}
                  {order?.payment?.deeplink && (
                    <a href={order.payment.deeplink} className="text-blue-600 underline mt-3 inline-block">
                      Mở ứng dụng thanh toán
                    </a>
                  )}

                  <div className="mt-4 text-sm text-gray-600 space-y-2">
                    <p>- Vui lòng quét mã QR và thanh toán trong thời gian giữ chỗ.</p>
                    <p>- Nếu chuyển khoản khi mã giữ chỗ đã hết hạn, hệ thống có thể tự hoàn tiền (refunded) hoặc đưa vào danh sách chờ xử lý tay (manual_review).</p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleVerify}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                      disabled={order.status === "paid" || order.status === "canceled"}
                    >
                      Tôi đã thanh toán
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 disabled:opacity-50"
                      disabled={order.status === "paid" || order.status === "canceled"}
                    >
                      Huỷ
                    </button>
                  </div>
                </div>
              </section>

              <aside className="space-y-4">
                <div className="bg-white rounded-2xl shadow p-5">
                  <h3 className="font-semibold mb-2">Lưu ý</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Chỉ có 1 người đặt được tại cùng thời điểm nhờ cơ chế khoá Redis ở backend.</li>
                    <li>Đừng đóng trang khi đang thanh toán. Sau khi thanh toán xong, bấm "Tôi đã thanh toán" để xác minh nhanh.</li>
                  </ul>
                </div>
                {order?.status === "paid" && (
                  <div className="bg-green-50 text-green-800 rounded-2xl p-4">
                    <p className="font-medium flex items-center gap-2"><BadgeCheck size={18}/> Thanh toán thành công</p>
                    <button
                      onClick={() => navigate("/orders")}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    >
                      Xem đơn của tôi
                    </button>
                  </div>
                )}
                {order?.status === "expired" && (
                  <div className="bg-red-50 text-red-800 rounded-2xl p-4">
                    <p className="font-medium flex items-center gap-2"><CircleX size={18}/> Phiên thanh toán đã hết hạn</p>
                    <p className="text-sm mt-1">Nếu bạn vừa chuyển tiền, hệ thống sẽ hoàn tiền tự động (nếu có) hoặc đưa vào danh sách chờ xử lý.</p>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}