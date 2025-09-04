import { useState, useEffect } from "react";
import { 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  AlertCircle,
  MapPin,
  Star
} from 'lucide-react';
import hotelApi from '../../api/hotelApi';

const HotelsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [hotelFilter, setHotelFilter] = useState('all');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingHotel, setEditingHotel] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [formData, setFormData] = useState({
    hotelName: '',
    location: '',
    description: '',
    imageUrl: ''
  });

  // Load data from API
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelApi.getAllHotels();
      setHotels(response || []);
      setError('');
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Không thể tải danh sách khách sạn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingHotel) {
        await hotelApi.updateHotel(editingHotel.id, formData);
      } else {
        await hotelApi.createHotel(formData);
      }
      
      await fetchHotels();
      resetForm();
      setShowAddHotelModal(false);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error saving hotel:', err);
      setError('Không thể lưu thông tin khách sạn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotel) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách sạn "${hotel.hotelName}"?`)) {
      try {
        await hotelApi.deleteHotel(hotel.id);
        await fetchHotels();
      } catch (err) {
        console.error('Error deleting hotel:', err);
        setError('Không thể xóa khách sạn. Vui lòng thử lại.');
      }
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      hotelName: hotel.hotelName || '',
      location: hotel.location || '',
      description: hotel.description || '',
      imageUrl: hotel.imageUrl || ''
    });
    setShowEditModal(true);
  };

  const handleViewDetail = async (hotel) => {
    try {
      const detailData = await hotelApi.getHotelDetail(hotel.id);
      setSelectedHotel(detailData);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching hotel detail:', err);
      setError('Không thể tải chi tiết khách sạn.');
    }
  };

  const resetForm = () => {
    setFormData({
      hotelName: '',
      location: '',
      description: '',
      imageUrl: ''
    });
    setEditingHotel(null);
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading && hotels.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách khách sạn...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý khách sạn</h1>
        <p className="text-gray-600">Quản lý thông tin khách sạn và địa điểm</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách khách sạn ({hotels.length})
            </h2>
            <button 
              onClick={() => {
                resetForm();
                setShowAddHotelModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm khách sạn
            </button>
          </div>

          {/* Bộ lọc */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khách sạn hoặc địa điểm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchHotels}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              title="Làm mới"
            >
              🔄
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên khách sạn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa điểm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHotels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Không tìm thấy khách sạn nào phù hợp' : 'Chưa có khách sạn nào'}
                  </td>
                </tr>
              ) : (
                filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                        {hotel.hotelName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {hotel.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-600 truncate" title={hotel.description}>
                        {hotel.description || 'Chưa có mô tả'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hotel.imageUrl ? (
                        <img 
                          src={hotel.imageUrl} 
                          alt={hotel.hotelName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetail(hotel)}
                          className="text-green-600 hover:text-green-800"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(hotel)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(hotel)}
                          className="text-red-600 hover:text-red-800"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {renderHotelModal()}
        {renderDetailModal()}
      </div>
    </div>
  );

  // Modal form thêm/sửa khách sạn
  function renderHotelModal() {
    const isEdit = showEditModal;
    const isShow = showAddHotelModal || showEditModal;

    if (!isShow) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEdit ? 'Chỉnh sửa khách sạn' : 'Thêm khách sạn mới'}
            </h3>
            <button
              onClick={() => {
                setShowAddHotelModal(false);
                setShowEditModal(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên khách sạn *</label>
              <input
                type="text"
                required
                value={formData.hotelName}
                onChange={(e) => setFormData({...formData, hotelName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Green Bamboo Hotel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 21 Nguyen Chi Thanh, Da Lat City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả chi tiết về khách sạn..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL hình ảnh</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/hotel-image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-32 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddHotelModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm khách sạn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Modal xem chi tiết khách sạn
  function renderDetailModal() {
    if (!showDetailModal || !selectedHotel) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Chi tiết khách sạn</h3>
            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedHotel(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {selectedHotel.imageUrl && (
              <div>
                <img
                  src={selectedHotel.imageUrl}
                  alt={selectedHotel.hotelName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  {selectedHotel.hotelName}
                </h4>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                  {selectedHotel.location}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Thông tin cơ bản</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">ID:</span> {selectedHotel.id}</p>
                  <p><span className="font-medium">Ngày tạo:</span> {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>

            {selectedHotel.description && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Mô tả</h5>
                <p className="text-gray-600 leading-relaxed">{selectedHotel.description}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedHotel);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedHotel(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default HotelsManagement;
