import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";
import InputField from "../components/InputField";
import bgImg from "../assets/register-bg.png";
import userApi from "../api/userApi";
import SocialLoginButtons from "../components/SocialLoginButtons";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      roles: ["USER"],
    };

    try {
      const res = await userApi.register(data);
      console.log("Register success:", res.data);
      setMessage("✅ Đăng ký thành công!");
    } catch (err) {
      console.error("Register failed:", err.response);
      setMessage(err.response?.data?.message || "❌ Đăng ký thất bại!");
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

        {/* Right: Register form */}
        <div className="px-6 md:px-10 py-10">
          <h1 className="text-2xl font-semibold text-slate-900 mb-8">
            Create Account
          </h1>

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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="First Name"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
              label="Last Name"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <InputField
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label="Phone No"
              type="tel"
              placeholder="With Country Code"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full justify-center">
              Register
            </Button>

            {message && (
              <p className="mt-4 text-center text-sm text-red-500">{message}</p>
            )}

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-slate-600 hover:text-blue-600"
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
