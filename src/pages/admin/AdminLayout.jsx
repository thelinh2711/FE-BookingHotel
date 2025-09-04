import { useState, useContext } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Bed,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Home,
  LogOut,
  User,
  Building2
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Tổng quan', 
      path: '/admin', 
      icon: Home, 
      color: 'bg-blue-500',
      description: 'Thống kê tổng quan hệ thống'
    },
    {
      id: 'hotels',
      label: 'Quản lý khách sạn',
      path: '/admin/hotels',
      icon: Building2,
      color: 'bg-purple-500',
      description: ['Danh sách khách sạn', 'Thêm sửa xóa khách sạn']
    },
    {
      id: 'rooms',
      label: 'Quản lý phòng',
      path: '/admin/rooms',
      icon: Bed,
      color: 'bg-green-500',
      description: ['Danh sách các loại phòng', 'Thêm sửa xóa phòng']
    },
    { 
      id: 'bookings', 
      label: 'Quản lý đặt phòng', 
      path: '/admin/bookings', 
      icon: Calendar, 
      color: 'bg-yellow-500',
      description: 'Danh sách đơn đặt phòng, hiển thị trạng thái'
    },
    { 
      id: 'users', 
      label: 'Quản lý khách hàng', 
      path: '/admin/users', 
      icon: Users, 
      color: 'bg-cyan-500',
      description: 'Danh sách người dùng'
    },
    { 
      id: 'reports', 
      label: 'Báo cáo thống kê', 
      path: '/admin/reports', 
      icon: BarChart3, 
      color: 'bg-red-500',
      description: 'Thống kê doanh thu theo tháng quý năm'
    },
    { 
      id: 'amenities', 
      label: 'Quản lý tiện ích', 
      path: '/admin/amenities', 
      icon: Settings, 
      color: 'bg-green-400',
      description: ['Thêm sửa xóa', 'Để khi thêm phòng thì có thể chọn cho nhanh + dùng đồ lọc']
    },
  ];

  const renderSidebar = () => (
    <div className="w-80 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        {user && (
          <div className="mt-3 flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user.name || user.email}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        )}
      </div>

      <nav className="mt-6 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <div key={item.id} className="mb-2">
              <Link
                to={item.path}
                className={`w-full flex items-center px-6 py-4 text-left transition-colors ${
                  isActive ? 'bg-blue-50 border-r-4 border-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-full h-16 rounded-lg ${item.color} flex items-center justify-between px-4`}>
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 text-white mr-3" />
                    <span className="font-medium text-white text-sm">{item.label}</span>
                  </div>
                  <div className="text-white text-xs text-right">
                    {Array.isArray(item.description) ? (
                      <div>
                        {item.description.map((desc, index) => (
                          <div key={index}>{desc}</div>
                        ))}
                      </div>
                    ) : (
                      <div>{item.description}</div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-6 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSidebar()}
      
      <div className="ml-80">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
