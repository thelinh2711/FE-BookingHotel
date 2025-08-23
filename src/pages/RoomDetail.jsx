import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Star, Share2 } from "lucide-react";

// Layout Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionTitle from "../components/SectionTitle";
import Reviews from "../components/Reviews";

// Room Detail Components
import ImageGallery from "../components/ImageGallery";
import Amenities from "../components/Amenities";
import BookingCard from "../components/BookingCard";
import RoomFeatures from "../components/RoomFeatures";
import HouseRules from "../components/HouseRules";
import SimilarRooms from "../components/SimilarRooms";

// API
import { getRoomClassById, getAllRoomClassesByHotel } from "../api/roomClassApi";

const RoomDetail = () => {
  const { id } = useParams();
  const location = useLocation(); // Lấy state từ navigation
  const [room, setRoom] = useState(null);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);

        // Lấy chi tiết phòng theo id
        const res = await getRoomClassById(id);
        const roomData = res.data;

        // 🔹 QUAN TRỌNG: Tính giá sau giảm giống như ở Home
        const discountPercent = roomData.discountPercent || 0;
        const originalPrice = roomData.priceOriginal || 0;
        
        // Tính giá sau giảm
        const discountedPrice = discountPercent > 0
          ? originalPrice * (100 - discountPercent) / 100
          : originalPrice;

        // 🔹 Map dữ liệu API sang format UI cần
        const mappedRoom = {
          id: roomData.id,
          name: roomData.roomClassName,
          description: roomData.description,
          
          // QUAN TRỌNG: Thêm đầy đủ thông tin giá
          price: discountedPrice,           // Giá sau giảm (để BookingCard hiển thị)
          originalPrice: originalPrice,      // Giá gốc
          priceOriginal: originalPrice,      // Giữ cả 2 tên cho chắc
          discountPercent: discountPercent,  // Phần trăm giảm
          
          capacity: roomData.capacity,
          quantity: roomData.quantity,
          images: roomData.roomImagePaths || [roomData.hotel?.imageUrl],
          rating: 4.5, // fake tạm
          city: roomData.hotel?.location,
          country: "Vietnam", // fake
          features: roomData.features?.map(f => f.featureName) || [],
          bedTypes: roomData.bedTypes?.map(b => b.bedName) || [],
          amenities: ["Free WiFi", "Parking", "Breakfast"], // fake tạm
          reviews: [], // fake tạm
          rules: ["No smoking", "No pets"], // fake tạm
          hotel: roomData.hotel,
          
          // Thêm raw data nếu cần
          roomClassName: roomData.roomClassName,
          roomImagePaths: roomData.roomImagePaths,
        };

        setRoom(mappedRoom);

        // Lấy các phòng cùng khách sạn (dùng hotel.id)
        if (roomData?.hotel?.id) {
          const resSimilar = await getAllRoomClassesByHotel(roomData.hotel.id);
          setSimilarRooms(resSimilar.data);
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Room not found
            </h2>
            <Link to="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-500 hover:text-blue-600">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <Link to="/rooms" className="text-slate-500 hover:text-blue-600">
              Rooms
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900">{room.name}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Info */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {room.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{room.rating || "N/A"}</span>
                  <span className="text-slate-500">
                    ({room.reviews?.length || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  {room.city}, {room.country}
                </div>
              </div>
            </div>
            <button className="p-2 border rounded-lg hover:bg-slate-50 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={room.images} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <SectionTitle title="Mô tả" />
              <p className="text-slate-600 leading-relaxed">
                {room.description ||
                  "Experience luxury and comfort in our beautifully appointed room."}
              </p>
            </div>

            {/* Room Features */}
            <RoomFeatures room={room} />

            {/* Amenities */}
            <Amenities features={room.features} />

            {/* House Rules */}
            <HouseRules rules={room.rules} />

            {/* Reviews Section */}
            <Reviews reviews={room.reviews} />
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard room={room} />
          </div>
        </div>

        {/* Similar Rooms */}
        <SimilarRooms
          rooms={similarRooms}
          currentRoomId={room.id}
          currentCity={room.city}
        />
      </main>

      <Footer />
    </>
  );
};

export default RoomDetail;