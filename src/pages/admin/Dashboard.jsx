import { 
  BarChart3, 
  Calendar, 
  Bed, 
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Dashboard = () => {
  const stats = {
    totalRevenue: 125000000,
    monthlyRevenue: 25000000,
    totalBookings: 156,
    occupancyRate: 75,
    newCustomers: 23,
    avgBookingValue: 3200000
  };

  const recentBookings = [
    { id: 1, guest: 'Nguyễn Văn A', room: 'Deluxe Ocean View', date: '2024-08-15', status: 'confirmed' },
    { id: 2, guest: 'Trần Thị B', room: 'Standard Room', date: '2024-08-16', status: 'pending' },
    { id: 3, guest: 'Lê Văn C', room: 'Suite Premium', date: '2024-08-17', status: 'confirmed' },
  ];

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.totalRevenue.toLocaleString('vi-VN')}₫
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12.5%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Doanh thu tháng</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.monthlyRevenue.toLocaleString('vi-VN')}₫
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8.2%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng đặt phòng</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+15.3%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Bed className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tỷ lệ lấp đầy</p>
            <p className="text-2xl font-bold text-gray-800">{stats.occupancyRate}%</p>
            <div className="flex items-center mt-2">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500">-2.1%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Khách hàng mới</p>
            <p className="text-2xl font-bold text-gray-800">{stats.newCustomers}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+5.7%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Giá trị TB/đơn</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.avgBookingValue.toLocaleString('vi-VN')}₫
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+3.4%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-pink-600" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Tổng quan</h1>
        <p className="text-gray-600">Theo dõi hiệu suất và hoạt động của khách sạn</p>
      </div>

      {renderStatsCards()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Đặt phòng gần đây</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Thao tác nhanh</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-600">Thêm phòng mới</p>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-600">Xem đặt phòng</p>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-600">Quản lý khách</p>
              </button>
              <button className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <BarChart3 className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-600">Xem báo cáo</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
