// src/components/Pagination.jsx
import React, { useMemo, useState, useEffect } from "react";

function makeRange(page, pageCount, { siblings = 1, edges = 1 }) {
  const totalShown = edges * 2 + siblings * 2 + 3;
  if (pageCount <= totalShown) return Array.from({ length: pageCount }, (_, i) => i + 1);

  const left = Math.max(page - siblings, edges + 2);
  const right = Math.min(page + siblings, pageCount - edges - 1);
  const items = [];

  for (let i = 1; i <= edges; i++) items.push(i);
  if (left > edges + 2) items.push("…-");
  else if (left === edges + 2) items.push(edges + 1);

  for (let i = left; i <= right; i++) items.push(i);

  if (right < pageCount - edges - 1) items.push("+…");
  else if (right === pageCount - edges - 1) items.push(pageCount - edges);

  for (let i = pageCount - edges + 1; i <= pageCount; i++) items.push(i);

  return items;
}

const Icon = ({ d, className = "" }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" className={className}>
    <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Pagination({
  page,
  pageCount,
  onChange,
  siblings = 1,
  edges = 1,
  showJumper = true,
  className = "",
}) {
  const [jump, setJump] = useState(page);
  const [isEditingMobile, setIsEditingMobile] = useState(false); // ✅ trạng thái edit trên mobile
  useEffect(() => setJump(page), [page]); // đồng bộ input với trang hiện tại

  const go = (p) => {
    if (p >= 1 && p <= pageCount && p !== page) onChange(p);
  };

  const items = useMemo(
    () => makeRange(page, pageCount, { siblings, edges }),
    [page, pageCount, siblings, edges]
  );

  const pill = (active) =>
    `h-10 px-4 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      active
        ? "border-transparent text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow"
        : "border-slate-200 bg-white/70 backdrop-blur text-slate-700 hover:bg-white shadow-sm"
    }`;

  const btn =
    "inline-flex items-center justify-center h-10 px-3 rounded-full border border-slate-200 bg-white/70 text-slate-700 hover:bg-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40";

  const jumpSize = Math.max(5, siblings * 2 + 3);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Mobile compact: arrows + counter (counter có thể click để nhập) */}
      <div className="flex sm:hidden items-center gap-2">
        <button className={`${btn} w-10 px-0`} onClick={() => go(1)} disabled={page <= 1} aria-label="First">
          <Icon d="M19 6l-6 6 6 6M11 6l-6 6 6 6" />
        </button>
        <button className={`${btn} w-10 px-0`} onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Prev">
          <Icon d="M15 6l-6 6 6 6" />
        </button>

        {isEditingMobile ? (
          <input
            type="number"
            min={1}
            max={pageCount}
            value={jump}
            onChange={(e) => setJump(Number(e.target.value))}
            onBlur={() => {
              go(Number(jump));
              setIsEditingMobile(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                go(Number(jump));
                setIsEditingMobile(false);
              }
              if (e.key === "Escape") {
                setIsEditingMobile(false);
                setJump(page);
              }
            }}
            className="w-16 h-9 text-center border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            aria-label="Jump to page"
          />
        ) : (
          <button
            onClick={() => {
              setJump(page);
              setIsEditingMobile(true);
            }}
            className="mx-1 text-sm text-slate-600 select-none hover:underline"
            aria-label={`Current page ${page} of ${pageCount}. Tap to edit.`}
          >
            <span className="font-medium text-slate-900">{page}</span>/<span>{pageCount}</span>
          </button>
        )}

        <button className={`${btn} w-10 px-0`} onClick={() => go(page + 1)} disabled={page >= pageCount} aria-label="Next">
          <Icon d="M9 6l6 6-6 6" />
        </button>
        <button className={`${btn} w-10 px-0`} onClick={() => go(pageCount)} disabled={page >= pageCount} aria-label="Last">
          <Icon d="M5 6l6 6-6 6M13 6l6 6-6 6" />
        </button>
      </div>

      {/* Desktop/full */}
      <nav className="hidden sm:flex items-center gap-2" aria-label="Pagination">
        <button className={btn} onClick={() => go(1)} disabled={page <= 1}>
          <Icon d="M19 6l-6 6 6 6M11 6l-6 6 6 6" />
          <span className="ml-2">First</span>
        </button>
        <button className={btn} onClick={() => go(page - 1)} disabled={page <= 1}>
          <Icon d="M15 6l-6 6 6 6" />
          <span className="ml-2">Prev</span>
        </button>

        {items.map((it, idx) => {
          if (it === "…-") {
            const target = Math.max(1, page - jumpSize);
            return (
              <button
                key={`ldots-${idx}`}
                className={`${btn} px-2`}
                onClick={() => go(target)}
                aria-label="Jump previous pages"
              >
                …
              </button>
            );
          }
          if (it === "+…") {
            const target = Math.min(pageCount, page + jumpSize);
            return (
              <button
                key={`rdots-${idx}`}
                className={`${btn} px-2`}
                onClick={() => go(target)}
                aria-label="Jump next pages"
              >
                …
              </button>
            );
          }
          return (
            <button
              key={it}
              onClick={() => go(it)}
              aria-current={it === page ? "page" : undefined}
              className={pill(it === page)}
            >
              {it}
            </button>
          );
        })}

        <button className={btn} onClick={() => go(page + 1)} disabled={page >= pageCount}>
          <span className="mr-2">Next</span>
          <Icon d="M9 6l6 6-6 6" />
        </button>
        <button className={btn} onClick={() => go(pageCount)} disabled={page >= pageCount}>
          <span className="mr-2">Last</span>
          <Icon d="M5 6l6 6-6 6M13 6l6 6-6 6" />
        </button>
      </nav>

      {/* Jumper desktop (tùy chọn) */}
      {showJumper && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
          <span>Jump to</span>
          <input
            type="number"
            min={1}
            max={pageCount}
            value={jump}
            onChange={(e) => setJump(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") go(Number(jump));
            }}
            className="w-16 h-9 px-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="h-9 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => go(Number(jump))}
          >
            Go
          </button>
        </div>
      )}
    </div>
  );
}
