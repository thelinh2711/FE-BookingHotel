import { 
  Wifi, Car, Coffee, Dumbbell, Users, 
  Bath, Tv, Wind, Shield, Home, Check 
} from 'lucide-react';
import SectionTitle from './SectionTitle';

const Amenities = ({ amenities }) => {
  const amenityIcons = {
    'Free WiFi': <Wifi className="w-5 h-5" />,
    'Parking': <Car className="w-5 h-5" />,
    'Breakfast': <Coffee className="w-5 h-5" />,
    'Gym': <Dumbbell className="w-5 h-5" />,
    'Family Rooms': <Users className="w-5 h-5" />,
    'Spa & Wellness': <Bath className="w-5 h-5" />,
    'TV': <Tv className="w-5 h-5" />,
    'Air Conditioning': <Wind className="w-5 h-5" />,
    'Safe': <Shield className="w-5 h-5" />,
    'Room Service': <Home className="w-5 h-5" />
  };

  return (
    <div>
      <SectionTitle title="Amenities" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-blue-600">
              {amenityIcons[amenity] || <Check className="w-5 h-5" />}
            </span>
            <span className="text-sm text-slate-700">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Amenities;