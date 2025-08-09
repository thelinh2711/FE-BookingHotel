import Button from './Button';
import bannerImg from '../assets/banner.jpg';
import { Backpack, Camera, MapPin } from 'lucide-react';

const Banner = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side: Text + Stats */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-5">
            Forget Busy Work,<br />
            Start Next Vacation
          </h1>
          <p className="text-slate-500 mb-6 max-w-md">
            We provide what you need to enjoy your holiday with family. Time to make another memorable moments.
          </p>

          <Button>Show More</Button>

          {/* Stats Section */}
         <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg">
            <StatItem icon={<Backpack size={28} className="text-pink-500" />} number="2500" label="Users" />
            <StatItem icon={<Camera size={28} className="text-pink-500" />} number="200" label="Treasure" />
            <StatItem icon={<MapPin size={28} className="text-pink-500" />} number="100" label="Cities" />
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            {/* Background shadow/decoration */}
            <div className="absolute top-8 left-8 w-full h-full bg-blue-100 rounded-3xl opacity-30"></div>
            
            {/* Main Image */}
            <img
              src={bannerImg}
              alt="Vacation room with natural lighting"
              className="relative w-full h-80 lg:h-96 object-cover rounded-tl-[60px] rounded-br-[60px] rounded-tr-lg rounded-bl-lg shadow-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

// StatItem Subcomponent
const StatItem = ({ icon, number, label }) => (
  <div className="text-left">
    <div className="mb-2">{icon}</div>
    <div className="text-slate-900">
      <span className="text-2xl font-bold text-blue-900">{number}</span> <span className="text-sm text-gray-500 font-medium">{label}</span>
    </div>
  </div>
);

export default Banner;