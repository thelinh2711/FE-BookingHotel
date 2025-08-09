import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";
import InputField from "../components/InputField";
import bgImg from "../assets/register-bg.png"; // đổi sang ảnh bạn có

const Register = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image + glass card */}
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

        {/* Right: form */}
        <div className="px-6 md:px-10 py-10">
          <h1 className="text-2xl font-semibold text-slate-900 mb-8">
            Create Account
          </h1>

          <form className="space-y-4">
            <InputField label="Name" placeholder="Enter your name" />
            <InputField label="E mail" type="email" placeholder="name@gmail.com" />
            <InputField label="Phone No" type="tel" placeholder="With Country Code" />
            <InputField label="Country" placeholder="Country Name" />
            <InputField label="Username" placeholder="Username" />
            <InputField label="Password" type="password" placeholder="6+ characters" />

            <p className="text-xs text-slate-500">
              By signing up you agree to{" "}
              <a href="#" className="text-blue-600 hover:underline">
                terms and conditions
              </a>{" "}
              at zoho.
            </p>

            <Button type="submit" className="w-full justify-center">
              Register
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-slate-600 hover:text-blue-600">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
