import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  AlertCircle,
  Loader2,
  Shield,
  User,
  Calendar,
  Mail
} from 'lucide-react';
import userApi from '../../api/userApi';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    roles: [{ name: 'USER', description: 'Regular user' }]
  });

  // Load users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers();
      setUsers(response || []);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);

      // Fallback to mock data for development/testing
      const mockUsers = [
        {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: "admin@gmail.com",
          phoneNo: "0123456789",
          roles: [{ name: "ADMIN", description: "Administrator role" }]
        },
        {
          id: 2,
          firstName: "Nguyễn",
          lastName: "Văn A",
          email: "nguyenvana@gmail.com",
          phoneNo: "0987654321",
          roles: [{ name: "USER", description: "Regular user" }]
        },
        {
          id: 3,
          firstName: "Trần",
          lastName: "Thị B",
          email: "tranthib@gmail.com",
          phoneNo: "0555666777",
          roles: [{ name: "USER", description: "Regular user" }]
        }
      ];

      setUsers(mockUsers);
      setError('Đang sử dụng dữ liệu mẫu. Vui lòng kiểm tra kết nối API.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingUser) {
        // For demo purposes, update local state
        const updatedUsers = users.map(user =>
          user.id === editingUser.id
            ? { ...user, ...formData, id: editingUser.id }
            : user
        );
        setUsers(updatedUsers);

        // Uncomment when API is ready
        // await userApi.updateUser(editingUser.id, formData);
      } else {
        // For demo purposes, add to local state
        const newUser = {
          ...formData,
          id: Math.max(...users.map(u => u.id), 0) + 1
        };
        setUsers([...users, newUser]);

        // Uncomment when API is ready
        // await userApi.createUser(formData);
      }

      resetForm();
      setShowAddModal(false);
      setShowEditModal(false);
      setError('');
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Không thể lưu thông tin người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.firstName} ${user.lastName}"?`)) {
      try {
        // For demo purposes, remove from local state
        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);

        // Uncomment when API is ready
        // await userApi.deleteUser(user.id);
        // await fetchUsers();

        setError('');
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Không thể xóa người dùng. Vui lòng thử lại.');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNo: user.phoneNo || '',
      roles: user.roles || [{ name: 'USER', description: 'Regular user' }]
    });
    setShowEditModal(true);
  };

  const handleViewDetail = async (user) => {
    try {
      // For demo purposes, use the user data directly
      setSelectedUser(user);
      setShowDetailModal(true);

      // Uncomment when API is ready
      // const detailData = await userApi.getUserDetail(user.id);
      // setSelectedUser(detailData);
      // setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching user detail:', err);
      setError('Không thể tải chi tiết người dùng.');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      roles: [{ name: 'USER', description: 'Regular user' }]
    });
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (roleFilter === 'all') return matchesSearch;

    const userRole = user.roles && user.roles.length > 0 ? user.roles[0].name : 'USER';
    return matchesSearch && userRole.toLowerCase() === roleFilter.toLowerCase();
  });

  const getRoleBadge = (roles) => {
    if (!roles || roles.length === 0) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
          Không xác định
        </span>
      );
    }

    const role = roles[0].name;
    return role === 'ADMIN' ? (
      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center">
        <Shield className="w-3 h-3 mr-1" />
        Quản trị viên
      </span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
        <User className="w-3 h-3 mr-1" />
        Người dùng
      </span>
    );
  };

  const getStatusBadge = (user) => {
    // Có thể dựa vào thời gian đăng nhập gần nhất hoặc trạng thái khác
    const isActive = true; // Tạm thời mặc định là active
    return isActive ? (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
        Hoạt động
      </span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
        Không hoạt động
      </span>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải danh sách người dùng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý người dùng</h1>
        <p className="text-gray-600">Quản lý thông tin người dùng và khách hàng</p>
      </div>

      {error && (
        <div className={`mb-6 p-4 rounded-lg ${
          error.includes('dữ liệu mẫu')
            ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
            <button
              onClick={() => setError('')}
              className={`ml-auto hover:opacity-70 ${
                error.includes('dữ liệu mẫu') ? 'text-yellow-500' : 'text-red-500'
              }`}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Người dùng thường</p>
              <p className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.roles && u.roles[0]?.name === 'USER').length}
              </p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quản trị viên</p>
              <p className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.roles && u.roles[0]?.name === 'ADMIN').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Có email</p>
              <p className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.email && u.email.trim() !== '').length}
              </p>
            </div>
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách người dùng ({users.length})
            </h2>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm người dùng
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng</option>
            </select>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
              title="Làm mới dữ liệu"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '🔄'}
              Làm mới
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Không tìm thấy người dùng nào phù hợp' : 'Chưa có người dùng nào'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Chưa có tên'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email || 'Chưa có email'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {user.phoneNo || 'Chưa có SĐT'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.roles)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetail(user)}
                          className="text-green-600 hover:text-green-800"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
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

        {renderUserModal()}
        {renderDetailModal()}
      </div>
    </div>
  );

  // Modal form thêm/sửa người dùng
  function renderUserModal() {
    const isEdit = showEditModal;
    const isShow = showAddModal || showEditModal;

    if (!isShow) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </h3>
            <button
              onClick={() => {
                setShowAddModal(false);
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Nguyễn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Văn A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={formData.phoneNo}
                onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <select
                value={formData.roles[0]?.name || 'USER'}
                onChange={(e) => setFormData({
                  ...formData,
                  roles: [{
                    name: e.target.value,
                    description: e.target.value === 'ADMIN' ? 'Administrator role' : 'Regular user'
                  }]
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USER">Người dùng</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
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
                {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm người dùng')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Modal xem chi tiết người dùng
  function renderDetailModal() {
    if (!showDetailModal || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Chi tiết người dùng</h3>
            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedUser(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 text-blue-500 mr-2" />
                  Thông tin cá nhân
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <p className="text-gray-800">#{selectedUser.id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Họ tên:</span>
                    <p className="text-gray-800">
                      {`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'Chưa có tên'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-gray-800">{selectedUser.email || 'Chưa có email'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Số điện thoại:</span>
                    <p className="text-gray-800">{selectedUser.phoneNo || 'Chưa có số điện thoại'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-purple-500 mr-2" />
                  Quyền hạn & Vai trò
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Vai trò:</span>
                    <div className="mt-1">
                      {getRoleBadge(selectedUser.roles)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Mô tả vai trò:</span>
                    <p className="text-gray-800">
                      {selectedUser.roles && selectedUser.roles[0]?.description || 'Không có mô tả'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                    <div className="mt-1">
                      {getStatusBadge(selectedUser)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedUser);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
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

export default UsersManagement;
