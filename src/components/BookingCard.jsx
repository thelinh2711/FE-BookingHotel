import Button from './Button';

const BookingCard = ({ room }) => {
  const hasDiscount = room.discountPercent > 0;

  return (
    <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-600 mb-3">Start Booking</p>

      {hasDiscount && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg text-slate-400 line-through">
            ${room.originalPrice}
          </span>
          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
            -{room.discountPercent}% OFF
          </span>
        </div>
      )}

      <div className="flex items-baseline gap-2 mb-5">
        <span className="text-4xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          ${room.price}
        </span>
        <span className="text-slate-400">per Day</span>
      </div>

      <Button className="w-full justify-center">
        Book Now!
      </Button>
    </div>
  );
};

export default BookingCard;
