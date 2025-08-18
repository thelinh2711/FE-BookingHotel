import { useState } from "react";
import { 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';

const RoomsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [roomFilter, setRoomFilter] = useState('all');

  // Mock data
  const amenitiesList = [
    { id: 1, name: 'Wifi miễn phí', icon: '📶' },
    { id: 2, name: 'Bãi đậu xe', icon: '🚗' },
    { id: 3, name: 'Bữa sáng', icon: '🍳' },
    { id: 4, name: 'Hồ bơi', icon: '🏊' },
    { id: 5, name: 'Gym', icon: '💪' },
    { id: 6, name: 'Spa', icon: '💆' },
    { id: 7, name: 'Nhà hàng', icon: '🍽️' },
    { id: 8, name: 'Bar', icon: '🍸' },
  ];

  const roomTypes = [
    { 
      id: 1, 
      name: 'Deluxe Ocean View', 
      price: 2500000, 
      available: 5, 
      total: 10,
      amenities: [1, 2, 3, 4]
    },
    { 
      id: 2, 
      name: 'Standard Room', 
      price: 1500000, 
      available: 8, 
      total: 15,
      amenities: [1, 2, 3]
    },
    { 
      id: 3, 
      name: 'Suite Premium', 
      price: 4000000, 
      available: 2, 
      total: 5,
      amenities: [1, 2, 3, 4, 5, 6, 7, 8]
    },
  ];

  const renderAddRoomModal = () => {
    if (!showAddRoomModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Thêm loại phòng mới</h3>
            <button 
              onClick={() => setShowAddRoomModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên phòng</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Deluxe Ocean View"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá/đêm (VNĐ)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2500000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số phòng có sẵn</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tổng số phòng</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn tiện ích (chọn nhanh)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {amenitiesList.map((amenity) => (
                  <label key={amenity.id} className="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAmenities([...selectedAmenities, amenity.id]);
                        } else {
                          setSelectedAmenities(selectedAmenities.filter(id => id !== amenity.id));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{amenity.icon} {amenity.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddRoomModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm phòng
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredRooms = roomTypes.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (roomFilter === 'available') return matchesSearch && room.available > 0;
    if (roomFilter === 'full') return matchesSearch && room.available === 0;
    return matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý phòng</h1>
        <p className="text-gray-600">Quản lý các loại phòng và tiện ích</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách các loại phòng</h2>
            <button 
              onClick={() => setShowAddRoomModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm loại phòng
            </button>
          </div>

          {/* Bộ lọc */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên phòng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả phòng</option>
              <option value="available">Còn phòng trống</option>
              <option value="full">Hết phòng</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá/đêm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng trống</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiện ích</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{room.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {room.price.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      room.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {room.available}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{room.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map(amenityId => {
                        const amenity = amenitiesList.find(a => a.id === amenityId);
                        return amenity ? (
                          <span key={amenityId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {amenity.icon}
                          </span>
                        ) : null;
                      })}
                      {room.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">+{room.amenities.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {renderAddRoomModal()}
      </div>
    </div>
  );
};

export default RoomsManagement;
