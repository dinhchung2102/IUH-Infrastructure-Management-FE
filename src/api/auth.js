import { apiHelper } from "./index.js";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
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
   * Clear all authentication data
   */
  clearAuth() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};

export default authService;
