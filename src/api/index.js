import axios from "axios";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.iuh.nagentech.com/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000");

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  //  baseURL:{$} "https://api.iuh.nagentech.com/",
  timeout: API_TIMEOUT,
  withCredentials: true, // Always include cookies (for refresh token)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.NODE_ENV === "development") {
      console.log("API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.NODE_ENV === "development") {
      console.log("API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      console.error("API Error:", {
        status,
        url: error.config?.url,
        message: data?.message || error.message,
        data,
      });

      if (status === 401 && !originalRequest._retry) {
        // Skip refresh for login/refresh endpoints to avoid infinite loop
        if (
          originalRequest.url?.includes("/auth/login") ||
          originalRequest.url?.includes("/auth/refresh-token")
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {}
          );

          const { access_token } = response.data.data || response.data;

          localStorage.setItem("access_token", access_token);

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          processQueue(null, access_token);
          isRefreshing = false;

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;

          // Refresh failed, show session expired dialog
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");

          // Trigger session expired event
          window.dispatchEvent(new CustomEvent("session-expired"));

          return Promise.reject(refreshError);
        }
      }

      if (status >= 500) {
        console.error("Server Error:", data);
      }

      return Promise.reject(error);
    } else if (error.request) {
      console.error("Network Error:", error.message);
    } else {
      console.error("Request Setup Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const apiHelper = {
  get: (url, config = {}) => api.get(url, config),

  post: (url, data = {}, config = {}) => api.post(url, data, config),

  put: (url, data = {}, config = {}) => api.put(url, data, config),

  patch: (url, data = {}, config = {}) => api.patch(url, data, config),

  delete: (url, config = {}) => api.delete(url, config),

  upload: (url, formData, config = {}) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
