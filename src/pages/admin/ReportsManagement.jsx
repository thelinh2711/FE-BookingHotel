import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const ReportsManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const monthlyData = [
    { month: 'Tháng 1', revenue: 45000000, bookings: 32, occupancy: 68 },
    { month: 'Tháng 2', revenue: 52000000, bookings: 38, occupancy: 72 },
    { month: 'Tháng 3', revenue: 48000000, bookings: 35, occupancy: 70 },
    { month: 'Tháng 4', revenue: 55000000, bookings: 42, occupancy: 78 },
    { month: 'Tháng 5', revenue: 62000000, bookings: 48, occupancy: 82 },
    { month: 'Tháng 6', revenue: 58000000, bookings: 45, occupancy: 80 },
  ];

  const quarterlyData = [
    { quarter: 'Quý 1/2024', revenue: 145000000, bookings: 105, occupancy: 70 },
    { quarter: 'Quý 2/2024', revenue: 175000000, bookings: 135, occupancy: 80 },
    { quarter: 'Quý 3/2024', revenue: 165000000, bookings: 125, occupancy: 75 },
  ];

  const roomPerformance = [
    { name: 'Deluxe Ocean View', bookings: 45, revenue: 112500000, occupancy: 85 },
    { name: 'Suite Premium', bookings: 28, revenue: 112000000, occupancy: 70 },
    { name: 'Standard Room', bookings: 62, revenue: 93000000, occupancy: 78 },
  ];

  const currentData = selectedPeriod === 'month' ? monthlyData : quarterlyData;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Báo cáo thống kê</h1>
        <p className="text-gray-600">Thống kê doanh thu và hiệu suất kinh doanh</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Theo tháng</option>
            <option value="quarter">Theo quý</option>
          </select>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Xuất báo cáo
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-800">
                {currentData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('vi-VN')}₫
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+12.5%</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng đặt phòng</p>
              <p className="text-2xl font-bold text-gray-800">
                {currentData.reduce((sum, item) => sum + item.bookings, 0)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+8.3%</span>
              </div>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tỷ lệ lấp đầy TB</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(currentData.reduce((sum, item) => sum + item.occupancy, 0) / currentData.length)}%
              </p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">-2.1%</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Doanh thu TB/{selectedPeriod === 'month' ? 'tháng' : 'quý'}</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(currentData.reduce((sum, item) => sum + item.revenue, 0) / currentData.length).toLocaleString('vi-VN')}₫
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+5.7%</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Biểu đồ doanh thu theo {selectedPeriod === 'month' ? 'tháng' : 'quý'}
            </h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
            </div>
            <div className="space-y-2">
              {currentData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {selectedPeriod === 'month' ? item.month : item.quarter}
                  </span>
                  <span className="font-medium text-gray-900">
                    {item.revenue.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Performance */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Hiệu suất theo loại phòng</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {roomPerformance.map((room, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{room.name}</h3>
                    <span className="text-sm text-gray-600">{room.occupancy}% lấp đầy</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Số lượt đặt</p>
                      <p className="font-medium">{room.bookings} lần</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Doanh thu</p>
                      <p className="font-medium">{room.revenue.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${room.occupancy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết theo {selectedPeriod === 'month' ? 'tháng' : 'quý'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {selectedPeriod === 'month' ? 'Tháng' : 'Quý'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số đặt phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tỷ lệ lấp đầy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doanh thu TB/đơn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {selectedPeriod === 'month' ? item.month : item.quarter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {item.revenue.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {item.bookings} lần
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.occupancy >= 80 ? 'bg-green-100 text-green-800' :
                      item.occupancy >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.occupancy}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {Math.round(item.revenue / item.bookings).toLocaleString('vi-VN')}₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;
