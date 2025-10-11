import api from "@/lib/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendOTPRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/response.type";

// Send OTP to email
export const sendOTP = async (
  data: SendOTPRequest
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/send-otp", data);
  return response.data;
};

// Login
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

// Register (requires OTP)
export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

// Refresh token
export const refreshToken = async (
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>(
    "/auth/refresh-token",
    data
  );
  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("account");
};

// Get current account
export const getCurrentAccount = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
