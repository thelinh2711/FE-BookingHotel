import { Link } from "react-router-dom"; // nếu bạn dùng React Router

const Logo = () => {
  return (
    <Link to="/" className="text-xl font-semibold">
      <span className="text-blue-600">Lanka</span>
      <span className="text-slate-900">Stay</span>
      <span className="text-slate-900">.</span>
    </Link>
  );
};

export default Logo;
