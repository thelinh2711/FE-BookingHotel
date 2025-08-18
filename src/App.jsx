import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About';
import Register from "./pages/Register";
import Login from "./pages/Login";
import RoomDetail from './pages/RoomDetail';
import Booking from './pages/Booking';
import GoogleCallback from './components/GoogleCallback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/rooms/:id" element={<RoomDetail />} />
      <Route path="/booking" element={<Booking />} />
    </Routes>
  )
}

export default App