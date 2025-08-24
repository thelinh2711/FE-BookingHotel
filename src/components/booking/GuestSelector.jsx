import React from 'react';
import { Users, Baby, Minus, Plus } from 'lucide-react';

const GuestSelector = ({ adults, children, onGuestChange, maxGuests = 10 }) => {
  const totalGuests = adults + children;
  
  const adjustGuests = (type, change) => {
    if (type === 'adults') {
      const newAdults = Math.max(1, Math.min(maxGuests, adults + change));
      if (newAdults + children <= maxGuests) {
        onGuestChange('adults', newAdults);
      }
    } else {
      const newChildren = Math.max(0, Math.min(maxGuests - adults, children + change));
      onGuestChange('children', newChildren);
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Số lượng khách
      </h3>
      
      <div className="space-y-4">
        {/* Adults */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-800">Người lớn</p>
              <p className="text-sm text-gray-500">Từ 12 tuổi trở lên</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustGuests('adults', -1)}
              disabled={adults <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="w-8 text-center font-semibold">{adults}</span>
            
            <button
              onClick={() => adjustGuests('adults', 1)}
              disabled={totalGuests >= maxGuests}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Baby className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-800">Trẻ em</p>
              <p className="text-sm text-gray-500">Từ 2-11 tuổi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustGuests('children', -1)}
              disabled={children <= 0}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="w-8 text-center font-semibold">{children}</span>
            
            <button
              onClick={() => adjustGuests('children', 1)}
              disabled={totalGuests >= maxGuests}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Tổng số khách: {totalGuests} / {maxGuests}
        </p>
      </div>
    </div>
  );
};

export default GuestSelector;