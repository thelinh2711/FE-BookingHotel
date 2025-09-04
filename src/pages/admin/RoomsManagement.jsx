import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';
import roomApi from '../../api/roomApi';

const RoomsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [roomFilter, setRoomFilter] = useState('all');
  const [roomClasses, setRoomClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomClassName: '',
    quantity: '',
    priceOriginal: '',
    description: '',
    discountPercent: '',
    capacity: '',
    hotelId: '',
    serviceIds: [],
    images: []
  });

  // Load data from API
  useEffect(() => {
    fetchRoomClasses();
  }, []);

  const fetchRoomClasses = async () => {
    try {
      setLoading(true);
      const response = await roomApi.getAllRoomClasses();
      setRoomClasses(response || []);
      setError('');
    } catch (err) {
      console.error('Error fetching room classes:', err);
      setError('Không thể tải danh sách phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const submitData = {
        ...formData,
        priceOriginal: parseInt(formData.priceOriginal),
        quantity: parseInt(formData.quantity),
        discountPercent: parseInt(formData.discountPercent) || 0,
        capacity: parseInt(formData.capacity),
        hotelId: parseInt(formData.hotelId) || 1, // Default hotel ID
        serviceIds: selectedAmenities
      };

      if (editingRoom) {
        await roomApi.updateRoomClass(editingRoom.id, submitData);
      } else {
        await roomApi.createRoomClass(submitData);
      }

      await fetchRoomClasses();
      resetForm();
      setShowAddRoomModal(false);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error saving room class:', err);
      setError('Không thể lưu thông tin phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomClass) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa loại phòng "${roomClass.roomClassName}"?`)) {
      try {
        await roomApi.deleteRoomClass(roomClass.id);
        await fetchRoomClasses();
      } catch (err) {
        console.error('Error deleting room class:', err);
        setError('Không thể xóa loại phòng. Vui lòng thử lại.');
      }
    }
  };

  const handleEdit = (roomClass) => {
    setEditingRoom(roomClass);
    setFormData({
      roomClassName: roomClass.roomClassName || '',
      quantity: roomClass.quantity || '',
      priceOriginal: roomClass.priceOriginal || '',
      description: roomClass.description || '',
      discountPercent: roomClass.discountPercent || '',
      capacity: roomClass.capacity || '',
      hotelId: roomClass.hotelId || '',
      serviceIds: roomClass.serviceIds || [],
      images: roomClass.images || []
    });
    setSelectedAmenities(roomClass.serviceIds || []);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      roomClassName: '',
      quantity: '',
      priceOriginal: '',
      description: '',
      discountPercent: '',
      capacity: '',
      hotelId: '',
      serviceIds: [],
      images: []
    });
    setSelectedAmenities([]);
    setEditingRoom(null);
  };

  const renderRoomModal = () => {
    const isEdit = showEditModal;
    const isShow = showAddRoomModal || showEditModal;

    if (!isShow) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEdit ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
            </h3>
            <button
              onClick={() => {
                setShowAddRoomModal(false);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại phòng *</label>
                <input
                  type="text"
                  required
                  value={formData.roomClassName}
                  onChange={(e) => setFormData({...formData, roomClassName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Deluxe Ocean View"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá gốc/đêm (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={formData.priceOriginal}
                  onChange={(e) => setFormData({...formData, priceOriginal: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2500000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng phòng *</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sức chứa (người) *</label>
                <input
                  type="number"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({...formData, discountPercent: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel ID</label>
                <input
                  type="number"
                  value={formData.hotelId}
                  onChange={(e) => setFormData({...formData, hotelId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả chi tiết về loại phòng..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddRoomModal(false);
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
                {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm phòng')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredRooms = roomClasses.filter(room => {
    const matchesSearch = room.roomClassName?.toLowerCase().includes(searchTerm.toLowerCase());
    if (roomFilter === 'available') return matchesSearch && room.quantity > 0;
    if (roomFilter === 'full') return matchesSearch && room.quantity === 0;
    return matchesSearch;
  });

  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent) return originalPrice;
    return originalPrice - (originalPrice * discountPercent / 100);
  };

  if (loading && roomClasses.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách phòng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý loại phòng</h1>
        <p className="text-gray-600">Quản lý các loại phòng và thông tin chi tiết</p>
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
              Danh sách loại phòng ({roomClasses.length})
            </h2>
            <button
              onClick={() => {
                resetForm();
                setShowAddRoomModal(true);
              }}
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
                placeholder="Tìm kiếm theo tên loại phòng..."
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
              <option value="all">Tất cả loại phòng</option>
              <option value="available">Còn phòng</option>
              <option value="full">Hết phòng</option>
            </select>
            <button
              onClick={fetchRoomClasses}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên loại phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá/đêm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sức chứa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Không tìm thấy loại phòng nào phù hợp' : 'Chưa có loại phòng nào'}
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {room.roomClassName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <div>
                        {room.discountPercent > 0 && (
                          <div className="text-xs text-gray-400 line-through">
                            {room.priceOriginal?.toLocaleString('vi-VN')}₫
                          </div>
                        )}
                        <div className={room.discountPercent > 0 ? 'text-red-600 font-medium' : ''}>
                          {calculateDiscountedPrice(room.priceOriginal, room.discountPercent)?.toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        room.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {room.quantity} phòng
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {room.capacity} người
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.discountPercent > 0 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          -{room.discountPercent}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-600 truncate" title={room.description}>
                        {room.description || 'Chưa có mô tả'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => console.log('View details:', room)}
                          className="text-green-600 hover:text-green-800"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(room)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(room)}
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

        {renderRoomModal()}
      </div>
    </div>
  );
};

export default RoomsManagement;
