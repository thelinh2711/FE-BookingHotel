import React, { useMemo, useState } from 'react';
import defaultAvatar from '../assets/User-avatar.png';
import SectionTitle from './SectionTitle';

function StarRating({ value = 0, size = 18, className = '' }) {
  const stars = [1, 2, 3, 4, 5];
  const fillFor = (i) => {
    if (value >= i) return 1;
    if (value >= i - 0.5) return 0.5;
    return 0;
  };
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {stars.map((i) => {
        const f = fillFor(i);
        return (
          <span key={i} className="relative" style={{ width: size, height: size }}>
            <svg viewBox="0 0 24 24" width={size} height={size} className="text-yellow-500">
              <path
                d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            {f > 0 && (
              <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                className="absolute inset-0 text-yellow-500"
                style={{ clipPath: f === 0.5 ? 'inset(0 50% 0 0)' : 'none' }}
              >
                <path
                  d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"
                  fill="currentColor"
                />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
}

function ProgressBar({ value = 0 }) {
  return (
    <div className="h-2 w-full bg-slate-200 rounded">
      <div
        className="h-2 bg-yellow-500 rounded"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function ReviewItem({ review }) {
  const { name, date, rating, comment, roomName} = review;
  return (
    <div className="flex gap-4 p-4 rounded-2xl border bg-white">
      <img
        src={defaultAvatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-semibold text-slate-900">{name}</div>
          {roomName && (
            <div className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Room: {roomName}
            </div>
          )}
          <div className="text-xs text-slate-500">
            {new Date(date).toLocaleDateString()}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <StarRating value={rating} />
          <span className="text-sm text-slate-600">{rating.toFixed(1)}</span>
        </div>
        <p className="mt-2 text-slate-700">{comment}</p>
      </div>
    </div>
  );
}

function RatingSummary({ reviews, onFilter, currentFilter }) {
  const { avg, counts, total } = useMemo(() => {
    const total = reviews.length;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    reviews.forEach((r) => {
      const star = Math.round(r.rating);
      counts[star] = (counts[star] || 0) + 1;
      sum += r.rating;
    });
    return { avg: total ? sum / total : 0, counts, total };
  }, [reviews]);

  const percent = (n) => (total ? (n / total) * 100 : 0);

  return (
    <div className="p-4 rounded-2xl border bg-white flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-bold text-slate-900">{avg.toFixed(1)}</div>
        <StarRating value={avg} className="mt-1" />
        <div className="text-sm text-slate-500 mt-1">{total} reviews</div>
      </div>
      <div className="md:flex-1 space-y-2">
        {[5,4,3,2,1].map((star) => (
          <button
            key={star}
            onClick={() => onFilter(currentFilter === star ? null : star)}
            className={`w-full flex items-center gap-3 group ${currentFilter === star ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
          >
            <span className="w-10 text-sm text-slate-700">{star}★</span>
            <ProgressBar value={percent(counts[star])} />
            <span className="w-10 text-right text-sm text-slate-600">{counts[star] || 0}</span>
          </button>
        ))}
        {currentFilter && (
          <button
            onClick={() => onFilter(null)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Xoá lọc ({currentFilter}★)
          </button>
        )}
      </div>
    </div>
  );
}

export default function Reviews({ reviews = [] }) {
  const [filter, setFilter] = useState(null);

  const filtered = useMemo(() => {
    if (!filter) return reviews;
    return reviews.filter((r) => Math.round(r.rating) === filter);
  }, [filter, reviews]);

  if (!reviews.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 p-6 rounded-2xl border bg-white text-center text-slate-600">
        <SectionTitle title="Đánh giá" />
        Chưa có đánh giá nào cho phòng này.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="max-w-7xl mx-auto px-4">
        <SectionTitle title="Đánh giá" />
        <RatingSummary reviews={reviews} currentFilter={filter} onFilter={setFilter} />
        <div className="grid grid-cols-1 gap-4 mt-6">
          {filtered.map((rv) => (
            <ReviewItem key={rv.id} review={rv} />
          ))}
        </div>
      </div>
    </section>
  );
}
