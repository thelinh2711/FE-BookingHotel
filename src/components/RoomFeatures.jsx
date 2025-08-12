import { BedDouble, Users, Bath, Home } from 'lucide-react';
import SectionTitle from './SectionTitle';

const RoomFeatures = () => {
  return (
    <div>
      <SectionTitle title="Room Features" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <BedDouble className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-slate-900">Bedroom</div>
            <div className="text-sm text-slate-500">1 King size bed</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-slate-900">Guests</div>
            <div className="text-sm text-slate-500">Up to 4 guests</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bath className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-slate-900">Bathroom</div>
            <div className="text-sm text-slate-500">Private bathroom with shower</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-slate-900">Size</div>
            <div className="text-sm text-slate-500">45 m² / 484 ft²</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFeatures;