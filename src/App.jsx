import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About';
import Register from "./pages/Register";
import Login from "./pages/Login";
import RoomDetail from './pages/RoomDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/rooms/:id" element={<RoomDetail />} />
    </Routes>
  )
}

export default App