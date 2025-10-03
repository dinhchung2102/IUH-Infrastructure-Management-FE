import { useState, useEffect } from "react";
import axios from "axios";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // load từ localStorage khi refresh
  useEffect(() => {
    const savedAccess = localStorage.getItem("access_token");
    const savedRefresh = localStorage.getItem("refresh_token");

    if (savedAccess) {
      setAccessToken(savedAccess);
      setRefreshToken(savedRefresh);
      const decoded = parseJwt(savedAccess);
      if (decoded) setUser(decoded);
    }
  }, []);

  // hàm refresh token
  const refreshAccessToken = async () => {
    if (!refreshToken) return logout();
    try {
      const res = await axios.post("/api/auth/refresh-token", {
        refreshToken,
      });
      if (res.data?.accessToken) {
        localStorage.setItem("access_token", res.data.accessToken);
        setAccessToken(res.data.accessToken);
        const decoded = parseJwt(res.data.accessToken);
        if (decoded) setUser(decoded);
        return res.data.accessToken;
      }
    } catch (err) {
      console.error("Refresh token failed", err);
      logout();
    }
  };

  // auto refresh token mỗi 14 phút (nếu access_token 15p hết hạn)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken]);

  const saveAuth = (access, refresh) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    const decoded = parseJwt(access);
    if (decoded) setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    window.location.href = "/";
  };
 const sendOtp = async ({ email }) => {
  try {
    const res = await axios.post("/api/auth/send-otp", { email });
    return res.data;
  } catch (err) {
    console.error("Send OTP failed:", err);
    return err.response?.data || { success: false, message: "Send OTP error" };
  }
};

const resendOtp = async ({ email }) => {
  try {
    const res = await axios.post("/api/auth/resend-otp", { email });
    return res.data;
  } catch (err) {
    console.error("Resend OTP failed:", err);
    return err.response?.data || { success: false, message: "Resend OTP error" };
  }
};

const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await axios.post("/api/auth/verify-otp", { email, authOTP: otp });
    if (res.data?.data?.access_token) {
      const { access_token, refresh_token, user } = res.data.data;
      saveAuth(access_token, refresh_token, user);
    }
    return res.data;
  } catch (err) {
    console.error("Verify OTP failed:", err);
    return err.response?.data || { success: false, message: "Verify OTP error" };
  }
};



  return {
    user,
    accessToken,
    refreshToken,
    saveAuth,
    logout,
    refreshAccessToken,
    sendOtp,
    resendOtp,
    verifyOtp,
  };
}
  
