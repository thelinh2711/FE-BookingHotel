import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import SectionTitle from './SectionTitle';

const SimilarRooms = ({ rooms, currentRoomId, currentCity }) => {
  // Filter rooms in same city, exclude current room
  const similarRooms = rooms
    .filter(r => r.id !== currentRoomId && r.city === currentCity)
    .slice(0, 3);

  // If no similar rooms in same city, show any 3 other rooms
  const displayRooms = similarRooms.length > 0 
    ? similarRooms 
    : rooms.filter(r => r.id !== currentRoomId).slice(0, 3);

  if (displayRooms.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <SectionTitle title="Similar Rooms" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayRooms.map(room => (
            <Link
              key={room.id}
              to={`/rooms/${room.id}`}
              className="block rounded-lg overflow-hidden border hover:shadow-lg transition"
            >
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{room.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{room.rating}</span>
                  <span className="text-sm text-slate-500">({room.reviewsCount})</span>
                </div>
                <div className="mt-2">
                  {room.discountPercent > 0 && (
                    <span className="text-sm text-slate-400 line-through mr-2">
                      ${room.originalPrice}
                    </span>
                  )}
                  <span className="text-lg font-bold">${room.price}</span>
                  <span className="text-sm text-slate-500"> / night</span>
                  {room.discountPercent > 0 && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
                      -{room.discountPercent}%
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SimilarRooms;