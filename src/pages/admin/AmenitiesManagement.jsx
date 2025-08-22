import { useState } from "react";
import { 
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';

const AmenitiesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const amenitiesList = [
    { id: 1, name: 'Wifi miễn phí', icon: '📶', category: 'Công nghệ', description: 'Internet tốc độ cao miễn phí' },
    { id: 2, name: 'Bãi đậu xe', icon: '🚗', category: 'Tiện ích', description: 'Chỗ đậu xe an toàn, có bảo vệ' },
    { id: 3, name: 'Bữa sáng', icon: '🍳', category: 'Ăn uống', description: 'Buffet sáng đa dạng món Á - Âu' },
    { id: 4, name: 'Hồ bơi', icon: '🏊', category: 'Giải trí', description: 'Hồ bơi ngoài trời với view đẹp' },
    { id: 5, name: 'Gym', icon: '💪', category: 'Thể thao', description: 'Phòng tập gym hiện đại 24/7' },
    { id: 6, name: 'Spa', icon: '💆', category: 'Thư giãn', description: 'Dịch vụ spa và massage chuyên nghiệp' },
    { id: 7, name: 'Nhà hàng', icon: '🍽️', category: 'Ăn uống', description: 'Nhà hàng cao cấp phục vụ 24/7' },
    { id: 8, name: 'Bar', icon: '🍸', category: 'Ăn uống', description: 'Bar với không gian sang trọng' },
  ];

  // Mock data cho room types để tính usage
  const roomTypes = [
    { id: 1, name: 'Deluxe Ocean View', amenities: [1, 2, 3, 4] },
    { id: 2, name: 'Standard Room', amenities: [1, 2, 3] },
    { id: 3, name: 'Suite Premium', amenities: [1, 2, 3, 4, 5, 6, 7, 8] },
  ];

  const filteredAmenities = amenitiesList.filter(amenity =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAddModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Thêm tiện ích mới</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên tiện ích</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Wifi miễn phí"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="📶"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chọn danh mục</option>
                <option value="Công nghệ">Công nghệ</option>
                <option value="Tiện ích">Tiện ích</option>
                <option value="Ăn uống">Ăn uống</option>
                <option value="Giải trí">Giải trí</option>
                <option value="Thể thao">Thể thao</option>
                <option value="Thư giãn">Thư giãn</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả chi tiết về tiện ích..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm tiện ích
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý tiện ích</h1>
        <p className="text-gray-600">
          Quản lý các tiện ích của khách sạn - Để khi thêm phòng thì có thể chọn cho nhanh + dùng đồ lọc
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách tiện ích</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm tiện ích
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm tiện ích hoặc danh mục..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAmenities.map((amenity) => {
              const usageCount = roomTypes.reduce((count, room) => 
                count + (room.amenities.includes(amenity.id) ? 1 : 0), 0
              );
              
              return (
                <div key={amenity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{amenity.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-800">{amenity.name}</h3>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {amenity.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{amenity.description}</p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Được sử dụng trong:</span>
                    <span className="font-medium text-blue-600">{usageCount} loại phòng</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {renderAddModal()}
      </div>

      {/* Usage Statistics */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Thống kê sử dụng tiện ích</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {amenitiesList.map((amenity) => {
              const usageCount = roomTypes.reduce((count, room) => 
                count + (room.amenities.includes(amenity.id) ? 1 : 0), 0
              );
              const usagePercentage = Math.round((usageCount / roomTypes.length) * 100);
              
              return (
                <div key={amenity.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{amenity.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{usageCount}</span>
                  </div>
                  <div className="mb-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {usagePercentage}% loại phòng sử dụng
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesManagement;
