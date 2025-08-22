import React, { useState } from "react";
import Button from "./Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import authApi from "../api/authApi";

const SocialLoginButtons = () => {
  const [message, setMessage] = useState("");

  const handleLogin = async (provider) => {
    try {
      let res;
      if (provider === "google") {
        res = await authApi.getGoogleLoginUrl();
      } else if (provider === "facebook") {
        res = await authApi.getFacebookLoginUrl();
      }

      console.log(`${provider} login url:`, res);

      if (res?.url) {
        // Redirect user sang trang đăng nhập Google/Facebook
        window.location.href = res.url;
      } else {
        setMessage(`❌ Không lấy được URL đăng nhập với ${provider}!`);
      }
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setMessage(`❌ Lỗi khi đăng nhập với ${provider}!`);
    }
  };

  return (
    <div className="space-y-3 mb-6">
      <Button
        onClick={() => handleLogin("google")}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-base border border-slate-300 bg-white !text-slate-700 hover:bg-slate-50"
      >
        <FcGoogle size={20} />
        Sign in with Google
      </Button>

      <Button
        onClick={() => handleLogin("facebook")}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-base border border-slate-300 bg-white !text-slate-700 hover:bg-slate-50"
      >
        <FaFacebook size={20} className="text-blue-600" />
        Sign in with Facebook
      </Button>

      {message && (
        <p className="mt-2 text-center text-sm text-red-500">{message}</p>
      )}
    </div>
  );
};

export default SocialLoginButtons;
