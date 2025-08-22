import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import bgImg from "../assets/register-bg.png";
import { Mail, Lock } from "lucide-react";
import authApi from "../api/authApi";
import SocialLoginButtons from "../components/SocialLoginButtons";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await authApi.login(email, password);
      console.log("Login response:", res);
      const token = res?.result?.token;

      if (token) {
        localStorage.setItem("token", token);
        setMessage("✅ Đăng nhập thành công!");

        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.scope || payload.role || "";

        if (role.includes("ADMIN")) {
          alert("🚧 Trang admin đang phát triển");
        } else if (role.includes("USER")) {
          navigate("/home");
        } else {
          setMessage("❌ Không xác định được quyền truy cập!");
        }
      } else {
        setMessage("❌ Không tìm thấy token trong response!");
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

              <Button type="submit" className="w-full justify-center py-2.5 text-base">
                Sign in
              </Button>
            </form>

            {/* Message */}
            {message && (
              <p className="mt-4 text-center text-sm text-red-500">{message}</p>
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
