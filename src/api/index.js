import axios from "axios";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000");

// axios instance
const api = axios.create({
  baseURL: "https://iuh.api.nagentech.com/api",
  timeout: API_TIMEOUT,
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
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      console.error("API Error:", {
        status,
        url: error.config?.url,
        message: data?.message || error.message,
        data,
      });

      if (status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
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
