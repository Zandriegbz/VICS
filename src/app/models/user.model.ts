// export interface User {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
// }

export interface User {
  eic: string;
  name: string;
  username: string;
  role: string;
}

// export interface LoginResponse {
//   success: boolean;
//   message: string;
//   user?: User;
//   token?: string;
// }

export interface LoginResponse {
  eic: string;
  name: string;
  username: string;
  role: string;
  token: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
} 