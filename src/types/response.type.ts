// Response types for API calls
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Account {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  gender?: "MALE" | "FEMALE";
  dateOfBirth?: string;
  isActive: boolean;
  role: string;
  permissions: string[];
}

export interface AuthResponse {
  success: true;
  message: string;
  data: {
    access_token: string;
    account: Account;
  };
  timestamp: string;
  path: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  password: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  gender?: "MALE" | "FEMALE";
  dateOfBirth?: string;
  authOTP: string;
}

export interface SendOTPRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  account: Account;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  authOTP: string;
  newPassword: string;
}
