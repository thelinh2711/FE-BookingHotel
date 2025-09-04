import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import bgImg from "../assets/register-bg.png";
import { Mail, Lock } from "lucide-react";
import authApi from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import SocialLoginButtons from "../components/SocialLoginButtons";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // reset message cũ
    try {
      // gọi API login
      const res = await authApi.login({ email, password });
      console.log("Login response:", res);

      // Kiểm tra response structure
      if (res?.code !== 0) {
        setMessage("❌ Đăng nhập thất bại!");
        return;
      }

      const token = res?.result?.token;
      if (!token) {
        setMessage("❌ Không tìm thấy token trong response!");
        return;
      }

      // Token đã được lưu trong authApi.login, không cần lưu lại

      // lấy user info
      const userData = await authApi.getInfo();
      console.log("User info:", userData);
      if (!userData) {
        setMessage("❌ Không lấy được thông tin user!");
        return;
      }

      // set vào context
      setUser(userData);
      setMessage("✅ Đăng nhập thành công!");

      // lấy danh sách role
      const roles = userData.roles?.map(r => r.name) || [];

      // điều hướng theo role
      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image + logo */}
        <div className="relative hidden md:block">
          <img
            src={bgImg}
            alt="Resort"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative h-screen p-8">
            <div className="h-full w-full rounded-[30px] bg-white/70 border border-[#E5E5E5] flex items-center justify-center">
              <div className="scale-150">
                <Logo />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login form */}
        <div className="px-6 md:px-10 py-10 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 mb-8">
              Please enter your details to sign in
            </p>

            {/* Social login buttons */}
            <SocialLoginButtons />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Remember me + forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full justify-center py-2.5 text-base"
              >
                Sign in
              </Button>
            </form>

            {/* Message */}
            {message && (
              <p
                className={`mt-4 text-center text-sm ${
                  message.includes("✅")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
