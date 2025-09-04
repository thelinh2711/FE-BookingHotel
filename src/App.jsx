// src/App.jsx - Updated with payment routes
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About';
import Register from "./pages/Register";
import Login from "./pages/Login";
import RoomDetail from './pages/RoomDetail';
import Booking from './pages/Booking';
import Cart from './pages/Cart';
import GoogleCallback from './components/GoogleCallback';

import PaymentConfirmation from './pages/PaymentConfirmation';
import PaymentSuccess from './pages/PaymentSuccess';
import MyOrders from './pages/MyOrders';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import HotelsManagement from './pages/admin/HotelsManagement';
import RoomsManagement from './pages/admin/RoomsManagement';
import BookingsManagement from './pages/admin/BookingsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import ReportsManagement from './pages/admin/ReportsManagement';
import AmenitiesManagement from './pages/admin/AmenitiesManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/rooms/:id" element={<RoomDetail />} />
      
      {/* Booking & Payment Routes */}
      <Route path="/booking" element={<Booking />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/booking/confirm" element={<PaymentConfirmation />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      
      <Route path="/orders" element={<MyOrders />} />
    
      {/* Admin Routes - Protected */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="hotels" element={<HotelsManagement />} />
        <Route path="rooms" element={<RoomsManagement />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="amenities" element={<AmenitiesManagement />} />
      </Route>
    </Routes>
  )
}

export default App