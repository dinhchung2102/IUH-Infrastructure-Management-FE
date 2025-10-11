// API Error Response Structure
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  path: string;
}

// Axios Error Type
export interface AxiosErrorResponse {
  response?: {
    data?: ApiErrorResponse;
  };
}
