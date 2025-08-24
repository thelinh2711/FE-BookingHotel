import React from 'react';
import { Minus, Plus } from 'lucide-react';

const RoomQuantitySelector = ({ room, quantity, onQuantityChange, maxQuantity = 10 }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img 
            src={room.image || room.roomImagePaths?.[0]} 
            alt={room.name}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-800">{room.name}</h3>
            <p className="text-sm text-gray-600">
              Tối đa {room.capacity || room.maxGuests} khách
            </p>
            <p className="text-lg font-bold text-blue-600">
              {room.price?.toLocaleString('vi-VN')}₫/đêm
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            disabled={quantity <= 0}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-8 text-center font-semibold">{quantity}</span>
          
          <button
            onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        Số lượng phòng khả dụng: {room.quantity || 'N/A'}
      </div>
    </div>
  );
};

export default RoomQuantitySelector;