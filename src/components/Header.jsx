import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";
import { AuthContext } from "../context/AuthContext"; 
import { CartContext } from "../context/CartContext"; // 👈 thêm CartContext
import { ChevronDown, ShoppingCart } from "lucide-react"; 
import defaultAvatar from "../assets/User-avatar.png";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "text-blue-600 font-medium"
    : "text-slate-700 hover:text-blue-600 transition";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext); // 👈 lấy cart
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={closeMenu}>
          <Logo />
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/hotels" className={navLinkClass}>
            Hotels
          </NavLink>
          <NavLink to="/rooms" className={navLinkClass}>
            Rooms
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Auth desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
                  Register
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* Giỏ hàng */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition"
                title="My Bookings"
              >
                <ShoppingCart className="w-6 h-6 text-slate-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-semibold rounded-full shadow-md">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Menu user */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <img
                    src={user?.avatar || defaultAvatar}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                  <span className="text-slate-700 font-medium">{user.name || user.email}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-fade-in">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
                        setMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            <NavLink to="/" className="block py-2" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/hotels" className="block py-2" onClick={closeMenu}>
              Hotels
            </NavLink>
            <NavLink to="/rooms" className="block py-2" onClick={closeMenu}>
              Rooms
            </NavLink>
            <NavLink to="/about" className="block py-2" onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/contact" className="block py-2" onClick={closeMenu}>
              Contact
            </NavLink>

            <div className="pt-3 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    <Button className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
                      Register
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Giỏ hàng mobile */}
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded flex items-center gap-2 relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    My Bookings
                    {cart.length > 0 && (
                      <span className="absolute left-28 top-2 bg-red-600 text-white text-xs rounded-full px-1">
                        {cart.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
