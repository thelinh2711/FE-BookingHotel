import { useState } from "react";
import { BedDouble, MapPin, Search } from "lucide-react";
import Button from "./Button";

const SearchBar = ({
  onSearch,
  locations = ["Colombo", "Galle", "Kandy"],
  defaultRoomType = "",
  defaultLocation,
  className = "",
}) => {
  const [roomType, setRoomType] = useState(defaultRoomType);
  const [location, setLocation] = useState(defaultLocation ?? locations[0] ?? "");

  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ roomType, location });
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <form
        onSubmit={submit}
        className="
          bg-blue-50 rounded-2xl
          px-3 py-3
          flex flex-col gap-3
          md:flex-row md:items-center md:gap-4
          w-full
        "
      >
        {/* Room Type */}
        <div className="w-full md:flex-1 md:min-w-[220px]">
          <label className="sr-only">Room type</label>
          <div className="h-12 bg-white rounded-xl shadow-sm flex items-center gap-3 px-4">
            <BedDouble className="w-5 h-5 text-slate-600 shrink-0" />
            <input
              type="text"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              placeholder="Room type (e.g. Deluxe)"
              className="flex-1 h-full bg-transparent outline-none placeholder-slate-400"
              autoComplete="off"
              aria-label="Room type"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-200" />

        {/* Location */}
        <div className="w-full md:flex-1 md:min-w-[200px]">
          <label className="sr-only">Location</label>
          <div className="h-12 bg-white rounded-xl shadow-sm flex items-center gap-3 px-4">
            <MapPin className="w-5 h-5 text-slate-600 shrink-0" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 h-full bg-transparent outline-none"
              aria-label="Select location"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button */}
        <Button
          type="submit"
          className="h-12 rounded-xl flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Search size={18} />
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
