import { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Bed,
  Users,
  TrendingUp,
  TrendingDown,
  Building2,
  Settings,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import userApi from '../../api/userApi';
import roomApi from '../../api/roomApi';
import hotelApi from '../../api/hotelApi';
import bookingApi from '../../api/bookingApi';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalHotels: 0,
    totalBookings: 0,
    adminUsers: 0,
    regularUsers: 0,
    availableRooms: 0,
    occupiedRooms: 0
  });
  const [recentData, setRecentData] = useState({
    users: [],
    rooms: [],
    hotels: [],
    bookings: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch data from all APIs
      const [usersResponse, roomsResponse, hotelsResponse] = await Promise.allSettled([
        userApi.getAllUsers(),
        roomApi.getAllRooms(),
        hotelApi.getAllHotels()
      ]);

      // Process users data
      const users = usersResponse.status === 'fulfilled' ? usersResponse.value || [] : [];
      const adminUsers = users.filter(u => u.roles && u.roles[0]?.name === 'ADMIN').length;
      const regularUsers = users.filter(u => u.roles && u.roles[0]?.name === 'USER').length;

      // Process rooms data
      const rooms = roomsResponse.status === 'fulfilled' ? roomsResponse.value || [] : [];
      const availableRooms = rooms.filter(r => r.quantity > 0).length;

      // Process hotels data
      const hotels = hotelsResponse.status === 'fulfilled' ? hotelsResponse.value || [] : [];

      // Mock bookings data (since API might not be ready)
      const mockBookings = [
        { id: 1, guest: 'Nguyễn Văn A', room: 'Deluxe Ocean View', date: '2024-12-15', status: 'confirmed' },
        { id: 2, guest: 'Trần Thị B', room: 'Standard Room', date: '2024-12-16', status: 'pending' },
        { id: 3, guest: 'Lê Văn C', room: 'Suite Premium', date: '2024-12-17', status: 'confirmed' },
        { id: 4, guest: 'Phạm Thị D', room: 'Family Room', date: '2024-12-18', status: 'pending' },
        { id: 5, guest: 'Hoàng Văn E', room: 'Executive Suite', date: '2024-12-19', status: 'confirmed' }
      ];

      setStats({
        totalUsers: users.length,
        totalRooms: rooms.length,
        totalHotels: hotels.length,
        totalBookings: mockBookings.length,
        adminUsers,
        regularUsers,
        availableRooms,
        occupiedRooms: Math.max(0, rooms.length - availableRooms)
      });

      setRecentData({
        users: users.slice(0, 5),
        rooms: rooms.slice(0, 5),
        hotels: hotels.slice(0, 5),
        bookings: mockBookings.slice(0, 5)
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard. Đang hiển thị dữ liệu mẫu.');

      // Fallback to mock data
      setStats({
        totalUsers: 15,
        totalRooms: 25,
        totalHotels: 3,
        totalBookings: 45,
        adminUsers: 2,
        regularUsers: 13,
        availableRooms: 18,
        occupiedRooms: 7
      });

      setRecentData({
        users: [
          { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@gmail.com' },
          { id: 2, firstName: 'Nguyễn', lastName: 'Văn A', email: 'nguyenvana@gmail.com' }
        ],
        rooms: [
          { id: 1, roomClassName: 'Deluxe Ocean View', price: 2500000 },
          { id: 2, roomClassName: 'Standard Room', price: 1500000 }
        ],
        hotels: [
          { id: 1, hotelName: 'Green Bamboo Hotel', location: 'Da Lat' },
          { id: 2, hotelName: 'Ocean View Resort', location: 'Nha Trang' }
        ],
        bookings: [
          { id: 1, guest: 'Nguyễn Văn A', room: 'Deluxe Ocean View', date: '2024-12-15', status: 'confirmed' },
          { id: 2, guest: 'Trần Thị B', room: 'Standard Room', date: '2024-12-16', status: 'pending' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng người dùng</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-500">
                Admin: {stats.adminUsers} | User: {stats.regularUsers}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Hotels */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng khách sạn</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalHotels}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">Đang hoạt động</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Total Rooms */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng loại phòng</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalRooms}</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-500">
                Có sẵn: {stats.availableRooms}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Bed className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Total Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng đặt phòng</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">Tháng này</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Tổng quan</h1>
            <p className="text-gray-600">Theo dõi hiệu suất và hoạt động của hệ thống</p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
            <button
              onClick={() => setError('')}
              className="ml-auto text-yellow-500 hover:text-yellow-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {renderStatsCards()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Đặt phòng gần đây</h2>
              <Link
                to="/admin/bookings"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                Xem tất cả
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentData.bookings.length > 0 ? (
                recentData.bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{booking.guest}</p>
                      <p className="text-sm text-gray-600">{booking.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{booking.date}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có đặt phòng nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Data Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Dữ liệu gần đây</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Recent Users */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    Người dùng mới
                  </h3>
                  <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm">
                    Xem tất cả
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentData.users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm text-gray-700">
                        {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Chưa có tên'}
                      </span>
                      <span className="text-xs text-gray-500">#{user.id}</span>
                    </div>
                  ))}
                  {recentData.users.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">Chưa có người dùng</p>
                  )}
                </div>
              </div>

              {/* Recent Hotels */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-purple-500" />
                    Khách sạn
                  </h3>
                  <Link to="/admin/hotels" className="text-blue-600 hover:text-blue-800 text-sm">
                    Xem tất cả
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentData.hotels.slice(0, 3).map((hotel) => (
                    <div key={hotel.id} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span className="text-sm text-gray-700">{hotel.hotelName}</span>
                      <span className="text-xs text-gray-500">{hotel.location}</span>
                    </div>
                  ))}
                  {recentData.hotels.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">Chưa có khách sạn</p>
                  )}
                </div>
              </div>

              {/* Recent Rooms */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <Bed className="w-4 h-4 mr-2 text-green-500" />
                    Loại phòng
                  </h3>
                  <Link to="/admin/rooms" className="text-blue-600 hover:text-blue-800 text-sm">
                    Xem tất cả
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentData.rooms.slice(0, 3).map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">{room.roomClassName}</span>
                      <span className="text-xs text-gray-500">
                        {room.price ? `${room.price.toLocaleString('vi-VN')}₫` : 'N/A'}
                      </span>
                    </div>
                  ))}
                  {recentData.rooms.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">Chưa có loại phòng</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Thao tác nhanh</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/hotels"
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
            >
              <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-600">Quản lý khách sạn</p>
            </Link>
            <Link
              to="/admin/rooms"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <Bed className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">Quản lý phòng</p>
            </Link>
            <Link
              to="/admin/users"
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">Quản lý người dùng</p>
            </Link>
            <Link
              to="/admin/amenities"
              className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center"
            >
              <Settings className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-600">Quản lý tiện ích</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
