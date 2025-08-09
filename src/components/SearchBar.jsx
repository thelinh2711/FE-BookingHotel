import { Calendar, User, MapPin, ChevronDown } from 'lucide-react';
import Button from './Button';

const SearchBar = () => {
  return (
    <div className="bg-blue-50 rounded-full p-4 flex flex-wrap md:flex-nowrap items-center justify-center gap-4">
      
      <SearchItem icon={<Calendar size={18} />} label="Check Available" />
      <SearchItem icon={<User size={18} />} label="Person" value="2" hasDropdown />
      <SearchItem icon={<MapPin size={18} />} label="Select Location" />

      <Button className="px-6 py-2 rounded-md shadow text-white font-semibold">
        Search
      </Button>
    </div>
  );
};

const SearchItem = ({ icon, label, value, hasDropdown = false }) => {
  return (
    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-md shadow text-slate-800 min-w-[180px] justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-medium">{label}</span>
        {value && <span className="font-semibold">{value}</span>}
      </div>
      {hasDropdown && <ChevronDown size={16} />}
    </div>
  );
};

export default SearchBar;
