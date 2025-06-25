import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginResponse, PasswordResetResponse } from '../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { api } from '../connection';
import Swal from 'sweetalert2';
import { VicsApiEndpointsService } from './vics-api-endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Storage keys
  private readonly TOKEN_KEY = 'vics_auth_token';
  private readonly USER_DATA_KEY = 'vics_user_data';
  
  private isAuthenticated: boolean = false;
  private currentUser: User | null = null;
  
  // Mock user for development purposes
  private mockUsers = [
    {
      id: 1,
      username: 'admin',
      password: '123456',
      email: 'admin@example.com',
      role: 'admin'
    },
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiEndpoints: VicsApiEndpointsService
  ) {
    this.initializeAuthState();
  }
  
  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuthState(): void {
    try {
      const storedToken = localStorage.getItem(this.TOKEN_KEY);
      const storedUser = localStorage.getItem(this.USER_DATA_KEY);
      
      if (storedToken && storedUser && this.validateToken(storedToken)) {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
      } else if (storedToken || storedUser) {
        // If we have inconsistent state (token but no user data or invalid token)
        this.clearAuthData();
      }
    } catch (error) {
      console.error('Failed to load user session:', error);
      this.clearAuthData();
    }
  }

  /**
   * Validate token format
   */
  private validateToken(token: string): boolean {
    // For mock token
    if (token.startsWith('mock-jwt-token-')) {
      return true;
    }
    
    // For real JWT
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Login user
   */
  login(username: string, password: string): Observable<LoginResponse> {
    // Use mock authentication in development mode
    try {
      const user = this.mockUsers.find(u => u.username === username && u.password === password);
      
      if (user) {
        // Create a user object without the password
        const authUser: User = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        };
        
        // Create a mock token
        const mockToken = `mock-jwt-token-${Date.now()}`;
        
        // Save authentication data
        this.saveAuthData(authUser, mockToken);
        
        return of({
          success: true,
          message: 'Login successful',
          user: authUser,
          token: mockToken
        }).pipe(delay(1000)); // Add a small delay to simulate network request
      } else {
        return of({
          success: false,
          message: 'Invalid username or password'
        }).pipe(delay(1000));
      }
    } catch (error) {
      console.error('Login error:', error);
      return of({
        success: false,
        message: 'An unexpected error occurred during login'
      }).pipe(delay(1000));
    }
    
    // Uncomment this when backend is ready
    /*
    return this.http.post<LoginResponse>(`${api}${this.apiEndpoints.login()}`, { username, password })
      .pipe(
        tap(response => {
          if (response.success && response.user && response.token) {
            this.saveAuthData(response.user, response.token);
          }
        }),
        catchError(this.handleError('Login error'))
      );
    */
  }

  /**
   * Save authentication data
   */
  private saveAuthData(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    this.currentUser = user;
    this.isAuthenticated = true;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  /**
   * Reset password
   */
  resetPassword(email: string): Observable<PasswordResetResponse> {
    // Use mock implementation for development
    try {
      const user = this.mockUsers.find(u => u.email === email);
      
      if (user) {
        return of({
          success: true,
          message: 'Password reset instructions have been sent to your email'
        }).pipe(delay(1000));
      } else {
        return of({
          success: false,
          message: 'Email not found'
        }).pipe(delay(1000));
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return of({
        success: false,
        message: 'An unexpected error occurred'
      }).pipe(delay(1000));
    }
    
    // Uncomment this when backend is ready
    /*
    return this.http.post<PasswordResetResponse>(`${api}${this.apiEndpoints.resetPassword()}`, { email })
      .pipe(
        catchError(this.handleError('Password reset error'))
      );
    */
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }
    
    return this.validateToken(token);
  }

  /**
   * Get current user data
   */
  getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    
    try {
      if (this.currentUser) {
        return this.currentUser;
      }
      
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      this.clearAuthData();
      return null;
    }
  }
  
  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    this.isAuthenticated = false;
    this.currentUser = null;
  }
  
  /**
   * Handle HTTP errors
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation}:`, error);
      
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: `${operation}: ${error.error?.message || error.message || 'Unknown error occurred'}`,
        confirmButtonText: 'Ok'
      });
      
      return throwError(() => error);
    };
  }
} 