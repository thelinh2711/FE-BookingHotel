import { useEffect, useState } from "react";
import bookingApi from "../api/bookingApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Star, XCircle, CalendarClock, Loader2 } from "lucide-react";

export default function MyOrders() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]); // list of { id, orderCode, roomName, checkin, checkout, totalPrice, status, cancelDeadline }

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await bookingApi.listMine();
      setOrders(res?.result || []);
    } catch (e) {
      setError(e.message || "Không lấy được danh sách đơn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const canCancel = (o) => {
    if (!o.cancelDeadline) return false;
    return new Date(o.cancelDeadline).getTime() > Date.now() && (o.status === "pending" || o.status === "paid");
  };

  const handleCancel = async (id) => {
    try {
      await bookingApi.cancel(id);
      fetchData();
    } catch (e) {
      alert(e.message || "Huỷ không thành công");
    }
  };

  const handleReview = async (id, rating, comment) => {
    try {
      await bookingApi.review(id, { rating, comment });
      alert("Cảm ơn bạn đã đánh giá!");
      fetchData();
    } catch (e) {
      alert(e.message || "Gửi đánh giá thất bại");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">Đơn của tôi</h1>

          {error && <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3">{error}</div>}
          {loading && <div className="flex items-center gap-2 text-gray-600"><Loader2 className="animate-spin" /> Đang tải...</div>}

          {!loading && orders.length === 0 && (
            <div className="text-gray-600">Bạn chưa có đơn nào.</div>
          )}

          <div className="space-y-4">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} onCancel={handleCancel} onReview={handleReview} canCancel={canCancel(o)} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OrderCard({ order, onCancel, onReview, canCancel }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const stars = [1,2,3,4,5];

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500">Mã đơn</p>
          <p className="font-medium">{order.orderCode || order.id}</p>
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <CalendarClock size={18}/> {order.checkin} → {order.checkout}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
        <div>
          <p className="text-gray-500">Phòng</p>
          <p className="font-medium">{order.roomName || order.roomId}</p>
        </div>
        <div>
          <p className="text-gray-500">Tổng tiền</p>
          <p className="font-semibold">{Number(order.totalPrice || 0).toLocaleString()}₫</p>
        </div>
        <div>
          <p className="text-gray-500">Trạng thái</p>
          <p className="font-medium capitalize">{order.status}</p>
        </div>
        <div>
          <p className="text-gray-500">Huỷ đến</p>
          <p className="font-medium">{order.cancelDeadline ? new Date(order.cancelDeadline).toLocaleString() : "-"}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {canCancel && (
          <button
            onClick={() => onCancel(order.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200"
          >
            <XCircle size={18}/> Huỷ đơn
          </button>
        )}
      </div>

      {order.status === "paid" && (
        <div className="mt-5 border-t pt-4">
          <p className="font-medium mb-2">Đánh giá</p>
          <div className="flex items-center gap-1 mb-2">
            {stars.map(s => (
              <button key={s} onClick={() => setRating(s)} aria-label={`rate ${s}`}>
                <Star size={22} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
              </button>
            ))}
          </div>
          <textarea
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Chia sẻ trải nghiệm của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="mt-2">
            <button
              onClick={() => onReview(order.id, rating, comment)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
              disabled={rating === 0}
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      )}
    </div>
  );
}