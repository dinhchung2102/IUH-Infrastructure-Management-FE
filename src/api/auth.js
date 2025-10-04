import { apiHelper } from "./index.js";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  SEND_OTP: "/auth/send-otp",
  SEND_REGISTER_OTP: "/auth/send-register-otp",
  RESEND_OTP: "/auth/resend-otp",
  VERIFY_OTP: "/auth/verify-otp",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
  REGISTER: "/auth/register",
  PROFILE: "/auth/profile",
  REQUEST_RESET_PASSWORD: "/auth/request-reset-password",
  RESET_PASSWORD: "/auth/reset-password",
};

export const authService = {
  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - User password
   * @returns {Promise} Login response
   */
  async login(credentials) {
    try {
      const response = await apiHelper.post(AUTH_ENDPOINTS.LOGIN, credentials);
      const responseData = response.data;

      if (responseData.success) {
        console.log("Login successful:", responseData.message);

        if (responseData.data && responseData.data.access_token) {
          const { access_token, refresh_token, user } = responseData.data;
          localStorage.setItem("access_token", access_token);
          if (refresh_token) {
            localStorage.setItem("refresh_token", refresh_token);
          }
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }
        }
      } else {
        console.log("Login failed:", responseData.message);
      }

      return responseData;
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data) {
        return error.response.data;
      }

      return {
        success: false,
        message: error.message || "Network error occurred",
        statusCode: 0,
        errorCode: "NETWORK_ERROR",
      };
    }
  },

  /** Gửi OTP (dùng cho các luồng khác) */
  async sendOtp(payload) {
    const response = await apiHelper.post(AUTH_ENDPOINTS.SEND_OTP, payload);
    return response.data;
  },

  /** Gửi OTP đăng ký */
  async sendRegisterOtp(payload) {
    const response = await apiHelper.post(
      AUTH_ENDPOINTS.SEND_REGISTER_OTP,
      payload
    );
    return response.data;
  },

  /** Gửi lại OTP */
  async resendOtp(payload) {
    const response = await apiHelper.post(AUTH_ENDPOINTS.RESEND_OTP, payload);
    return response.data;
  },

  /** Xác thực OTP */
  async verifyOtp(payload) {
    const response = await apiHelper.post(AUTH_ENDPOINTS.VERIFY_OTP, payload);
    return response.data;
  },

  /** Refresh token */
  async refreshToken(refreshToken) {
    const response = await apiHelper.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },

  /** Logout */
  async logout() {
    try {
      await apiHelper.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (e) {
      console.warn("Logout API failed:", e?.message || e);
    }
    authUtils.clearAuth();
  },

  /** Đăng ký */
  async register(payload) {
    const response = await apiHelper.post(AUTH_ENDPOINTS.REGISTER, payload);
    return response.data;
  },

  /** Lấy profile user */
  async getProfile() {
    const response = await apiHelper.get(AUTH_ENDPOINTS.PROFILE);
    return response.data;
  },

  /** Gửi OTP để reset mật khẩu */
  async requestResetPassword(payload) {
    try {
      const response = await apiHelper.post(
        AUTH_ENDPOINTS.REQUEST_RESET_PASSWORD,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Request reset password error:", error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /** Reset mật khẩu với OTP */
  async resetPassword(payload) {
    try {
      const response = await apiHelper.put(
        AUTH_ENDPOINTS.RESET_PASSWORD,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },
};

export const authUtils = {
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = localStorage.getItem("access_token");
    return !!token;
  },

  /**
   * Get current user data
   * @returns {Object|null} User data or null
   */
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get access token
   * @returns {string|null} Access token or null
   */
  getAccessToken() {
    return localStorage.getItem("access_token");
  },

  /**
   * Get refresh token
   * @returns {string|null} Refresh token or null
   */
  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },

  /**
   * Set tokens
   */
  setTokens({ access_token, refresh_token }) {
    if (access_token) localStorage.setItem("access_token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
  },

  /**
   * Set user info
   */
  setUser(user) {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  },

  /**
   * Clear all authentication data
   */
  clearAuth() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};

export default authService;
