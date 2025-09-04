// src/App.jsx
import { Routes, Route } from "react-router-dom"

// Public Pages
import Home from "./pages/Home"
import About from "./pages/About"
import Register from "./pages/Register"
import Login from "./pages/Login"
import RoomDetail from "./pages/RoomDetail"
import GoogleCallback from "./components/GoogleCallback"

// Booking & Payment
import Booking from "./pages/Booking"
import Cart from "./pages/Cart"

import PaymentPage from "./pages/PaymentPage"
import PaymentResult from "./pages/PaymentResult"
import MyOrders from "./pages/MyOrders"

// Admin
import AdminLayout from "./pages/admin/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import RoomsManagement from "./pages/admin/RoomsManagement"
import BookingsManagement from "./pages/admin/BookingsManagement"
import UsersManagement from "./pages/admin/UsersManagement"
import ReportsManagement from "./pages/admin/ReportsManagement"
import AmenitiesManagement from "./pages/admin/AmenitiesManagement"

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/rooms/:id" element={<RoomDetail />} />

      {/* Booking & Payment */}
      <Route path="/booking" element={<Booking />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment/result" element={<PaymentResult />} />
      <Route path="/orders" element={<MyOrders />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
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
