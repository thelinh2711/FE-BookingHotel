import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Star, Share2 } from 'lucide-react';

// Layout Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionTitle from '../components/SectionTitle';
import Reviews from '../components/Reviews';

// Room Detail Components
import ImageGallery from '../components/ImageGallery';
import Amenities from '../components/Amenities';
import BookingCard from '../components/BookingCard';
import RoomFeatures from '../components/RoomFeatures';
import HouseRules from '../components/HouseRules';
import SimilarRooms from '../components/SimilarRooms';

// Data
import data from '../data/mockData.json';

const RoomDetail = () => {
  const { id } = useParams();
  
  // Lấy data trực tiếp, không cần loading
  const room = data.rooms.find(r => r.id === parseInt(id));

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Room not found</h2>
            <Link to="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock data cho demo
  const images = [room.image];
  const amenities = [
    'Free WiFi', 'Parking', 'Breakfast', 'Air Conditioning',
    'TV', 'Family Rooms', 'Room Service', 'Safe'
  ];
  const roomReviews = data.reviews;
  const allRooms = data.rooms;

  return (
    <>
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-500 hover:text-blue-600">Home</Link>
            <span className="text-slate-400">/</span>
            <Link to="/rooms" className="text-slate-500 hover:text-blue-600">Rooms</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900">{room.name}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Info */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{room.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{room.rating}</span>
                  <span className="text-slate-500">({room.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  {room.city}, {room.country}
                </div>
              </div>
            </div>
            <button className="p-2 border rounded-lg hover:bg-slate-50 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={images} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <SectionTitle title="About this place" />
              <p className="text-slate-600 leading-relaxed">
                Experience luxury and comfort in our beautifully appointed room with stunning views. 
                This spacious accommodation features modern amenities and elegant decor, perfect for 
                both business and leisure travelers. Enjoy the serene atmosphere and exceptional service 
                that makes your stay truly memorable.
              </p>
            </div>

            {/* Room Features */}
            <RoomFeatures />

            {/* Amenities */}
            <Amenities amenities={amenities} />

            {/* House Rules */}
            <HouseRules />

            {/* Reviews Section */}
            <Reviews reviews={roomReviews} />
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard room={room} />
          </div>
        </div>

        {/* Similar Rooms */}
        <SimilarRooms 
          rooms={allRooms} 
          currentRoomId={room.id} 
          currentCity={room.city}
        />
      </main>

      <Footer />
    </>
  );
};

export default RoomDetail;