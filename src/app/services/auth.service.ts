import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginResponse, PasswordResetResponse } from '../models/user.model';
import { ErrorService } from './error.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { api } from '../connection';
import Swal from 'sweetalert2';
import { VicsApiEndpointsService } from './vics-api-endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
    private errorService: ErrorService,
    private http: HttpClient,
    private apiEndpoints: VicsApiEndpointsService
  ) {
    // Check if user is already logged in from localStorage
    try {
      const storedToken = localStorage.getItem('vics_auth_token');
      const storedUser = localStorage.getItem('vics_user_data');
      if (storedToken && storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
      }
    } catch (error) {
      this.errorService.showError('Failed to load user session', error instanceof Error ? error.message : String(error));
      this.clearAuthData();
    }
  }

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
        
        // Store user in local storage
        this.currentUser = authUser;
        this.isAuthenticated = true;
        
        // Create a mock token
        const mockToken = `mock-jwt-token-${Date.now()}`;
        
        localStorage.setItem('vics_auth_token', mockToken);
        localStorage.setItem('vics_user_data', JSON.stringify(authUser));
        
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
        }).pipe(delay(1000)); // Add a small delay to simulate network request
      }
    } catch (error) {
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
            // Store token and user data
            localStorage.setItem('vics_auth_token', response.token);
            localStorage.setItem('vics_user_data', JSON.stringify(response.user));
            
            // Update service state
            this.currentUser = response.user;
            this.isAuthenticated = true;
          } else {
            // Show error message for unsuccessful login
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: response.message || 'Invalid credentials',
              confirmButtonText: 'Try Again'
            });
          }
        }),
        catchError(this.handleError('Login error'))
      );
    */
  }

  logout(): void {
    try {
      this.clearAuthData();
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorService.showError('Logout error', error instanceof Error ? error.message : String(error));
    }
  }

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
      return of({
        success: false,
        message: 'An unexpected error occurred'
      }).pipe(delay(1000));
    }
    
    // Uncomment this when backend is ready
    /*
    return this.http.post<PasswordResetResponse>(`${api}${this.apiEndpoints.resetPassword()}`, { email })
      .pipe(
        tap(response => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Password Reset Initiated',
              text: response.message || 'Reset instructions sent to your email',
              confirmButtonText: 'Ok'
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Password Reset Failed',
              text: response.message || 'Email not found',
              confirmButtonText: 'Try Again'
            });
          }
        }),
        catchError(this.handleError('Password reset error'))
      );
    */
  }

  getToken(): string | null {
    return localStorage.getItem('vics_auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('vics_user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      this.errorService.showError('Error retrieving user data', error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  private clearAuthData(): void {
    localStorage.removeItem('vics_auth_token');
    localStorage.removeItem('vics_user_data');
    this.isAuthenticated = false;
    this.currentUser = null;
  }
  
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(error);
      
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