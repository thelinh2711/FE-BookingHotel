import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Reviews from "../components/Reviews";
import PaginatedRoomsSection from "../components/PaginatedRoomsSection";
import api from "../api/api"; // ✅ dùng axios instance

function Home() {
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]); // sau này có thể call API reviews
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/api/room-classes");
        const data = res.data;

        // Map dữ liệu từ BE sang format HotelCard cần
        const mapped = data.map((room) => {
          const price =
            room.discountPercent && room.discountPercent > 0
              ? (room.priceOriginal * (100 - room.discountPercent)) / 100
              : room.priceOriginal;

          return {
            id: room.id,
            image:
              room.roomImagePaths?.[0] ||
              room.hotel?.imageUrl ||
              "/placeholder.jpg",
            name: room.roomClassName,
            city: room.hotel?.location || "Unknown",
            country: "Vietnam", // tạm vì BE chưa có
            rating: 4.5, // BE chưa có rating
            reviewsCount: 120, // BE chưa có reviews
            price: price,
            originalPrice: room.priceOriginal,
            discountPercent: room.discountPercent,
            badge: room.discountPercent > 0 ? null : "Popular Choice",
          };
        });

        setRooms(mapped);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <Header />
      <Banner />
      <SearchBar />

      {/* Top Rated */}
      <PaginatedRoomsSection
        title="Top Rated"
        items={rooms}
        pageSize={6}
        sortFn={(a, b) => (b.rating ?? 0) - (a.rating ?? 0)}
      />

      {/* On Sale */}
      <PaginatedRoomsSection
        title="On Sale"
        items={rooms}
        pageSize={6}
        filterFn={(x) => (x.discountPercent ?? 0) > 0}
        sortFn={(a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0)}
      />

      <main className="p-6 space-y-8">
        <section>
          <Reviews reviews={reviews} />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
