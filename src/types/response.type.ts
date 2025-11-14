import type { PermissionString } from "./permission.type";

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
  permissions: PermissionString[];
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

// RefreshTokenResponse for Web Client
// Backend returns: { message: string, access_token: string }
// Note: refresh_token is in httpOnly cookie, not in response
// Field name is "access_token" (synchronized with login endpoint)
export interface RefreshTokenResponse {
  message: string;
  // Web Client format (primary)
  access_token?: string;
  // Alternative format (for backward compatibility)
  accessToken?: string;
  // Mobile Client format (not used in Web Client)
  refresh_token?: string;
  account?: Account;
  // Wrapped in data field (if backend uses ApiResponse wrapper)
  data?: {
    access_token?: string;
    accessToken?: string;
    account?: Account;
  };
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  authOTP: string;
  newPassword: string;
}
