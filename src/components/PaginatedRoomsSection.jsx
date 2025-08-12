import { useMemo, useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import Pagination from "./Pagination";
import SectionTitle from "./SectionTitle"; 

export default function PaginatedRoomsSection({
  title,
  items = [],
  pageSize = 6,
  sortFn,
  filterFn,
}) {
  const [page, setPage] = useState(1);

  const data = useMemo(() => {
    let arr = [...items];
    if (filterFn) arr = arr.filter(filterFn);
    if (sortFn) arr.sort(sortFn);
    return arr;
  }, [items, sortFn, filterFn]);

  const total = data.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = data.slice(start, start + pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [page, pageCount]);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-10">
      <SectionTitle title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pageItems.map((r) => (
          <HotelCard key={r.id} {...r} />
        ))}
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={setPage}
        className="mt-6"
      />
    </section>
  );
}
