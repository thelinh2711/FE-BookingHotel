import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About';
import Register from "./pages/Register";
import Login from "./pages/Login";
import RoomDetail from './pages/RoomDetail';
import Booking from './pages/Booking';
import PaymentConfirmation from './pages/PaymentConfirmation';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/rooms/:id" element={<RoomDetail />} />
      <Route path="/booking" element={<Booking />} />
      
      <Route path="/booking/confirm" element={<PaymentConfirmation />} />
      <Route path="/orders" element={<MyOrders />} />
    </Routes>
  )
}

export default App
