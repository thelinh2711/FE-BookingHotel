// SimilarRooms.jsx
import SectionTitle from './SectionTitle';
import HotelCard from './HotelCard';

const SimilarRooms = ({ rooms, currentRoomId, currentCity }) => {
  // Lọc cùng thành phố, bỏ phòng hiện tại
  const similarRooms = rooms
    .filter(r => r.id !== currentRoomId && r.city === currentCity)
    .slice(0, 3);

  // Nếu không có phòng cùng thành phố, lấy bất kỳ 3 phòng khác
  const displayRooms =
    similarRooms.length > 0
      ? similarRooms
      : rooms.filter(r => r.id !== currentRoomId).slice(0, 3);

  if (displayRooms.length === 0) return null;

  return (
    <div className="mt-12">
      <SectionTitle title="Similar Rooms" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayRooms.map((r) => (
          <HotelCard
            key={r.id}
            id={r.id}
            image={r.image}
            name={r.name}
            city={r.city}
            country={r.country}
            rating={r.rating}
            reviewsCount={r.reviewsCount}
            price={r.price}
            originalPrice={r.originalPrice}
            discountPercent={r.discountPercent}
            badge={r.badge}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarRooms;
