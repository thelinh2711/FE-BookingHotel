import { useState } from 'react';
import { Heart } from 'lucide-react';

const ImageGallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Mock multiple images nếu chỉ có 1 ảnh
  const galleryImages = images.length > 1 ? images : [
    images[0],
    images[0], // duplicate để demo
    images[0],
    images[0],
    images[0]
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px]">
      {/* Main Image */}
      <div className="relative h-full">
        <img 
          src={galleryImages[selectedIndex]} 
          alt="Room main view"
          className="w-full h-full object-cover rounded-lg"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 gap-2 h-full">
        {galleryImages.slice(1, 5).map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx + 1)}
            className={`relative overflow-hidden rounded-lg ${
              idx + 1 === selectedIndex ? 'ring-2 ring-blue-600' : ''
            }`}
          >
            <img 
              src={img} 
              alt={`Room view ${idx + 2}`}
              className="w-full h-full object-cover hover:scale-105 transition"
            />
            {idx === 3 && galleryImages.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                +{galleryImages.length - 5} more
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;