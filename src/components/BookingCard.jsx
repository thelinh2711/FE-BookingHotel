import { useState } from 'react';
import { Calendar } from 'lucide-react';
import Button from './Button';

const BookingCard = ({ room }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  
  const hasDiscount = room.discountPercent > 0;
  
  return (
    <div className="sticky top-24 bg-white rounded-2xl border p-6 shadow-lg">
      <div className="mb-4">
        {hasDiscount && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl text-slate-400 line-through">
              ${room.originalPrice}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded">
              -{room.discountPercent}% OFF
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">${room.price}</span>
          <span className="text-slate-500">/ night</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>
      </div>

      <Button className="w-full justify-center mb-3">
        Book Now
      </Button>
      
      <button className="w-full py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
        Contact Host
      </button>

      <p className="text-xs text-slate-500 text-center mt-3">
        You won't be charged yet
      </p>
    </div>
  );
};

export default BookingCard;