import { useState } from "react";
import { 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const BookingsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const bookings = [
    { 
      id: 1, 
      guestName: 'Nguyễn Văn A', 
      room: 'Deluxe Ocean View', 
      checkIn: '2024-08-15', 
      checkOut: '2024-08-18',
      status: 'confirmed',
      total: 7500000,
      phone: '0901234567',
      email: 'nguyenvana@email.com'
    },
    { 
      id: 2, 
      guestName: 'Trần Thị B', 
      room: 'Standard Room', 
      checkIn: '2024-08-16', 
      checkOut: '2024-08-19',
      status: 'pending',
      total: 4500000,
      phone: '0907654321',
      email: 'tranthib@email.com'
    },
    { 
      id: 3, 
      guestName: 'Lê Văn C', 
      room: 'Suite Premium', 
      checkIn: '2024-08-17', 
      checkOut: '2024-08-20',
      status: 'cancelled',
      total: 12000000,
      phone: '0909876543',
      email: 'levanc@email.com'
    },
    { 
      id: 4, 
      guestName: 'Phạm Thị D', 
      room: 'Deluxe Ocean View', 
      checkIn: '2024-08-18', 
      checkOut: '2024-08-21',
      status: 'confirmed',
      total: 7500000,
      phone: '0912345678',
      email: 'phamthid@email.com'
    },
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.room.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && booking.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã xác nhận' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleExportExcel = () => {
    // Logic xuất Excel
    console.log('Xuất Excel');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý đặt phòng</h1>
        <p className="text-gray-600">Theo dõi và quản lý tất cả đơn đặt phòng</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách đơn đặt phòng</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleExportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Xuất Excel
              </button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khách hàng hoặc loại phòng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đặt phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhận phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trả phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    #BK{booking.id.toString().padStart(6, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{booking.guestName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    <div className="text-sm">
                      <div>{booking.phone}</div>
                      <div className="text-gray-500">{booking.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{booking.room}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(booking.checkIn).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(booking.checkOut).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {booking.total.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Xem chi tiết">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Hủy đặt phòng">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-600">Đã xác nhận</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Chờ xác nhận</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status === 'cancelled').length}
              </p>
              <p className="text-sm text-gray-600">Đã hủy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {bookings.reduce((sum, b) => b.status === 'confirmed' ? sum + b.total : sum, 0).toLocaleString('vi-VN')}₫
              </p>
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;
