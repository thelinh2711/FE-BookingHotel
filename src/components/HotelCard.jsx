import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function HotelCard({
  id,
  image,
  name,
  city,
  country,
  rating,
  reviewsCount,
  price,              // giá hiện tính để trả (đã trừ giảm giá nếu có)
  originalPrice,      // giá gốc (nếu có giảm)
  discountPercent,    // số % giảm (nếu có)
  badge               // "Popular Choice" | "Most Picked" | ...
}) {
  const hasDiscount = typeof discountPercent === "number" && discountPercent > 0;

  return (
    <Link
      to={`/rooms/${id}`}
      className="block rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white"
    >
      <div className="relative">
        <img src={image} alt={name} className="w-full aspect-[16/10] object-cover" />

        {/* Badge giá */}
        <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-600 text-white rounded">
          {price}VND <span className="opacity-80">/ night</span>
        </div>

        {/* Badge giảm giá / phổ biến */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-red-600 text-white rounded">
            -{discountPercent}%
          </div>
        )}
        {badge && !hasDiscount && (
          <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-indigo-600 text-white rounded">
            {badge}
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="font-semibold text-slate-900 line-clamp-1">{name}</div>
        <div className="text-sm text-slate-500">{city}, {country}</div>

        <div className="mt-1 flex items-center gap-1 text-sm text-slate-600">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          {rating?.toFixed?.(1) ?? "—"}
          <span className="text-slate-400"> ({reviewsCount ?? 0})</span>
        </div>

        {hasDiscount && (
          <div className="mt-1 text-sm">
            <span className="text-slate-400 line-through mr-2">
              {originalPrice}VND
            </span>
            <span className="text-green-600 font-medium">Save {discountPercent}%</span>
          </div>
        )}
      </div>
    </Link>
  );
}
