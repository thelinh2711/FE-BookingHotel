import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      authApi.googleLogin(code)
        .then(res => {
          localStorage.setItem("token", res.token);
          localStorage.setItem("refreshToken", res.refreshToken);
          console.log(res.token);
          console.log(res.refreshToken);
          navigate("/");
        })
        .catch(err => {
          console.error(err);
          navigate("/login?error=oauth_failed");
        });
    } else {
      navigate("/login?error=oauth_failed");
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
