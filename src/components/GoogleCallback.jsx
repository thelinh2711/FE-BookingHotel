import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { AuthContext } from "../context/AuthContext"; // ⚡ đúng path tới AuthContext

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // ✅ lấy setUser từ context

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      authApi.googleLogin(code)
        .then(res => {
          // Token đã được lưu trong authApi.googleLogin, không cần lưu lại

          // ✅ cập nhật user ngay, không cần reload
          if (res.user) {
            setUser(res.user);
          }

          navigate("/");
        })
        .catch(err => {
          console.error(err);
          navigate("/login?error=oauth_failed");
        });
    } else {
      navigate("/login?error=oauth_failed");
    }
  }, [location, navigate, setUser]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
