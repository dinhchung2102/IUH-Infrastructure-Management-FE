import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import SessionExpiredDialog from "../components/SessionExpiredDialog";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const logout = useCallback(async () => {
    try {
      // Call logout API if token exists
      const token = localStorage.getItem("access_token");
      if (token) {
        await axios.post(
          `${
            import.meta.env.VITE_API_BASE_URL ||
            "https://api.iuh.nagentech.com/api"
          }/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    }
  }, []);

  const fetchUserProfile = useCallback(
    async (access_token) => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL ||
            "https://api.iuh.nagentech.com/api"
          }/auth/profile`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        if (res.data && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        logout();
      }
    },
    [logout]
  );

  // load từ localStorage khi refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);

      // nếu có user lưu sẵn thì set tạm thời
      if (savedUser) setUser(JSON.parse(savedUser));

      // fetch lại profile từ API để chắc chắn dữ liệu đầy đủ
      fetchUserProfile(savedToken);
    }

    // Listen for session expired event
    const handleSessionExpired = () => {
      setShowSessionExpired(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, [fetchUserProfile]);

  const login = (userData, access_token) => {
    setUser(userData);
    setToken(access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", access_token);

    // fetch profile để đảm bảo dữ liệu đầy đủ
    fetchUserProfile(access_token);
  };

  const handleSessionExpiredConfirm = async () => {
    setShowSessionExpired(false);
    await logout();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
      <SessionExpiredDialog
        open={showSessionExpired}
        onConfirm={handleSessionExpiredConfirm}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
