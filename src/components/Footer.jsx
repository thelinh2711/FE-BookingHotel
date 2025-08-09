import { Link } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';


const Footer = () => {
  return (
    <footer className="max-w-full bg-white border-t pt-10">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left: Logo + tagline */}
        <div>
          <Logo />
          <p className="mt-2 text-sm text-slate-500 max-w-xs">
            We kaboom your beauty holiday instantly and memorable.
          </p>
        </div>

        {/* Right: Call to action */}
        <div className="text-left md:text-right">
          {/* Nếu SectionTitle to quá, có thể thay bằng 1 h4 custom style */}
          <h4 className="text-slate-800 font-medium mb-2">
            Become hotel Owner
          </h4>
          <Link to="/register">
            <Button>Register Now</Button>
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-blue-600 text-white text-sm text-center py-2">
        Copyright ©2024 • All rights reserved • Saiman Faris
      </div>
    </footer>
  );
};

export default Footer;
