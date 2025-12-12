import api from "@/lib/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendOTPRequest,
  RefreshTokenResponse,
} from "@/types/response.type";

// Send registration OTP to email
export const sendRegisterOTP = async (
  data: SendOTPRequest
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    "/auth/send-register-otp",
    data
  );
  return response.data;
};

// Login
export const login = async (
  data: LoginRequest
): Promise<AuthResponse["data"]> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data.data;
};

// Register (requires OTP)
export const register = async (
  data: RegisterRequest
): Promise<AuthResponse["data"]> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data.data;
};

// Refresh token
// Web Client: No need to send refresh token in body, backend reads from httpOnly cookie
// Mobile Client: Should send refreshToken in body (not implemented here, this is for Web)
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>(
    "/auth/refresh-token"
    // No body needed for Web Client - refresh token is in httpOnly cookie
  );
  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
  localStorage.removeItem("access_token");
  localStorage.removeItem("account");
  localStorage.removeItem("remembered_email");
};

// Get current account
export const getCurrentAccount = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Request password reset
export const requestPasswordReset = async (
  email: string
): Promise<{ message: string }> => {
  const response = await api.post("/auth/request-reset-password", { email });
  return response.data;
};

// Reset password with OTP
export const resetPassword = async (data: {
  email: string;
  authOTP: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await api.put("/auth/reset-password", data);
  return response.data;
};

// Check user permissions
export interface CheckPermissionResponse {
  message: string;
  role: string;
  permissions: string[]; // PermissionString[]
  total: number;
}

export const checkPermission = async (): Promise<CheckPermissionResponse> => {
  const response = await api.get<CheckPermissionResponse>(
    "/auth/check-permission"
  );
  return response.data;
};