// axios.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Xử lý khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    // Don't try to refresh token for login/register endpoints
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/send-register-otp") ||
      originalRequest?.url?.includes("/auth/request-reset-password") ||
      originalRequest?.url?.includes("/auth/reset-password");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        // Nếu đang refresh, chờ refresh xong
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers)
              originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh using cookie-based refresh token
        const res = await api.post("/auth/refresh-token");

        const newAccessToken =
          res.data.data?.access_token || res.data.access_token;

        // Lưu access token mới
        localStorage.setItem("access_token", newAccessToken);

        // Lưu account data mới nếu có
        if (res.data.data?.account || res.data.account) {
          const account = res.data.data?.account || res.data.account;
          localStorage.setItem("account", JSON.stringify(account));
        }

        api.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        if (originalRequest.headers)
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Clear all data
        localStorage.removeItem("access_token");
        localStorage.removeItem("account");
        localStorage.removeItem("remembered_email");

        // Show alert dialog for re-login
        window.dispatchEvent(new CustomEvent("token-expired"));

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
