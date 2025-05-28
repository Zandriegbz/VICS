export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
} 