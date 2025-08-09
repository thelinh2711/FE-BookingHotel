import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-blue-600 font-medium'
    : 'text-slate-700 hover:text-blue-600 transition';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/hotels" className={navLinkClass}>Hotels</NavLink>
          <NavLink to="/rooms" className={navLinkClass}>Rooms</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
